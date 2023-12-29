"use server";

import { revalidatePath } from "next/cache";
import { createLead, deleteLead, updateLead } from "@/lib/api/jobs/mutations";
import {
  LeadId,
  NewLeadParams,
  UpdateLeadParams,
  leadIdSchema,
  insertLeadParams,
  updateLeadParams,
} from "@/lib/db/schema/jobs";

const handleErrors = (e: unknown) => {
  if (e instanceof Error) return e.message;
  if (e && typeof e === "object" && "error" in e) return e.error as string;
  return "Error";
};

const revalidateLeads = () => revalidatePath("/leads");

export const createLeadAction = async (input: NewLeadParams) => {
  try {
    const payload = insertLeadParams.parse(input);
    await createLead(payload);
    revalidateLeads();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateLeadAction = async (input: UpdateLeadParams) => {
  try {
    const payload = updateLeadParams.parse(input);
    await updateLead(payload.id, payload);
    revalidateLeads();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteLeadAction = async (input: LeadId) => {
  try {
    const payload = leadIdSchema.parse({ id: input });
    await deleteLead(payload.id);
    revalidateLeads();
  } catch (e) {
    return handleErrors(e);
  }
};
