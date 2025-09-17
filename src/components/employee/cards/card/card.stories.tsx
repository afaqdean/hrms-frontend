import type { Meta, StoryFn } from '@storybook/react';
import EmployeeOverviewCard from '@/components/employee/cards/card/EmployeeOverviewCard';
import React from 'react';
import { FaFile } from 'react-icons/fa'; // Import an icon for demonstration

export default {
  title: 'Components/Card', // Storybook path
  component: EmployeeOverviewCard, // The component itself
  parameters: {
    docs: {
      description: {
        component:
          'A card component that displays an icon, text, and a ratio of availed leaves to total leaves. The background color can be customized using the `variant` prop.',
      },
    },
  },
  argTypes: {
    icon: {
      description: 'Icon to display inside the card',
    },
    text: {
      control: 'text',
      description: 'Text to display below the icon',
    },
    availedLeaves: {
      control: 'number',
      description: 'Number of availed leaves',
    },
    totalLeaves: {
      control: 'number',
      description: 'Total number of leaves',
    },
    className: {
      control: 'text',
      description: 'Additional custom class names',
    },
    variant: {
      control: 'select',
      options: ['yellow', 'red', 'green', 'blue'],
      description: 'Variant to control the card background color',
    },
  },
  docs: {
    page: null, // This will generate the default DocsPage automatically
  },
} as Meta;

// Template for creating stories
const Template: StoryFn<typeof EmployeeOverviewCard> = args => <EmployeeOverviewCard {...args} />;

// Default story (primary variant is yellow)
export const Default = Template.bind({});
Default.args = {
  icon: <FaFile />, // Use a file icon
  text: 'Total Leave Counts',
  availedLeaves: 5,
  totalLeaves: 20,
  variant: 'yellow', // Primary variant
};

// Story with red variant
export const RedVariant = Template.bind({});
RedVariant.args = {
  icon: <FaFile />,
  text: 'Total Leave Counts',
  availedLeaves: 10,
  totalLeaves: 30,
  variant: 'red',
};

// Story with green variant
export const GreenVariant = Template.bind({});
GreenVariant.args = {
  icon: <FaFile />,
  text: 'Total Leave Counts',
  availedLeaves: 15,
  totalLeaves: 25,
  variant: 'green',
};

// Story with blue variant
export const BlueVariant = Template.bind({});
BlueVariant.args = {
  icon: <FaFile />,
  text: 'Total Leave Counts',
  availedLeaves: 8,
  totalLeaves: 18,
  variant: 'blue',
};
