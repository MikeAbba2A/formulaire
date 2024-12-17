import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const LignesEngagements = ({ isTransversal, selectedBudget }) => {
  const [rows, setRows] = useState([
    { budgetAction: "", categorie: "", sousCategorie: "", quantite: 0, prixUnitaire: 0, total: 0 },
  ]);

  const [budgets, setBudgets] = useState([]); // Liste des budgets
  const [categories, setCategories] = useState([]); // Liste des catégories

  // Charger les budgets
  useEffect(() => {
    fetch("https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/data.php")
      .then((response) => response.json())
      .then((data) => {
        console.log("Budgets reçus :", data);
        setBudgets(data);
      })
      .catch((error) => console.error("Erreur lors de la récupération des budgets :", error));
  }, []);

  // Charger les catégories
  useEffect(() => {
    fetch("https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/categories.php")
      .then((response) => response.json())
      .then((data) => {
        console.log("Catégories reçues :", data);
        setCategories(data);
      })
      .catch((error) => console.error("Erreur lors de la récupération des catégories :", error));
  }, []);

  const handleAddRow = () => {
    setRows([
      ...rows,
      { budgetAction: "", categorie: "", sousCategorie: "", quantite: 0, prixUnitaire: 0, total: 0 },
    ]);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    // Réinitialiser la catégorie si le budget/action change
    if (field === "budgetAction") {
      updatedRows[index]["categorie"] = "";
    }

    // Recalculer le total
    if (field === "quantite" || field === "prixUnitaire") {
      updatedRows[index]["total"] =
        parseFloat(updatedRows[index].quantite || 0) *
        parseFloat(updatedRows[index].prixUnitaire || 0);
    }

    setRows(updatedRows);
  };


  const totalGeneral = rows.reduce((acc, row) => acc + row.total, 0);

  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isTransversal
          ? "Lignes d'engagements Transversaux"
          : "Lignes d'engagements"}
      </Typography>

      {rows.map((row, index) => {
        // Priorité au budget local (row.budgetAction), sinon selectedBudget global
        const activeBudget = row.budgetAction || selectedBudget;

        // Filtrer les catégories selon le budget actif
        const filteredCategories = categories.filter(
          (cat) => cat.parent === activeBudget
        );

        return (
          <Grid container spacing={2} key={index} alignItems="center" sx={{ marginBottom: 1 }}>
            {/* Budgets / Actions */}
            {isTransversal && (
              <Grid item xs={12} md={2}>
                <TextField
                  select
                  fullWidth
                  value={row.budgetAction}
                  onChange={(e) => handleChange(index, "budgetAction", e.target.value)}
                  label="Budgets / Actions"
                >
                  {budgets.map((budget, i) => (
                    <MenuItem key={i} value={budget}>
                      {budget}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            {/* Catégories */}
            <Grid item xs={12} md={2}>
              <TextField
                select
                fullWidth
                label="Catégorie"
                value={row.categorie}
                onChange={(e) => handleChange(index, "categorie", e.target.value)}
                disabled={!activeBudget}
              >
                <MenuItem value="">-- Sélectionner une catégorie --</MenuItem>
                {filteredCategories.map((category, i) => (
                  <MenuItem key={i} value={category.titre}>
                    {category.titre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Quantité */}
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                type="number"
                value={row.quantite}
                onChange={(e) => handleChange(index, "quantite", e.target.value)}
                label="Quantité"
              />
            </Grid>

            {/* Prix unitaire */}
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                type="number"
                value={row.prixUnitaire}
                onChange={(e) => handleChange(index, "prixUnitaire", e.target.value)}
                label="Prix Unitaire"
              />
            </Grid>

            {/* Total */}
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                value={row.total.toFixed(2)}
                InputProps={{ readOnly: true }}
                label="Total"
              />
            </Grid>

            {/* Actions */}
            <Grid item xs={12} md={2}>
              <IconButton
                color="error"
                onClick={() => handleRemoveRow(index)}
                disabled={rows.length === 1}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
              {index === rows.length - 1 && (
                <IconButton color="primary" onClick={handleAddRow}>
                  <AddCircleOutlineIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
        );
      })}

      {/* Total général */}
      <Box sx={{ marginTop: 2, textAlign: "right" }}>
        <Typography variant="h6">
          Total Général : {totalGeneral.toFixed(2)} €
        </Typography>
      </Box>
    </Box>
  );
};

export default LignesEngagements;
