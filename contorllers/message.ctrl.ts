import { NextApiRequest, NextApiResponse } from 'next';
import Custom_server_error from '@/contorllers/error/custom_server_error';
import messageModel from '@/models/message/message.model';

async function post(req: NextApiRequest, res: NextApiResponse) {
  const { uid, message, author } = req.body;
  console.log(uid, message, '#########');
  if (uid === undefined) {
    throw new Custom_server_error({ statusCode: 400, message: 'uid is required' });
  }
  if (message === undefined) {
    throw new Custom_server_error({ statusCode: 400, message: 'message is required' });
  }

  await messageModel.post({ uid, message, author });
  return res.status(201).json({ message: 'success' });
}

const MessageCtrl = {
  post,
};

export default MessageCtrl;
