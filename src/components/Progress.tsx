import clsx from "clsx";

type ProgressProps = {
  value: number;
  className?: string;
};

export default function Progress(props: ProgressProps) {
  return (
    <div className="relative">
      <div
        className={clsx("radial-progress absolute opacity-15", props.className)}
        style={{ "--value": 100 } as React.CSSProperties}
      />
      <div
        className={clsx("radial-progress", props.className)}
        style={{ "--value": props.value } as React.CSSProperties}
        aria-valuenow={props.value}
        role="progressbar"
      >
        {Math.round(props.value)}%
      </div>
    </div>
  );
}
