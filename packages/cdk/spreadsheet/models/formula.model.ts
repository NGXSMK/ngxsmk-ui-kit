/** AST node types for parsed formulas. */
export type FormulaNodeType =
  | 'cell_ref'
  | 'range_ref'
  | 'number'
  | 'string'
  | 'boolean'
  | 'binary_op'
  | 'unary_op'
  | 'function_call';

export interface FormulaNode {
  readonly type: FormulaNodeType;
}

export interface CellRefNode extends FormulaNode {
  readonly type: 'cell_ref';
  readonly col: string;
  readonly row: number;
}

export interface RangeRefNode extends FormulaNode {
  readonly type: 'range_ref';
  readonly startCol: string;
  readonly startRow: number;
  readonly endCol: string;
  readonly endRow: number;
}

export interface NumberNode extends FormulaNode {
  readonly type: 'number';
  readonly value: number;
}

export interface StringNode extends FormulaNode {
  readonly type: 'string';
  readonly value: string;
}

export interface BooleanNode extends FormulaNode {
  readonly type: 'boolean';
  readonly value: boolean;
}

export interface BinaryOpNode extends FormulaNode {
  readonly type: 'binary_op';
  readonly op: '+' | '-' | '*' | '/' | '&' | '=' | '<>' | '>' | '<' | '>=' | '<=';
  readonly left: FormulaNode;
  readonly right: FormulaNode;
}

export interface UnaryOpNode extends FormulaNode {
  readonly type: 'unary_op';
  readonly op: '-' | '+';
  readonly operand: FormulaNode;
}

export interface FunctionCallNode extends FormulaNode {
  readonly type: 'function_call';
  readonly name: string;
  readonly args: FormulaNode[];
}

/** Result of evaluating a formula. */
export interface FormulaResult {
  readonly value: number | string | boolean | null;
  readonly error?: string;
}

/** Dependency edge in the formula graph. */
export interface FormulaDependency {
  /** Cell that contains the formula. */
  readonly source: string;
  /** Cell(s) the formula depends on. */
  readonly targets: ReadonlyArray<string>;
}

/** Built-in function signature. */
export interface FormulaFunction {
  readonly name: string;
  readonly minArgs: number;
  readonly maxArgs: number;
  readonly fn: (args: (number | string | boolean | null)[]) => number | string | boolean | null;
}
