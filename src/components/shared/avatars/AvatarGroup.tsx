import Image from 'next/image';

const AvatarGroup: React.FC<{ avatars: string[] }> = ({ avatars }) => {
  return (
    <div className="flex items-center">
      {avatars.map((avatar, index) => {
        const uniqueId = `${avatar}-${index}`;
        return (
          <div
            key={uniqueId}
            className="relative mt-2 size-10 overflow-hidden rounded-full border-2 border-white shadow-md"
            style={{ zIndex: avatars.length - index }} // Ensures the last avatar appears on top
          >
            <Image
              src={avatar}
              alt={`Avatar ${uniqueId}`}
              layout="fill" // Ensures the image fills the parent div
              objectFit="cover" // Prevents distortion and maintains aspect ratio
            />
          </div>
        );
      })}
    </div>
  );
};

export default AvatarGroup;
