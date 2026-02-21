import clsx from "clsx";

export default function BadgeRow(props: {
  className?: string;
  tags: string[];
}) {
  return (
    <div
      className={clsx(
        "flex flex-wrap-reverse gap-x-1 gap-y-1.5 overflow-auto scrollbar-hide",
        props.className
      )}
    >
      {props.tags.map((tag) => (
        <div
          key={tag}
          className="badge not-hover:badge-ghost badge-sm hover:badge-primary transition-colors cursor-pointer"
        >
          {tag}
        </div>
      ))}
    </div>
  );
}
