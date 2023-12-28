import { db } from "@/lib/db/client";
import { and, eq } from "drizzle-orm";
import {
  JobId,
  NewJobParams,
  UpdateJobParams,
  updateJobSchema,
  insertJobSchema,
  jobs,
  jobIdSchema,
  LeadId,
  NewLeadParams,
  UpdateLeadParams,
  insertLeadSchema,
  updateLeadSchema,
} from "@/lib/db/schema/jobs";
import { getUserAuth } from "@/lib/auth/utils";

export const createJob = async (job: NewJobParams) => {
  const { session } = await getUserAuth();
  const newJob = insertJobSchema.parse({
    ...job,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db.insert(jobs).values(newJob);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateJob = async (id: JobId, job: UpdateJobParams) => {
  const { session } = await getUserAuth();
  const { id: jobId } = jobIdSchema.parse({ id });
  const newJob = updateJobSchema.parse({
    ...job,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db
      .update(jobs)
      .set(newJob)
      .where(
        and(eq(jobs.id, jobId!), eq(jobs.orgId, session?.user.activeOrgId!))
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteJob = async (id: JobId) => {
  const { session } = await getUserAuth();
  const { id: jobId } = jobIdSchema.parse({ id });
  try {
    await db
      .delete(jobs)
      .where(
        and(eq(jobs.id, jobId!), eq(jobs.orgId, session?.user.activeOrgId!))
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const createLead = async (job: NewLeadParams) => {
  const { session } = await getUserAuth();
  const newLead = insertLeadSchema.parse({
    ...job,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db.insert(jobs).values(newLead);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateLead = async (id: LeadId, job: UpdateLeadParams) => {
  const { session } = await getUserAuth();
  const { id: jobId } = jobIdSchema.parse({ id });
  const newLead = updateLeadSchema.parse({
    ...job,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db
      .update(jobs)
      .set(newLead)
      .where(
        and(eq(jobs.id, jobId!), eq(jobs.orgId, session?.user.activeOrgId!))
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteLead = async (id: LeadId) => {
  const { session } = await getUserAuth();
  const { id: jobId } = jobIdSchema.parse({ id });
  try {
    await db
      .delete(jobs)
      .where(
        and(eq(jobs.id, jobId!), eq(jobs.orgId, session?.user.activeOrgId!))
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
