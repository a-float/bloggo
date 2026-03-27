import Image from "next/image";
import React from "react";

interface BlurredBackgroundImageProps {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function BlurredBackgroundImage({
  src,
  alt = "",
  width = 250,
  height = 300,
}: BlurredBackgroundImageProps) {
  return (
    <>
      <Image
        className="w-full h-full scale-105 blur-xs opacity-80 absolute object-cover object-center"
        src={src}
        width={width}
        height={height}
        alt=""
      />
      <Image
        className="z-0 relative object-contain w-full h-full object-center"
        width={width}
        height={height}
        src={src}
        alt={alt}
      />
    </>
  );
}
