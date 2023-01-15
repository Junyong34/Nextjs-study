import BadReqError from '@/contorllers/error/bad_request';

export default function checkSupportMethod(supportedMethods: string[], reqMethod: string): void {
  if (supportedMethods.indexOf(reqMethod!) === -1) {
    // 에러 변환
    throw new BadReqError('Method Not Allowed');
  }
}
