export class ResponseObject<T = Record<string, any>> {
  status: number;
  message: string;
  data?: T;
}
