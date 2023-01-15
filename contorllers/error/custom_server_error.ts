export default class Custom_server_error extends Error {
  public statusCode: number;
  public location?: string;

  constructor({ message, statusCode = 500, location }: { message: string; statusCode: number; location?: string }) {
    super(message);
    this.statusCode = statusCode;
    this.location = location;
  }
  serializeErrors(): { message: string } | string {
    return { message: this.message };
  }
}
