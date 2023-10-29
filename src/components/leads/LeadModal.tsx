"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import LeadForm from "./LeadForm";
import { Lead } from "@/lib/db/schema/leads";

export default function LeadModal({
  lead,
  emptyState,
}: {
  lead?: Lead;
  emptyState?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const editing = !!lead?.id;
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
            New Lead
          </Button>
        ) : (
          <Button variant={editing ? "ghost" : "outline"} size="sm">
            {editing ? "Edit" : "+ Add Lead"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>{editing ? "Edit" : "Create"} Lead</DialogTitle>
        </DialogHeader>
        <div className="px-5 pb-5">
          <LeadForm closeModal={closeModal} lead={lead} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
