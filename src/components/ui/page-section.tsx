import { PropsWithChildren } from "react";

const PageSection = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="mb-8 rounded-lg shadow-md border pt-6 pb-8 px-8">
        {children}
      </div>
    </div>
  );
};

export default PageSection;
