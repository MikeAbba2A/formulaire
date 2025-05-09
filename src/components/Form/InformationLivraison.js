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
            required 
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
        <FileUpload handleFileChange={handleFileChange} selectedFiles={selectedFiles} />
      </Grid>
    </Box>
  );
};

export default InformationLivraison;
