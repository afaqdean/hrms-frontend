import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { CiMedicalCross } from 'react-icons/ci';
import Avatar from './Avatar';

export default {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    src: { control: 'text' },
    icon: { control: 'boolean' },
    className: { control: 'text' },
  },
} as Meta;

const Template: StoryFn<typeof Avatar> = args => <Avatar {...args} />;

export const Default = Template.bind({});
Default.args = {
  src: '/assets/avatar.jpg',
  className: 'border border-gray-300',
};

export const IconVariant = Template.bind({});
IconVariant.args = {
  icon: <CiMedicalCross />,
  className: 'bg-[#E3EEFF]',
};
