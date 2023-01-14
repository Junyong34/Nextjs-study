import { NextApiRequest, NextApiResponse } from 'next';
import FirebaseAdmin from '@/models/firebase_admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uid, email, displayName, photoURL } = req.body;

  if (uid === undefined || uid === null) {
    res.status(400).json({ error: 'uid is required' });
    return;
  }
  if (email === undefined || email === null) {
    res.status(400).json({ error: 'email is required' });
    return;
  }

  try {
    // doc 문서에 기준 값을 uid로 지정
    // const addResult = await FirebaseAdmin.getInstance()
    //   .Firebase.collection('members')
    //   .doc(uid)
    //   .set({
    //     uid,
    //     email,
    //     displayName: displayName ?? '',
    //     photoURL: photoURL ?? '',
    //   });
    const screenName = (email as string).replace('@gmail.com', '');
    // await FirebaseAdmin.getInstance()
    //   .Firebase.collection('screen_names')
    //   .doc(screenName)
    //   .set({
    //     uid,
    //     email,
    //     displayName: displayName ?? '',
    //     photoURL: photoURL ?? '',
    //   });

    const addResult = await FirebaseAdmin.getInstance().Firebase.runTransaction(async (transaction) => {
      const memberRef = FirebaseAdmin.getInstance().Firebase.collection('members').doc(uid);
      const screenNameRef = FirebaseAdmin.getInstance().Firebase.collection('screen_names').doc(screenName);
      const memberDoc = await transaction.get(memberRef);
      const screenNameDoc = await transaction.get(screenNameRef);
      if (!memberDoc.exists) {
        throw new Error('Document does not exist!');
      }
      if (!screenNameDoc.exists) {
        throw new Error('Document does not exist!');
      }
      const addData = {
        uid,
        email,
        displayName: displayName ?? '',
        photoURL: photoURL ?? '',
      };
      await transaction.set(memberRef, addData);
      await transaction.set(screenNameRef, addData);
      return true;
    });
    if (addResult) {
      return res.status(201).json({ result: true, id: uid });
    }
    return res.status(200).json({ result: false, id: uid });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ result: false });
  }
}
