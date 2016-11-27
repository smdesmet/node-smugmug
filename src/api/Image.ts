import { SmugMugClient } from '../client';
import { Model, Request, Response, Uri } from './_base';

export class Image extends Model {
  Uri?: string;
  WebUri?: string;
  UriDescription?: string;
  Title?: string;
  Caption?: string;
  Keywords?: string;
  KeywordArray?: string[];
  Watermark?: string;
  Latitude?: string;
  Longitude?: string;
  Altitude?: number;
  Hidden?: boolean;
  ThumbnailUrl?: string;
  FileName?: string;
  Processing?: boolean;
  UploadKey?: string;
  Date?: Date;
  Format?: string;
  OriginalHeight?: number;
  OriginalWidth?: number;
  OriginalSize?: number;
  LastUpdated?: Date;
  Collectable?: boolean;
  IsArchive?: boolean;
  IsVideo?: boolean;
  CanEdit?: boolean;
  Protected?: boolean;
  ImageKey?: string;
  ArchivedUri?: string;
  ArchivedSize?: number;
  ArchivedMD5?: string;
  FormattedValues?: {
    Caption?: any;
  };
  Uris?: {
    LargestImage?: Uri;
    ImageSizes?: Uri;
    ImageSizeDetails?: Uri;
    PointOfInterest?: Uri;
    PointOfInterestCrops?: Uri;
    Regions?: Uri;
    ImageAlbum?: Uri;
    ImageDownload?: Uri;
    ImageOwner?: Uri;
    ImageComments?: Uri;
    ImageMetadata?: Uri;
    ImagePrices?: Uri;
  };

  constructor(client: SmugMugClient, obj: Image) {
    super(client);
    Object.assign(this, obj);
  }
}

export class ImageResponse extends Response {
  Image: Image;

  constructor(client: SmugMugClient, obj: any) {
    super(client, obj);
    this.Image = new Image(this._client, this.Image);
  }
}

export interface ImageRequestOptionsBase {
}

export interface ImageRequestOptionsWithImageId extends ImageRequestOptionsBase {
  imageId: string;
}

export interface ImageRequestOptionsWithHighlightNodeId extends ImageRequestOptionsBase {
  getNodeId: () => Promise<string>;
}

export type ImageRequestOptions = ImageRequestOptionsWithImageId | ImageRequestOptionsWithHighlightNodeId;

export class ImageRequest extends Request {
  constructor(client: SmugMugClient, private _options: ImageRequestOptions) {
    super(client);
  }

  async request(method: string, data?: {}): Promise<ImageResponse> {
    let res;
    if ((<ImageRequestOptionsWithImageId> this._options).imageId) {
      const { imageId } = <ImageRequestOptionsWithImageId> this._options;
      res = await this._client.request(method, `/image/${imageId}`, data);
    } else if ((<ImageRequestOptionsWithHighlightNodeId> this._options).getNodeId) {
      const nodeId = await (<ImageRequestOptionsWithHighlightNodeId> this._options).getNodeId();
      res = await this._client.request(method, `/highlight/node/${nodeId}`, data);
    }
    return new ImageResponse(this._client, res);
  }

  async options(data: {}): Promise<ImageResponse> {
    return this.request('OPTIONS', data);
  }

  async get(): Promise<ImageResponse> {
    return this.request('GET');
  }
}
