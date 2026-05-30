import { type ComponentProps } from "react";
import clsx from "clsx";
import { Icon } from "./Icon";
import { ButtonIcon } from "./Button";
import { useAppStore } from "../store";
import { removeRepo as apiRemoveRepo } from "../api";
import { useGitAction } from "../hooks/useGitAction";
import { toast } from "../utils/toast";
import type { Repo } from "../types";
import { RepoDropdowActions } from "./RepoDropdowActions";

interface Props extends ComponentProps<"div"> {
  repo: Repo;
}

export function RepoRow(props: Readonly<Props>) {
  const { repo, className, ...rest } = props;
  const { removeRepo } = useAppStore();
  const { execute, loading } = useGitAction();

  const handleGit = async (action: "fetch" | "pull" | "push") => {
    const result = await execute(repo.path, action);
    if (result?.success) toast(result.result, "ok");
    else if (result) toast(result.result, "err");
  };

  const handleRemove = async () => {
    await apiRemoveRepo(repo.path);
    removeRepo(repo.path);
    toast("Repository removed");
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-4 rounded-xl p-3 hover:bg-surface0/50",
        className,
      )}
      {...rest}
    >
      <div className="flex min-w-48 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mauve/15 text-mauve">
          <Icon name="folder_code" size={24} />
        </div>
        <div>
          <div className="text-base font-semibold text-foreground">
            {repo.name}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-mauve">
            <Icon name="fork_right" size={16} />
            {repo.branch || "?"}
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-2">
        {repo.error && <span className="badge badge-error">err</span>}
        {!repo.error && repo.isClean && !repo.ahead && !repo.behind && (
          <span className="badge badge-clean">
            <Icon name="check" size={16} />
          </span>
        )}
        {repo.changed > 0 && (
          <span className="badge badge-changed">{repo.changed} changed</span>
        )}
        {repo.staged > 0 && (
          <span className="badge badge-staged">{repo.staged} staged</span>
        )}
        {repo.ahead > 0 && (
          <span className="badge badge-ahead">
            <Icon name="arrow_upward" size={16} />
            {repo.ahead}
          </span>
        )}
        {repo.behind > 0 && (
          <span className="badge badge-behind">
            <Icon name="arrow_downward" size={16} />
            {repo.behind}
          </span>
        )}
        {repo.stash > 0 && (
          <span className="badge badge-stash">{repo.stash} stashed</span>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap gap-2 sm:flex-nowrap">
        <ButtonIcon
          className="bg-transparent hover:not-disabled:bg-surface0"
          icon="cloud_download"
          isLoading={loading === "fetch"}
          title="fetch"
          onClick={() => handleGit("fetch")}
          disabled={!!loading}
        />
        <ButtonIcon
          className="bg-transparent hover:not-disabled:bg-surface0"
          icon="download"
          isLoading={loading === "pull"}
          title="pull"
          onClick={() => handleGit("pull")}
          disabled={!!loading}
        />
        <ButtonIcon
          className="bg-transparent hover:not-disabled:bg-surface0"
          icon="upload"
          isLoading={loading === "push"}
          title="push"
          onClick={() => handleGit("push")}
          disabled={!!loading}
        />
        <RepoDropdowActions onRemove={handleRemove} />
      </div>
    </div>
  );
}
