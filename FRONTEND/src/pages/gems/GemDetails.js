import { useState, useEffect, useContext } from "react";
import { useLoaderData, useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Typography,
} from "@mui/material";
import EditCard from "../../components/EditCard";
import BasicModal from "../../components/BasicModal";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/auth-context";

let gemsLength;

export default function GemDetails(props) {
  const auth = useContext(AuthContext);
  const { id } = useParams();
  const { gem } = useLoaderData();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [editGem, setEditGem] = useState(true);
  const [title, setTitle] = useState(gem.title);
  const [origin, setOrigin] = useState(gem.origin);
  const [reserved, setReserved] = useState(gem.reserved);
  const originEditButton = editGem ? t("edit") : t("back");
  const [deleteGemState, setDeleteGemState] = useState(false);

  const gemPom = { title, origin, reserved };

  // MODAL VARIABLES
  const [open, setOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalTypeDanger, setModalTypeDanger] = useState(false);

  const handleYesDelete = () => {
    const response = fetch(`${process.env.REACT_APP_BACKEND_URL}/gems/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + auth.token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        navigate("../../gems/");
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

  const handleNoDelete = () => {
    navigate("../../gems/");
  };

  useEffect(() => {
    let controller = new AbortController();
    (async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + "/gems",
          {
            signal: controller.signal,
          }
        );
        const { gems } = await response.json();
        gemsLength = gems.length;
        controller = null;
      } catch (e) {
        // Handle fetch error
      }
    })();
    return () => controller?.abort();
  }, []);

  const changeGem = (id) => {
    const response = fetch(`${process.env.REACT_APP_BACKEND_URL}/gems/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.token,
      },
      body: JSON.stringify(gemPom),
    })
      .then((response) => {
        if (title === "") throw new Error("Please fill up the Title");
        if (origin.length < 5)
          throw new Error("Origin needs to be min. 5 characters long.");
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }

        setModalText(t("recordChanged"));
        setOpen(true);

        setTimeout(() => {
          setOpen(false);
          setEditGem((prev) => !prev);
          navigate("../../gems/" + id);
        }, 1500);
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

  const handleEditClick = () => {
    setDeleteGemState(false);
    setTitle(gem.title);
    setOrigin(gem.origin);
    setReserved(gem.reserved);
    setEditGem((prev) => !prev);
  };

  const handeDeleteClick = () => {
    if (gemsLength < 11) {
      setModalTypeDanger(true);
      setModalText(
        "The minimum GEM limit has been exceeded (min. 10 Gems in DB)."
      );
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        setModalTypeDanger(false);
      }, 2000);
    } else {
      setDeleteGemState((prev) => !prev);
    }
  };

  return (
    <div>
      <div>
        {editGem && (
          <button className="gemBtn" onClick={() => navigate("../../gems")}>
            {t("back")}
          </button>
        )}
        {auth.isLoggedIn && (
          <button className="gemBtn" onClick={handleEditClick}>
            {originEditButton}
          </button>
        )}
        {auth.isLoggedIn && editGem && (
          <button className="gemBtn" onClick={handeDeleteClick}>
            {t("delete")}
          </button>
        )}
      </div>
      {deleteGemState && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          // marginTop="5rem"
          bgcolor="background.paper"
          p={2}
        >
          <Typography
            variant="h6"
            gutterBottom
            padding="0.5rem 0.8rem"
            borderRadius="10px"
            sx={{ backgroundColor: "#bc4123", color: "white" }}
          >
            Do you want to DELETE the Gem?
          </Typography>
          <Box display="flex" gap={2} marginTop="0.5rem">
            <Button
              variant="contained"
              color="primary"
              onClick={handleYesDelete}
            >
              YES
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleNoDelete}
            >
              NO
            </Button>
          </Box>
        </Box>
      )}
      {editGem ? (
        <div className="gem-details">
          <EditCard gem={gem} key={gem.id} width="400px" height="400px" />
        </div>
      ) : (
        <div className="createDiv">
          <TextField
            value={title}
            required
            id="titleCreate"
            label={t("title")}
            variant="outlined"
            fullWidth
            style={{ margin: "5px 0px" }}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <TextField
            value={origin}
            required
            id="titleOrigin"
            label={t("origin")}
            variant="outlined"
            fullWidth
            style={{ margin: "5px 0px" }}
            onChange={(e) => setOrigin(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={reserved}
                onChange={(e) => setReserved(e.target.checked)}
              />
            }
            label={t("reserved")}
          />
          <Button
            variant="contained"
            style={{ display: "block", margin: "5px auto" }}
            //onClick={changeGem(id)}
            onClick={() => changeGem(id)}
          >
            {t("change")}
          </Button>
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <EditCard gem={gemPom} key={gem.id} width="400px" height="400px" />
          </div>
        </div>
      )}
      <BasicModal
        text={modalText}
        modalTypeDanger={modalTypeDanger}
        open={open}
      />
    </div>
  );
}

// data loader
export const gemDetailsLoader = async ({ params }) => {
  const { id } = params;
  const res = await fetch(process.env.REACT_APP_BACKEND_URL + "/gems/" + id);
  return res.json();
};
