export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  const classes = ["btn", `btn-${variant}`, className].filter(Boolean).join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
