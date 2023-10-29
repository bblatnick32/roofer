import { checkAuth } from "@/lib/auth/utils";

const Page = async () => {
  await checkAuth("opportunities");

  return <div />;
};

export default Page;
