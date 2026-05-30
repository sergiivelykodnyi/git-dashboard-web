import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useRef,
  useId,
} from "react";
import type { ComponentProps } from "react";
import clsx from "clsx";
import { ButtonIcon } from "./Button";

interface DropdownContextType {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  menuId: string;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

function useDropdown() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error(
      "Dropdown components must be rendered within a <Dropdown> provider",
    );
  }
  return context;
}

export function Dropdown(props: ComponentProps<"div">) {
  const { children, className, ...rest } = props;
  const [isOpenMenu, setMenu] = useState(false);
  const triggerId = useId();
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on Escape press or when clicking outside
  useEffect(() => {
    if (!isOpenMenu) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        // Put focus back on the trigger button
        const trigger = document.getElementById(triggerId);
        trigger?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpenMenu, triggerId]);

  return (
    <DropdownContext.Provider
      value={{
        isOpen: isOpenMenu,
        setOpen: setMenu,
        triggerId,
        menuId,
      }}
    >
      <div
        ref={containerRef}
        className={clsx("menu-wrapper", className)}
        {...rest}
      >
        <ButtonIcon
          id={triggerId}
          className="bg-transparent hover:not-disabled:bg-surface0"
          icon="more_vert"
          title="More actions"
          aria-haspopup="menu"
          aria-expanded={isOpenMenu}
          aria-controls={menuId}
          onClick={() => setMenu((isOpen) => !isOpen)}
        />
        {isOpenMenu && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setMenu(false)}
            />
            <DropdownMenu>{children}</DropdownMenu>
          </>
        )}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenu(props: ComponentProps<"ul">) {
  const { children, className, onClick, ...rest } = props;
  const { menuId, triggerId } = useDropdown();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLUListElement>) => {
      e.stopPropagation();
      onClick?.(e);
    },
    [onClick],
  );

  return (
    <ul
      id={menuId}
      role="menu"
      aria-labelledby={triggerId}
      className={clsx("menu", className)}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </ul>
  );
}

export function DropdownItem(props: ComponentProps<"li">) {
  const { children, className, ...rest } = props;

  return (
    <li role="none" className={className} {...rest}>
      {children}
    </li>
  );
}

export function DropdownItemSeparator(props: ComponentProps<"li">) {
  const { className, ...rest } = props;

  return (
    <li
      role="separator"
      className={clsx("menu-separator", className)}
      {...rest}
    />
  );
}

export function DropdownAction(props: ComponentProps<"button">) {
  const { children, className, onClick, ...rest } = props;
  const { setOpen } = useDropdown();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // Close dropdown when an action is clicked
      setOpen(false);
      onClick?.(e);
    },
    [onClick, setOpen],
  );

  return (
    <button
      role="menuitem"
      className={clsx("menu-item", className)}
      type="button"
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
}
