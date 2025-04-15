"use client"
import { ModeToggle } from "@/components/theme-toggle";
import { GithubIcon, TwitterIcon, CommandIcon, FacebookIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Anchor from "./anchor";
import { SheetLeftbar } from "./leftbar";
import { page_routes } from "@/lib/routes-config";
import { SheetClose } from "@/components/ui/sheet";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const NAVLINKS = [
  {
    title: "Documentation",
    href: `/docs${page_routes[0].href}`,
  },
  // {
  //   title: "Blog",
  //   href: "/blog",
  // },
  // {
  //   title: "About",
  //   href: "/about",
  // },
  {
    title: "Contact",
    href: "https://rjaziz.com/contact",
  }
];


export function Navbar() {
  return (
    <nav className="w-full border-b h-16 sticky top-0 z-50 bg-background">
      <div className="sm:container mx-auto w-[95vw] h-full flex items-center sm:justify-between md:gap-2">
        <div className="flex items-center sm:gap-5 gap-2.5 w-full">
          <SheetLeftbar />
          <div className="flex items-center gap-10">
            <div className="lg:flex hidden">
              <Eyebase haveText={true} isBlur={true} isMove={true} size="sm" />
            </div>
            <div className="md:flex hidden items-center gap-4 text-sm font-medium text-muted-foreground">
              <NavMenu />
            </div>
            <div className=" " />
          </div>
        </div>

        <div className="flex items-center sm:justify-normal justify-between sm:gap-3 ml-1 sm:w-fit w-[90%]">
          <div className="flex items-center justify-between sm:gap-2">
            <div className="flex ml-4 sm:ml-0">
              <Link
                href="https://github.com/kiraaziz/eyebase"
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon",
                })}
              >
                <GithubIcon className="h-[1.1rem] w-[1.1rem]" />
              </Link> 
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}


export function NavMenu({ isSheet = false }) {
  return (
    <>
      {NAVLINKS.map((item) => {
        const Comp = (
          <Anchor
            key={item.title + item.href}
            activeClassName="!text-primary dark:font-medium font-semibold"
            absolute
            className="flex items-center gap-1 sm:text-sm text-[14.5px] dark:text-stone-300/85 text-stone-800"
            href={item.href}
          >
            {item.title}
          </Anchor>
        );
        return isSheet ? (
          <SheetClose key={item.title + item.href} asChild>
            {Comp}
          </SheetClose>
        ) : (
          Comp
        );
      })}
    </>
  );
}


