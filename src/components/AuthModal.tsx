import { useContext, useState, type SubmitEventHandler } from "react";
import "../styles/AuthModal.css";
import { getUser, login, signup } from "../services/auth.services";
import { AuthContext } from "../contexts/AuthContext";
import type { AxiosError, AxiosResponse } from "axios";
// import { useToast } from "../contexts/ToastContext";

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // const { toast } = useToast();
  const { setUser } = useContext(AuthContext);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (mode === "login") {
        await login({ email, password });
      } else {
        await signup({ name, email, password, confirmPass: confirmPassword });
      }

      const user = await getUser();
      setUser(user);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
    } catch (error) {
      const err = error as AxiosError;
      const status = err.response?.status;
      const message = (err.response as AxiosResponse)?.data?.message;

      if (status === 404 || message === "User not found") {
        setError("No account found with this email. Try signing up.");
      } else if (status === 400 || message === "Invalid credentials") {
        setError("Incorrect password. Please try again.");
      } else if (status === 500) {
        setError("A server error occurred. Please try again later.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    setError(null);
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" aria-label="Close" onClick={onClose}>
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
                disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading
              ? mode === "login"
                ? "Signing in…"
                : "Creating account…"
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
