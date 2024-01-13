import { ColumnDef } from "@tanstack/react-table";

import { Company, Property, Opp, Contact } from "@/lib/db";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc/client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

export default function useColumns({
  companies,
  properties,
  contacts,
}: {
  companies?: Company[];
  properties?: Property[];
  contacts?: Contact[];
}): ColumnDef<Opp>[] {
  const { toast } = useToast();
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

    router.refresh();
    toast({
      title: "Success",
      description: `Opportunity ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: deleteOpp, isLoading: isDeleting } =
    trpc.opps.deleteOpp.useMutation({
      onSuccess: (res) => onSuccess("delete", res),
    });

  return useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          return (
            <Link href={`/opps/${row.original.id}`}>
              <Button variant="link">{row.getValue("name")}</Button>
            </Link>
          );
        },
      },
      {
        accessorKey: "companyId",
        header: "Company",
        cell: ({ row }) => {
          const opp = row.original;
          const company = companies?.find((c) => c.id === opp.companyId);
          return company?.name;
        },
      },
      {
        accessorKey: "propertyId",
        header: "Property",
        cell: ({ row }) => {
          const opp = row.original;
          const property = properties?.find((p) => p.id === opp.propertyId);
          return property?.name;
        },
      },
      {
        accessorKey: "contactId",
        header: "Contact",
        cell: ({ row }) => {
          const opp = row.original;
          const contact = contacts?.find((c) => c.id === opp.contactId);
          return contact?.name;
        },
      },
      {
        accessorKey: "stage",
        header: "Stage",
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const opp = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href={`/opps/${row.original.id}`}>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={() => deleteOpp({ id: opp.id })}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [companies, properties, contacts, deleteOpp]
  );
}
