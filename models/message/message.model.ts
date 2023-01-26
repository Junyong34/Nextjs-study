import FirebaseAdmin from '../firebase_admin';
import Custom_server_error from '@/contorllers/error/custom_server_error';
import { firestore } from 'firebase-admin';
import { InMessage, InMessageServer } from '@/models/message/in_message';
import { InAuthUser } from '@/models/in_auth_user';

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
    let messageCount = 1;
    const memberDoc = await transaction.get(memberRef);
    if (!memberDoc.exists) {
      throw new Custom_server_error({ statusCode: 400, message: 'member does not exist' });
    }
    const memberInfo = memberDoc.data() as InAuthUser & { messageCount: number };
    if (memberInfo.messageCount) {
      messageCount = memberInfo.messageCount + 1;
    }
    const newMessageRef = memberRef.collection(MSG_COL).doc();
    const newMessageBody: {
      message: string;
      createAt: firestore.FieldValue;
      author?: {
        displayName: string;
        photoURL?: string;
      };
      messageNo: number;
    } = {
      message,
      messageNo: messageCount,
      createAt: firestore.FieldValue.serverTimestamp(),
    };
    if (author) {
      newMessageBody['author'] = author;
    }
    await transaction.set(newMessageRef, newMessageBody);
    await transaction.update(memberRef, { messageCount: messageCount + 1 });
  });
}

async function listWithPage({ uid, page = 1, size = 10 }: { uid: string; page?: number; size?: number }) {
  const memberRef = Firestore.collection(MEMBER_COL).doc(uid);
  const listData = await Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    if (!memberDoc.exists) {
      throw new Custom_server_error({ statusCode: 400, message: 'member does not exist' });
    }
    const memberInfo = memberDoc.data() as InAuthUser & { messageCount: number };
    const { messageCount = 0 } = memberInfo;
    const totalElements = messageCount !== 0 ? messageCount - 1 : 0;
    const remains = totalElements % size;
    const totalPages = Math.floor(totalElements - remains / size) + (remains > 0 ? 1 : 0);
    const startAt = totalElements - (page - 1) * size;
    if (startAt < 0) {
      return {
        totalElements,
        totalPages: 0,
        page,
        size,
        content: [],
      };
    }
    const messages = memberRef.collection(MSG_COL).orderBy('messageNo', 'desc').startAt(startAt).limit(size);
    const messageColDoc = await transaction.get(messages);
    const data = messageColDoc.docs.map((doc) => {
      const docData = doc.data() as Omit<InMessageServer, 'id'>;
      return {
        ...docData,
        id: doc.id,
        createAt: docData.createAt?.toDate().toISOString(),
        replyAt: docData.replyAt?.toDate().toISOString() || undefined,
      } as InMessage;
    });
    return {
      totalElements,
      totalPages,
      page,
      size,
      content: data,
    };
  });
  return listData;
}

async function list({ uid }: { uid: string }) {
  const memberRef = Firestore.collection(MEMBER_COL).doc(uid);
  const listData = await Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    if (!memberDoc.exists) {
      throw new Custom_server_error({ statusCode: 400, message: 'member does not exist' });
    }
    const messages = memberRef.collection(MSG_COL).orderBy('createAt', 'desc');
    const messageColDoc = await transaction.get(messages);
    const data = messageColDoc.docs.map((doc) => {
      const docData = doc.data() as Omit<InMessageServer, 'id'>;
      return {
        ...docData,
        id: doc.id,
        createAt: docData.createAt?.toDate().toISOString(),
        replyAt: docData.replyAt?.toDate().toISOString() || undefined,
      } as InMessage;
    });
    return data;
  });
  return listData;
}

async function get({ uid, messageId }: { uid: string; messageId: string }) {
  const memberRef = Firestore.collection(MEMBER_COL).doc(uid);
  const messageRef = memberRef.collection(MSG_COL).doc(messageId);
  const data = await Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    if (!memberDoc.exists) {
      throw new Custom_server_error({ statusCode: 400, message: 'member does not exist' });
    }

    const messageDoc = await transaction.get(messageRef);
    if (!messageDoc.exists) {
      throw new Custom_server_error({ statusCode: 400, message: 'message does not exist' });
    }
    const messageData = messageDoc.data() as InMessageServer;

    return {
      ...messageData,
      id: messageDoc.id,
      createAt: messageData.createAt?.toDate().toISOString(),
      replyAt: messageData.replyAt?.toDate().toISOString() || undefined,
    };
  });
  return data;
}

async function postReply({ uid, messageId, reply }: { uid: string; messageId: string; reply: string }) {
  const memberRef = Firestore.collection(MEMBER_COL).doc(uid);
  const messageRef = memberRef.collection(MSG_COL).doc(messageId);
  await Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    if (!memberDoc.exists) {
      throw new Custom_server_error({ statusCode: 400, message: 'member does not exist' });
    }

    const messageDoc = await transaction.get(messageRef);
    if (!messageDoc.exists) {
      throw new Custom_server_error({ statusCode: 400, message: 'message does not exist' });
    }
    const messageData = messageDoc.data() as InMessageServer;
    if (messageData.reply) {
      throw new Custom_server_error({ statusCode: 400, message: 'already replied' });
    }

    await transaction.update(messageRef, {
      reply,
      replyAt: firestore.FieldValue.serverTimestamp(),
    });
  });
}

const messageModel = {
  post,
  list,
  postReply,
  get,
  listWithPage,
};
export default messageModel;