export const Eyebase = ({ size, isBlur, haveText, isMove }: { size: "sm" | "m" | "lg" | "xl", isBlur: boolean, haveText: boolean, isMove: boolean }) => {

  const eyeBallRef = useRef<any>(null)
  const containerRef = useRef<any>(null)

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      if (!eyeBallRef.current || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const eyeCenterX = containerRect.left + containerRect.width / 2
      const eyeCenterY = containerRect.top + containerRect.height / 2

      const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX)

      const maxDistance = 8

      const x = Math.cos(angle) * maxDistance
      const y = Math.sin(angle) * maxDistance

      eyeBallRef.current.style.transform = `translate(${x}px, ${y}px)`
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const scaleUp = () => {
    if (haveText) {
      if (size === "sm") {
        return "w-20 h-8"
      }
      if (size === "m") {
        return "w-48 h-20"
      }
      if (size === "lg") {
        return "w-72 h-28"
      }
      if (size === "xl") {
        return "w-96 h-36"
      }
    } else {
      if (size === "sm") {
        return "w-8 h-8"
      }
      if (size === "m") {
        return "w-20 h-20"
      }
      if (size === "lg") {
        return "w-28 h-28"
      }
      if (size === "xl") {
        return "w-36 h-36"
      }
    }
  }

  return (
    <div className={cn(scaleUp(), 'relative flex items-center justify-center overflow-visible')}>
      {isBlur && <div className={cn(size === "sm" ? "scale-[0.2]" : size === "m" ? "scale-50" : size === "lg" ? "scale-75" : size === "xl" ? "scale-100" : "", "blur-3xl absolute h-max w-max flex items-center justify-center flex-row gap-7")}>
        <div className={cn(haveText ? "pt-2" : "pt-8", "relative flex items-center justify-center h-32 w-36 ")} ref={containerRef}>
          {isMove ? <div id="eye" className="h-16 w-16 flex items-center justify-center rounded-full">
            <div
              ref={eyeBallRef}
              id="eyeBall"
              className="h-8 w-8 bg-primary absolute rounded-full transition-transform duration-75"
            />
          </div> : <div id="eye" className="h-16 w-16 flex items-center justify-center rounded-full">
            <div
              className="h-8 w-8 bg-primary absolute rounded-full transition-transform duration-75"
            />
          </div>}
          <svg
            width="200"
            height="200"
            viewBox="0 -0.5 25 25"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute translate-x-1.5 -translate-y-2 text-primary"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.5 12.714C18.5 15.081 15.366 17 11.5 17C7.634 17 4.5 15.081 4.5 12.714C4.5 10.347 7.634 8.42896 11.5 8.42896C15.366 8.42896 18.5 10.347 18.5 12.714Z"
              stroke="currentColor"
              className="fill-transparent"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.75 8.429C10.75 8.84321 11.0858 9.179 11.5 9.179C11.9142 9.179 12.25 8.84321 12.25 8.429H10.75ZM12.25 5C12.25 4.58579 11.9142 4.25 11.5 4.25C11.0858 4.25 10.75 4.58579 10.75 5H12.25ZM18.2931 7.05471C18.4813 6.68571 18.3347 6.23403 17.9657 6.04586C17.5967 5.85769 17.145 6.00428 16.9569 6.37329L18.2931 7.05471ZM15.5199 9.19129C15.3317 9.5603 15.4783 10.012 15.8473 10.2001C16.2163 10.3883 16.668 10.2417 16.8561 9.87271L15.5199 9.19129ZM6.04314 6.37329C5.85497 6.00428 5.40329 5.85769 5.03429 6.04586C4.66528 6.23403 4.51869 6.68571 4.70686 7.05471L6.04314 6.37329ZM6.14386 9.87271C6.33203 10.2417 6.78371 10.3883 7.15271 10.2001C7.52172 10.012 7.66831 9.5603 7.48014 9.19129L6.14386 9.87271ZM12.25 8.429V5H10.75V8.429H12.25ZM16.9569 6.37329L15.5199 9.19129L16.8561 9.87271L18.2931 7.05471L16.9569 6.37329ZM4.70686 7.05471L6.14386 9.87271L7.48014 9.19129L6.04314 6.37329L4.70686 7.05471Z"
              fill="currentColor"
            />
          </svg>
        </div>
        {haveText && <h1 className='text-5xl font-bold text-primary'>Eyebase</h1>}
      </div>}
      <div className={cn(size === "sm" ? "scale-[0.2]" : size === "m" ? "scale-50" : size === "lg" ? "scale-75" : size === "xl" ? "scale-100" : "", "absolute h-max w-max flex items-center justify-center flex-row gap-7")}>
        <div className={cn(haveText ? "pt-2" : "pt-8", "relative flex items-center justify-center h-32 w-36 ")} ref={containerRef}>
          {isMove ? <div id="eye" className="h-16 w-16 flex items-center justify-center rounded-full">
            <div
              ref={eyeBallRef}
              id="eyeBall"
              className="h-8 w-8 bg-primary absolute rounded-full transition-transform duration-75"
            />
          </div> : <div id="eye" className="h-16 w-16 flex items-center justify-center rounded-full">
            <div
              className="h-8 w-8 bg-primary absolute rounded-full transition-transform duration-75"
            />
          </div>}
          <svg
            width="200"
            height="200"
            viewBox="0 -0.5 25 25"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute translate-x-1.5 -translate-y-2 text-primary"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.5 12.714C18.5 15.081 15.366 17 11.5 17C7.634 17 4.5 15.081 4.5 12.714C4.5 10.347 7.634 8.42896 11.5 8.42896C15.366 8.42896 18.5 10.347 18.5 12.714Z"
              stroke="currentColor"
              className="fill-transparent"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.75 8.429C10.75 8.84321 11.0858 9.179 11.5 9.179C11.9142 9.179 12.25 8.84321 12.25 8.429H10.75ZM12.25 5C12.25 4.58579 11.9142 4.25 11.5 4.25C11.0858 4.25 10.75 4.58579 10.75 5H12.25ZM18.2931 7.05471C18.4813 6.68571 18.3347 6.23403 17.9657 6.04586C17.5967 5.85769 17.145 6.00428 16.9569 6.37329L18.2931 7.05471ZM15.5199 9.19129C15.3317 9.5603 15.4783 10.012 15.8473 10.2001C16.2163 10.3883 16.668 10.2417 16.8561 9.87271L15.5199 9.19129ZM6.04314 6.37329C5.85497 6.00428 5.40329 5.85769 5.03429 6.04586C4.66528 6.23403 4.51869 6.68571 4.70686 7.05471L6.04314 6.37329ZM6.14386 9.87271C6.33203 10.2417 6.78371 10.3883 7.15271 10.2001C7.52172 10.012 7.66831 9.5603 7.48014 9.19129L6.14386 9.87271ZM12.25 8.429V5H10.75V8.429H12.25ZM16.9569 6.37329L15.5199 9.19129L16.8561 9.87271L18.2931 7.05471L16.9569 6.37329ZM4.70686 7.05471L6.14386 9.87271L7.48014 9.19129L6.04314 6.37329L4.70686 7.05471Z"
              fill="currentColor"
            />
          </svg>
        </div>
        {haveText && <h1 className='text-7xl font-medium text-primary'>Eyebase</h1>}
      </div>
    </div>
  )
}