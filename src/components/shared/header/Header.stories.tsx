import type { Meta, StoryFn } from '@storybook/react';
import Header from '@/components/shared/header/Header';

export default {
  title: 'Components/Header', // Storybook path
  component: Header, // The component itself
  parameters: {
    docs: {
      description: {
        component: 'A simple header component with a pink background.', // AutoDocs description
      },
    },
  },
} as Meta;

// Template for creating stories
const Template: StoryFn<typeof Header> = () => <Header />;

// Default story
export const Default = Template.bind({});
