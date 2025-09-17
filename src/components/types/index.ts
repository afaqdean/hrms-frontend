import type { BtnType } from '@/constants/Types/ButtonType';
import type { ReactNode } from 'react';

/**
 * Props for the CheckBox component.
 *
 * This type defines the properties that can be passed to the CheckBox component.
 *
 * @typedef {object} CheckBoxProps
 * @property {string} name - The name of the checkbox input.
 * @property {string} text - The label text that will be displayed next to the checkbox.
 * @property {InputHTMLAttributes} extraProps - extra props to pass in the checkbox.
 * @property {('sm' | 'base' | 'lg')} [textSize='base'] - The size of the label text.
 * Default is 'base'. Possible values are:
 *   - 'sm': Small text size
 *   - 'base': Default (medium) text size
 *   - 'lg': Large text size
 */
export type CheckBoxProps = {
  name?: string;
  text: string | ReactNode; // The label text for the checkbox
  textSize?: 'sm' | 'base' | 'lg'; // Optional size for the label text
  extraProps?: React.InputHTMLAttributes<HTMLInputElement>; // Corrected type for extra props
};

/**
 * @description An interface for the props of the ModalUI component
 * @property {React.ReactNode | string} [btnName] - The name of the button that triggers the modal
 * @property {React.ReactNode} [children] - The content of the modal
 * @property {boolean} [isOpen] - The state of the modal (open or closed)
 * @property {() => void} [handleOpen] - The function that opens the modal
 * @property {() => void} [handleClose] - The function that closes the modal
 * @property {BtnType} [btnType] - The type of the button that triggers the modal (create or delete)
 */
export type ModalUIProps = {
  btnName?: React.ReactNode | string;
  children?: React.ReactNode;
  isOpen?: boolean;
  handleOpen?: () => void;
  handleClose?: () => void;
  btnType?: BtnType;
};

export type TimeTrackingTableEntryProps = {
  day: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  totalHours: string;
};
