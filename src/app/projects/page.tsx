import { checkAuth } from "@/lib/auth/utils";

const Page = async () => {
  await checkAuth("projects");

  return <div />;
};

export default Page;
