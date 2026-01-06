import type { Meta, StoryObj } from '@storybook/react';
import CategoryList from './CategoryList';

const meta: Meta<typeof CategoryList> = {
  title: 'Components/CategoryList',
  component: CategoryList,
};

export default meta;

type Story = StoryObj<typeof CategoryList>;

export const Default: Story = {
  args: {
    current: '전체보기',
    horizontal: true,
  },
};

export const ReactActive: Story = {
  args: {
    current: 'React',
    horizontal: true,
  },
};
