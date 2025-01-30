import { Link } from "react-router";
import { Button } from "~/components/common/button";
import Input from "~/components/common/input";

export default function Login() {
  return (
    <div className="flex flex-col items-center  gap-4 my-12">
      <h1 className="text-2xl font-bold">Login</h1>
      <div className="flex bg-base-100 p-8 rounded-xl flex-col  gap-4 min-w-[300px] shadow-sm">
        <div className="flex flex-col gap-1">
          <Input label="E-Mail" placeholder="E-Mail" type="text" name="email" />
          <Input
            label="Password"
            placeholder="Password"
            type="password"
            name="password"
          />
        </div>
        <Button variant="primary">Login</Button>
        <Button variant="secondary" asAnchor href="/auth/login/otp">
          Login via Magic Link
        </Button>
        <Link to={{ pathname: "/auth/signup" }} className="text-sm">
          Don't have an account? <b>Sign up</b>
        </Link>
        <Link to={{ pathname: "/auth/forgot-password" }} className="text-sm">
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
