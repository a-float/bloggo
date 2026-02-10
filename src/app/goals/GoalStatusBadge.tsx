import { GoalDto } from "@/data/goal-dto";
import clsx from "clsx";
import dayjs from "dayjs";
import { FaRocket, FaTrophy } from "react-icons/fa6";

export default function GoalStatusBadge(props: {
  goal: GoalDto;
  className?: string;
}) {
  if (props.goal.status === "COMPLETED") {
    return (
      <span className={clsx("badge badge-success badge-md", props.className)}>
        <FaTrophy />
        Completed on {dayjs(props.goal.completedAt).format("DD MMM YYYY")}
      </span>
    );
  }
  if (props.goal.status === "ACTIVE") {
    return (
      <span className={clsx("badge badge-info badge-md", props.className)}>
        <FaRocket />
        Active
      </span>
    );
  }
}
