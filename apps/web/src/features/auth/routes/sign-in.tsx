import { useState } from "react";
import { authClient } from "../auth-client";
import { useNavigate } from "react-router";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submitNewUser = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      email,
      password,
    };

    await authClient.signIn.email(
      {
        ...formData,
      },
      {
        onRequest: () => {
          //show loading
        },
        onSuccess: () => {
          //redirect to the dashboard or sign in page
          navigate("/dashboard");
        },
        onError: (ctx) => {
          // display the error message
          alert(ctx.error.message);
        },
      },
    );
  };

  return (
    <form className="space-y-2 m-2" onSubmit={submitNewUser}>
      <div>
        <label>
          Email:{" "}
          <input
            className="border border-black-300 rounded-sm"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Password:{" "}
          <input
            className="border border-black-300 rounded-sm"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <div>
        <button
          type="submit"
          className="border px-4 py-2 rounded-sm bg-gray-300"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
