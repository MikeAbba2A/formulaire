import React from "react";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";

const CheckboxSection = ({ formData, handleCheckboxChange }) => {
  return (
    <Box
  sx={{
    marginBottom: 3,
    display: "flex",
    gap: 3,
    justifyContent: "center", // Centre le contenu horizontalement
  }}
>
  {/* Première checkbox */}
  <FormControlLabel
    control={
      <Checkbox
        checked={formData.copieDocument} // État spécifique
        onChange={(e) => handleCheckboxChange(e)} // Appelle handleCheckboxChange avec copieDocument
        name="copieDocument" // Nom unique
      />
    }
    label={
      <Typography variant="body1">
        Recevoir une copie du document une fois validé
      </Typography>
    }
  />

  {/* Deuxième checkbox */}
  <FormControlLabel
    control={
      <Checkbox
        checked={formData.lignesTransversales} // État spécifique
        onChange={(e) => handleCheckboxChange(e)} // Appelle handleCheckboxChange avec lignesTransversales
        name="lignesTransversales" // Nom unique
      />
    }
    label={
      <Typography variant="body1">
        Lignes d'engagement transversale
      </Typography>
    }
  />
</Box>

  );
};

export default CheckboxSection;
