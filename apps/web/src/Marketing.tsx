import { Link } from "react-router";

export function Marketing() {
  return (
    <div>
      <div>
        <Link to="/auth/sign-in">sign in</Link>
      </div>
      <div>
        <Link to="/auth/sign-up">sign up</Link>
      </div>
    </div>
  );
}
