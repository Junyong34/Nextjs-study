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
import { useState } from 'react';
import { useAuth } from '@/contexts/auth_user.context';
import { InAuthUser } from '@/models/in_auth_user';
import axios, { AxiosResponse } from 'axios';
import MessageItem from '@/components/message_item';
import { InMessage } from '@/models/message/in_message';
import { useQuery } from 'react-query';

interface Props {
  userInfo: InAuthUser | null;
  screenName: string;
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

const UserHomePage: NextPage<Props> = function ({ userInfo, screenName }) {
  const { authUser } = useAuth();
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [messageList, setMessageList] = useState<InMessage[]>([]);
  const [MessageListFetchTrigger, setMessageListFetchTrigger] = useState(false);
  const toast = useToast();

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
        setMessageList((prev) => {
          const findIndex = prev.findIndex((item) => item.id === data.id);
          console.log(findIndex, '######', prev, data);
          if (findIndex >= 0) {
            const updateArr = [...prev];
            updateArr[findIndex] = data;
            return updateArr;
          }
          return prev;
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  const messageListQueryKey = ['messageList', userInfo?.uid, page, MessageListFetchTrigger];
  useQuery(
    messageListQueryKey,
    async () =>
      await axios.get<{
        totalElements: number;
        content: InMessage[];
        totalPages: number;
        page: number;
        size: number;
      }>(`/api/message.list?uid=${userInfo?.uid}&page=${page}&size=10`),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      onSuccess: ({ data }: any) => {
        console.log(data.totalPages);
        setTotalPage(data.totalPages);
        if (page === 1) {
          setMessageList(data.content);
        } else {
          setMessageList((prev) => [...prev, ...data.content]);
        }
      },
    },
  );

  // useEffect(() => {
  //   if (userInfo) {
  //     void fetchMessageList(userInfo.uid);
  //   }
  // }, [userInfo, MessageListFetchTrigger, page]);

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
                  setPage(1);
                  setTimeout(() => {
                    setMessageListFetchTrigger((prev) => !prev);
                  }, 50);
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
                key={`message-${userInfo.uid}-${messageData.id}`}
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
            );
          })}
        </VStack>
        {totalPage > page && (
          <Button
            width={'full'}
            mt={2}
            fontSize={'sm'}
            onClick={() => {
              setPage((prev) => prev + 1);
            }}
          >
            더보기
          </Button>
        )}
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
        screenName: '',
      },
    };
  }
  const screenNameToStr = Array.isArray(screenName) ? screenName[0] : screenName;
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
        screenName: screenNameToStr,
      },
    };
  } catch (e) {
    // console.error(e);
    return {
      props: {
        userInfo: null,
        screenName: screenNameToStr,
      },
    };
  }
};

export default UserHomePage;
