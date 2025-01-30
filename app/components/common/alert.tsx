const style = {
  default: "alert",
  info: "alert alert-info",
  error: "alert alert-error",
  success: "alert alert-success",
  warning: "alert alert-warning",
  "default-soft": "alert alert-soft",
  "info-soft": "alert alert-info alert-soft",
  "error-soft": "alert alert-error alert-soft",
  "success-soft": "alert alert-success alert-soft",
  "warning-soft": "alert alert-warning alert-soft",
  "default-outline": "alert alert-outline",
  "info-outline": "alert alert-info alert-outline",
  "error-outline": "alert alert-error alert-outline",
  "success-outline": "alert alert-success alert-outline",
  "warning-outline": "alert alert-warning alert-outline",
};

type AlertProps = {
  message: string;
  icon?: React.ReactNode;
  variant?: keyof typeof style;
  className?: string;
  actions?: React.ReactNode;
};

export default function Alert({
  message,
  icon,
  variant = "default",
  className,
  actions,
}: AlertProps) {
  return (
    <div
      role="alert"
      className={
        style[variant] + " alert-vertical sm:alert-horizontal " + className
      }
    >
      {icon}
      <span>{message}</span>
      {actions && <div>{actions}</div>}
    </div>
  );
}
