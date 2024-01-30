export default function CustomContainer({
  children,
  className = undefined,
  childWrapperClassName = undefined,
  col = "col-xs-12 col-xl-10",
  containerBreakPoint = "xl"
}) {
  return (
    <>
      <div className={`container-${containerBreakPoint} ${className || ""}`}>
        <div className={`${ childWrapperClassName || "row justify-content-center"}`}>
          <div className={col}>{children}</div>
        </div>
      </div>
    </>
  );
}
