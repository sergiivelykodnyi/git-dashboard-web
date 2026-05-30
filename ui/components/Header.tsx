import { type ComponentProps } from "react";
import clsx from "clsx";
import { Icon } from "./Icon";
import { useAppStore, type ThemeMode } from "../store";
import { Dropdown, DropdownItem, DropdownAction } from "./Dropdown";

const themeIcons: Record<ThemeMode, string> = {
  system: "contrast",
  dark: "dark_mode",
  light: "light_mode",
};

interface Props extends ComponentProps<"header"> {
  onRefresh: () => void;
  refreshing: boolean;
  onFetchAll: () => void;
  fetching: boolean;
  onAddRepo: () => void;
}

export function Header(props: Readonly<Props>) {
  const {
    onRefresh,
    refreshing,
    onFetchAll,
    fetching,
    onAddRepo,
    className,
    ...rest
  } = props;
  const { lastRefresh, themeMode, setThemeMode } = useAppStore();

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 h-20 border-b border-surface0 bg-mantle px-6",
        className,
      )}
      {...rest}
    >
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-semibold tracking-tight text-mauve uppercase">
            <Icon name="fork_right" size={24} />
            git dashboard
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastRefresh && (
            <span className="px-2 py-1 text-xs text-overlay0">
              Updated {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <Dropdown
            triggerIcon={themeIcons[themeMode]}
            triggerTitle="Switch theme"
          >
            <DropdownItem>
              <DropdownAction
                className={clsx(
                  themeMode === "system" && "bg-surface0/50 text-mauve",
                )}
                onClick={() => setThemeMode("system")}
              >
                <Icon
                  name="contrast"
                  className={clsx(
                    "menu-item-icon",
                    themeMode === "system" && "text-mauve",
                  )}
                  size={16}
                />
                System
              </DropdownAction>
            </DropdownItem>
            <DropdownItem>
              <DropdownAction
                className={clsx(
                  themeMode === "dark" && "bg-surface0/50 text-mauve",
                )}
                onClick={() => setThemeMode("dark")}
              >
                <Icon
                  name="dark_mode"
                  className={clsx(
                    "menu-item-icon",
                    themeMode === "dark" && "text-mauve",
                  )}
                  size={16}
                />
                Dark
              </DropdownAction>
            </DropdownItem>
            <DropdownItem>
              <DropdownAction
                className={clsx(
                  themeMode === "light" && "bg-surface0/50 text-mauve",
                )}
                onClick={() => setThemeMode("light")}
              >
                <Icon
                  name="light_mode"
                  className={clsx(
                    "menu-item-icon",
                    themeMode === "light" && "text-mauve",
                  )}
                  size={16}
                />
                Light
              </DropdownAction>
            </DropdownItem>
          </Dropdown>
          <button
            type="button"
            className="button button-secondary"
            onClick={onRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <span className="spinner" />
            ) : (
              <Icon
                name="sync"
                size={16}
                className={refreshing ? "spin" : ""}
              />
            )}{" "}
            Refresh all
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={onFetchAll}
            disabled={fetching}
          >
            {fetching ? (
              <span className="spinner" />
            ) : (
              <Icon name="cloud_download" size={16} />
            )}{" "}
            Fetch all
          </button>
          <button
            type="button"
            className="button button-primary"
            onClick={onAddRepo}
          >
            <Icon name="add" size={16} /> Add repo
          </button>
        </div>
      </div>
    </header>
  );
}
