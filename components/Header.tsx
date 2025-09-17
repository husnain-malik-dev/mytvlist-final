import Image from "next/image";
import Link from "next/link";
import GenreDropdown from "./GenreDropdown";
import SearchInput from "./SearchInput";
import Logo from '../public/Logo.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "./ui/button";

async function Header() {
  let user;
  try {
    user = await currentUser();
  } catch (error) {
    console.error("Clerk error:", error);
    user = null;
  }
  const userName = user?.username || '';

  const navigationItems = [
    { href: userName ? `/my-list/${userName}` : "/sign-in", label: "TV List", hiddenOnMobile: true },
    { href: "/forums", label: "Forums", hiddenOnMobile: true },
  ];

  return (
    <header className="fixed w-full z-20 top-0 flex items-center justify-between p-5 bg-gradient-to-t from-gray-200/0 via-gray-900/25 to-gray-900">
      <Link href="/" className="mr-10">
        <Image
          src={Logo}
          width={120}
          height={0}
          alt="My TV List Logo"
          className="cursor-pointer invert md:ml-6"
        />
      </Link>

      <nav className="flex space-x-2 sm:space-x-4 justify-center items-center md:text-lg">
        {navigationItems.map((item) => (
          <div key={item.href} className={item.hiddenOnMobile ? "hidden sm:block" : ""}>
            <Link href={item.href}>{item.label}</Link>
          </div>
        ))}

        <div className="hidden sm:block">
          <GenreDropdown />
        </div>

        <div className="sm:hidden">
          <MobileDropdown userName={userName} />
        </div>

        <SearchInput />

        <SignedOut>
          <SignInButton>
            <Button variant="outline" className="rounded-full">Sign in</Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </nav>
    </header>
  );
}

export default Header;

async function MobileDropdown({ userName }: { userName: string }) {
  const mobileItems = [
    { href: `/my-list/${userName}`, label: "TV List" },
    { href: "/forums", label: "Forums" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-white flex justify-center items-center">
        <ChevronDown className="ml-1" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="sm:hidden">
        <DropdownMenuLabel>Explore</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mobileItems.map((item) => (
          <DropdownMenuItem key={item.href} className="cursor-pointer">
            <Link href={item.href}>{item.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}