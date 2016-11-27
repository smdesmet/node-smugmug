import { SmugMugClient } from '../client';
import { Model, Request, Response, Uri } from './_base';

export class AlbumTemplate extends Model {
  Uri?: string;
  UriDescription?: string;
  Name?: string;
  TemplateUri?: string;
  AllowDownloads?: boolean;
  Backprinting?: string;
  BoutiquePackaging?: string;
  CanRank?: boolean;
  Clean?: boolean;
  Comments?: boolean;
  EXIF?: boolean;
  External?: boolean;
  FamilyEdit?: boolean;
  Filenames?: boolean;
  FriendEdit?: boolean;
  Geography?: boolean;
  Header?: string;
  HideOwner?: boolean;
  InterceptShipping?: string;
  LargestSize?: string;
  PackagingBranding?: boolean;
  Password?: string;
  PasswordHint?: string;
  Printable?: boolean;
  ProofDays?: number;
  Protected?: boolean;
  Public?: boolean;
  Share?: boolean;
  SmugSearchable?: string;
  SortDirection?: string;
  SortMethod?: string;
  SquareThumbs?: boolean;
  Watermark?: boolean;
  WorldSearchable?: boolean;
  Uris?: {
    User?: Uri;
    Template?: Uri;
  };

  constructor(client: SmugMugClient, obj: AlbumTemplate) {
    super(client);
    Object.assign(this, obj);
  }
}

export class AlbumTemplateResponse extends Response {
  AlbumTemplate: AlbumTemplate;

  constructor(client: SmugMugClient, obj: any) {
    super(client, obj);
    this.AlbumTemplate = new AlbumTemplate(this._client, this.AlbumTemplate);
  }
}

export interface AlbumTemplateRequestOptions {
  albumTemplateId: string;
}

export class AlbumTemplateRequest extends Request {
  constructor(client: SmugMugClient, private _options: AlbumTemplateRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<AlbumTemplateResponse> {
    const { albumTemplateId } = this._options;
    const res = await this._client.request(method, `/albumtemplate/${albumTemplateId}`, data);
    return new AlbumTemplateResponse(this._client, res);
  }

  async get(): Promise<AlbumTemplateResponse> {
    return this.request('GET');
  }
}

export class AlbumTemplatesResponse extends Response {
  AlbumTemplate: AlbumTemplate[];
}

export interface AlbumTemplatesRequestOptions {
  getUserId: () => Promise<string>;
}

export class AlbumTemplatesRequest extends Request {
  constructor(client: SmugMugClient, private _options: AlbumTemplatesRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<AlbumTemplatesResponse> {
    const { getUserId } = this._options;
    const userId = await getUserId();
    const res = await this._client.request(method, `/user/${userId}!albumtemplates`, data);
    return new AlbumTemplatesResponse(this._client, res);
  }

  async get(): Promise<AlbumTemplatesResponse> {
    return this.request('GET');
  }
}
