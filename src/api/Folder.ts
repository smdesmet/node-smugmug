import { SmugMugClient } from '../client';
import { Model, Request, Response, Uri } from './_base';

export class Folder extends Model {
  ResponseLevel?: string;
  Uri?: string;
  WebUri?: string;
  UriDescription?: string;
  Name?: string;
  UrlName?: string;
  SecurityType?: string;
  SortMethod?: string;
  SortDirection?: string;
  Description?: string;
  Keywords?: string[];
  Password?: string;
  PasswordHint?: string;
  Privacy?: string;
  SmugSearchable?: string;
  WorldSearchable?: string;
  DateAdded?: Date;
  DateModified?: Date;
  UrlPath?: string;
  NodeID?: string;
  IsEmpty?: boolean;
  Uris?: {
    FolderByID?: Uri;
    Node?: Uri;
    User?: Uri;
    HighlightImage?: Uri;
    FolderHighlightImage?: Uri;
    Folders?: Uri;
    FolderList?: Uri;
    MoveFolders?: Uri;
    SortFolders?: Uri;
    FolderAlbums?: Uri;
    AlbumFromAlbumTemplate?: Uri;
    SortFolderAlbums?: Uri;
    MoveFolderAlbums?: Uri;
    AlbumList?: Uri;
    FolderPages?: Uri;
    MoveFolderPages?: Uri;
    SortFolderPages?: Uri;
    Size?: Uri;
  };

  constructor(client: SmugMugClient, obj: Folder) {
    super(client);
    Object.assign(this, obj);
  }
}

export class FolderResponse extends Response {
  Folder: Folder;

  constructor(client: SmugMugClient, obj: any) {
    super(client, obj);
    this.Folder = new Folder(this._client, this.Folder);
  }
}

export interface FolderRequestOptionsBase {
}

export interface FolderRequestOptionsWithFolderId extends FolderRequestOptionsBase {
  folderId: string;
}

export interface FolderRequestOptionsWithUserId extends FolderRequestOptionsBase {
  getUserId: () => Promise<string>;
}

export type FolderRequestOptions = FolderRequestOptionsWithFolderId | FolderRequestOptionsWithUserId;

export class FolderRequest extends Request {
  constructor(client: SmugMugClient, private _options: FolderRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<FolderResponse> {
    let res;
    if ((<FolderRequestOptionsWithFolderId> this._options).folderId) {
      const folderId = (<FolderRequestOptionsWithFolderId> this._options).folderId;
      res = await this._client.request(method, `/folder/id/${folderId}`, data);
    } else {
      const userId = await (<FolderRequestOptionsWithUserId> this._options).getUserId();
      res = await this._client.request(method, `/folder/user/${userId}`, data);
    }
    return new FolderResponse(this._client, res);
  }

  async get(): Promise<FolderResponse> {
    return this.request('GET');
  }
}
