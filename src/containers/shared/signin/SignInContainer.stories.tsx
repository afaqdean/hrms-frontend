import type { Meta, StoryFn } from '@storybook/react';
import SignInContainer from './Login';

export default {
  title: 'Containers/SignInContainer', // Storybook path
  component: SignInContainer, // The component itself
  parameters: {
    docs: {
      description: {
        component: 'A sign-in form component for user authentication.',
      },
    },
  },
} as Meta;

// Template for creating stories
const Template: StoryFn<typeof SignInContainer> = () => <SignInContainer />;

// Default story
export const Default = Template.bind({});
