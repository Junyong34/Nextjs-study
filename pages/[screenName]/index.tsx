import { GetServerSideProps, NextPage } from 'next';
import { ServiceLayout } from '@/components/service_layout.';
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import ResizeTextArea from 'react-textarea-autosize';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth_user.context';
import { InAuthUser } from '@/models/in_auth_user';
import axios, { AxiosResponse } from 'axios';
import MessageItem from '@/components/message_item';
import { InMessage } from '@/models/message/in_message';
interface Props {
  userInfo: InAuthUser | null;
}
async function postMessage({
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
  if (message.length <= 0) {
    return {
      result: false,
      message: '메시지를 입력해주세요',
    };
  }
  try {
    await fetch(`/api/message.add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid,
        message,
        author,
      }),
    });
    return {
      result: true,
    };
  } catch (e) {
    console.error(e);
    return {
      result: false,
      message: '메시지 전송에 실패했습니다',
    };
  }
}
// const userInfo = {
//   uid: 'test',
//   email: 'wnsdyd21@gmail.com',
//   displayName: '김우빈',
//   photoURL: 'https://lh3.googleusercontent.com/a/AEdFTp6tzK8dAUX5fdMzYrLptALFc9o0q7Jl_nSdMuO-=s96-c',
// };

const UserHomePage: NextPage<Props> = function ({ userInfo }) {
  const { authUser } = useAuth();
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [messageList, setMessageList] = useState<InMessage[]>([]);
  const [messageListFetchTrigger, setMessageListFetchTrigger] = useState(false);
  const toast = useToast();

  async function fetchMessageList(uid: string) {
    try {
      const resp = await fetch(`/api/message.list?uid=${uid}`);
      if (resp.status === 200) {
        const data = await resp.json();
        setMessageList(data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (userInfo) {
      void fetchMessageList(userInfo.uid);
    }
  }, [userInfo, messageListFetchTrigger]);

  if (userInfo === null) {
    return <div>유저 정보가 없습니다.</div>;
  }
  return (
    <ServiceLayout title={`${userInfo.displayName} 홈`} minHeight={'100vh'} backgroundColor={'grey.50'}>
      <Box maxW={'md'} mx={'auto'} pt={6}>
        <Box border={'1px'} borderRadius={'lg'} overflow={'hidden'} mb={'2'} bg={'white'}>
          <Flex p={6}>
            <Avatar size={'lg'} src={userInfo.photoURL ?? ''} />
            <Flex direction={'column'} justify={'center'} pl={4}>
              <Text fontSize={'md'}>{userInfo.displayName}</Text>
              <Text fontSize={'xs'}>{userInfo.email}</Text>
            </Flex>
          </Flex>
        </Box>
        <Box border={'1px'} borderRadius={'lg'} overflow={'hidden'} mb={'2'} bg={'white'}>
          <Flex align={'center'} p={2}>
            <Avatar
              size={'xs'}
              src={isAnonymous ? 'https://bit.ly/broken-link/1' : authUser?.photoURL ?? 'https://bit.ly/broken-link/1'}
              mr={2}
            />
            <Textarea
              resize={'none'}
              minHeight={'unset'}
              overflow={'hidden'}
              fontSize={'xs'}
              bg={'grey.100'}
              border={'none'}
              maxRows={7}
              minRows={1}
              placeholder={'무슨 생각을 하고 계신가요?'}
              mr={2}
              as={ResizeTextArea}
              value={message}
              onChange={(e) => {
                if (e.currentTarget.value) {
                  const lineCount = e.currentTarget.value.split(/\r\n|\r|\n/).length ?? 1;
                  if (lineCount >= 7) {
                    toast({
                      title: '최대 7줄까지 입력 가능합니다.',
                      position: 'top',
                      status: 'error',
                      duration: 2000,
                      isClosable: false,
                    });
                    return;
                  }
                }
                setMessage(e.currentTarget.value);
              }}
            />
            <Button
              disabled={message.length === 0}
              bgColor={'#FFB86C'}
              color={'white'}
              colorScheme={'yellow'}
              variant={'solid'}
              size={'sm'}
              onClick={async () => {
                const author = isAnonymous
                  ? undefined
                  : {
                      displayName: authUser?.displayName ?? '',
                      photoURL: authUser?.photoURL ?? 'https://bit.ly/broken-link/1',
                    };
                const messageResp = await postMessage({
                  uid: userInfo.uid,
                  message,
                  author,
                });
                if (messageResp.result) {
                  toast({
                    title: '메시지 전송 성공',
                    position: 'top',
                    status: 'success',
                    duration: 2000,
                    isClosable: false,
                  });
                  setMessage('');
                } else {
                  toast({
                    title: messageResp.message,
                    position: 'top',
                    status: 'error',
                    duration: 2000,
                    isClosable: false,
                  });
                }
              }}
            >
              등록
            </Button>
          </Flex>
          <FormControl display={'flex'} alignItems={'center'} my={2} mx={2}>
            <Switch
              size={'sm'}
              colorScheme={'orange'}
              mr={1}
              id={'anonymous'}
              isChecked={isAnonymous}
              onChange={() => {
                if (authUser === null) {
                  toast({
                    title: '로그인이 필요합니다.',
                    position: 'top',
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                  });
                  setIsAnonymous(true);
                  return;
                }
                setIsAnonymous((prev) => !prev);
              }}
            />
            <FormLabel htmlFor={'anonymous'} mb={'0'} fontSize={'xx-small'}>
              anonymous
            </FormLabel>
          </FormControl>
        </Box>
        <VStack spacing={'12px'} mt={'6'}>
          {messageList.map((messageData) => {
            return (
              <MessageItem
                key={`message-${userInfo?.uid}-${messageData.id}`}
                uid={userInfo.uid}
                item={messageData}
                photoURL={userInfo?.photoURL ?? 'https://bit.ly/broken-link/1'}
                displayName={userInfo?.displayName ?? ''}
                isOwner={authUser !== null && authUser.uid === userInfo.uid}
                onSendMessage={() => {
                  setMessageListFetchTrigger((prev) => !prev);
                }}
              />
            );
          })}
        </VStack>
      </Box>
    </ServiceLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { screenName } = query;
  if (screenName === undefined) {
    return {
      props: {
        userInfo: null,
      },
    };
  }
  try {
    const protocal = process.env.PROTOCOL || 'http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PROT || '3000';
    const baseUrl = `${protocal}://${host}:${port}`;
    const userInfoResp: AxiosResponse<InAuthUser> = await axios(`${baseUrl}/api/user.Info/${screenName}`);
    console.info(userInfoResp.data);
    return {
      props: {
        userInfo: userInfoResp.data ?? null,
      },
    };
  } catch (e) {
    // console.error(e);
    return {
      props: {
        userInfo: null,
      },
    };
  }
};

export default UserHomePage;
