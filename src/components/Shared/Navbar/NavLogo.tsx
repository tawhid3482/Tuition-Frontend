// src/components/navbar/NavLogo.tsx
import Image from "next/image";
import Link from "next/link";
import Logo from "../../../app/assets/logo.png";

interface NavLogoProps {
  className?: string;
}

export default function NavLogo({ className = "" }: NavLogoProps) {
  return (
    <div className={`relative h-10 w-20 md:h-12 md:w-28 lg:h-16 lg:w-32 ${className}`}>
      <Link href="/">
        <Image
          src={Logo}
          alt="Company Logo"
          fill
          className="object-contain cursor-pointer"
          sizes="(max-width: 768px) 80px, (max-width: 1024px) 112px, 128px"
          priority
        />
      </Link>
    </div>
  );
}