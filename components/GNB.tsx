import { useAuth } from '@/contexts/auth_user.context';
import { Avatar, Box, Button, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer } from '@chakra-ui/react';
import More_btn_icon from '@/components/more_btn_icon';

export const GNB = () => {
  const { loading, authUser, signOut, signInWithGoogle } = useAuth();

  const loginButton = (
    <Button
      fontSize="sm"
      fontWeight={600}
      color={'white'}
      bg={'blue.400'}
      _hover={{
        bg: 'blue.500',
      }}
      onClick={signInWithGoogle}
    >
      로그인
    </Button>
  );
  const logOutBtn = (
    <Menu>
      <MenuButton as={IconButton} icon={<Avatar size={'md'} src={authUser?.photoURL ?? ''} />} borderRadius={'full'} />
      <MenuList>
        <MenuItem
          onClick={() => {
            window.location.href = `/${authUser?.email?.replace('@gmail.com', '')}`;
          }}
        >
          사용자 홈으로 이동
        </MenuItem>
        <MenuItem
          onClick={() => {
            signOut();
          }}
        >
          로그아웃
        </MenuItem>
      </MenuList>
    </Menu>
  );
  const authInitialized = loading || authUser === null;

  return (
    <Box borderBottom={1} borderStyle={'solid'} borderColor={'gray.200'}>
      <Flex minH={'60px'} mx={'auto'} py={{ base: 2 }} px={{ base: 4 }} align={'center'} maxW={'md'}>
        <Spacer />
        <Box flex={1}>
          <img style={{ height: '40px' }} src={'/main_logo.svg'} alt="메인 로고" />
        </Box>
        <Box justifyContent={'flex-end'}>{authInitialized ? loginButton : logOutBtn}</Box>
      </Flex>
    </Box>
  );
};
