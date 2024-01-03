import { CompleteJob } from "@/lib/db";
import { MainPageWrapper } from "@/components/main-page";
import JobStagePipeline from "./job-stage-pipeline";
import JobStatusToolbar from "./job-status-toolbar";
import JobNav from "./job-nav";

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
        <div>
          <h1 className="text-md text-gray-500">Job</h1>
          <h1 className="font-bold text-5xl text-gray-900">{job.name}</h1>
        </div>
        <JobStatusToolbar job={job} />
      </div>
      <JobStagePipeline job={job} />
      <JobNav className="pt-2" job={job} />
      {children}
    </MainPageWrapper>
  );
};

export default JobWrapper;
