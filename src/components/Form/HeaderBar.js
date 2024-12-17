import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const HeaderBar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#00a292", padding: 1 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          CIRCUIT ACHAT - Formulaire de demande d'achat
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
