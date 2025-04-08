import React, { useContext } from "react";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; // If you're using React Router for navigation
import { AuthContext } from "../context/auth-context";

export default function Logout() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("../../");
  };

  const handleBack = () => {
    navigate("../../");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      marginTop="5rem"
      bgcolor="background.paper"
      p={2}
    >
      <Typography variant="h4" gutterBottom>
        You have logged out
      </Typography>
      <Box display="flex" gap={2} marginTop="2rem">
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleBack}>
          Go to Home
        </Button>
      </Box>
    </Box>
  );
}
