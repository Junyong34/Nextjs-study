import { NextPage } from 'next';
import { ServiceLayout } from '@/components/service_layout.';
import { Avatar, Box, Button, Flex, FormControl, FormLabel, Switch, Text, Textarea, useToast } from '@chakra-ui/react';
import ResizeTextArea from 'react-textarea-autosize';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth_user.context';

const userInfo = {
  uid: 'test',
  email: 'wnsdyd21@gmail.com',
  displayName: '김우빈',
  photoUrl: 'https://lh3.googleusercontent.com/a/AEdFTp6tzK8dAUX5fdMzYrLptALFc9o0q7Jl_nSdMuO-=s96-c',
};

const UserHomePage: NextPage = function () {
  const { authUser } = useAuth();
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const toast = useToast();
  return (
    <ServiceLayout title={'user home'} minHeight={'100vh'} backgroundColor={'grey.50'}>
      <Box maxW={'md'} mx={'auto'} pt={6}>
        <Box border={'1px'} borderRadius={'lg'} overflow={'hidden'} mb={'2'} bg={'white'}>
          <Flex p={6}>
            <Avatar size={'lg'} src={userInfo.photoUrl} />
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
      </Box>
    </ServiceLayout>
  );
};

export default UserHomePage;
