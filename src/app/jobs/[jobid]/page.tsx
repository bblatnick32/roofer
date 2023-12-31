import { checkAuth } from "@/lib/auth/utils";
import { notFound } from "next/navigation";
import JobDetails from "./job-details";
import { getJobById } from "@/lib/api/jobs/queries";

interface PageProps {
  params: {
    jobid: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { jobid } = params;
  await checkAuth(`jobs/${jobid}`);

  // make a call to get the job
  const { job } = await getJobById(Number(jobid));
  if (!job) notFound();

  return <JobDetails job={job} />;
};

export default Page;
