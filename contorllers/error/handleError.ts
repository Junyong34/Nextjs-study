import Custom_server_error from '@/contorllers/error/custom_server_error';
import { NextApiResponse } from 'next';

const handleError = (err: unknown, res: NextApiResponse) => {
  let unknownError = err;
  if (!(err instanceof Custom_server_error)) {
    unknownError = new Custom_server_error({ statusCode: 499, message: 'Unknown error' });
  }

  const customError = unknownError as Custom_server_error;
  res
    .status(customError.statusCode)
    .setHeader('location', customError.location ?? '')
    .json(customError.serializeErrors());
};

export default handleError;
