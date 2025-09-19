import type { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

export default function AuthLayout(props: {
  children: ReactNode;
}) {
  return (
    <>
      <ToastContainer />
      {props.children}
    </>
  );
}
