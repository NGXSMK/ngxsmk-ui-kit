import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../packages/**/*.stories.@(ts|mdx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};

export default config;
