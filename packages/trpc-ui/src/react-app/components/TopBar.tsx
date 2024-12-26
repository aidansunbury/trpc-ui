import MailLockIcon from "@mui/icons-material/MailLockOutlined";
import Search from "@mui/icons-material/Search";
import { Chevron } from "@src/react-app/components/Chevron";
import { LogoSvg } from "@src/react-app/components/LogoSvg";
import { useHeadersContext } from "@src/react-app/components/contexts/HeadersContext";
import { useSearch } from "@src/react-app/components/contexts/SearchStore";
import { useIsMac } from "@src/react-app/components/hooks/useIsMac";
import type React from "react";

export function TopBar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { setHeadersPopupShown } = useHeadersContext();
  return (
    <div className="position-fixed top-0 right-0 left-0 flex h-16 w-full flex-row items-center justify-between border-b border-b-panelBorder bg-actuallyWhite bg-gray-50 px-4 pr-8 drop-shadow-sm">
      <div className="flex flex-row items-center gap-4">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle sidebar"
          aria-pressed={open}
        >
          {open ? (
            <Chevron className="h-4 w-4" direction="left" />
          ) : (
            <Chevron className="h-4 w-4" direction="right" />
          )}
        </button>
        <a
          href="https://github.com/aidansunbury/trpc-ui"
          target="_blank"
          className="flex flex-row items-center font-bold font-mono text-lg"
          rel="noreferrer"
        >
          <LogoSvg className="mr-2 h-10 w-10 rounded-lg" />
          tRPC.ui()
        </a>
      </div>
      <RouterSearchTooltip />
      <button
        onClick={() => setHeadersPopupShown(true)}
        className="rounded-sm border border-neutralSolidTransparent px-4 py-2 font-bold text-neutralText shadow-sm"
        type="button"
      >
        Headers
        <MailLockIcon className="ml-1 h-6 w-6" />
      </button>
    </div>
  );
}

// import Search from '@mui/icons-material/Search'
export function RouterSearchTooltip() {
  const searchOpen = useSearch((s) => s.searchOpen);
  const setSearchOpen = useSearch((s) => s.setSearchOpen);

  const isMac = useIsMac();
  const helperText = isMac ? "⌘ + P" : "Ctrl + P";
  if (searchOpen) return null;
  return (
    <button
      onClick={() => setSearchOpen(true)}
      type="button"
      className="flex flex-row items-center text-neutralSolidTransparent"
    >
      <Search fontSize="small" className="color-neutralSolidTransparent mr-2" />
      {helperText}
    </button>
  );
}
