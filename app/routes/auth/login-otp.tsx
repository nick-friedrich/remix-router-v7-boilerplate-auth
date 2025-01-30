import { Link } from "react-router";
import { Button } from "~/components/common/button";
import Input from "~/components/common/input";

export default function Login() {
  return (
    <div className="flex flex-col items-center  gap-4 my-12">
      <h1 className="text-2xl font-bold">Login with OTP</h1>
      <div className="flex bg-base-100 p-8 rounded-xl flex-col  gap-4 min-w-[300px] shadow-sm">
        <div className="flex flex-col gap-1">
          <Input label="E-Mail" placeholder="E-Mail" type="text" name="email" />
        </div>
        <Button variant="primary">Send Magic Link</Button>
        <Button variant="secondary" asAnchor href="/auth/login">
          Login with password
        </Button>
        <Link to={{ pathname: "/auth/signup" }} className="text-sm">
          Don't have an account? <b>Sign up</b>
        </Link>
      </div>
    </div>
  );
}
