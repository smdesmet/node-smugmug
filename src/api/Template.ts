import { SmugMugClient } from '../client';
import { Model, Request, Response, Uri } from './_base';

export class Template extends Model {
  constructor(client: SmugMugClient, obj: Template) {
    super(client);
    Object.assign(this, obj);
  }
}

export class TemplateResponse extends Response {
  Template: Template;

  constructor(client: SmugMugClient, obj: any) {
    super(client, obj);
    this.Template = new Template(this._client, this.Template);
  }
}

export interface TemplateRequestOptions {
  templateId: string;
}

export class TemplateRequest extends Request {
  constructor(client: SmugMugClient, private _options: TemplateRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<TemplateResponse> {
    const { templateId } = this._options;
    const res = await this._client.request(method, `/template/${templateId}`, data);
    return new TemplateResponse(this._client, res);
  }

  async get(): Promise<TemplateResponse> {
    return this.request('GET');
  }
}
