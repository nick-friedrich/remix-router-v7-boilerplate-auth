import { Link } from "react-router";

export function Button({
  asAnchor,
  href,
  children,
  className,
  variant = "primary",
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  asAnchor?: boolean;
  href?: string;
  disabled?: boolean;
}) {
  const variantClass = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    success: "btn-success",
    error: "btn-error",
    warning: "btn-warning",
    info: "btn-info",
  };

  if (asAnchor) {
    return (
      <Link
        to={{ pathname: href }}
        className={`btn ${variantClass[variant]} ${className}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`btn ${variantClass[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
