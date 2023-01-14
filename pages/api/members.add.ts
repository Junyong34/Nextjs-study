import { NextApiRequest, NextApiResponse } from 'next';
import FirebaseAdmin from '@/models/firebase_admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uid, email, displayName, photoURL } = req.body;

  if (uid === undefined || uid === null) {
    res.status(400).json({ error: 'uid is required' });
    return;
  }

  try {
    // doc 문서에 기준 값을 uid로 지정
    const addResult = await FirebaseAdmin.getInstance()
      .Firebase.collection('members')
      .doc(uid)
      .set({
        uid,
        email: email ?? '',
        displayName: displayName ?? '',
        photoURL: photoURL ?? '',
      });
    return res.status(200).json({ id: addResult, result: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ result: false });
  }
}
