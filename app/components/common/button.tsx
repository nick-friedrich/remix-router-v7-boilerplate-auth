import { Link } from "react-router";

export function Button({
  asAnchor,
  href,
  children,
  className,
  variant = "primary",
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  asAnchor?: boolean;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
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
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`btn ${variantClass[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
