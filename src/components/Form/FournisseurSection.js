import React, { useState, useEffect } from "react";
import { Grid, TextField, MenuItem } from "@mui/material";

const FournisseurSection = ({ formData, handleChange, setFormData }) => {
  const [fournisseurs, setFournisseurs] = useState([]);

  useEffect(() => {
    // Appel au fichier PHP pour récupérer les fournisseurs
    fetch("https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/fournisseurs.php")
      .then((response) => response.json())
      .then((data) => {
        setFournisseurs(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des fournisseurs :", error);
      });
  }, []);

  const handleFournisseurChange = (event) => {
    const selectedFournisseur = fournisseurs.find(
      (fournisseur) => fournisseur.intitule === event.target.value
    );

    // Met à jour les champs automatiquement
    setFormData({
      ...formData,
      fournisseur: event.target.value,
      adresseLivraison: formatAdresse(selectedFournisseur),
      adresseFacturation: formatAdresse(selectedFournisseur),
    });
  };

  const formatAdresse = (fournisseur) => {
    if (!fournisseur) return "";
    return `${fournisseur.intitule}\n${fournisseur.adresse}${
      fournisseur.complement ? ` ${fournisseur.complement}` : ""
    }\n${fournisseur.code_postal} ${fournisseur.ville}${
      fournisseur.pays ? `\n${fournisseur.pays}` : ""
    }`;
  };
  

  return (
    <Grid container spacing={2} sx={{ marginBottom: 2 }}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          select
          label="Fournisseur"
          name="fournisseur"
          value={formData.fournisseur}
          onChange={handleFournisseurChange}
          required
          error={!formData.fournisseur}
          helperText={!formData.fournisseur ? "Ce champ est requis" : ""}
        >
          {fournisseurs.map((fournisseur) => (
            <MenuItem key={fournisseur.intitule} value={fournisseur.intitule}>
              {fournisseur.intitule}
            </MenuItem>
          ))}
        </TextField>
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
  );
};

export default FournisseurSection;
