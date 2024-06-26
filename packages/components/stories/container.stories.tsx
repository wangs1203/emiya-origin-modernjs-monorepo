import type { Meta, StoryObj } from '@storybook/react';
import { Container } from '../src';

const storyMeta: Meta<typeof Container> = {
  title: 'Emiya Components/Container',
  component: Container,
  argTypes: {
    children: { control: 'object' },
    full: { control: 'boolean' },
    shadow: { control: 'boolean' },
  },
  args: {
    children: <div>content</div>,
  },
};

export default storyMeta;

type Story = StoryObj<typeof Container>;

export const Default: Story = {
  render: ({ children, full }) => (
    <div className="tw-bg-orange-200 tw-w-full tw-h-full">
      <Container full={full}>{children}</Container>
    </div>
  ),
};
