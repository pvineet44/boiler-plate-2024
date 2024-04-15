export type HandlerFunction = (
    req: NextApiRequest,
    res: NextApiResponse
  ) => void | Promise<void>;
  