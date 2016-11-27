import { SmugMugClient } from '../client';
import { Model, Request, Response } from './_base';

export class Features extends Model {
  Uri?: string;
  UriDescription?: string;
  Backprinting?: boolean;
  CustomPackaging?: boolean;
  GrantAccess?: boolean;
  Printmarks?: boolean;
  RightClickProtection?: boolean;
  Sales?: boolean;
  Sharpening?: boolean;
  Video?: boolean;
  Watermarks?: boolean;

  constructor(client: SmugMugClient, obj: Features) {
    super(client);
    Object.assign(this, obj);
  }
}

export class FeaturesResponse extends Response {
  Features: Features;

  constructor(client: SmugMugClient, obj: any) {
    super(client, obj);
    this.Features = new Features(this._client, this.Features);
  }
}

export interface FeaturesRequestOptions {
  userId: () => Promise<string>;
}

export class FeaturesRequest extends Request {
  constructor(client: SmugMugClient, private _options: FeaturesRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<FeaturesResponse> {
    const { userId } = this._options;
    const res = await this._client.request(method, `/user/${userId}!features`, data);
    return new FeaturesResponse(this._client, res);
  }

  async get(): Promise<FeaturesResponse> {
    return this.request('GET');
  }
}
