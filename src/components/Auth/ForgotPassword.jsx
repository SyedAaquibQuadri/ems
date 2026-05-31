import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../utils/firebase";
import {
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsGoogleAccount(false);
    setLoading(true);

    try {
      // Step 1: Check what sign-in methods exist for this email
      const methods = await fetchSignInMethodsForEmail(auth, email);

      // Step 2: No account found in Firebase
      if (methods.length === 0) {
        // Intentionally vague for security — don't confirm whether account exists
        setMessage(
          "If an account with this email exists, you'll receive a reset link shortly."
        );
        setLoading(false);
        return;
      }

      // Step 3: Account exists but uses Google OAuth — no password to reset
      if (methods.includes("google.com") && !methods.includes("password")) {
        setIsGoogleAccount(true);
        setLoading(false);
        return;
      }

      // Step 4: Normal email/password account — send reset email
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Password reset email sent! Check your inbox (and spam folder)."
      );
    } catch (err) {
      // Handle any unexpected Firebase errors
      switch (err.code) {
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please wait a few minutes and try again.");
          break;
        default:
          setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h2>
        <p className="text-gray-500 text-sm mb-6">
          Enter your email and we'll help you get back in.
        </p>

        {/* Google account notice */}
        {isGoogleAccount && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 mb-4 text-sm">
            <p className="font-semibold mb-1">This account uses Google Sign-In</p>
            <p>
              You signed up with Google, so there's no password to reset.
              Please use the{" "}
              <Link to="/login" className="underline font-medium">
                "Continue with Google"
              </Link>{" "}
              button on the login page.
            </p>
          </div>
        )}

        {/* Success message */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-4 text-sm">
            {message}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Only show form if not a confirmed Google account */}
        {!isGoogleAccount && !message && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Checking..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {/* Reset button if they typed wrong email */}
        {(isGoogleAccount || message) && (
          <button
            onClick={() => {
              setIsGoogleAccount(false);
              setMessage("");
              setEmail("");
            }}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Try a different email
          </button>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;