import { NextApiRequest, NextApiResponse } from 'next';
import Custom_server_error from '@/contorllers/error/custom_server_error';
import messageModel from '@/models/message/message.model';
import FirebaseAdmin from '@/models/firebase_admin';

async function post(req: NextApiRequest, res: NextApiResponse) {
  const { uid, message, author } = req.body;
  if (uid === undefined) {
    throw new Custom_server_error({ statusCode: 400, message: 'uid is required' });
  }
  if (message === undefined) {
    throw new Custom_server_error({ statusCode: 400, message: 'message is required' });
  }

  await messageModel.post({ uid, message, author });
  return res.status(201).json({ message: 'success' });
}

async function list(req: NextApiRequest, res: NextApiResponse) {
  const { uid, page, size } = req.query;
  const convertPage = page ? parseInt(page.toString(), 10) : 1;
  const convertSize = size ? parseInt(size.toString(), 10) : 10;
  if (uid === undefined) {
    throw new Custom_server_error({ statusCode: 400, message: 'uid is required' });
  }
  const messages = await messageModel.listWithPage({
    uid: uid.toString(),
    page: convertPage,
    size: convertSize,
  });
  return res.status(200).json(messages);
}

async function postReply(req: NextApiRequest, res: NextApiResponse) {
  const { uid, messageId, reply } = req.body;
  console.log(uid, '#####', messageId, '#####', reply);
  if (uid === undefined) {
    throw new Custom_server_error({ statusCode: 400, message: 'uid is required' });
  }
  if (messageId === undefined) {
    throw new Custom_server_error({ statusCode: 400, message: 'message is required' });
  }
  if (reply === undefined) {
    throw new Custom_server_error({ statusCode: 400, message: 'reply is required' });
  }

  await messageModel.postReply({ uid, messageId, reply });
  return res.status(201).json({ message: 'success' });
}

async function updateMessage(req: NextApiRequest, res: NextApiResponse) {
  const { uid, messageId, deny } = req.body;
  const token = req.headers.authorization;
  if (token === undefined) {
    throw new Custom_server_error({ statusCode: 401, message: 'token is required' });
  }
  let tokenUid: null | string = null;
  try {
    const decodedToken = await FirebaseAdmin.getInstance().Auth.verifyIdToken(token);
    tokenUid = decodedToken.uid;
  } catch (err) {
    throw new Custom_server_error({ statusCode: 401, message: 'token is invalid' });
  }
  if (uid !== tokenUid) {
    throw new Custom_server_error({ statusCode: 401, message: '수정 권한이 없습니다.' });
  }

  if (uid === undefined) {
    throw new Custom_server_error({ statusCode: 400, message: 'uid is required' });
  }
  if (messageId === undefined) {
    throw new Custom_server_error({ statusCode: 400, message: 'message is required' });
  }
  if (deny === undefined) {
    throw new Custom_server_error({ statusCode: 400, message: 'deny is required' });
  }

  const result = await messageModel.updateMessage({ uid, messageId, deny });
  return res.status(200).json(result);
}

async function get(req: NextApiRequest, res: NextApiResponse) {
  const { uid, messageId } = req.query;
  if (uid === undefined) {
    throw new Custom_server_error({ statusCode: 400, message: 'uid is required' });
  }
  if (messageId === undefined) {
    throw new Custom_server_error({ statusCode: 400, message: 'message is required' });
  }

  const data = await messageModel.get({ uid: uid.toString(), messageId: messageId.toString() });
  return res.status(200).json(data);
}

const MessageCtrl = {
  post,
  list,
  get,
  updateMessage,
  postReply,
};

export default MessageCtrl;
