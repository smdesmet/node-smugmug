import { SmugMugClient } from '../client';
import { Model, Request, Response, Uri } from './_base';

export class Guide extends Model {
  constructor(client: SmugMugClient, obj: Guide) {
    super(client);
    Object.assign(this, obj);
  }
}

export class GuideResponse extends Response {
  Guide: Guide;

  constructor(client: SmugMugClient, obj: any) {
    super(client, obj);
    this.Guide = new Guide(this._client, this.Guide);
  }
}

export interface GuideRequestOptions {
  guideId: string;
}

export class GuideRequest extends Request {
  constructor(client: SmugMugClient, private _options: GuideRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<GuideResponse> {
    const { guideId } = this._options;
    const res = await this._client.request(method, `/guide/${guideId}`, data);
    return new GuideResponse(this._client, res);
  }

  async get(): Promise<GuideResponse> {
    return this.request('GET');
  }
}
