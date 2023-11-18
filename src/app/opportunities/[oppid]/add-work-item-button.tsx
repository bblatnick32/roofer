/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import WorkItemForm from "@/components/workItems/WorkItemForm";
import { CompleteIssueTemplate } from "@/lib/db/schema/issueTemplates";
import { CompleteRepairTemplate } from "@/lib/db/schema/repairTemplates";
import UploadDropzone from "./upload-dropzone";

const AddWorkItemButton = ({
  opportunityId,
  issueTemplates,
  repairTemplates,
}: {
  opportunityId: number;
  issueTemplates: CompleteIssueTemplate[];
  repairTemplates: CompleteRepairTemplate[];
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const closeModal = () => setIsOpen(false);

  const [photoId, setPhotoId] = useState<number | null>(null);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
          setPhotoId(null);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button>Add Work Item</Button>
      </DialogTrigger>

      <DialogContent fullScreen>
        <div className="flex flex-row gap-6">
          <div className="basis-1/2">
            <UploadDropzone
              opportunityId={opportunityId}
              onChange={async (photo) => {
                setPhotoId(photo?.id ?? null);
              }}
            />
          </div>
          <div className="basis-1/2">
            <WorkItemForm
              closeModal={closeModal}
              opportunityId={opportunityId}
              photoId={photoId}
              issueTemplates={issueTemplates}
              repairTemplates={repairTemplates}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkItemButton;
