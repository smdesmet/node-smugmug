import { SmugMugClient } from '../client';
import { Model, Request, Response, Uri } from './_base';

export class Download extends Model {
  constructor(client: SmugMugClient, obj: Download) {
    super(client);
    Object.assign(this, obj);
  }
}

export class DownloadResponse extends Response {
  Download: Download;

  constructor(client: SmugMugClient, obj: any) {
    super(client, obj);
    this.Download = new Download(this._client, this.Download);
  }
}

export interface DownloadRequestOptions {
  downloadId: string;
}

export class DownloadRequest extends Request {
  constructor(client: SmugMugClient, private _options: DownloadRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<DownloadResponse> {
    const { downloadId } = this._options;
    const res = await this._client.request(method, `/download/${downloadId}`, data);
    return new DownloadResponse(this._client, res);
  }

  async get(): Promise<DownloadResponse> {
    return this.request('GET');
  }
}
