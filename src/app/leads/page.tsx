import { checkAuth } from "@/lib/auth/utils";

const Page = async () => {
  await checkAuth("leads");

  return <div />;
};

export default Page;
