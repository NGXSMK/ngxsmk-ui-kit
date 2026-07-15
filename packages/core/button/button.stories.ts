import { Meta, StoryObj } from '@storybook/angular';
import { NgxsmkButton } from '@ngxsmk/core/button';

const meta: Meta<NgxsmkButton> = {
  title: 'Core/Button',
  component: NgxsmkButton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'success', 'warning', 'error', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<NgxsmkButton>;

export const Primary: Story = {
  render: () => ({
    template: '<button ngxsmk-button variant="primary">Primary</button>',
  }),
};

export const Outline: Story = {
  render: () => ({
    template: '<button ngxsmk-button variant="outline">Outline</button>',
  }),
};
