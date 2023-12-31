import { CompleteJob } from "@/lib/db";
import { MainPageWrapper } from "@/components/main-page";
import JobStatusPipeline from "./job-status-pipeline";

const JobDetails = ({ job }: { job: CompleteJob }) => {
  return (
    <MainPageWrapper>
      <div className="flex flex-col items-start justify-between gap-4 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <div>
          <h1 className="text-md text-gray-500">Job</h1>
          <h1 className="mb-3 font-bold text-5xl text-gray-900">{job.name}</h1>
        </div>
      </div>
      <JobStatusPipeline job={job} />
    </MainPageWrapper>
  );
};

export default JobDetails;
