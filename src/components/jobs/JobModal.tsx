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
import JobForm from "./JobForm";
import { Job } from "@/lib/db/schema/jobs";

export default function JobModal({
  job,
  emptyState,
}: {
  job?: Job;
  emptyState?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const editing = !!job?.id;
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
            New Job
          </Button>
        ) : (
          <Button variant={editing ? "ghost" : "outline"} size="sm">
            {editing ? "Edit" : "Create New Job"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>{editing ? "Edit" : "Create"} Job</DialogTitle>
        </DialogHeader>
        <div className="px-5 pb-5">
          <JobForm closeModal={closeModal} job={job} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
