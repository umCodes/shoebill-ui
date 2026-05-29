import { useContext, useState, type SubmitEventHandler } from "react";
import "../styles/AuthModal.css";
import { getUser, login, signup } from "../services/auth.services";
import { AuthContext } from "../contexts/AuthContext";
import type { AxiosError, AxiosResponse } from "axios";
import { useToast } from "../contexts/ToastContext";

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast()
  const {setUser} = useContext(AuthContext)
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault(); 
    try {
      if (mode === "login") await login({
            email,
            password
        })
      else await signup({
              name,
              email,
              password,
              confirmPass: confirmPassword
          })

      const user = await getUser()
      setUser(user)
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
    } catch (error) {
      const err = error as AxiosError
      const {message} = (err.response as AxiosResponse).data
      console.log(message)
      if (message === "User not found") toast("No account found with this email. Try Signing Up.", "error")
    }
  };

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    // setEmail("");
    // setPassword("");
    // setConfirmPassword("");
    // setName("");
  };

  return (
    <div className="auth-overlay" >
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close"  aria-label="Close" onClick={onClose}>
          ✕
        </button>

        <div className="auth-header">
          <h1>Welcome</h1>
          <p>
            {mode === "login"
              ? "Sign in to your account"
              : "Create your account"}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Login
          </button>
          <button
            className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === "signup" && (
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="auth-submit" >
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* <div className="auth-divider">
          <span>or</span>
        </div>

        <button className="auth-social">Continue with Google</button> */}
      </div>
    </div>
  );
}