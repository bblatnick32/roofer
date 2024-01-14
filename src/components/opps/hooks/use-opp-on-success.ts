import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

const useOppOnSuccess = (closeModal?: () => void) => {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const router = useRouter();

  const onSuccess = async (
    action: "create" | "update" | "delete",
    data?: { success?: boolean; error?: string }
  ) => {
    if (data?.error) {
      toast({
        title: `${action
          .slice(0, 1)
          .toUpperCase()
          .concat(action.slice(1))} Failed`,
        description: data.error,
        variant: "destructive",
      });
      return;
    }

    await utils.opps.getOpps.invalidate();
    utils.opps.getOpps.prefetch();
    await utils.opps.getOppById.invalidate();
    // utils.opps.getOppById.prefetch();

    if (closeModal) closeModal();
    toast({
      title: "Success",
      description: `Opportunity ${action}d!`,
      variant: "default",
    });
  };

  return onSuccess;
};

export { useOppOnSuccess };
