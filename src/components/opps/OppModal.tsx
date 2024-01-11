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
import { Opp } from "@/lib/db/schema/opps";
import { NameFormField } from "./forms/FormFields";
import NewOppFormShell from "./forms/NewOppFormShell";
import OppFormShell from "./forms/OppFormShell";
import { useNewOppForm, useOppForm } from "./forms/hooks";
import { insertOppParams, updateOppParams } from "@/lib/db";

export default function OppModal({
  opp,
  emptyState,
}: {
  opp?: Opp;
  emptyState?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const editing = !!opp?.id;
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
            New Opportunity
          </Button>
        ) : (
          <Button variant={editing ? "ghost" : "default"} size="sm">
            {editing ? "Edit" : "New Opportunity"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>{editing ? "Edit" : "New"} Opportunity</DialogTitle>
        </DialogHeader>
        <div className="px-5 pb-5">
          {editing ? (
            <OppForm closeModal={closeModal} opp={opp} />
          ) : (
            <NewOppForm closeModal={closeModal} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const NewOppForm = ({ closeModal }: { closeModal: () => void }) => {
  const form = useNewOppForm();
  return (
    <NewOppFormShell form={form} closeModal={closeModal}>
      <NameFormField<typeof insertOppParams> form={form} />
    </NewOppFormShell>
  );
};

const OppForm = ({ opp, closeModal }: { opp: Opp; closeModal: () => void }) => {
  const form = useOppForm(opp);
  return (
    <OppFormShell opp={opp} form={form} closeModal={closeModal}>
      <NameFormField<typeof updateOppParams> form={form} />
    </OppFormShell>
  );
};
