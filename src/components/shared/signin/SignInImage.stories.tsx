import type { Meta, StoryObj } from '@storybook/react';
import SignInImage from './SignInImage';

const meta: Meta<typeof SignInImage> = {
  title: 'Components/SignInImage',
  component: SignInImage,
  parameters: {
    docs: {
      description: {
        component:
          'A simple image component displaying a login-related graphic. Uses Next.js Image optimization.',
      },
    },
  },
};

export default meta;

export const Default: StoryObj<typeof SignInImage> = {
  args: {},
};
