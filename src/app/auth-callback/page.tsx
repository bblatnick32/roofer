"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";
import { trpc } from "@/lib/trpc/client";

const Page = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { setActive } = useOrganizationList();

  trpc.auth.authCallback.useQuery(undefined, {
    onSuccess: ({ success, activeOrgId, orgId }) => {
      if (success) {
        // if no active organization is set, set it to the orgId (there should only be one)
        if (setActive && orgId && !activeOrgId) {
          setActive({
            organization: orgId,
          })
            .catch((err) => {
              console.error(err);
            })
            .then(
              () => {
                // user is synced to db
                router.push(origin ? `/${origin}` : "/dashboard");
              },
              (err) => {
                // handle any errors here
                console.error(err);
              }
            );
        } else {
          // user is synced to db
          router.push(origin ? `/${origin}` : "/dashboard");
        }
      }
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
      }
    },
    retry: true,
    retryDelay: 500,
  });

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
