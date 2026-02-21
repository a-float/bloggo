import Avatar from "boring-avatars";

export default function AvatarWithFallback(props: {
  src?: string | null;
  name: string;
  className?: string;
}) {
  return props.src ? (
    <img className={props.className} src={props.src} alt={props.name} />
  ) : (
    <Avatar className={props.className} name={props.name} variant="beam" />
  );
}
