import { SmugMugClient } from '../client';
import { Model, Request, Response, Uri } from './_base';

export class Page extends Model {
  constructor(client: SmugMugClient, obj: Page) {
    super(client);
    Object.assign(this, obj);
  }
}

export class PageResponse extends Response {
  Page: Page;

  constructor(client: SmugMugClient, obj: any) {
    super(client, obj);
    this.Page = new Page(this._client, this.Page);
  }
}

export interface PageRequestOptions {
  pageId: string;
}

export class PageRequest extends Request {
  constructor(client: SmugMugClient, private _options: PageRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<PageResponse> {
    const { pageId } = this._options;
    const res = await this._client.request(method, `/page/${pageId}`, data);
    return new PageResponse(this._client, res);
  }

  async get(): Promise<PageResponse> {
    return this.request('GET');
  }
}
