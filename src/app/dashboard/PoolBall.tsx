export default function PoolBall({
  kind,
  num,
}: {
  kind: "8" | "9";
  num: number | string;
}) {
  if (kind === "9") {
    return (
      <div className="poolball nine">
        <div className="poolball-num">{num}</div>
      </div>
    );
  }
  return (
    <div className="poolball eight">
      <div className="poolball-num">{num}</div>
    </div>
  );
}
