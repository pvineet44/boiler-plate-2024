import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export const getAdminServerSideProps: GetServerSideProps<any> = async (
  context
): Promise<any> => {
  const admin = await isAdmin(
    context.req as NextApiRequest,
    context.res as NextApiResponse
  );

  if (admin) {
    return {
      props: {},
    };
  } else {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

export const isAdmin = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<boolean> => {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (session?.user?.profile === "admin") {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};
