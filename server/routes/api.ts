import { Router } from "express";
import { simpleGit } from "simple-git";
import { loadConfig, saveConfig, resolveRepoPath } from "../services/config.js";
import {
  scanDirectory,
  getRepoStatus,
  isGitRepo,
  executeGitOperation,
} from "../services/git.js";

export const apiRouter = Router();

// GET all repos status
apiRouter.get("/repos", async (req, res) => {
  const config = loadConfig();
  const paths = new Set([...config.repoPaths]);
  if (config.scanDir) {
    scanDirectory(config.scanDir).forEach((p) => paths.add(p));
  }
  const statuses = await Promise.all([...paths].map(getRepoStatus));
  res.json(statuses);
});

// GET single repo status
apiRouter.get("/repos/status", async (req, res) => {
  const repoPath = req.query.path as string;
  if (!repoPath) {
    res.status(400).json({ error: "path required" });
    return;
  }
  const resolved = resolveRepoPath(repoPath);
  if (!resolved) {
    res.status(400).json({ error: "Invalid or non-existent path" });
    return;
  }
  const status = await getRepoStatus(resolved);
  res.json(status);
});

// POST git operation (fetch/pull/push/commit)
apiRouter.post("/repos/git", async (req, res) => {
  const { path: repoPath, action, message } = req.body;
  if (!repoPath || !action) {
    res.status(400).json({ error: "path and action required" });
    return;
  }
  const resolved = resolveRepoPath(repoPath);
  if (!resolved) {
    res.status(400).json({ error: "Invalid or non-existent path" });
    return;
  }
  if (!isGitRepo(resolved)) {
    res.status(400).json({ error: "Not a git repository" });
    return;
  }

  try {
    const response = await executeGitOperation(resolved, action, message);
    res.json(response);
  } catch (e: unknown) {
    res.status(500).json({ success: false, result: (e as Error).message });
  }
});

// GET config
apiRouter.get("/config", (req, res) => {
  res.json(loadConfig());
});

// POST config
apiRouter.post("/config", (req, res) => {
  const { repoPaths, scanDir } = req.body;
  const validatedPaths = Array.isArray(repoPaths)
    ? repoPaths.filter((p) => typeof p === "string")
    : [];
  saveConfig({
    repoPaths: validatedPaths,
    scanDir: typeof scanDir === "string" ? scanDir : "",
  });
  res.json({ ok: true });
});

// POST add single repo
apiRouter.post("/repos/add", (req, res) => {
  const { path: repoPath } = req.body;
  if (!repoPath) {
    res.status(400).json({ error: "path required" });
    return;
  }
  const resolved = resolveRepoPath(repoPath);
  if (!resolved) {
    res.status(400).json({ error: "Invalid or non-existent path" });
    return;
  }
  if (!isGitRepo(resolved)) {
    res.status(400).json({ error: "Not a git repository" });
    return;
  }
  const config = loadConfig();
  if (!config.repoPaths.includes(resolved)) {
    config.repoPaths.push(resolved);
    saveConfig(config);
  }
  res.json({ ok: true });
});

// POST fetch all repos
apiRouter.post("/repos/fetch-all", async (req, res) => {
  const config = loadConfig();
  const paths = new Set([...config.repoPaths]);
  if (config.scanDir) {
    scanDirectory(config.scanDir).forEach((p) => paths.add(p));
  }
  const results = await Promise.all(
    [...paths].map(async (repoPath) => {
      try {
        const git = simpleGit(repoPath);
        const remotes = await git.getRemotes(true).catch(() => []);
        if (remotes.length > 0) {
          await git.fetch(["--all", "--prune"]);
        }
      } catch {
        // ignore fetch errors; still return updated status
      }
      return getRepoStatus(repoPath);
    }),
  );
  res.json(results);
});

// DELETE repo from list
apiRouter.delete("/repos", (req, res) => {
  const { path: repoPath } = req.body;
  if (!repoPath) {
    res.status(400).json({ error: "path required" });
    return;
  }
  const config = loadConfig();
  config.repoPaths = config.repoPaths.filter((p) => p !== repoPath);
  saveConfig(config);
  res.json({ ok: true });
});
