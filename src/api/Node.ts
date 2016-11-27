import { SmugMugClient } from '../client';
import { Model, Pages, Request, Response, Uri } from './_base';
import { ImageRequest } from './Image';
import { User } from './User';

export interface NodeUris {
  ParentNode?: Uri;
  ParentNodes?: Uri;
  User?: Uri;
  NodeCoverImage?: Uri;
  HighlightImage?: Uri;
  NodeComments?: Uri;
}

export interface FolderNodeUris extends NodeUris {
  FolderByID?: Uri;
  ChildNodes?: Uri;
  MoveNodes?: Uri;
}

export interface AlbumNodeUris extends NodeUris {
  Album?: Uri;
}

export class Node extends Model {
  ResponseLevel?: string;
  Uri?: string;
  WebUri?: string;
  UriDescription?: string;
  Description?: string;
  HideOwner?: boolean;
  Name?: string;
  Keywords?: string[];
  Password?: string;
  PasswordHint?: string;
  Privacy?: string;
  SecurityType?: string;
  ShowCoverImage?: boolean;
  SmugSearchable?: string;
  SortDirection?: string;
  SortMethod?: string;
  Type?: string;
  UrlName?: string;
  WorldSearchable?: string;
  DateAdded?: Date;
  DateModified?: Date;
  EffectivePrivacy?: string;
  EffectiveSecurityType?: string;
  FormattedValues?: {
    Name?: {
      html: string;
    };
    Description?: {
      html: string;
      text: string;
    };
  };
  HasChildren?: boolean;
  IsRoot?: boolean;
  NodeID?: string;
  UrlPath?: string;
  Uris?: FolderNodeUris | AlbumNodeUris;

  constructor(client: SmugMugClient, obj: Node) {
    super(client);
    Object.assign(this, obj);
  }

  async request(method: string, data?: {}): Promise<Response | NodeResponse> {
    const req = new NodeRequest(this._client, { nodeId: this.NodeID });
    return req.request(method, data);
  }

  async options(data: {}): Promise<NodeResponse> {
    const res: Promise<NodeResponse> = this.request('OPTIONS', data);
    return res;
  }

  async get(): Promise<NodeResponse> {
    const res: Promise<NodeResponse> = this.request('GET');
    return res;
  }

  async patch(data: {}): Promise<NodeResponse> {
    const res: Promise<NodeResponse> = this.request('PATCH', data);
    return res;
  }

  async delete(): Promise<Response> {
    const res: Promise<Response> = this.request('DELETE');
    return res;
  }

  get FolderByID() {
    throw new Error('not yet implemented');
  }

  get ParentNodes() {
    throw new Error('not yet implemented');
  }

  get User() {
    throw new Error('not yet implemented');
  }

  get NodeCoverImage() {
    throw new Error('not yet implemented');
  }

  get HighlightImage(): ImageRequest {
    return new ImageRequest(this._client, {
      getNodeId: async () => this.NodeID,
    });
  }

  get NodeComments() {
    throw new Error('not yet implemented');
  }

  get ChildNodes(): NodesRequest {
    return new NodesRequest(this._client, {
      childNodes: true,
      getNodeId: async () => this.NodeID,
    });
  }

  get MoveNodes() {
    throw new Error('not yet implemented');
  }
}

export class NodeResponse extends Response {
  Node: Node;

  constructor(client: SmugMugClient, obj: any) {
    super(client, obj);
    this.Node = new Node(this._client, this.Node);
  }

  async addChild(data: {}): Promise<NodeResponse> {
    return this.Node.ChildNodes.post(data);
  }

  async delete(): Promise<Response> {
    return this.Node.delete();
  }
}

export interface NodeRequestOptionsBase {
}

export interface NodeRequestOptionsWithNodeId extends NodeRequestOptionsBase {
  nodeId: string;
}

export interface NodeRequestOptionsWithUser extends NodeRequestOptionsBase {
  getUser: () => Promise<User>;
}

