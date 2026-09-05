import { useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "../api/useUser";
import { useUserStore } from "../store/useUserStore";
import { useEffect } from "react";



function Login() {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate()
  const location = useLocation();

  // api hooks calls
  const { mutateAsync, isPending } = useLogin();

  const redirectPath = location?.state?.from?.pathname || '/home'

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const obj = new FormData(e.target);
      const formData = Object.fromEntries(obj)
      const data = await mutateAsync(formData)

      setUser(data)
    } catch (error) {
      console.error("Login error", error)
    }
  }

  useEffect(() => {
    if (user) {
      navigate(redirectPath, { replace: true })
      return
    }
  }, [user, navigate, redirectPath])

  return (
    <div className="h-dvh content-center ">
      <form onSubmit={handleSubmit} action="" className="mx-auto w-fit p-5 outline rounded-2xl space-y-3">
        <h3 className="text-2xl font-semibold mb-5 ">Login </h3>
        <div>
          <label className="grid ">
            <strong>Username</strong>
            <input type="text" name="username" placeholder="username " className="outline p-2" />
          </label>
        </div>
        <div>
          <label className="grid">
            <strong>Password</strong>
            <input type="text" name="password" placeholder="password" className="outline p-2" />
          </label>
        </div>
        <button type="submit" disabled={isPending} className="outline mt-3 px-2 py-1 rounded-md disabled:opacity-30">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login