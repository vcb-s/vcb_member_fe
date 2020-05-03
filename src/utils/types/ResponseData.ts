import { AxiosResponse } from 'axios';

export namespace ResponseData {
  export interface DataContent extends Record<string, any> {}

  export interface Data<D extends DataContent> {
    code: number;
    data: D;
    msg?: string;
  }
  export interface OK<D extends DataContent> extends AxiosResponse<Data<D>> {}
}
