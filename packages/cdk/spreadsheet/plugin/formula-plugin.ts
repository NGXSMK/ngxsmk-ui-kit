import type { SpreadsheetPlugin } from './plugin.types';
import type { SpreadsheetEngine } from '../spreadsheet-engine';
import type {
  FormulaNode,
  CellRefNode,
  RangeRefNode,
  NumberNode,
  StringNode,
  BooleanNode,
  BinaryOpNode,
  UnaryOpNode,
  FunctionCallNode,
  FormulaResult,
  FormulaFunction,
} from '../models';

/**
 * FormulaPlugin evaluates formulas in cells.
 * Maintains a dependency graph for recalculation ordering.
 */
export class FormulaPlugin implements SpreadsheetPlugin {
  readonly name = 'formula';
  readonly priority = 50;

  private _engine: SpreadsheetEngine | null = null;
  private _functions = new Map<string, FormulaFunction>();

  constructor() {
    this._registerBuiltinFunctions();
  }

  onInit(engine: SpreadsheetEngine): void {
    this._engine = engine;
  }

  onDestroy(): void {
    this._functions.clear();
  }

  /** Register a custom function. */
  registerFunction(fn: FormulaFunction): void {
    this._functions.set(fn.name.toUpperCase(), fn);
  }

  /** Evaluate a formula string. */
  evaluate(formula: string, getCellValue: (ref: string) => unknown): FormulaResult {
    try {
      const ast = this._parse(formula);
      if (!ast) return { value: null, error: '#PARSE!' };
      const value = this._evalNode(ast, getCellValue);
      return { value };
    } catch (e) {
      return { value: null, error: e instanceof Error ? e.message : '#ERROR!' };
    }
  }

  /** Build a dependency graph: which cells depend on which. */
  buildDependencyGraph(): Map<string, string[]> {
    const graph = new Map<string, string[]>();
    if (!this._engine) return graph;

    const rows = this._engine.rowData();
    const cols = this._engine.columnDefs();

    for (let r = 0; r < rows.length; r++) {
      for (const col of cols) {
        const val = rows[r].cells[col.id]?.value;
        if (typeof val === 'string' && val.startsWith('=')) {
          const refs = this._extractRefs(val);
          graph.set(`${r}:${col.id}`, refs);
        }
      }
    }

    return graph;
  }

  /** Topologically sort cells by their dependencies (recalc order). */
  getRecalcOrder(): string[] {
    const graph = this.buildDependencyGraph();
    const visited = new Set<string>();
    const order: string[] = [];

    const visit = (cell: string, stack: Set<string>) => {
      if (visited.has(cell)) return;
      if (stack.has(cell)) return;
      stack.add(cell);
      const deps = graph.get(cell) ?? [];
      for (const dep of deps) {
        visit(dep, stack);
      }
      stack.delete(cell);
      visited.add(cell);
      order.push(cell);
    };

    for (const cell of graph.keys()) {
      visit(cell, new Set());
    }

    return order;
  }

  // ── Parser ──

  private _parse(formula: string): FormulaNode | null {
    const expr = formula.startsWith('=') ? formula.slice(1) : formula;
    try {
      return this._parseExpression(expr, { pos: 0 });
    } catch {
      return null;
    }
  }

  private _parseExpression(expr: string, ctx: { pos: number }): FormulaNode {
    return this._parseComparison(expr, ctx);
  }

  private _parseComparison(expr: string, ctx: { pos: number }): FormulaNode {
    let left = this._parseConcat(expr, ctx);
    this._skipSpaces(expr, ctx);

    while (ctx.pos < expr.length) {
      const ch = expr[ctx.pos];
      if (ch === '=' || ch === '<' || ch === '>') {
        let op: string;
        if (ch === '=' && expr[ctx.pos + 1] !== '=') {
          op = '=';
          ctx.pos++;
        } else if (ch === '<' && expr[ctx.pos + 1] === '>') {
          op = '<>';
          ctx.pos += 2;
        } else if (ch === '<' && expr[ctx.pos + 1] === '=') {
          op = '<=';
          ctx.pos += 2;
        } else if (ch === '>' && expr[ctx.pos + 1] === '=') {
          op = '>=';
          ctx.pos += 2;
        } else if (ch === '>') {
          op = '>';
          ctx.pos++;
        } else {
          break;
        }
        const right = this._parseConcat(expr, ctx);
        left = { type: 'binary_op', op: op as BinaryOpNode['op'], left, right } as BinaryOpNode;
      } else {
        break;
      }
    }

    return left;
  }

