import { NextPage } from 'next';
import { Img } from '@chakra-ui/image';
import { Box } from '@chakra-ui/react';
import PrintText from '@/components/print_text';
import { useRouter } from 'next/router';

const OpenGraphImgPage: NextPage = () => {
  const { query } = useRouter();
  const text = query.text ?? '';
  const printText = Array.isArray(text) ? text[0] : text;
  return (
    <Box width={'full'} bg={'white'} p={'25px'} pt={'50px'} borderRadius={'lg'}>
      <PrintText printText={printText} />
      <Img src={'/screenshot_bg.svg'} alt={'screenshot_bg'} />
    </Box>
  );
};

export default OpenGraphImgPage;
