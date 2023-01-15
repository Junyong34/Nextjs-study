import Custom_server_error from '@/contorllers/error/custom_server_error';

export default class BadReqError extends Custom_server_error {
  constructor(message: string) {
    super({ statusCode: 400, message });
  }
}
