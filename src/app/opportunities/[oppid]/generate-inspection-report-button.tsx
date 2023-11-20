"use client";

import { DialogHeader } from "@/components/ui/dialog";
import { CompleteWorkItemForList } from "@/lib/db";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PdfRenderer from "@/components/pdf-renderer";

const GenerateInspectionReportButton = ({
  workItems,
}: {
  workItems: CompleteWorkItemForList[];
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const closeModal = () => setIsOpen(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button variant="outline" size="sm">
          Generate Inspection Report
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>Inspection Report</DialogTitle>
        </DialogHeader>
        <div className="px-5 pb-5">
          <PdfRenderer workItems={workItems} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateInspectionReportButton;