  private _parseConcat(expr: string, ctx: { pos: number }): FormulaNode {
    let left = this._parseAddSub(expr, ctx);
    this._skipSpaces(expr, ctx);

    while (ctx.pos < expr.length && expr[ctx.pos] === '&') {
      ctx.pos++;
      const right = this._parseAddSub(expr, ctx);
      left = { type: 'binary_op', op: '&', left, right } as BinaryOpNode;
      this._skipSpaces(expr, ctx);
    }

    return left;
  }

  private _parseAddSub(expr: string, ctx: { pos: number }): FormulaNode {
    let left = this._parseMulDiv(expr, ctx);
    this._skipSpaces(expr, ctx);

    while (ctx.pos < expr.length && (expr[ctx.pos] === '+' || expr[ctx.pos] === '-')) {
      const op = expr[ctx.pos] as '+' | '-';
      ctx.pos++;
      const right = this._parseMulDiv(expr, ctx);
      left = { type: 'binary_op', op, left, right } as BinaryOpNode;
      this._skipSpaces(expr, ctx);
    }

    return left;
  }

  private _parseMulDiv(expr: string, ctx: { pos: number }): FormulaNode {
    let left = this._parseUnary(expr, ctx);
    this._skipSpaces(expr, ctx);

    while (ctx.pos < expr.length && (expr[ctx.pos] === '*' || expr[ctx.pos] === '/')) {
      const op = expr[ctx.pos] as '*' | '/';
      ctx.pos++;
      const right = this._parseUnary(expr, ctx);
      left = { type: 'binary_op', op, left, right } as BinaryOpNode;
      this._skipSpaces(expr, ctx);
    }

    return left;
  }

  private _parseUnary(expr: string, ctx: { pos: number }): FormulaNode {
    this._skipSpaces(expr, ctx);
    if (ctx.pos < expr.length && (expr[ctx.pos] === '-' || expr[ctx.pos] === '+')) {
      const op = expr[ctx.pos] as '-' | '+';
      ctx.pos++;
      const operand = this._parseUnary(expr, ctx);
      return { type: 'unary_op', op, operand } as UnaryOpNode;
    }
    return this._parsePrimary(expr, ctx);
  }

