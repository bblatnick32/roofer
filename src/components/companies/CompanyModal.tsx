"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CompanyForm from "./CompanyForm";
import { Company, CompanyId } from "@/lib/db/schema/companies";

export default function CompanyModal({
  company,
  emptyState,
  onCreate,
}: {
  company?: Company;
  emptyState?: boolean;
  onCreate?: (id: CompanyId) => void;
}) {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const editing = !!company?.id;
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {emptyState ? (
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            New Company
          </Button>
        ) : (
          <Button variant={editing ? "ghost" : "default"} size="sm">
            {editing ? "Edit" : "New Company"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>{editing ? "Edit" : "New"} Company</DialogTitle>
        </DialogHeader>
        <div className="px-5 pb-5">
          <CompanyForm
            closeModal={closeModal}
            company={company}
            onCreate={onCreate}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
