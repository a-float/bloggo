import clsx from "clsx";

export default function Spinner({ className }: { className?: string }) {
  return <span className={clsx("loading loading-spinner", className)} />;
}
