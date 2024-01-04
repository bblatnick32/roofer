import JobForm from "@/components/jobs/JobForm";
import { getJobById } from "@/lib/api/jobs/queries";
import { checkAuth } from "@/lib/auth/utils";
import { notFound } from "next/navigation";

interface JobLayoutProps {
  params: {
    jobid: string;
  };
}

const JobDetailPage = async ({ params }: JobLayoutProps) => {
  const { jobid } = params;
  await checkAuth(`jobs/${jobid}/detail`);

  // make a call to get the job
  const { job } = await getJobById(Number(jobid));
  if (!job) notFound();

  return <JobForm job={job} />;
};

export default JobDetailPage;
