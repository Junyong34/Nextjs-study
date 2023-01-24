import { Avatar, Box, Button, Divider, Flex, Spacer, Text, Textarea } from '@chakra-ui/react';
import { InMessage } from '@/models/message/in_message';
import convert_date_to_string from '@/utils/convert_date_to_string';
import ResizeTextArea from 'react-textarea-autosize';
import { useState } from 'react';

interface Props {
  uid: string;
  displayName: string;
  isOwner: boolean;
  photoURL: string;
  item: InMessage;
  onSendMessage: () => void;
}

const MessageItem = function ({ uid, item, photoURL, displayName, isOwner, onSendMessage }: Props) {
  const [reply, setReply] = useState('');
  async function postReply() {
    if (reply.length <= 0) {
      return;
    }
    try {
      const resp = await fetch(`/api/message.add.reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: uid,
          messageId: item.id,
          reply: reply,
        }),
      });
      console.info(resp.status);
      if (resp.status < 300) {
        onSendMessage();
      }
    } catch (e) {
      console.error(e);
    }
  }
  const photoUrl = item.author
    ? item.author.photoURL ?? 'https://bit.ly/broken-link/1'
    : 'https://bit.ly/broken-link/1';
  const displayNameItem = item.author ? item.author.displayName : 'anonymous';
  const haveReply = !!item.reply;
  return (
    <Box borderRadius={'md'} width={'full'} bg={'white'} boxShadow={'md'}>
      <Box>
        <Flex pl={2} pr={2} pt={2} alignItems={'center'}>
          <Avatar size={'xs'} src={photoUrl} />
          <Text fontSize={'xx-small'} ml={`1`}>
            {displayNameItem}
          </Text>
          <Spacer />
          <Text fontSize={'xx-small'} whiteSpace={'pre-line'} color={'gray.500'}>
            {convert_date_to_string(item.createAt!)}
          </Text>
        </Flex>
      </Box>
      <Box p={2}>
        <Box borderRadius={'md'} borderWidth={'1px'} p={2}>
          <Text whiteSpace={'pre-line'} fontSize={'sm'}>
            {item.message}
          </Text>
        </Box>
        {haveReply && (
          <Box pt={2}>
            <Divider />
            <Box display={'flex'} mt={2}>
              <Box pt={2}>
                <Avatar size={'xs'} mr={2} src={photoURL} />
              </Box>
              <Box borderRadius={'md'} borderWidth={'1px'} width={'full'} p={2} bg={'grey.100'}>
                <Flex alignItems={'center'}>
                  <Text fontSize={'xs'}>{displayName}</Text>
                  <Spacer />
                  <Text whiteSpace={'pre-line'} fontSize={'xx-small'} color={'gray'}>
                    {convert_date_to_string(item.replyAt!)}
                  </Text>
                </Flex>
                <Text whiteSpace={'pre-line'} fontSize={'xs'}>
                  {item.reply}
                </Text>
              </Box>
            </Box>
          </Box>
        )}
        {!haveReply && isOwner && (
          <Box pt={2}>
            <Divider />
            <Box display={'flex'} mt={2}>
              <Box pt={1}>
                <Avatar size={'xs'} mr={2} src={photoURL} />
              </Box>
              <Box borderRadius={'md'} width={'full'} bg={'gray.100'} mr={2}>
                <Textarea
                  border={'none'}
                  boxShadow={'none !important'}
                  resize={'none'}
                  minH={'unset'}
                  overflow={'hidden'}
                  fontSize={'xs'}
                  placeholder={'댓글을 입력하세요..'}
                  as={ResizeTextArea}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
              </Box>
              <Button
                disabled={reply.length <= 0}
                colorScheme={'blue'}
                variant={'solid'}
                size={'sm'}
                onClick={() => {
                  void postReply();
                }}
              >
                등록
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MessageItem;
