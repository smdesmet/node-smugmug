import { SmugMugClient } from '../client';
import { Model, Request, Response, Uri } from './_base';
import { AlbumTemplatesRequest } from './AlbumTemplate';
import { FeaturesRequest } from './Features';
import { FolderRequest } from './Folder';
import { NodeRequest } from './Node';

const USER_VAULT = new WeakMap<User, { res: UserResponse }>();

export class User extends Model {
  ResponseLevel?: string;
  Uri?: string;
  WebUri?: string;
  UriDescription?: string;
  AccountStatus?: string;
  FirstName?: string;
  FriendsView?: boolean;
  ImageCount?: number;
  IsTrial?: boolean;
  LastName?: string;
  NickName?: string;
  SortBy?: string;
  ViewPassHint?: string;
  ViewPassword?: string;
  Domain?: string;
  DomainOnly?: string;
  RefTag?: string;
  Name?: string;
  Plan?: string;
  QuickShare?: boolean;
  Uris?: {
    BioImage?: Uri;
    CoverImage?: Uri;
    UserProfile?: Uri;
    Node?: Uri;
    Folder?: Uri;
    UserAlbums?: Uri;
    UserGeoMedia?: Uri;
    UserPopularMedia?: Uri;
    UserFeaturedAlbums?: Uri;
    UserRecentImages?: Uri;
    UserImageSearch?: Uri;
    UserTopKeywords?: Uri;
    UrlPathLookup?: Uri;
    UserAlbumTemplates?: Uri;
    SortUserFeaturedAlbums?: Uri;
    UserTasks?: Uri;
    UserWatermarks?: Uri;
    UserPrintmarks?: Uri;
    UserUploadLimits?: Uri;
    UserLatestQuickNews?: Uri;
    UserGuideStates?: Uri;
    UserHideGuides?: Uri;
    Features?: Uri;
    UserGrants?: Uri;
    DuplicateImageSearch?: Uri;
    UserDeletedAlbums?: Uri;
    UserDeletedFolders?: Uri;
    UserDeletedPages?: Uri;
    UserContacts?: Uri;
  };

  constructor(client: SmugMugClient, obj: User, res: UserResponse) {
    super(client);
    Object.assign(this, obj);
    USER_VAULT.set(this, { res });
  }

  get BioImage() {
    throw new Error('not yet implemented');
  }

  get CoverImage() {
    throw new Error('not yet implemented');
  }

  get UserProfile() {
    throw new Error('not yet implemented');
  }

  get Node(): NodeRequest {
    const { res } = USER_VAULT.get(this);
    return new NodeRequest(this._client, {
      getUser: async () => res.User,
    });
  }

  get Folder(): FolderRequest {
    return new FolderRequest(this._client, {
      getUserId: async () => this.NickName,
    });
  }

  get UserAlbums() {
    throw new Error('not yet implemented');
  }

  get UserGeoMedia() {
    throw new Error('not yet implemented');
  }

  get UserPopularMedia() {
    throw new Error('not yet implemented');
  }

  get UserFeaturedAlbums() {
    throw new Error('not yet implemented');
  }

  get UserRecentImages() {
    throw new Error('not yet implemented');
  }

  get UserImageSearch() {
    throw new Error('not yet implemented');
  }

  get UserTopKeywords() {
    throw new Error('not yet implemented');
  }

  get UrlPathLookup() {
    throw new Error('not yet implemented');
  }

  get UserAlbumTemplates(): AlbumTemplatesRequest {
    return new AlbumTemplatesRequest(this._client, {
      getUserId: async () => this.NickName,
    });
  }

  get SortUserFeaturedAlbums() {
    throw new Error('not yet implemented');
  }

  get UserTasks() {
    throw new Error('not yet implemented');
  }

  get UserWatermarks() {
    throw new Error('not yet implemented');
  }

  get UserPrintmarks() {
    throw new Error('not yet implemented');
  }

  get UserUploadLimits() {
    throw new Error('not yet implemented');
  }

  get UserLatestQuickNews() {
    throw new Error('not yet implemented');
  }

  get UserGuideStates() {
    throw new Error('not yet implemented');
  }