  private _parsePrimary(expr: string, ctx: { pos: number }): FormulaNode {
    this._skipSpaces(expr, ctx);

    if (ctx.pos >= expr.length) {
      throw new Error('Unexpected end of expression');
    }

    const ch = expr[ctx.pos];

    // String literal
    if (ch === '"') {
      ctx.pos++;
      let str = '';
      while (ctx.pos < expr.length && expr[ctx.pos] !== '"') {
        str += expr[ctx.pos++];
      }
      if (ctx.pos < expr.length) ctx.pos++;
      return { type: 'string', value: str } as StringNode;
    }

    // Parenthesized expression
    if (ch === '(') {
      ctx.pos++;
      const node = this._parseExpression(expr, ctx);
      this._skipSpaces(expr, ctx);
      if (ctx.pos < expr.length && expr[ctx.pos] === ')') ctx.pos++;
      return node;
    }

    // Number
    if ((ch >= '0' && ch <= '9') || ch === '.') {
      let numStr = '';
      while (
        ctx.pos < expr.length &&
        ((expr[ctx.pos] >= '0' && expr[ctx.pos] <= '9') || expr[ctx.pos] === '.')
      ) {
        numStr += expr[ctx.pos++];
      }
      return { type: 'number', value: parseFloat(numStr) } as NumberNode;
    }

    // Boolean
    const upper = expr.slice(ctx.pos).toUpperCase();
    if (upper.startsWith('TRUE')) {
      ctx.pos += 4;
      return { type: 'boolean', value: true } as BooleanNode;
    }
    if (upper.startsWith('FALSE')) {
      ctx.pos += 5;
      return { type: 'boolean', value: false } as BooleanNode;
    }

    // Cell reference, range, or function call
    if ((ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z')) {
      let name = '';
      while (ctx.pos < expr.length && /[A-Za-z0-9_]/.test(expr[ctx.pos])) {
        name += expr[ctx.pos++];
      }
      this._skipSpaces(expr, ctx);

      // Range reference (e.g. A1:B5)
      if (ctx.pos < expr.length && expr[ctx.pos] === ':') {
        ctx.pos++;
        const end = this._parseCellRef(expr, ctx);
        const startParsed = parseCellRefStr(name);
        return {
          type: 'range_ref',
          startCol: startParsed.col,
          startRow: startParsed.row,
          endCol: end.col,
          endRow: end.row,
        } as RangeRefNode;
      }

      // Function call
      if (ctx.pos < expr.length && expr[ctx.pos] === '(') {
        ctx.pos++;
        const args: FormulaNode[] = [];
        while (ctx.pos < expr.length && expr[ctx.pos] !== ')') {
          args.push(this._parseExpression(expr, ctx));
          this._skipSpaces(expr, ctx);
          if (ctx.pos < expr.length && expr[ctx.pos] === ',') ctx.pos++;
          this._skipSpaces(expr, ctx);
        }
        if (ctx.pos < expr.length) ctx.pos++;
        return { type: 'function_call', name: name.toUpperCase(), args } as FunctionCallNode;
      }

      // Cell reference
      const ref = parseCellRefStr(name);
      return { type: 'cell_ref', col: ref.col, row: ref.row } as CellRefNode;
    }

    throw new Error(`Unexpected character: ${ch}`);
  }

  private _parseCellRef(expr: string, ctx: { pos: number }): { col: string; row: number } {
    let name = '';
    while (ctx.pos < expr.length && /[A-Za-z0-9_]/.test(expr[ctx.pos])) {
      name += expr[ctx.pos++];
    }
    return parseCellRefStr(name);
  }

  private _skipSpaces(expr: string, ctx: { pos: number }): void {
    while (ctx.pos < expr.length && expr[ctx.pos] === ' ') ctx.pos++;
  }

  // ── Evaluator ──

  private _evalNode(
    node: FormulaNode,
    getCellValue: (ref: string) => unknown,
  ): number | string | boolean | null {
    switch (node.type) {
      case 'number':
        return (node as NumberNode).value;
      case 'string':
        return (node as StringNode).value;
      case 'boolean':
        return (node as BooleanNode).value;
      case 'cell_ref': {
        const refNode = node as CellRefNode;
        const ref = `${refNode.col}${refNode.row}`;
        const val = getCellValue(ref);
        if (typeof val === 'string' && val.startsWith('=')) {
          const result = this.evaluate(val, getCellValue);
          return result.value;
        }
        return val as number | string | boolean | null;
      }
      case 'binary_op': {
        const binNode = node as BinaryOpNode;
        const l = this._evalNode(binNode.left, getCellValue);
        const r = this._evalNode(binNode.right, getCellValue);
        return this._evalBinaryOp(binNode.op, l, r);
      }
      case 'unary_op': {
        const unaryNode = node as UnaryOpNode;
        const val = this._evalNode(unaryNode.operand, getCellValue);
        if (unaryNode.op === '-') return -(val as number);
        return val;
      }
      case 'function_call': {
        const fnNode = node as FunctionCallNode;
        const fn = this._functions.get(fnNode.name);
        if (!fn) throw new Error(`Unknown function: ${fnNode.name}`);
        const args = fnNode.args.map((a: FormulaNode) => this._evalNode(a, getCellValue));
        return fn.fn(args);
      }
      case 'range_ref':
        return 0;
      default:
        return null;
    }
  }

  private _evalBinaryOp(op: string, l: unknown, r: unknown): number | string | boolean {
    const ln = typeof l === 'number' ? l : parseFloat(String(l)) || 0;
    const rn = typeof r === 'number' ? r : parseFloat(String(r)) || 0;

    switch (op) {
      case '+':
        return ln + rn;
      case '-':
        return ln - rn;
      case '*':
        return ln * rn;
      case '/':
        return rn !== 0 ? ln / rn : (null as unknown as number);
      case '&':
        return String(l ?? '') + String(r ?? '');
      case '=':
        return l === r || ln === rn;
      case '<>':
        return l !== r && ln !== rn;
      case '>':
        return ln > rn;
      case '<':
        return ln < rn;
      case '>=':
        return ln >= rn;
      case '<=':
        return ln <= rn;
      default:
        return 0;
    }
  }

  private _extractRefs(formula: string): string[] {
    const refs: string[] = [];
    const regex = /([A-Z]+)(\d+)/gi;
    let match;
    while ((match = regex.exec(formula)) !== null) {
      refs.push(`${match[1].toUpperCase()}${match[2]}`);
    }
    return refs;
  }

  // ── Built-in Functions ──

  private _registerBuiltinFunctions(): void {
    const fns: FormulaFunction[] = [
      {
        name: 'SUM',
        minArgs: 1,
        maxArgs: Infinity,
        fn: (args) => args.reduce<number>((s, v) => s + (Number(v) || 0), 0),
      },
      {
        name: 'AVERAGE',
        minArgs: 1,
        maxArgs: Infinity,
        fn: (args) => {
          const nums = args.map(Number).filter((n) => !isNaN(n));
          return nums.length ? nums.reduce((s, v) => s + v, 0) / nums.length : 0;
        },
      },
      {
        name: 'COUNT',
        minArgs: 1,
        maxArgs: Infinity,
        fn: (args) => args.filter((v) => v != null && v !== '').length,
      },
      {
        name: 'MIN',
        minArgs: 1,
        maxArgs: Infinity,
        fn: (args) => Math.min(...args.map(Number).filter((n) => !isNaN(n))),
      },
      {
        name: 'MAX',
        minArgs: 1,
        maxArgs: Infinity,
        fn: (args) => Math.max(...args.map(Number).filter((n) => !isNaN(n))),
      },
      {
        name: 'IF',
        minArgs: 3,
        maxArgs: 3,
        fn: (args) => (args[0] ? args[1] : args[2]),
      },
      {
        name: 'AND',
        minArgs: 1,
        maxArgs: Infinity,
        fn: (args) => args.every(Boolean),
      },
      {
        name: 'OR',
        minArgs: 1,
        maxArgs: Infinity,
        fn: (args) => args.some(Boolean),
      },
      {
        name: 'NOT',
        minArgs: 1,
        maxArgs: 1,
        fn: (args) => !args[0],
      },
      {
        name: 'CONCAT',
        minArgs: 1,
        maxArgs: Infinity,
        fn: (args) => args.join(''),
      },
      {
        name: 'ROUND',
        minArgs: 1,
        maxArgs: 2,
        fn: (args) => {
          const decimals = args[1] != null ? Number(args[1]) : 0;
          return Math.round(Number(args[0]) * Math.pow(10, decimals)) / Math.pow(10, decimals);
        },
      },
      { name: 'ABS', minArgs: 1, maxArgs: 1, fn: (args) => Math.abs(Number(args[0])) },
      {
        name: 'POWER',
        minArgs: 2,
        maxArgs: 2,
        fn: (args) => Math.pow(Number(args[0]), Number(args[1])),
      },
      { name: 'SQRT', minArgs: 1, maxArgs: 1, fn: (args) => Math.sqrt(Number(args[0])) },
      { name: 'LEN', minArgs: 1, maxArgs: 1, fn: (args) => String(args[0]).length },
      { name: 'UPPER', minArgs: 1, maxArgs: 1, fn: (args) => String(args[0]).toUpperCase() },
      { name: 'LOWER', minArgs: 1, maxArgs: 1, fn: (args) => String(args[0]).toLowerCase() },
      { name: 'TRIM', minArgs: 1, maxArgs: 1, fn: (args) => String(args[0]).trim() },
    ];
    for (const fn of fns) {
      this._functions.set(fn.name, fn);
    }
  }
}

function parseCellRefStr(ref: string): { col: string; row: number } {
  const match = ref.match(/^([A-Z]+)(\d+)$/i);
  if (!match) throw new Error(`Invalid cell reference: ${ref}`);
  return { col: match[1].toUpperCase(), row: parseInt(match[2], 10) };
}
