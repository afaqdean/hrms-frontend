import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import AvatarGroup from './AvatarGroup';

/**
 * Metadata for the AvatarGroup component stories.
 * This defines the title, component, and controls for Storybook.
 */
const meta: Meta<typeof AvatarGroup> = {
  title: 'Components/AvatarGroup', // Storybook title
  component: AvatarGroup, // Component being documented
  tags: ['autodocs'], // Enables automatic documentation generation
  argTypes: {
    avatars: {
      control: [], // Allows Storybook to control the `avatars` prop as an array
      description: 'An array of avatar image URLs to display in the group.', // Description for the prop
    },
  },
};

export default meta;

/**
 * Template for creating AvatarGroup stories.
 * This is a reusable function that accepts args and renders the AvatarGroup component.
 */
const Template: StoryObj<typeof AvatarGroup> = {
  render: args => <AvatarGroup {...args} />, // Renders the AvatarGroup component with passed args
};

/**
 * Default story for the AvatarGroup component.
 * This demonstrates a typical use case with multiple avatars.
 */
export const Default: StoryObj<typeof AvatarGroup> = {
  ...Template,
  args: {
    avatars: [
      'https://randomuser.me/api/portraits/men/1.jpg',
      'https://randomuser.me/api/portraits/women/2.jpg',
      'https://randomuser.me/api/portraits/men/3.jpg',
      'https://randomuser.me/api/portraits/women/4.jpg',
    ],
  },
};

/**
 * LargeGroup story for the AvatarGroup component.
 * This demonstrates the component with a larger group of avatars.
 */
export const LargeGroup: StoryObj<typeof AvatarGroup> = {
  ...Template,
  args: {
    avatars: [
      'https://randomuser.me/api/portraits/men/6.jpg',
      'https://randomuser.me/api/portraits/women/7.jpg',
      'https://randomuser.me/api/portraits/men/8.jpg',
      'https://randomuser.me/api/portraits/women/9.jpg',
      'https://randomuser.me/api/portraits/men/10.jpg',
      'https://randomuser.me/api/portraits/women/11.jpg',
    ],
  },
};
