import React from "react";
import { Grid, TextField } from "@mui/material";

const AdresseSection = ({ formData, handleChange }) => {
  return (
    <Grid container spacing={3} sx={{ marginBottom: 3 }}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          multiline
          rows={1}
          variant="outlined"
          label="Adresse de livraison"
          name="adresseLivraison"
          value={formData.adresseLivraison}
          onChange={handleChange}
          placeholder="Entrez l'adresse de livraison"
          required
          error={!formData.adresseLivraison}
          helperText={!formData.adresseLivraison ? "Ce champ est requis" : ""}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          multiline
          rows={1}
          variant="outlined"
          label="Adresse de facturation"
          name="adresseFacturation"
          value={formData.adresseFacturation}
          onChange={handleChange}
          placeholder="Entrez l'adresse de facturation"
          required
          error={!formData.adresseFacturation}
          helperText={
            !formData.adresseFacturation ? "Ce champ est requis" : ""
          }
        />
      </Grid>
    </Grid>
  );
};

export default AdresseSection;
