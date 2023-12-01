import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import MaxWidthWrapper from "./max-width-wrapper";
import { buttonVariants } from "./ui/button";
import { getUserAuth } from "@/lib/auth/utils";
import { LeftNavBar } from "./left-nav-bar";
import { PropsWithChildren } from "react";

const Navbar = async ({ children }: PropsWithChildren) => {
  const { session } = await getUserAuth();

  if (session?.user?.id)
    return (
      <div className="flex">
        <LeftNavBar />
        {children}
      </div>
    );

  return (
    <>
      <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
        <MaxWidthWrapper>
          <div className="flex h-14 items-center justify-between border-b border-zinc-200">
            <div className="flex space-x-6 items-center font-medium">
              <Link href="/" className="flex z-40 font-bold text-primary">
                <span>skyline.</span>
              </Link>
            </div>

            {/* todo: add mobile navbar */}

            <div className="hidden items-center space-x-4 sm:flex">
              {!session ? (
                <>
                  <Link
                    href="/pricing"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Pricing
                  </Link>
                  <SignInButton>
                    <button
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                      })}
                    >
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button
                      className={buttonVariants({
                        size: "sm",
                      })}
                    >
                      Get started <ArrowRight className="ml-1.5 h-5 w-5" />
                    </button>
                  </SignUpButton>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </MaxWidthWrapper>
      </nav>
      {children}
    </>
  );
};

export default Navbar;
