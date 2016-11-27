import { SmugMugClient } from '../client';
import { Model, Request, Response, Uri } from './_base';

export class Printmark extends Model {
  constructor(client: SmugMugClient, obj: Printmark) {
    super(client);
    Object.assign(this, obj);
  }
}

export class PrintmarkResponse extends Response {
  Printmark: Printmark;

  constructor(client: SmugMugClient, obj: any) {
    super(client, obj);
    this.Printmark = new Printmark(this._client, this.Printmark);
  }
}

export interface PrintmarkRequestOptions {
  printmarkId: string;
}

export class PrintmarkRequest extends Request {
  constructor(client: SmugMugClient, private _options: PrintmarkRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<PrintmarkResponse> {
    const { printmarkId } = this._options;
    const res = await this._client.request(method, `/printmark/${printmarkId}`, data);
    return new PrintmarkResponse(this._client, res);
  }

  async get(): Promise<PrintmarkResponse> {
    return this.request('GET');
  }
}
