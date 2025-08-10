import LogoSVG from "../icons/trip-control-logo";

export default function Logo({
  width = 32,
  height = 32,
  className = "",
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <LogoSVG
      width={width}
      height={height}
      className={className}
      color="currentColor"
    />
  );
}
