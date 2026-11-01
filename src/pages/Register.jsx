
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");

  function handleRegister(event) {
    event.preventDefault();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let existingUser = users.find(function (user) {
      return user.email === email;
    });

    if (existingUser) {
      alert("Email is already registered!");
      return;
    }

    let newUser = {
      name,
      email,
      phone,
      address,
      password,
      role
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration Successful!");
    navigate("/login");
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Select Role</label>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="tenant">Tenant</option>
          <option value="owner">Property Owner</option>
        </select>

        <button type="submit">Register</button>

        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
