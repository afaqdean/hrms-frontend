import type React from 'react';
import type { BtnType } from '../constants/Types/ButtonType';

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
