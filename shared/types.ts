export interface RepoStatus {
  name: string;
  path: string;
  error?: string;
  branch?: string;
  tracking?: string;
  hasRemote: boolean;
  ahead: number;
  behind: number;
  changed: number;
  staged: number;
  stash: number;
  isClean: boolean | null;
  lastCommit: {
    hash: string;
    message: string;
    author: string;
    date: string;
  } | null;
  files: Array<{
    path: string;
    index: string;
    working_dir: string;
  }>;
}

export interface Config {
  repoPaths: string[];
  scanDir: string;
}
