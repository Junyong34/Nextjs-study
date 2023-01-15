import { InAuthUser } from '@/models/in_auth_user';
import FirebaseAdmin from '../firebase_admin';

const MEMBER_COL = 'members';
const SCR_NAME_COL = 'screenName';

type ResultTS =
  | {
      result: boolean;
      id: string;
    }
  | {
      result: boolean;
      message: string;
    };

async function addMember({ uid, email, displayName, photoURL }: InAuthUser): Promise<ResultTS> {
  try {
    const screenName = (email as string).replace('@gmail.com', '');
    const addResult = await FirebaseAdmin.getInstance().Firebase.runTransaction(async (transaction) => {
      const memberRef = FirebaseAdmin.getInstance().Firebase.collection(MEMBER_COL).doc(uid);
      const screenNameRef = FirebaseAdmin.getInstance().Firebase.collection(SCR_NAME_COL).doc(screenName);
      const memberDoc = await transaction.get(memberRef);
      // const screenNameDoc = await transaction.get(screenNameRef);
      if (!memberDoc.exists) {
        return false;
      }
      // if (!screenNameDoc.exists) {
      //   throw new Error('Document does not exist!2');
      // }
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
      return { result: true, id: uid };
    }
    return { result: false, message: 'addMember failed' };
  } catch (error: any) {
    console.error(error);
    return { result: false, message: error?.message };
  }
}

const MemberModel = {
  addMember,
};

export default MemberModel;
