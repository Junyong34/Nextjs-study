import { NextPage } from 'next';
import { ServiceLayout } from '@/components/service_layout.';
import { Box, Center, Flex, Heading } from '@chakra-ui/react';
import { Google_login_button } from '@/components/google_login_button';
import { useAuth } from '@/contexts/auth_user.context';
const IndexPage: NextPage = function () {
  const { signInWithGoogle, authUser } = useAuth();
  console.log(authUser);
  return (
    <ServiceLayout title={'test'}>
      <Box maxW={'md'} mx={'auto'}>
        <img src={'/main_logo.svg'} alt="메인 로고" />
        <Flex justify={'center'}>
          <Heading>#개발개발</Heading>
        </Flex>
      </Box>
      <Center mt={20}>
        <Google_login_button
          onClick={() => {
            signInWithGoogle();
          }}
        />
      </Center>
    </ServiceLayout>
  );
};

export default IndexPage;
