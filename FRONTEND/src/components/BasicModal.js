import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

export default function BasicModal(props) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "50px",
    bgcolor: !props.modalTypeDanger ? "background.paper" : "#bc4123",
    color: !props.modalTypeDanger ? "black" : "#ffffff",
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

  return (
    <div>
      <Modal
        open={props.open}
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
