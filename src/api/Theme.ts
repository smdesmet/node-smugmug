import { SmugMugClient } from '../client';
import { Model, Request, Response, Uri } from './_base';

export class Theme extends Model {
  constructor(client: SmugMugClient, obj: Theme) {
    super(client);
    Object.assign(this, obj);
  }
}

export class ThemeResponse extends Response {
  Theme: Theme;

  constructor(client: SmugMugClient, obj: any) {
    super(client, obj);
    this.Theme = new Theme(this._client, this.Theme);
  }
}

export interface ThemeRequestOptions {
  themeId: string;
}

export class ThemeRequest extends Request {
  constructor(client: SmugMugClient, private _options: ThemeRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<ThemeResponse> {
    const { themeId } = this._options;
    const res = await this._client.request(method, `/theme/${themeId}`, data);
    return new ThemeResponse(this._client, res);
  }

  async get(): Promise<ThemeResponse> {
    return this.request('GET');
  }
}
