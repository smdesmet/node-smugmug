import { SmugMugClient } from '../client';
import { Model, Request, Response, Uri } from './_base';

export class Status extends Model {
  constructor(client: SmugMugClient, obj: Status) {
    super(client);
    Object.assign(this, obj);
  }
}

export class StatusResponse extends Response {
  Status: Status;

  constructor(client: SmugMugClient, obj: any) {
    super(client, obj);
    this.Status = new Status(this._client, this.Status);
  }
}

export interface StatusRequestOptions {
  statusId: string;
}

export class StatusRequest extends Request {
  constructor(client: SmugMugClient, private _options: StatusRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<StatusResponse> {
    const { statusId } = this._options;
    const res = await this._client.request(method, `/status/${statusId}`, data);
    return new StatusResponse(this._client, res);
  }

  async get(): Promise<StatusResponse> {
    return this.request('GET');
  }
}
