import { NextApiRequest, NextApiResponse } from 'next';
import handleError from '@/contorllers/error/handleError';
import checkSupportMethod from '@/contorllers/error/check_support_method';
import messageCtrl from '@/contorllers/message.ctrl';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const supportMethods = ['GET'];

  try {
    checkSupportMethod(supportMethods, method!);
    await messageCtrl.get(req, res);
  } catch (err) {
    console.error(err);
    handleError(err, res);
    // 메러처리
  }
}
