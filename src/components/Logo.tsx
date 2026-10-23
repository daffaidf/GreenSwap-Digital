"use client";

import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/Logo.png"
      alt="GreenSwap Digital logo"
      width={48}
      height={48}
      className={className}
    />
  );
}
