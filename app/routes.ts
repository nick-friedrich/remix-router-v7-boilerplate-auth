import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  layout("components/layout/layout.tsx", [
    index("routes/home.tsx"),
    route("dashboard", "routes/dashboard.tsx"),
    ...prefix("auth", [
      route("login", "routes/auth/login.tsx"),
      route("login/otp", "routes/auth/login-otp.tsx"),
      route("login/otp/validate", "routes/auth/login-validate-otp.tsx"),
      route("signup", "routes/auth/signup.tsx"),
      route("forgot-password", "routes/auth/forgot-password.tsx"),
      route("reset-password", "routes/auth/reset-password.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
