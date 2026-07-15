import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';

export interface NgAddSchema {
  project?: string;
  theme?: 'violet' | 'neutral' | 'emerald' | 'rose';
}

export function ngAdd(_options: NgAddSchema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    // Stub: production implementation will wire @ngxsmk packages, add the theme
    // stylesheet to angular.json styles, and register provideAnimations/zoneless
    // providers. Intentionally minimal for now.
    return _tree;
  };
}
