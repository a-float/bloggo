import Avatar from "boring-avatars";

export default function AvatarWithFallback(props: {
  src?: string | null;
  name: string;
}) {
  return props.src ? (
    <img src={props.src} alt={props.name} />
  ) : (
    <Avatar name={props.name} variant="beam" />
  );
}
