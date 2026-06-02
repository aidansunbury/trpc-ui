import AddIcon from "@mui/icons-material/Add";
export function AddItemButton({
  className,
  onClick,
}: {
  className?: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex h-10 flex-row items-center justify-center rounded-sm border border-neutral-solid-transparent bg-white-transparent hover:bg-white-less-transparent ${className ? className : ""}`}
      type="button"
      onClick={onClick}
    >
      Add <AddIcon />
    </button>
  );
}
