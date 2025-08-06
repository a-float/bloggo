import { FaHeading } from "react-icons/fa6";

export default function HeadingIcon(props: { level: number }) {
  return (
    <div className="w-6">
      <FaHeading className="inline-block" />
      <sub>{props.level}</sub>
    </div>
  );
}
