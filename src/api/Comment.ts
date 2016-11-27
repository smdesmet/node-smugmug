import { SmugMugClient } from '../client';
import { Model, Request, Response, Uri } from './_base';

export class Comment extends Model {
  constructor(client: SmugMugClient, obj: Comment) {
    super(client);
    Object.assign(this, obj);
  }
}

export class CommentResponse extends Response {
  Comment: Comment;

  constructor(client: SmugMugClient, obj: any) {
    super(client, obj);
    this.Comment = new Comment(this._client, this.Comment);
  }
}

export interface CommentRequestOptions {
  commentId: string;
}

export class CommentRequest extends Request {
  constructor(client: SmugMugClient, private _options: CommentRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<CommentResponse> {
    const { commentId } = this._options;
    const res = await this._client.request(method, `/comment/${commentId}`, data);
    return new CommentResponse(this._client, res);
  }

  async get(): Promise<CommentResponse> {
    return this.request('GET');
  }
}
