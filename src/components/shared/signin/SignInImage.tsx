import loginImage from '@/public/assets/Group.png';
import Image from 'next/image';
import React from 'react';

const SignInImage = () => {
  return (
    <div className="mb-3 flex items-center justify-center smd:mb-0 md:w-1/2">
      <div className="relative size-20 md:h-full md:w-80">
        <Image
          src={loginImage}
          alt="login-image"
          fill // Makes it take full width and height of the parent div
          className="object-contain" // Ensures the whole image is visible without cropping
        />
      </div>
    </div>
  );
};

export default SignInImage;
