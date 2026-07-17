import { Rule, Tree, SchematicContext, SchematicsException } from '@angular-devkit/schematics';

export interface NgAddSchema {
  project?: string;
  theme?: 'violet' | 'neutral' | 'emerald' | 'rose';
}

export function ngAdd(_options: NgAddSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Initializing @ngxsmk/core UI kit...');

    if (!tree.exists('angular.json')) {
      throw new SchematicsException('Could not find angular.json workspace file.');
    }

    const content = tree.read('angular.json')!.toString('utf-8');
    const json = JSON.parse(content);
    
    const projectName = _options.project || Object.keys(json.projects)[0];
    if (!projectName) {
      throw new SchematicsException('No project found in workspace.');
    }

    const project = json.projects[projectName];
    if (!project) {
      throw new SchematicsException(`Project "${projectName}" not found in workspace.`);
    }

    const targets = project.architect || project.targets;
    if (!targets) {
      throw new SchematicsException(`Could not find architect targets for project "${projectName}".`);
    }

    // Add styles to build architect options
    if (targets.build && targets.build.options) {
      const styles = targets.build.options.styles || [];
      const themeName = _options.theme || 'violet';
      const themeStyle = `node_modules/@ngxsmk/theme/styles/ngxsmk.${themeName}.css`;
      const buttonStyle = 'node_modules/@ngxsmk/core/styles/button.css';
      const inputStyle = 'node_modules/@ngxsmk/core/styles/input.css';

      if (!styles.includes(themeStyle)) {
        styles.unshift(themeStyle);
        context.logger.info(`Added theme stylesheet: ${themeStyle}`);
      }
      if (!styles.includes(buttonStyle)) {
        styles.push(buttonStyle);
        context.logger.info(`Added button stylesheet: ${buttonStyle}`);
      }
      if (!styles.includes(inputStyle)) {
        styles.push(inputStyle);
        context.logger.info(`Added input/textarea stylesheet: ${inputStyle}`);
      }

      targets.build.options.styles = styles;
    }

    // Add styles to test architect options
    if (targets.test && targets.test.options) {
      const styles = targets.test.options.styles || [];
      const themeName = _options.theme || 'violet';
      const themeStyle = `node_modules/@ngxsmk/theme/styles/ngxsmk.${themeName}.css`;
      const buttonStyle = 'node_modules/@ngxsmk/core/styles/button.css';
      const inputStyle = 'node_modules/@ngxsmk/core/styles/input.css';

      if (!styles.includes(themeStyle)) {
        styles.unshift(themeStyle);
      }
      if (!styles.includes(buttonStyle)) {
        styles.push(buttonStyle);
      }
      if (!styles.includes(inputStyle)) {
        styles.push(inputStyle);
      }

      targets.test.options.styles = styles;
    }

    tree.overwrite('angular.json', JSON.stringify(json, null, 2));
    context.logger.info('Successfully updated angular.json with @ngxsmk/core styles!');

    return tree;
  };
}
