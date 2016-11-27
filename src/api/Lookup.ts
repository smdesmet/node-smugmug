import { SmugMugClient } from '../client';
import { Model, Request, Response, Uri } from './_base';

export class NicknameUrlPathLookup extends Model {
  constructor(client: SmugMugClient, obj: NicknameUrlPathLookup) {
    super(client);
    Object.assign(this, obj);
  }
}

export class NicknameUrlPathLookupResponse extends Response {
  NicknameUrlPathLookup: NicknameUrlPathLookup;

  constructor(client: SmugMugClient, obj: any) {
    super(client, obj);
    this.NicknameUrlPathLookup = new NicknameUrlPathLookup(this._client, this.NicknameUrlPathLookup);
  }
}

export interface NicknameUrlPathLookupRequestOptions {
}

export class NicknameUrlPathLookupRequest extends Request {
  constructor(client: SmugMugClient, private _options: NicknameUrlPathLookupRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<NicknameUrlPathLookupResponse> {
    const res = await this._client.request(method, '!nicknameurlpathlookup', data);
    return new NicknameUrlPathLookupResponse(this._client, res);
  }

  async get(): Promise<NicknameUrlPathLookupResponse> {
    return this.request('GET');
  }
}

export class WebUriLookup extends Model {
  constructor(client: SmugMugClient, obj: WebUriLookup) {
    super(client);
    Object.assign(this, obj);
  }
}

export class WebUriLookupResponse extends Response {
  WebUriLookup: WebUriLookup;

  constructor(client: SmugMugClient, obj: any) {
    super(client, obj);
    this.WebUriLookup = new WebUriLookup(this._client, this.WebUriLookup);
  }
}

export interface WebUriLookupRequestOptions {
}

export class WebUriLookupRequest extends Request {
  constructor(client: SmugMugClient, private _options: WebUriLookupRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<WebUriLookupResponse> {
    const res = await this._client.request(method, '!weburilookup', data);
    return new WebUriLookupResponse(this._client, res);
  }

  async get(): Promise<WebUriLookupResponse> {
    return this.request('GET');
  }
}
