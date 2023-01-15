import { NextApiRequest, NextApiResponse } from 'next';
import MemberModel from '@/models/member/member.model';
import BadReqError from '@/contorllers/error/bad_request';

async function add(req: NextApiRequest, res: NextApiResponse) {
  const { uid, email, displayName, photoURL } = req.body;

  if (uid === undefined || uid === null) {
    throw new BadReqError('uid is required');
  }
  if (email === undefined || email === null) {
    throw new BadReqError('email is required');
  }

  const addResult = await MemberModel.addMember({
    uid,
    email,
    displayName,
    photoURL,
  });
  if (addResult.result) {
    res.status(200).json(addResult);
  }
  res.status(500).json(addResult);
}

const MemberCtrl = {
  add,
};

export default MemberCtrl;
