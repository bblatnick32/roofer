"use client";

import { trpc } from "@/lib/trpc/client";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useOppOnSuccess } from "./hooks/use-opp-on-success";
import { OppId } from "@/lib/db";
import { useRouter } from "next/navigation";

const DeleteOppMenuItem = ({ id }: { id: OppId }) => {
  const router = useRouter();
  const onSuccess = useOppOnSuccess();
  const { mutate: deleteOpp, isLoading: isDeleting } =
    trpc.opps.deleteOpp.useMutation({
      onSuccess: (res) => {
        router.push("/opps");
        onSuccess("delete", res);
      },
    });

  return (
    <DropdownMenuItem onClick={() => deleteOpp({ id })}>
      Delete
    </DropdownMenuItem>
  );
};

export default DeleteOppMenuItem;
