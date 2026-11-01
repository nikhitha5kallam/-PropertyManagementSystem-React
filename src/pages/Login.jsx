
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");

  function handleLogin(event) {
    event.preventDefault();

    // Admin Login
    if (role === "admin") {
      if (
        email === "nikhitha.kallam@gmail.com" &&
        password === "admin123"
      ) {
        localStorage.setItem("currentUser", email);
        localStorage.setItem("role", "admin");

        alert("Admin Login Successful!");
        navigate("/admin");
      } else {
        alert("Invalid Admin Email or Password!");
      }

      return;
    }

    // Tenant and Owner Login
    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(function (user) {
      return (
        user.email === email &&
        user.password === password &&
        user.role === role
      );
    });

    if (!user) {
      alert("Invalid Email, Password or Selected Role!");
      return;
    }

    localStorage.setItem("currentUser", user.email);
    localStorage.setItem("role", user.role);

    alert("Login Successful!");

    if (role === "owner") {
      navigate("/owner");
    } else {
      navigate("/tenant");
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login to Your Account</h2>

        <label>Login As</label>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="admin">Admin</option>
          <option value="tenant">Tenant</option>
          <option value="owner">Property Owner</option>
        </select>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
