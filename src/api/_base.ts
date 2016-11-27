import * as assert from 'assert';

import { SmugMugClient } from '../client';

const MODEL_VAULT = new WeakMap<any, { client: SmugMugClient }>();
const REQUEST_VAULT = new WeakMap<any, { client: SmugMugClient }>();
const RESPONSE_VAULT = new WeakMap<any, { client: SmugMugClient }>();

export class Model {
  constructor(client: SmugMugClient) {
    assert(client, 'request missing client');
    MODEL_VAULT.set(this, { client });
  }

  protected get _client(): SmugMugClient {
    const { client } = MODEL_VAULT.get(this);
    return client;
  }
}

export interface Pages {
  Total: number;
  Start: number;
  Count: number;
  RequestedCount: number;
  FirstPage: string;
  LastPage: string;
}

export class Request {
  constructor(client: SmugMugClient) {
    assert(client, 'request missing client');
    REQUEST_VAULT.set(this, { client });
  }

  protected get _client(): SmugMugClient {
    const { client } = REQUEST_VAULT.get(this);
    return client;
  }
}

export class Response {
  Uri?: string;
  UriDescription?: string;
  EndpointtType?: string;
  Locator?: string;
  LocatorType?: string;
  ResponseLevel?: string;
  DocUri?: string;

  constructor(client: SmugMugClient, obj: any) {
    assert(client, 'response missing client');
    if (obj) {
      Object.assign(this, obj);
    }
    RESPONSE_VAULT.set(this, { client });
  }

  protected get _client(): SmugMugClient {
    const { client } = RESPONSE_VAULT.get(this);
    return client;
  }
}

export interface Uri {
  Uri: string;
  UriDescription: string;
  EndpointType: string;
  Locator: string;
  LocatorType: string;
}
