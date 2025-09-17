import type { Meta, StoryFn } from '@storybook/react';
import SignInForm from '@/components/shared/signin/SignInForm';

export default {
  title: 'Components/SignInForm', // Storybook path
  component: SignInForm, // The component itself
  parameters: {
    docs: {
      description: {
        component: 'A sign-in form component for user authentication.',
      },
    },
  },
} as Meta;

// Template for creating stories
const Template: StoryFn<typeof SignInForm> = () => <SignInForm />;

// Default story
export const Default = Template.bind({});
