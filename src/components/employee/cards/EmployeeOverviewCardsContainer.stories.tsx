import type { Meta, StoryObj } from '@storybook/react';
import EmployeeOverviewCardsContainer from '@/components/employee/cards/EmployeeOverviewCardsContainer';

const meta = {
  title: 'Components/EmployeeOverviewCardsContainer',
  component: EmployeeOverviewCardsContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Overview
A container displaying multiple cards, each representing an employee's leave details. Each card shows the number of availed and total leaves.

## Features
- Displays a grid of cards
- Customizable background color for each card
- Each card shows availed and total leave numbers with an icon

## Usage Guidelines
- Use the \`Card\` component within this container to display various leave details.
- Customize the grid layout and card properties as needed.
`,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EmployeeOverviewCardsContainer>;

export default meta;

type Story = StoryObj<typeof EmployeeOverviewCardsContainer>;

// Basic Template for rendering the component
const Template: Story = {
  render: () => <EmployeeOverviewCardsContainer />,
};

export const Default = {
  ...Template,
  parameters: {
    docs: {
      description: {
        story: 'Default container displaying cards with leave details.',
      },
    },
  },
};

export const WithMultipleCards = {
  ...Template,
  parameters: {
    docs: {
      description: {
        story: 'Container showing multiple leave cards with the same configuration.',
      },
    },
  },
};

export const WithCustomBackground = {
  ...Template,
  parameters: {
    docs: {
      description: {
        story: 'Container with cards having a custom background color (e.g., yellow).',
      },
    },
  },
};