  get UserHideGuides() {
    throw new Error('not yet implemented');
  }

  get Features(): FeaturesRequest {
    return new FeaturesRequest(this._client, {
      userId: async () => this.NickName,
    });
  }

  get UserGrants() {
    throw new Error('not yet implemented');
  }

  get DuplicateImageSearch() {
    throw new Error('not yet implemented');
  }

  get UserDeletedAlbums() {
    throw new Error('not yet implemented');
  }

  get UserDeletedFolders() {
    throw new Error('not yet implemented');
  }

  get UserDeletedPages() {
    throw new Error('not yet implemented');
  }

  get UserContacts() {
    throw new Error('not yet implemented');
  }
}

export class UserResponse extends Response {
  User: User;

  constructor(client: SmugMugClient, obj: any) {
    super(client, obj);
    this.User = new User(this._client, this.User, this);
  }
}

export interface UserRequestOptions {
  userId?: string;  // empty user ID for auth user
}

export class UserRequest extends Request {
  constructor(client: SmugMugClient, private _options: UserRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<UserResponse> {
    const { userId } = this._options;
    let res;
    if (userId) {
      res = await this._client.request(method, `/user/${userId}`, data);
    } else {
      res = await this._client.request(method, '!authuser', data);
    }
    return new UserResponse(this._client, res);
  }

  async get(): Promise<UserResponse> {
    return this.request('GET');
  }

  async getId(): Promise<string> {
    const { userId } = this._options;
    if (userId) {
      return userId;
    }
    const res = await this._client.get('!authuser');
    const userRes = new UserResponse(this._client, res);
    return userRes.User.NickName;
  }

  get BioImage() {
    throw new Error('not yet implemented');
  }

  get CoverImage() {
    throw new Error('not yet implemented');
  }

  get UserProfile() {
    throw new Error('not yet implemented');
  }

  get Node(): NodeRequest {
    return new NodeRequest(this._client, {
      getUser: async () => {
        const userRes = await this.get();
        return userRes.User;
      },
    });
  }

  get Folder(): FolderRequest {
    return new FolderRequest(this._client, {
      getUserId: () => this.getId(),
    });
  }

  get UserAlbums() {
    throw new Error('not yet implemented');
  }

  get UserGeoMedia() {
    throw new Error('not yet implemented');
  }

  get UserPopularMedia() {
    throw new Error('not yet implemented');
  }

  get UserFeaturedAlbums() {
    throw new Error('not yet implemented');
  }

  get UserRecentImages() {
    throw new Error('not yet implemented');
  }

  get UserImageSearch() {
    throw new Error('not yet implemented');
  }

  get UserTopKeywords() {
    throw new Error('not yet implemented');
  }

  get UrlPathLookup() {
    throw new Error('not yet implemented');
  }

  get UserAlbumTemplates(): AlbumTemplatesRequest {
    const { userId } = this._options;
    return new AlbumTemplatesRequest(this._client, {
      getUserId: () => this.getId(),
    });
  }

  get SortUserFeaturedAlbums() {
    throw new Error('not yet implemented');
  }

  get UserTasks() {
    throw new Error('not yet implemented');
  }

  get UserWatermarks() {
    throw new Error('not yet implemented');
  }

  get UserPrintmarks() {
    throw new Error('not yet implemented');
  }

  get UserUploadLimits() {
    throw new Error('not yet implemented');
  }

  get UserLatestQuickNews() {
    throw new Error('not yet implemented');
  }

  get UserGuideStates() {
    throw new Error('not yet implemented');
  }

  get UserHideGuides() {
    throw new Error('not yet implemented');
  }

  get Features() {
    throw new Error('not yet implemented');
  }

  get UserGrants() {
    throw new Error('not yet implemented');
  }

  get DuplicateImageSearch() {
    throw new Error('not yet implemented');
  }

  get UserDeletedAlbums() {
    throw new Error('not yet implemented');
  }

  get UserDeletedFolders() {
    throw new Error('not yet implemented');
  }

  get UserDeletedPages() {
    throw new Error('not yet implemented');
  }

  get UserContacts() {
    throw new Error('not yet implemented');
  }
}
