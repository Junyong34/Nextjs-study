import { GetServerSideProps, NextPage } from 'next';
import { ServiceLayout } from '@/components/service_layout.';
import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth_user.context';
import { InAuthUser } from '@/models/in_auth_user';
import axios, { AxiosResponse } from 'axios';
import MessageItem from '@/components/message_item';
import { InMessage } from '@/models/message/in_message';
import Link from 'next/link';

interface Props {
  userInfo: InAuthUser | null;
  messageData: InMessage | null;
  screenName: string;
}

const MessageName: NextPage<Props> = function ({ userInfo, messageData: initMsgData, screenName }) {
  const { authUser } = useAuth();
  console.log(authUser);
  const [messageData, setMessageData] = useState<null | InMessage>(initMsgData);

  // async function fetchMessageList(uid: string) {
  //   try {
  //     const resp = await fetch(`/api/message.list?uid=${uid}&page=${page}&size=10`);
  //     if (resp.status === 200) {
  //       const data: {
  //         totalElements: number;
  //         content: InMessage[];
  //         totalPages: number;
  //         page: number;
  //         size: number;
  //       } = await resp.json();
  //       setTotalPage(data.totalPages);
  //       setMessageList((prev) => [...prev, ...data.content]);
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  async function fetchMessageInfo({ uid, messageId }: { uid: string; messageId: string }) {
    try {
      const resp = await fetch(`/api/message.info?uid=${uid}&messageId=${messageId}`);
      if (resp.status === 200) {
        const data: InMessage = await resp.json();
        setMessageData(data);
      }
    } catch (e) {
      console.error(e);
    }
  }
  console.log(userInfo);
  if (userInfo === null) {
    return <div>유저 정보가 없습니다.</div>;
  }
  if (messageData === null) {
    return <div>메시지 정보가 없습니다.</div>;
  }
  return (
    <ServiceLayout title={`${userInfo.displayName} 홈`} minHeight={'100vh'} backgroundColor={'grey.50'}>
      <Box maxW={'md'} mx={'auto'} pt={6}>
        <Link href={`/${screenName}`}>
          <a>
            <Button mb={'2'} fontSize={'sm'}>
              {screenName} 홈으로
            </Button>
          </a>
        </Link>
        <Box border={'1px'} borderRadius={'lg'} overflow={'hidden'} mb={'2'} bg={'white'}>
          <Flex p={6}>
            <Avatar size={'lg'} src={userInfo.photoURL ?? ''} />
            <Flex direction={'column'} justify={'center'} pl={4}>
              <Text fontSize={'md'}>{userInfo.displayName}</Text>
              <Text fontSize={'xs'}>{userInfo.email}</Text>
            </Flex>
          </Flex>
        </Box>
        <MessageItem
          uid={userInfo.uid}
          item={messageData}
          screenName={screenName}
          photoURL={userInfo?.photoURL ?? 'https://bit.ly/broken-link/1'}
          displayName={userInfo?.displayName ?? ''}
          isOwner={authUser !== null && authUser.uid === userInfo.uid}
          onSendMessage={() => {
            void fetchMessageInfo({
              uid: userInfo.uid,
              messageId: messageData.id,
            });
          }}
        />
      </Box>
    </ServiceLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { screenName, messageId } = query;
  if (screenName === undefined) {
    return {
      props: {
        userInfo: null,
        messageData: null,
        screenName: '',
      },
    };
  }
  if (messageId === undefined) {
    return {
      props: {
        userInfo: null,
        messageData: null,
        screenName: '',
      },
    };
  }
  try {
    const protocal = process.env.PROTOCOL || 'http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PROT || '3000';
    const baseUrl = `${protocal}://${host}:${port}`;
    const userInfoResp: AxiosResponse<InAuthUser> = await axios(`${baseUrl}/api/user.Info/${screenName}`);
    const screenNameToStr = Array.isArray(screenName) ? screenName[0] : screenName;

    if (userInfoResp.status !== 200 || userInfoResp.data === undefined || userInfoResp.data.uid === undefined) {
      return {
        props: {
          userInfo: null,
          messageData: null,
          screenName: screenNameToStr,
        },
      };
    }
    const userInMessageResp: AxiosResponse<InMessage> = await axios(
      `${baseUrl}/api/message.info?uid=${userInfoResp.data.uid}&messageId=${messageId}`,
    );
    if (
      userInMessageResp.status !== 200 ||
      userInMessageResp.data === undefined ||
      userInMessageResp.data.id === undefined
    ) {
      return {
        props: {
          userInfo: null,
          messageData: null,
          screenName: screenNameToStr,
        },
      };
    }
    return {
      props: {
        userInfo: userInfoResp.data ?? null,
        messageData: userInMessageResp.data ?? null,
        screenName: screenNameToStr,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        userInfo: null,
        messageData: null,
      },
    };
  }
};

export default MessageName;
