import { Link } from "react-router";
import { Button } from "~/components/common/button";
import Input from "~/components/common/input";

export default function Signup() {
  return (
    <div className="flex flex-col items-center  gap-4 my-12">
      <h1 className="text-2xl font-bold">Create an account</h1>
      <div className="flex bg-base-100 p-8 rounded-xl flex-col  gap-4 min-w-[300px] shadow-sm">
        <div className="flex flex-col gap-1">
          <Input label="E-Mail" placeholder="E-Mail" type="text" name="email" />
          <Input
            label="Password"
            placeholder="Password"
            type="password"
            name="password"
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
          />
        </div>

        <Button>Sign up</Button>
        <Link to={{ pathname: "/auth/login" }} className="text-sm">
          Already have an account? <b>Login</b>
        </Link>
      </div>
    </div>
  );
}