export type NodeRequestOptions = NodeRequestOptionsWithNodeId | NodeRequestOptionsWithUser;

export class NodeRequest extends Request {
  constructor(client: SmugMugClient, private _options: NodeRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<Response | NodeResponse> {
    let nodeId;
    if ((<NodeRequestOptionsWithNodeId> this._options).nodeId) {
      nodeId = (<NodeRequestOptionsWithNodeId> this._options).nodeId;
    } else {
      const user = await (<NodeRequestOptionsWithUser> this._options).getUser();
      nodeId = user.Uris.Node.Uri.split('/').reverse()[0];
    }
    const res = await this._client.request(method, `/node/${nodeId}`, data);
    if (method.toUpperCase() === 'DELETE') {
      return new Response(this._client, res);
    }
    return new NodeResponse(this._client, res);
  }

  async options(data: {}): Promise<NodeResponse> {
    const res: Promise<NodeResponse> = this.request('OPTIONS', data);
    return res;
  }

  async get(): Promise<NodeResponse> {
    const res: Promise<NodeResponse> = this.request('GET');
    return res;
  }

  async patch(data: {}): Promise<NodeResponse> {
    const res: Promise<NodeResponse> = this.request('PATCH', data);
    return res;
  }

  async delete(): Promise<Response> {
    const res: Promise<Response> = this.request('DELETE');
    return res;
  }

  async getId(): Promise<string> {
    let nodeId;
    if ((<NodeRequestOptionsWithNodeId> this._options).nodeId) {
      nodeId = (<NodeRequestOptionsWithNodeId> this._options).nodeId;
    } else {
      const user = await (<NodeRequestOptionsWithUser> this._options).getUser();
      nodeId = user.Uris.Node.Uri.split('/').reverse()[0];
    }
    return nodeId;
  }

  get FolderByID() {
    throw new Error('not yet implemented');
  }

  get ParentNodes() {
    throw new Error('not yet implemented');
  }

  get User() {
    throw new Error('not yet implemented');
  }

  get NodeCoverImage() {
    throw new Error('not yet implemented');
  }

  get HighlightImage(): ImageRequest {
    return new ImageRequest(this._client, {
      getNodeId: () => this.getId(),
    });
  }

  get NodeComments() {
    throw new Error('not yet implemented');
  }

  get ChildNodes(): NodesRequest {
    return new NodesRequest(this._client, {
      childNodes: true,
      getNodeId: this.getId.bind(this),
    });
  }

  get MoveNodes() {
    throw new Error('not yet implemented');
  }
}

export class NodesResponse extends Response {
  Node: Node[];
  Pages: Pages;

  constructor(client: SmugMugClient, obj: any) {
    super(client, obj);
    this.Node = this.Node.map(node => new Node(this._client, node));
  }
}

export interface NodesRequestOptionsBase {
  getNodeId: () => Promise<string>;
}

export interface NodesRequestOptionsWithChildNodes extends NodesRequestOptionsBase {
  childNodes: boolean;
}

export type NodesRequestOptions = NodesRequestOptionsWithChildNodes;

export class NodesRequest extends Request {
  constructor(client: SmugMugClient, private _options: NodesRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<NodeResponse | NodesResponse> {
    const nodeId = await this._options.getNodeId();
    let res;
    if (this._options.childNodes) {
      res = await this._client.request(method, `/node/${nodeId}!children`, data);
    }
    if (method.toUpperCase() === 'POST') {
      return new NodeResponse(this._client, res);
    }
    return new NodesResponse(this._client, res);
  }

  async options(data: {}): Promise<NodesResponse> {
    const res: Promise<NodesResponse> = this.request('OPTIONS', data);
    return res;
  }

  async get(): Promise<NodesResponse> {
    const res: Promise<NodesResponse> = this.request('GET');
    return res;
  }

  async post(data: {}): Promise<NodeResponse> {
    const res: Promise<NodeResponse> = this.request('POST', data);
    return res;
  }
}
