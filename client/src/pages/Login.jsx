import { useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "../api/useUser";
import { useUserStore } from "../store/useUserStore";
import { useEffect } from "react";

function Login() {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  const { mutateAsync, isPending } = useLogin();

  const from = location.state?.from?.pathname || "/home";

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      
      const response = await mutateAsync(data);
      setUser(response);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="h-dvh content-center">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-fit p-5 outline rounded-2xl space-y-3"
      >
        <h3 className="text-2xl font-semibold mb-5">Login</h3>
        <div>
          <label className="grid">
            <strong>Username</strong>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="outline p-2"
              required
            />
          </label>
        </div>
        <div>
          <label className="grid">
            <strong>Password</strong>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="outline p-2"
              required
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="outline mt-3 px-2 py-1 rounded-md disabled:opacity-30 cursor-pointer"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;