import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Button,
  Paper,
} from "@mui/material";

const FormulaireDemande = () => {

  const [formData, setFormData] = useState({
    adresseLivraison: "",
    adresseFacturation: "",
    fournisseur: "",
    numeroPiece: "x-DA000475",
    copieDocument: false,
  });

  const today = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  console.log(today);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, copieDocument: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulaire soumis :", formData);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: "20px",
        maxWidth: "900px",
        margin: "20px auto",
        borderRadius: "10px",
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* En-tête */}
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h4" color="error" gutterBottom>
            LOGO
          </Typography>
          <Grid container justifyContent="space-between">
            <Typography variant="body1">
                <strong>Date :</strong> {today}
            </Typography>
            <Typography variant="body1">
              <strong>Initiateur de la demande :</strong> Admin 254
            </Typography>
          </Grid>
        </Box>

        {/* Section Adresse */}
        <Grid container spacing={3} sx={{ marginBottom: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Adresse de livraison"
              name="adresseLivraison"
              value={formData.adresseLivraison}
              onChange={handleChange}
              placeholder="Entrez l'adresse de livraison"
              required
              error={!formData.adresseLivraison}
              helperText={
                !formData.adresseLivraison ? "Ce champ est requis" : ""
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              multiline
              rows={4}
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

        {/* Section Fournisseur */}
        <Grid container spacing={3} sx={{ marginBottom: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fournisseur"
              name="fournisseur"
              value={formData.fournisseur}
              onChange={handleChange}
              placeholder="Entrez le nom du fournisseur"
              required
              error={!formData.fournisseur}
              helperText={!formData.fournisseur ? "Ce champ est requis" : ""}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Numéro de pièce"
              name="numeroPiece"
              value={formData.numeroPiece}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
        </Grid>

        {/* Checkbox */}
        <Box sx={{ marginBottom: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.copieDocument}
                onChange={handleCheckboxChange}
                name="copieDocument"
              />
            }
            label={
              <Typography variant="body1">
                Recevoir une copie du document une fois validé
              </Typography>
            }
          />
        </Box>

        {/* Bouton de soumission */}
        <Box sx={{ textAlign: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ textTransform: "none" }}
          >
            Soumettre
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default FormulaireDemande;