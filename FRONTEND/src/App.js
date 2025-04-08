import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import React, { useCallback, useEffect } from "react";
import { useState } from "react";

// pages
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import Gems, { gemsLoader } from "./pages/gems/Gems";
import GemDetails, { gemDetailsLoader } from "./pages/gems/GemDetails";

// layouts
import RootLayout from "./layouts/RootLayout";
import GemsLayout from "./layouts/GemsLayout";

// Auth
import { AuthContext } from "./context/auth-context";

// mui
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

let logoutTimer;
let timer;

function App() {
  const [darkMode, setDarkMode] = useState(null);

  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  const [leftMinutes, setLeftMinutes] = useState();
  const [leftSeconds, setLeftSeconds] = useState();

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate01 =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate01);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate01.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    clearTimeout(logoutTimer);
    clearInterval(timer);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);

      if (remainingTime < 0) {
        logout();
      }

      timer = setInterval(() => {
        const pomTime = Math.floor((tokenExpirationDate - new Date()) / 1000);
        setLeftMinutes(String(Math.floor(pomTime / 60)).padStart(2, "0"));
        setLeftSeconds(String(pomTime % 60).padStart(2, "0"));
        const min = String(Math.floor(pomTime / 60)).padStart(2, "0");
        const sec = String(pomTime % 60).padStart(2, "0");
      }, 1000);
    } else {
      clearTimeout(logoutTimer);
      clearInterval(timer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  let router;

  router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={
          <RootLayout
            mode={theme.palette.mode}
            check={darkMode}
            leftMinutes={leftMinutes}
            leftSeconds={leftSeconds}
            handleChange={() => setDarkMode(!darkMode)}
          />
        }
      >
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="gems" element={<GemsLayout />}>
          <Route index element={<Gems />} loader={gemsLoader} />
          <Route
            path=":id"
            element={<GemDetails />}
            loader={gemDetailsLoader}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
