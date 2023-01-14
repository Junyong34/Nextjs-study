import { Box, BoxProps } from '@chakra-ui/react';
import Head from 'next/head';
import { FC, ReactNode } from 'react';
import { GNB } from './GNB';

interface Props {
  title: string;
  children: ReactNode;
}

export const ServiceLayout: FC<Props & BoxProps> = function ({ title = 'blah x2', children, ...boxProps }: Props) {
  return (
    <Box {...boxProps}>
      <Head>
        <title>{title}</title>
      </Head>
      <GNB />
      {children}
    </Box>
  );
};
