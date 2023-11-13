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
import RepairTemplateForm from "./RepairTemplateForm";
import { RepairTemplate } from "@/lib/db/schema/repairTemplates";

export default function RepairTemplateModal({
  repairTemplate,
  emptyState,
}: {
  repairTemplate?: RepairTemplate;
  emptyState?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const editing = !!repairTemplate?.id;
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
            New Repair Template
          </Button>
        ) : (
          <Button variant={editing ? "ghost" : "default"} size="sm">
            {editing ? "Edit" : "New Repair Template"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>
            {editing ? "Edit" : "Create"} Repair Template
          </DialogTitle>
        </DialogHeader>
        <div className="px-5 pb-5">
          <RepairTemplateForm
            closeModal={closeModal}
            repairTemplate={repairTemplate}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
