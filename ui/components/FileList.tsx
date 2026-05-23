import { type ComponentProps } from "react";
import clsx from "clsx";
import type { GitFile } from "../types";

interface Props extends ComponentProps<"div"> {
  files: GitFile[];
}

const statusClass: Record<string, string> = {
  M: "fs-M",
  A: "fs-A",
  D: "fs-D",
  R: "fs-R",
  "?": "fs-unknown",
  " ": "fs-unknown",
};

function fileStatus(f: GitFile) {
  const s = f.index !== " " && f.index !== "?" ? f.index : f.working_dir;
  return s || "?";
}

export function FileList(props: Readonly<Props>) {
  const { files, className, ...rest } = props;
  if (!files.length) return null;
  return (
    <div
      className={clsx(
        "bg-mantle border border-surface0 rounded-xl py-4 px-6",
        className,
      )}
      {...rest}
    >
      <div className="text-xs font-semibold tracking-widest uppercase text-overlay1 mb-4">
        Changed Files ({files.length})
      </div>
      <div className="flex flex-col gap-1">
        {files.map((f) => {
          const s = fileStatus(f);
          return (
            <div
              key={f.path}
              className="flex items-center gap-2 py-2 px-2 rounded-md bg-base border border-surface0 font-mono text-xs"
            >
              <div
                className={clsx(
                  "w-4 h-4 rounded flex items-center justify-center text-xs font-bold shrink-0",
                  statusClass[s] ?? "fs-unknown",
                )}
              >
                {s}
              </div>
              <div className="flex-1 text-subtext1">{f.path}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
