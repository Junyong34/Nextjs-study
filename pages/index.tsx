import { NextPage } from 'next';
import { ServiceLayout } from '@/components/service_layout.';
import { Box, Center, Flex, Heading } from '@chakra-ui/react';
import { Google_login_button } from '@/components/google_login_button';

const IndexPage: NextPage = function () {
  return (
    <ServiceLayout title={'test'}>
      <Box maxW={'md'} mx={'auto'}>
        <img src={'/main_logo.svg'} alt="메인 로고" />
        <Flex justify={'center'}>
          <Heading>#개발개발</Heading>
        </Flex>
      </Box>
      <Center mt={20}>
        <Google_login_button />
      </Center>
    </ServiceLayout>
  );
};

export default IndexPage;
