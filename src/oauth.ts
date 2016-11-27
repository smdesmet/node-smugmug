import * as path from 'path';
import * as querystring from 'querystring';
import * as readline from 'readline';

import * as fs from 'fs-extra-promise';
const { OAuth } = require('oauth');

import * as C from './constants';

export interface OAuthRequestToken {
  oauthToken: string;
  oauthTokenSecret: string;
  results: any;
}

export interface OAuthAccessToken {
  accessToken: string;
  accessTokenSecret: string;
  results: any;
}

export interface UserAuthOptions {
  access?: string;
  permissions?: string;
}

export interface AuthOptions {
  consumerKey: string;
  consumerSecret: string;
  userAuthOptions?: UserAuthOptions;
  tokenPath?: string;
}

export interface AuthContainer {
  oauth: any;
  token: OAuthAccessToken;
}

function _buildAuthQuerystring(options: UserAuthOptions) {
  const params: any = {};
  if (options.access) {
    params.Access = options.access;
  }
  if (options.permissions) {
    params.Permissions = options.permissions;
  }
  return querystring.stringify(params);
}

async function _getOAuthRequestToken(oauth: any) {
  return new Promise<OAuthRequestToken>((resolve, reject) => {
    oauth.getOAuthRequestToken((err: Error, oauthToken: string, oauthTokenSecret: string, results: any) => {
      if (err) { return reject(err); }
      resolve({oauthToken, oauthTokenSecret, results});
    });
  });
}

async function _getOAuthAccessToken(oauth: any, token: string, tokenSecret: string, verifier: string) {
  return new Promise<OAuthAccessToken>((resolve, reject) => {
    oauth.getOAuthAccessToken(
      token, tokenSecret, verifier,
      (err: Error, accessToken: string, accessTokenSecret: string, results: any) => {
        if (err) { return reject(err); }
        resolve({accessToken, accessTokenSecret, results});
      },
    );
  });
}

async function _storeToken(token: any, tokenPath: string) {
  try {
    await fs.mkdirAsync(path.dirname(tokenPath));
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
  await fs.writeFileAsync(tokenPath, JSON.stringify(token, null, 2) + '\n');
  console.log(`Token stored to:\n${tokenPath}\n`);
}

async function _getNewToken(oauth: any, options: AuthOptions) {
  return new Promise<OAuthAccessToken>(async (resolve: any, reject: any) => {
    const { oauthToken, oauthTokenSecret } = await _getOAuthRequestToken(oauth);
    const authQuerystring = _buildAuthQuerystring(options.userAuthOptions);
    const authUrl = `${C.OAUTH_USER_AUTH_URL}?${authQuerystring}`;
    const signedAuthUrl = oauth.signUrl(authUrl, oauthToken, oauthTokenSecret);

    console.log(`Authorize this app by visiting this url:\n${signedAuthUrl}\n`);
    const rl = readline.createInterface({input: process.stdin, output: process.stdout});
    rl.question('Enter the code from that page here:\n', async (code: string) => {
      rl.close();
      console.log();
      try {
        const token = await _getOAuthAccessToken(oauth, oauthToken, oauthTokenSecret, code);
        if (options.tokenPath) {
          await _storeToken(token, options.tokenPath);
        }
        resolve(token);
      } catch (err) {
        reject(new Error(`Error while trying to retrieve access token:\n${err.message}`));
      }
    });
  });
}

export async function authorize(options: AuthOptions): Promise<AuthContainer> {
  const oauth = new OAuth(
    C.OAUTH_REQUEST_TOKEN_URL,
    C.OAUTH_ACCESS_TOKEN_URL,
    options.consumerKey,
    options.consumerSecret,
    C.OAUTH_SPEC,
    C.OAUTH_CALLBACK,
    C.OAUTH_SIGNATURE_METHOD,
  );
  let token;
  try {
    if (!options.tokenPath) {
      throw new Error('missing token path');
    }
    const tokenPath = path.resolve(options.tokenPath);
    const tokenRaw = await fs.readFileAsync(tokenPath, {encoding: 'utf8'});
    token = JSON.parse(tokenRaw);
  } catch (err) {
    token = await _getNewToken(oauth, options);
  }
  return {oauth, token};
}
