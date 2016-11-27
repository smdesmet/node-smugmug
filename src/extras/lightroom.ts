import * as path from 'path';

import * as Bluebird from 'bluebird';
const sqlite3 = require('sqlite3');

type LrFileCountMap = {[id: string]: number};

export interface LrFolder {
  path: string;
  fileCount: number;
}

type LrFolderHierarchy = {[name: string]: LrFolderHierarchy};

type LrFolderPathMap = {[id: string]: string};

type LrFolderMap = {[id: string]: LrFolder};

export class LrNode {
  constructor(
    public name: string,
    public album: boolean,
    public children: LrNode[] = []) {}

  child(namePath: string): LrNode {
    const tokens = namePath.split('/');
    const [name, subName] = [tokens[0], tokens.slice(1).join('/')];
    for (const child of this.children) {
      if (child.name === name) {
        return subName ? child.child(subName) : child;
      }
    }
    return null;
  }
}

function _buildLrFolderHierarchy(folders: LrFolder[]): LrFolderHierarchy {
  const result: LrFolderHierarchy = {};
  for (const folder of folders) {
    const names = folder.path.split(path.sep);
    const [folderNames, albumName] = [names.slice(0, names.length - 1), names[names.length - 1]];
    let dir = result;
    for (const folderName of folderNames) {
      if (!(folderName in dir)) {
        dir[folderName] = {};
      }
      dir = dir[folderName];
    }
    dir[albumName] = null;
  }
  return result;
}

function _buildLrNode(folderHierarchy: LrFolderHierarchy): LrNode {
  function buildChildren(hierarchy: LrFolderHierarchy): LrNode[] {
    const result: LrNode[] = [];
    for (const folderName of Object.keys(hierarchy).sort()) {
      const subHierarchy = hierarchy[folderName];
      let node: LrNode;
      if (subHierarchy) {
        node = new LrNode(folderName, false, buildChildren(subHierarchy));
      } else {
        node = new LrNode(folderName, true);
      }
      result.push(node);
    }
    return result;
  }
  return new LrNode(null, false, buildChildren(folderHierarchy));
}

async function _getLrFolderMap(query: any): Promise<LrFolderMap> {
  let rows: any[];

  rows = await query(`SELECT folder, COUNT(folder) as file_count FROM AgLibraryFile GROUP BY folder`);
  const fileCountMap = rows.reduce<LrFileCountMap>((res, row) => {
    res[row.folder] = row.file_count;
    return res;
  }, {});

  rows = await query(`SELECT id_local, absolutePath FROM AgLibraryRootFolder;`);
  const rootFolderMap = rows.reduce<LrFolderPathMap>((res, row) => {
    res[row.id_local] = row.absolutePath;
    return res;
  }, {});

  rows = await query(`SELECT id_local, pathFromRoot, rootFolder FROM AgLibraryFolder;`);
  const nonRootFolderMap = rows.reduce<LrFolderPathMap>((res, row) => {
    res[row.id_local] = path.resolve(rootFolderMap[row.rootFolder], row.pathFromRoot);
    return res;
  }, {});

  return Object.entries<string>(nonRootFolderMap).reduce<LrFolderMap>((res, [folderId, folderPath]) => {
    res[folderId] = {
      fileCount: (folderId in fileCountMap) ? fileCountMap[folderId] : 0,
      path: folderPath,
    };
    return res;
  }, {});
}

function _getLrAlbumFolders(folderMap: LrFolderMap): LrFolder[] {
  const folders = Object.values<LrFolder>(folderMap)
    .sort((a, b) => a.path.localeCompare(b.path));
  return folders.reduce<LrFolder[]>((res, folder, i) => {
    if (folder.fileCount) {
      res.push(folder);
    }
    return res;
  }, []);
}

export async function getLrFolders(dbPath: string, basePath: string): Promise<LrFolder[]> {
  let db: any;
  try {
    db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);
    const query: any = Bluebird.promisify(db.all, {context: db});
    const folderMap = await _getLrFolderMap(query);
    return _getLrAlbumFolders(folderMap)
      .filter(albumFolder => albumFolder.path.startsWith(basePath))
      .map(albumFolder => {
        return {
          fileCount: albumFolder.fileCount,
          path: path.relative(basePath, albumFolder.path),
        };
      })
      .filter(albumFolder => albumFolder.path !== '');
  } finally {
    if (db) {
      await db.close();
    }
  }
}

export function getLrNode(folders: LrFolder[]): LrNode {
  return _buildLrNode(_buildLrFolderHierarchy(folders));
}
