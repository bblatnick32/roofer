/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import IssueForm from "@/components/issues/IssueForm";
import { CompleteIssueTemplate } from "@/lib/db/schema/issueTemplates";
import { CompleteRepairTemplate } from "@/lib/db/schema/repairTemplates";
import UploadDropzone from "./upload-dropzone";
import { Photo, Issue } from "@/lib/db/schema";

const AddEditIssueButton = ({
  issue,
  opportunityId,
  issueTemplates,
  repairTemplates,
  photo,
}: {
  issue?: Issue;
  photo?: Photo | null;
  opportunityId: number;
  issueTemplates: CompleteIssueTemplate[];
  repairTemplates: CompleteRepairTemplate[];
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const closeModal = () => setIsOpen(false);

  const [photoIdLocal, setPhotoIdLocal] = useState<number | null>(
    photo?.id ?? null
  );

  const editing = !!issue?.id;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
          setPhotoIdLocal(null);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button variant={editing ? "ghost" : "default"} size="sm">
          {editing ? "Edit" : "New Issue"}
        </Button>
      </DialogTrigger>

      <DialogContent fullScreen className="flex flex-col">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>{editing ? "Edit" : "Create"} Issue</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row gap-6 flex-grow">
          <div className="basis-1/2">
            <UploadDropzone
              photoUrl={photo?.url ?? null}
              opportunityId={opportunityId}
              onChange={async (photo) => {
                setPhotoIdLocal(photo?.id ?? null);
              }}
            />
          </div>
          <div className="basis-1/2">
            <IssueForm
              issue={issue}
              closeModal={closeModal}
              opportunityId={opportunityId}
              photoId={photoIdLocal}
              issueTemplates={issueTemplates}
              repairTemplates={repairTemplates}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditIssueButton;
