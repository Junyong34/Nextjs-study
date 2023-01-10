import { Box, Button } from '@chakra-ui/react';

interface Props {
  onClick: () => void;
}
export const Google_login_button = function ({ onClick }: Props) {
  return (
    <Box>
      <Button
        size={'lg'}
        width={'full'}
        maxW="md"
        borderRadius={'full'}
        bgColor={'#4285f4'}
        color={'white'}
        colorScheme={'blue'}
        onClick={onClick}
        leftIcon={
          <img
            src={'/google.svg'}
            alt={'google Lgo'}
            style={{
              backgroundColor: 'white',
              padding: '3px',
            }}
          />
        }
      >
        Google 로그인
      </Button>
    </Box>
  );
};
