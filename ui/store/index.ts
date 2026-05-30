import { create } from "zustand";
import type { Repo, LogEntry } from "../types";

let logId = 0;

export type ThemeMode = "system" | "dark" | "light";

interface AppState {
  repos: Repo[];
  activeRepoPath: string | null;
  logs: LogEntry[];
  lastRefresh: Date | null;
  isLogOpen: boolean;
  themeMode: ThemeMode;

  setRepos: (repos: Repo[]) => void;
  updateRepo: (repo: Repo) => void;
  removeRepo: (path: string) => void;
  setActiveRepo: (path: string | null) => void;
  addLog: (msg: string, type: LogEntry["type"]) => void;
  clearLogs: () => void;
  setLastRefresh: () => void;
  toggleLogOpen: () => void;
  setLogOpen: (open: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = "git-dashboard-theme";

function getInitialThemeMode(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark" || saved === "light" || saved === "system") {
    return saved;
  }
  return "system";
}

let currentThemeMode: ThemeMode = getInitialThemeMode();

function applyTheme(mode: ThemeMode) {
  currentThemeMode = mode;
  let theme: "mocha" | "latte";
  if (mode === "system") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "mocha"
      : "latte";
  } else {
    theme = mode === "dark" ? "mocha" : "latte";
  }
  document.documentElement.dataset.theme = theme;
}

applyTheme(currentThemeMode);

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    if (currentThemeMode === "system") {
      applyTheme("system");
    }
  });

export const useAppStore = create<AppState>((set) => ({
  repos: [],
  activeRepoPath: null,
  logs: [],
  lastRefresh: null,
  isLogOpen: false,
  themeMode: getInitialThemeMode(),

  setThemeMode: (mode) => {
    localStorage.setItem(STORAGE_KEY, mode);
    applyTheme(mode);
    set({ themeMode: mode });
  },

  setRepos: (repos) => set({ repos }),

  updateRepo: (repo) =>
    set((state) => ({
      repos: state.repos.map((r) => (r.path === repo.path ? repo : r)),
    })),

  removeRepo: (path) =>
    set((state) => ({
      repos: state.repos.filter((r) => r.path !== path),
      activeRepoPath:
        state.activeRepoPath === path ? null : state.activeRepoPath,
    })),

  setActiveRepo: (path) => set({ activeRepoPath: path }),

  addLog: (msg, type) =>
    set((state) => ({
      logs: [
        ...state.logs.slice(-49),
        { id: logId++, msg, type, time: new Date().toLocaleTimeString() },
      ],
    })),

  clearLogs: () => set({ logs: [] }),

  setLastRefresh: () => set({ lastRefresh: new Date() }),

  toggleLogOpen: () => set((state) => ({ isLogOpen: !state.isLogOpen })),

  setLogOpen: (open) => set({ isLogOpen: open }),
}));
