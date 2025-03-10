import React from "react";
import { Box, Grid, TextField, Typography } from "@mui/material";
import FileUpload from "../Form/pieces_jointes";

const InformationLivraison = ({ formData, handleChange, handleFileChange, selectedFiles }) => {
  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h6" gutterBottom>
        Information livraison
      </Typography>
      <Grid container spacing={2} alignItems="center">
        {/* Date de réception envisagée */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            type="date"
            label="Date de réception envisagée"
            name="dateReception"
            value={formData.dateReception}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        {/* Description de la demande */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            multiline
            rows={1}
            label="Description de la demande"
            name="descriptionDemande"
            value={formData.descriptionDemande}
            onChange={handleChange}
          />
        </Grid>

        {/* Justification */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            multiline
            rows={1}
            label="Justification"
            name="justification"
            value={formData.justification}
            onChange={handleChange}
          />
        </Grid>

        {/* Pièce jointe */}
        {/* <Grid item xs={12} md={3}>
          <Typography variant="body1" gutterBottom>
            Pièce jointe
          </Typography>
          <input
            type="file"
            name="pieceJointe[]"
            onChange={handleFileChange}
            multiple
            style={{
              display: "block",
              padding: "10px 0",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "100%",
            }}
          />
          <Typography variant="body2" color="textSecondary">
            {formData.pieceJointe
              ? formData.pieceJointe.name
              : "Aucun fichier sélectionné."}
          </Typography>
        </Grid> */}
        <FileUpload handleFileChange={handleFileChange} selectedFiles={selectedFiles} />
      </Grid>
    </Box>
  );
};

export default InformationLivraison;
