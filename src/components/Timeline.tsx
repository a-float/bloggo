import dayjs from "dayjs";

type TimelineProps = {
  items: { name: string; date: Date | null }[];
};

const checkSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="text-primary h-5 w-5"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
      clipRule="evenodd"
    />
  </svg>
);

export default function Timeline(props: TimelineProps) {
  if (props.items.length < 2) {
    return null;
  }

  return (
    <ul className="timeline timeline-vertical lg:timeline-horizontal lg:[&>li]:flex-1">
      {props.items.map((item, idx, arr) => (
        <li key={idx}>
          {idx > 0 && <hr />}
          <div className="timeline-start timeline-box">{item.name}</div>

          <div className="timeline-middle">{checkSvg}</div>
          {item.date ? (
            <div className="timeline-end text-sm">
              {dayjs(item.date).format("DD MMMM")}
            </div>
          ) : null}
          {idx < arr.length - 1 && (
            <hr
              className={dayjs(item.date).isBefore(dayjs()) ? "bg-primary" : ""}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
