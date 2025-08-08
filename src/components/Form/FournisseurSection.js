// export default FournisseurSection;

import React, { useState, useEffect } from "react";
import { Grid, TextField, Autocomplete } from "@mui/material";
import { racineAPI } from "../_config/config";

const FournisseurSection = ({ formData, handleChange, setFormData }) => {
  const [fournisseurs, setFournisseurs] = useState([]);

  useEffect(() => {
    // Appel au fichier PHP pour récupérer les fournisseurs
    fetch(`${racineAPI}fournisseurs.php`)
      .then((response) => response.json())
      .then((data) => {
        // on rend unique les fournisseurs par intitule
        const uniqueFournisseurs = [...new Set(data.map((f) => f.intitule))];
        setFournisseurs(uniqueFournisseurs);
        setFournisseurs(data);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des fournisseurs :",
          error
        );
      });
  }, []);

  const handleFournisseurChange = (event, value) => {
    const selectedFournisseur = fournisseurs.find(
      (fournisseur) => fournisseur.intitule === value
    );

    // Met à jour les champs automatiquement
    setFormData({
      ...formData,
      fournisseur: value || "", // Si aucun fournisseur n'est sélectionné, valeur vide
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
      {/* Fournisseur avec auto-complétion */}
      <Grid item xs={12} md={6}>
        <Autocomplete
          freeSolo
          options={fournisseurs.map((f) => f.intitule)}
          value={formData.fournisseur || ""}
          onChange={handleFournisseurChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Fournisseur"
              required
              error={!formData.fournisseur}
              helperText={!formData.fournisseur ? "Ce champ est requis" : ""}
            />
          )}
        />
      </Grid>

      {/* Numéro de pièce */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Numéro de pièce"
          name="numeroPiece"
          value={formData.numeroPiece || ""}
          InputProps={{ readOnly: true }}
          variant="outlined"
          disabled
        />
      </Grid>
    </Grid>
  );
};

export default FournisseurSection;
