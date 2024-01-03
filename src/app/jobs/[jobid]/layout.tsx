import { checkAuth } from "@/lib/auth/utils";
import { notFound } from "next/navigation";
import { getJobById } from "@/lib/api/jobs/queries";
import JobWrapper from "./job-wrapper";

interface JobLayoutProps {
  params: {
    jobid: string;
  };
  children: React.ReactNode;
}

const JobLayout = async ({ params, children }: JobLayoutProps) => {
  const { jobid } = params;
  await checkAuth(`jobs/${jobid}`);

  // make a call to get the job
  const { job } = await getJobById(Number(jobid));
  if (!job) notFound();

  return <JobWrapper job={job}>{children}</JobWrapper>;
};

export default JobLayout;
