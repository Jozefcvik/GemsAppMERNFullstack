import React, { useContext, useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import imageDiamond from "../images/Diamond02.png";
import imageDiamond2 from "../images/Diamond22.png";
import {
  Hidden,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LanguageMenu from "../components/LanguageMenu";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/auth-context";

export default function RootLayout(props) {
  const auth = useContext(AuthContext);
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="root-layout">
      <header className={props.mode !== "dark" ? "headerLight" : "headerDark"}>
        <nav>
          <img
            src={props.mode !== "dark" ? imageDiamond : imageDiamond2}
            style={{ height: "40px" }}
          ></img>
          <h1>Steinoo</h1>

          <LanguageMenu />

          <Box
            sx={{
              justifyContent: "center",
              bgcolor: "background.default",
              color: "text.primary",
              borderRadius: 1,
              marginRight: "15px",
            }}
          >
            <IconButton
              sx={{ ml: 1, color: "inherit" }}
              onClick={props.handleChange}
            >
              {props.mode !== "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </Box>

          <div
            className={
              props.mode !== "dark" ? "rootLinksLight" : "rootLinksDark"
            }
          >
            <Hidden smDown>
              <NavLink to="/">{t("home")}</NavLink>
              <NavLink to="gems">{t("gems")}</NavLink>
              <NavLink to="about">{t("about")}</NavLink>
              {!auth.isLoggedIn && <NavLink to="login">{t("login")}</NavLink>}
              {auth.isLoggedIn && <NavLink to="logout">Logout</NavLink>}
            </Hidden>
            <Hidden smUp>
              <IconButton
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                className="minMenu"
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <div
                  className={
                    props.mode !== "dark" ? "minLinksLight" : "minLinksDark"
                  }
                >
                  <MenuItem onClick={handleClose}>
                    <NavLink to="/">{t("home")}</NavLink>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <NavLink to="gems">{t("gems")}</NavLink>
                  </MenuItem>

                  <MenuItem onClick={handleClose}>
                    <NavLink to="about">{t("about")}</NavLink>
                  </MenuItem>
                  {!auth.isLoggedIn && (
                    <MenuItem onClick={handleClose}>
                      <NavLink to="login">{t("login")}</NavLink>
                    </MenuItem>
                  )}
                  {auth.isLoggedIn && (
                    <MenuItem onClick={handleClose}>
                      <NavLink to="logout">logout</NavLink>
                    </MenuItem>
                  )}
                </div>
              </Menu>
            </Hidden>
            {auth.isLoggedIn && props.leftMinutes && (
              <Typography
                className={
                  Number(props.leftMinutes) + Number(props.leftSeconds) > 30
                    ? ""
                    : "blink_me"
                }
                color="error"
                variant="body2"
                sx={{ marginLeft: "0.3rem" }}
              >
                {props.leftMinutes}:{props.leftSeconds}
              </Typography>
            )}
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
