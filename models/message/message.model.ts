import FirebaseAdmin from '../firebase_admin';
import Custom_server_error from '@/contorllers/error/custom_server_error';
import { firestore } from 'firebase-admin';

const MEMBER_COL = 'members';
const MSG_COL = 'message';
// const SCR_NAME_COL = 'screenName';

const Firestore = FirebaseAdmin.getInstance().FireStore;
async function post({
  uid,
  message,
  author,
}: {
  uid: string;
  message: string;
  author?: {
    displayName: string;
    photoURL?: string;
  };
}) {
  const memberRef = Firestore.collection(MEMBER_COL).doc(uid);
  await Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    if (!memberDoc.exists) {
      throw new Custom_server_error({ statusCode: 400, message: 'member does not exist' });
    }
    const newMessageRef = memberRef.collection(MSG_COL).doc();
    const newMessageBody: {
      message: string;
      createAt: firestore.FieldValue;
      author?: {
        displayName: string;
        photoURL?: string;
      };
    } = {
      message,
      createAt: firestore.FieldValue.serverTimestamp(),
    };
    if (author) {
      newMessageBody['author'] = author;
    }
    await transaction.set(newMessageRef, newMessageBody);
  });
}

const messageModel = {
  post,
};
export default messageModel;
