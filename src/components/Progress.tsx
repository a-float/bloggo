import clsx from "clsx";

type ProgressProps = {
  value: number;
  className?: string;
};

export default function Progress(props: ProgressProps) {
  return (
    <div
      className={clsx("radial-progress", props.className)}
      style={{ "--value": props.value } as React.CSSProperties}
      aria-valuenow={props.value}
      role="progressbar"
    >
      {props.value}%
    </div>
  );
}
