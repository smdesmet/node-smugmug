import { SmugMugClient } from '../client';
import { Model, Request, Response, Uri } from './_base';

export class Album extends Model {
  ResponseLevel?: string;
  Uri?: string;
  WebUri?: string;
  UriDescription?: string;
  NiceName?: string;
  UrlName?: string;
  Title?: string;
  Name?: string;
  AllowDownloads?: string;
  Description?: string;
  External?: boolean;
  Keywords?: string;
  PasswordHint?: string;
  Protected?: boolean;
  SortDirection?: string;
  SortMethod?: string;
  SecurityType?: string;
  AlbumKey?: string;
  LastUpdated?: Date;
  ImagesLastUpdated?: Date;
  NodeID?: string;
  ImageCount?: number;
  UrlPath?: string;
  CanShare?: boolean;
  Uris?: {
    AlbumShareUris?: Uri;
    Node?: Uri;
    NodeCoverImage?: Uri;
    User?: Uri;
    Folder?: Uri;
    ParentFolders?: Uri;
    HighlightImage?: Uri;
    AlbumHighlightImage?: Uri;
    AlbumImages?: Uri;
    AlbumPopularMedia?: Uri;
    AlbumGeoMedia?: Uri;
    AlbumComments?: Uri;
    AlbumDownload?: Uri;
    AlbumPrice?: Uri;
  };

  constructor(client: SmugMugClient, obj: Album) {
    super(client);
    Object.assign(this, obj);
  }

  async request(method: string, data?: {}): Promise<AlbumResponse> {
    const req = new AlbumRequest(this._client, { albumId: this.AlbumKey });
    return req.request(method, data);
  }

  async drequest(): Promise<Response> {
    const req = new AlbumRequest(this._client, { albumId: this.AlbumKey });
    return req.drequest();
  }

  async options(data: {}): Promise<AlbumResponse> {
    const res: Promise<AlbumResponse> = this.request('OPTIONS', data);
    return res;
  }

  async get(): Promise<AlbumResponse> {
    const res: Promise<AlbumResponse> = this.request('GET');
    return res;
  }

  async patch(data: {}): Promise<AlbumResponse> {
    const res: Promise<AlbumResponse> = this.request('PATCH', data);
    return res;
  }

  async delete(): Promise<Response> {
    const res: Promise<Response> = this.request('DELETE');
    return res;
  }
}

export class AlbumResponse extends Response {
  Album: Album;

  constructor(client: SmugMugClient, obj: any) {
    super(client, obj);
    this.Album = new Album(this._client, this.Album);
  }
}

export interface AlbumRequestOptions {
  albumId: string;
}

export class AlbumRequest extends Request {
  constructor(client: SmugMugClient, private _options: AlbumRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<AlbumResponse> {
    if(method=='DELETE') throw new Error("Delete should be drequest");
    const { albumId } = this._options;
    const res = await this._client.request(method, `/album/${albumId}`, data);
    return new AlbumResponse(this._client, res);
  }

  async drequest(): Promise<Response> {
    const { albumId } = this._options;
    const res = await this._client.request("DELETE", `/album/${albumId}`);
      return new Response(this._client, res);
  }

  async options(data: {}): Promise<AlbumResponse> {
    const res: Promise<AlbumResponse> = this.request('OPTIONS', data);
    return res;
  }

  async get(): Promise<AlbumResponse> {
    const res: Promise<AlbumResponse> = this.request('GET');
    return res;
  }

  async patch(data: {}): Promise<AlbumResponse> {
    const res: Promise<AlbumResponse> = this.request('PATCH', data);
    return res;
  }

  async delete(): Promise<Response> {
    const res: Promise<Response> = this.drequest();
    return res;
  }
}
