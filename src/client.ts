import axios from 'axios';

import { Response } from './api/_base';
import { AlbumRequest } from './api/Album';
import { AlbumTemplateRequest } from './api/AlbumTemplate';
import { CommentRequest } from './api/Comment';
import { DownloadRequest } from './api/Download';
import { FolderRequest } from './api/Folder';
import { GuideRequest } from './api/Guide';
import { ImageRequest } from './api/Image';
import { NicknameUrlPathLookupRequest, WebUriLookupRequest } from './api/Lookup';
import { NodeRequest } from './api/Node';
import { PageRequest } from './api/Page';
import { PrintmarkRequest } from './api/Printmark';
import { StatusRequest } from './api/Status';
import { TemplateRequest } from './api/Template';
import { ThemeRequest } from './api/Theme';
import { UserRequest } from './api/User';
import { WatermarkRequest } from './api/Watermark';
import { API_BASE_URL } from './constants';
import { AuthContainer, authorize } from './oauth';

const OPTIONS_VAULT = new WeakMap<any, ClientOptions>();
const AUTH_VAULT = new WeakMap<any, AuthContainer>();

export interface ClientOptions {
  consumerKey: string;
  consumerSecret: string;
  tokenPath?: string;
  userAuthOptions?: any;
}

export class SmugMugClient {
  constructor(options: ClientOptions) {
    OPTIONS_VAULT.set(this, options);
  }

  // ===== Requests =====

  async request(method: string, url: string, data?: {}): Promise<Response> {
    await this._ensureAuthorized();
    const { oauth, token } = AUTH_VAULT.get(this);
    const requestUrl = `${API_BASE_URL}${url}`;
    const response = await axios({
      data,
      headers: {
        Accept: 'application/json',
        Authorization: oauth.authHeader(
          requestUrl,
          token.accessToken,
          token.accessTokenSecret,
          method
        ),
      },
      method,
      url: requestUrl,
    });
    return new Response(this, response.data.Response);
  }

  async options(url: string, data: {}) {
    return this.request('OPTIONS', url, data);
  }

  async get(url: string) {
    return this.request('GET', url);
  }

  async patch(url: string, data: {}) {
    return this.request('PATCH', url, data);
  }

  async put(url: string, data: {}) {
    return this.request('PUT', url, data);
  }

  async post(url: string, data: {}) {
    return this.request('POST', url, data);
  }

  async delete(url: string) {
    return this.request('DELETE', url);
  }

  // ===== API =====

  Node(nodeId: string): NodeRequest {
    return new NodeRequest(this, {nodeId});
  }

  get AuthUser(): UserRequest {
    return new UserRequest(this, {});
  }

  User(userId: string): UserRequest {
    return new UserRequest(this, {userId});
  }

  Album(albumId: string): AlbumRequest {
    return new AlbumRequest(this, {albumId});
  }

  AlbumTemplate(albumTemplateId: string): AlbumTemplateRequest {
    return new AlbumTemplateRequest(this, {albumTemplateId});
  }

  Theme(themeId: string): ThemeRequest {
    return new ThemeRequest(this, {themeId});
  }

  Template(templateId: string): TemplateRequest {
    return new TemplateRequest(this, {templateId});
  }

  Image(imageId: string): ImageRequest {
    return new ImageRequest(this, {imageId});
  }

  Watermark(watermarkId: string): WatermarkRequest {
    return new WatermarkRequest(this, {watermarkId});
  }

  Printmark(printmarkId: string): PrintmarkRequest {
    return new PrintmarkRequest(this, {printmarkId});
  }

  Folder(folderId: string): FolderRequest {
    return new FolderRequest(this, {folderId});
  }

  FolderByUser(userId: string): FolderRequest {
    return new FolderRequest(this, {getUserId: async () => userId});
  }

  Comment(commentId: string): CommentRequest {
    return new CommentRequest(this, {commentId});
  }

  Page(pageId: string): PageRequest {
    return new PageRequest(this, {pageId});
  }

  Status(statusId: string): StatusRequest {
    return new StatusRequest(this, {statusId});
  }

  Download(downloadId: string): DownloadRequest {
    return new DownloadRequest(this, {downloadId});
  }

  NicknameUrlPathLookup(): NicknameUrlPathLookupRequest {
    return new NicknameUrlPathLookupRequest(this, {});
  }

  WebUriLookup(): WebUriLookupRequest {
    return new WebUriLookupRequest(this, {});
  }

  Guide(guideId: string): GuideRequest {
    return new GuideRequest(this, {guideId});
  }

  // ===== Private Methods =====

  private async _ensureAuthorized() {
    if (AUTH_VAULT.has(this)) { return; }
    const options = OPTIONS_VAULT.get(this);
    const auth = await authorize({
      consumerKey: options.consumerKey,
      consumerSecret: options.consumerSecret,
      tokenPath: options.tokenPath,
      userAuthOptions: options.userAuthOptions,
    });
    AUTH_VAULT.set(this, auth);
  }
}
