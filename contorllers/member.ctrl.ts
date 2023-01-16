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

async function findByScreenName(req: NextApiRequest, res: NextApiResponse) {
  const { screenName } = req.query;
  if (screenName === undefined || screenName === null) {
    throw new BadReqError('screenName is required');
  }
  const extractScreenName = Array.isArray(screenName) ? screenName[0] : screenName;
  const findResult = await MemberModel.findByScreenName(extractScreenName);
  if (findResult) {
    res.status(200).json(findResult);
  } else {
    res.status(404).json({ message: 'Not Found' });
  }
}

const MemberCtrl = {
  add,
  findByScreenName,
};

export default MemberCtrl;
