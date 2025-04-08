import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: "50px",
  bgcolor: "#FF2424",
  color: "white",
  borderRadius: "5px",
  boxShadow: 24,
  textAlign: "center",
  p: 4,
};

const contentStyle = {
  fontSize: "2.5rem",
  letterSpacing: "5px",
  fontFamily: "Poppins",
  padding: "20px 50px",
  fontWeight: "700",
};

export default function ErrorModal() {
  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={contentStyle}
          >
            {props.text}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
