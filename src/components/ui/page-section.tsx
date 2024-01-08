import { PropsWithChildren } from "react";

const PageSection = ({ children }: PropsWithChildren) => {
  return (
    <div className="mb-8 mx-14 rounded-lg shadow-md border pt-6 pb-8 px-8">
      {children}
    </div>
  );
};

export default PageSection;
