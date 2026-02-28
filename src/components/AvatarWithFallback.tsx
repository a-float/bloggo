import Avatar from "boring-avatars";

export default function AvatarWithFallback(props: {
  src?: string | null;
  name: string;
  className?: string;
}) {
  return (
    <Avatar className={props.className} name={props.name} variant="beam" />
  );
  // Ignore avatar src untill google avatar 439 fetch is resolved
  // return props.src ? (
  //   <img className={props.className} src={props.src} alt={props.name} />
  // ) : (
  //   <Avatar className={props.className} name={props.name} variant="beam" />
  // );
}
