import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function isValidPassword(password) {
    const minLength = 6;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpper && hasLower && hasDigit && hasSpecial && password.length >= minLength;
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isValidPassword(password)) {
      toast.error("Password must be at least 6 characters long and contain an uppercase letter, a lowercase letter, a digit, and a special character.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await axios.post("http://localhost:5000/api/user/register", {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
      });

      toast.success("Registered successfully!");
      localStorage.setItem("uid", firebaseUser.uid);
      navigate(`/search/${firebaseUser.uid}`, { replace: true });
    } catch (err) {
      console.error("Register failed:", err);
      toast.error("Registration failed.");
    }
  };

  return (
    <div className="register-container">
      <form id="register" onSubmit={handleRegister}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Create Account</h2>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <button type="submit">Submit</button>
        <p>Already have an account? <a href="/login">Login</a></p>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
