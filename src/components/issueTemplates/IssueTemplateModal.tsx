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
import IssueTemplateForm from "./IssueTemplateForm";
import { IssueTemplate } from "@/lib/db/schema/issueTemplates";

export default function IssueTemplateModal({
  issueTemplate,
  emptyState,
}: {
  issueTemplate?: IssueTemplate;
  emptyState?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const editing = !!issueTemplate?.id;
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
            New Issue Template
          </Button>
        ) : (
          <Button variant={editing ? "ghost" : "default"} size="sm">
            {editing ? "Edit" : "New Issue Template"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>
            {editing ? "Edit" : "Create"} Issue Template
          </DialogTitle>
        </DialogHeader>
        <div className="px-5 pb-5">
          <IssueTemplateForm
            closeModal={closeModal}
            issueTemplate={issueTemplate}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
