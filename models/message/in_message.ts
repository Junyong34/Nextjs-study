export interface InMessage {
  id: string;
  message: string;
  reply?: string;
  replyAt?: string;
  createAt: string;
  author?: {
    displayName: string;
    photoURL?: string;
  };
}
