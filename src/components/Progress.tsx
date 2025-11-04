import clsx from "clsx";

type ProgressProps = {
  progress: number;
  className?: string;
};

export default function Progress(props: ProgressProps) {
  return (
    <div
      className={clsx("radial-progress", props.className)}
      style={{ "--value": props.progress } as React.CSSProperties}
      aria-valuenow={props.progress}
      role="progressbar"
    >
      {props.progress}%
    </div>
  );
}
