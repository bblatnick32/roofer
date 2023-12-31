import { db } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type JobId, jobIdSchema, jobs } from "@/lib/db/schema/jobs";

export const getJobs = async () => {
  const { session } = await getUserAuth();
  const j = await db
    .select()
    .from(jobs)
    .where(eq(jobs.orgId, session?.user.activeOrgId!));
  return { jobs: j };
};

export const getJobById = async (id: JobId) => {
  const { session } = await getUserAuth();
  const { id: jobId } = jobIdSchema.parse({ id });
  const [j] = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.id, jobId), eq(jobs.orgId, session?.user.activeOrgId!)));
  return { job: j };
};
