import React, { useState, useContext } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import BasicModal from "../components/BasicModal";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

export default function Login() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalTypeDanger, setModalTypeDanger] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setError("");

    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      } else {
        setModalTypeDanger(false);
        setModalText("You are logged.");
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
          navigate("../../gems");
          auth.login(responseData.userId, responseData.token);
        }, 2000);
      }
    } catch (err) {
      setModalTypeDanger(true);
      setModalText(err.message.toString());
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        setModalTypeDanger(false);
      }, 2000);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ marginTop: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "5rem",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        {error && (
          <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </Box>
      <BasicModal
        text={modalText}
        modalTypeDanger={modalTypeDanger}
        open={open}
      />
    </Container>
  );
}
