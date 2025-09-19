'use client';

import Login from '@/containers/shared/signin/Login';
import React, { Suspense } from 'react';

export default function SignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
}
