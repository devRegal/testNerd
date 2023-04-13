import "./Login.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const login = async (event) => {
    event.preventDefault();

    // Use this URL in development
    const functionUrl = "/.netlify/functions/login";

    // Use this URL in production
    // const functionUrl = "https://your-site.netlify.app/.netlify/functions/login";

    try {
      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.status === 200) {
        const { apiKey, secretApiKey } = await response.json();
        navigate("/dashboard", {
          state: { apiKey: apiKey, secretApiKey: secretApiKey },
        });
      } else {
        throw new Error("Invalid username or password.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Invalid username or password.");
    }
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <form>
        <input
          type={"text"}
          placeholder={"Username"}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type={"password"}
          placeholder={"Password"}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button type={"submit"} onClick={(event) => login(event)}>
          Login
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Login;
