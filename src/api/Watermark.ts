import { SmugMugClient } from '../client';
import { Model, Request, Response, Uri } from './_base';

export class Watermark extends Model {
  constructor(client: SmugMugClient, obj: Watermark) {
    super(client);
    Object.assign(this, obj);
  }
}

export class WatermarkResponse extends Response {
  Watermark: Watermark;

  constructor(client: SmugMugClient, obj: any) {
    super(client, obj);
    this.Watermark = new Watermark(this._client, this.Watermark);
  }
}

export interface WatermarkRequestOptions {
  watermarkId: string;
}

export class WatermarkRequest extends Request {
  constructor(client: SmugMugClient, private _options: WatermarkRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<WatermarkResponse> {
    const { watermarkId } = this._options;
    const res = await this._client.request(method, `/watermark/${watermarkId}`, data);
    return new WatermarkResponse(this._client, res);
  }

  async get(): Promise<WatermarkResponse> {
    return this.request('GET');
  }
}
