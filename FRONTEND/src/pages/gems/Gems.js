import { useState, useContext } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { TextField, Checkbox, FormControlLabel, Button } from "@mui/material";
import AllCards from "../../components/AllCards";
import BasicModal from "../../components/BasicModal";
import { useTranslation } from "react-i18next";

import { AuthContext } from "../../context/auth-context";

export default function Gems(props) {
  const auth = useContext(AuthContext);
  const { gems } = useLoaderData();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [createGem, setCreateGem] = useState(false);
  const [title, setTitle] = useState("");
  const [origin, setOrigin] = useState("");
  const [reserved, setReserved] = useState(false);
  const buttonOrigin = createGem ? t("back") : t("create");

  // MODAL VARIABLES
  const [open, setOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalTypeDanger, setModalTypeDanger] = useState(false);

  const createHandler = () => {
    if (gems.length > 14) {
      setModalTypeDanger(true);
      setModalText(
        "The maximum GEM limit has been exceeded (max. 15 Gems in DB)."
      );
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        setModalTypeDanger(false);
      }, 3000);
    } else {
      setCreateGem((prev) => !prev);
    }
  };

  const createGemHandler = () => {
    const gem = { title, origin, reserved };

    fetch(process.env.REACT_APP_BACKEND_URL + "/gems", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.token,
      },
      body: JSON.stringify(gem),
    })
      .then((response) => {
        if (title === "") throw new Error("Please fill up the Title");
        if (origin.length < 5)
          throw new Error("Origin needs to be min. 5 characters long.");
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        } else {
          setModalText(t("recordCreated"));
          setOpen(true);
          setTitle("");
          setOrigin("");
          setReserved(false);
          setTimeout(() => {
            setOpen(false);
          }, 1500);
          setCreateGem((prev) => !prev);
          navigate("../../gems");
        }
      })

      .catch((err) => {
        setModalTypeDanger(true);
        setModalText(err.toString());
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
          setModalTypeDanger(false);
        }, 2000);
      });
  };

  return (
    <div>
      <ul className="gems" style={{ padding: "0px" }}>
        {auth.isLoggedIn && (
          <button className="Create" onClick={createHandler}>
            {buttonOrigin}
          </button>
        )}
        <div>
          {createGem && (
            <div className="createDiv">
              <TextField
                id="titleCreate"
                label={t("title")}
                variant="outlined"
                fullWidth
                style={{ margin: "5px 0px" }}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                id="titleOrigin"
                label={t("origin")}
                variant="outlined"
                fullWidth
                style={{ margin: "5px 0px" }}
                onChange={(e) => setOrigin(e.target.value)}
              />
              <FormControlLabel
                control={
                  <Checkbox onChange={(e) => setReserved(e.target.checked)} />
                }
                label={t("reserved")}
              />
              <Button
                variant="contained"
                style={{ display: "block", margin: "5px auto" }}
                onClick={createGemHandler}
              >
                {t("create")}
              </Button>
            </div>
          )}
        </div>
        <div className="gemsGrid">
          {gems.map((gem) => (
            <Link to={gem.id.toString()} key={gem.id}>
              <AllCards gem={gem} key={gem.id} />
            </Link>
          ))}
        </div>
      </ul>
      <BasicModal
        text={modalText}
        modalTypeDanger={modalTypeDanger}
        open={open}
      />
    </div>
  );
}

// data loader
export const gemsLoader = async () => {
  const res = await fetch(process.env.REACT_APP_BACKEND_URL + "/gems");
  return res.json();
};
