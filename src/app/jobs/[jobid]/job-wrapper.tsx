import { CompleteJob } from "@/lib/db";
import { MainPageWrapper } from "@/components/main-page";
import JobStagePipeline from "./job-stage-pipeline";
import JobNav from "./job-nav";
import JobStatusToolbar from "./job-status-toolbar";

const JobWrapper = ({
  job,
  children,
}: {
  job: CompleteJob;
  children: React.ReactNode;
}) => {
  return (
    <MainPageWrapper className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
        <div className="mr-4">
          <h1 className="text-md text-gray-500">Job</h1>
          <h1 className="font-bold text-5xl text-gray-900">{job.name}</h1>
        </div>
        <JobStagePipeline job={job} />
      </div>
      <div className="flex justify-between">
        <JobNav className="pt-2" job={job} />
        <JobStatusToolbar job={job} />
      </div>
      {children}
    </MainPageWrapper>
  );
};

export default JobWrapper;
