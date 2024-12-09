import AddIcon from "@mui/icons-material/Add";
import React from "react";
export function AddItemButton({
  className,
  onClick,
}: {
  className?: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex h-10 flex-row items-center justify-center rounded-[4px] border border-neutralSolidTransparent bg-whiteTransparent hover:bg-whiteLessTransparent ${className ? className : ""}`}
      type="button"
      onClick={onClick}
    >
      Add <AddIcon />
    </button>
  );
}
