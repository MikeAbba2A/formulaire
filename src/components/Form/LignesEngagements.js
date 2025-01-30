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

const LignesEngagements = ({ formData, isTransversal, selectedPole, selectedBudget, fetchBudgetInitial, budgetInitial, onRowsChange, initialRows = [] }) => {
  const [rows, setRows] = useState([
    { budgetAction: "", categorie: "", sousCategorie: "", quantite: 0, prixUnitaire: 0, total: 0 },
  ]);

  // const [budgets, setBudgets] = useState([]); // Liste des budgets
  const [filteredBudgets, setFilteredBudgets] = useState([]); // Budgets filtrés
  const [categories, setCategories] = useState([]); // Liste des catégories

  useEffect(() => {
      const updateBudgetInitial = async () => {
        if (formData.exerciceBudgetaire && formData.services && formData.budgetsActions) {
          const montant = await fetchBudgetInitial(
            formData.exerciceBudgetaire,
            formData.services,
            formData.budgetsActions,
            "" // Catégorie vide ici
          );
        }
      };
      updateBudgetInitial();
    }, [formData.exerciceBudgetaire, formData.services, formData.budgetsActions]);

  // Charger les budgets
  useEffect(() => {
    fetch("https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/data.php")
      .then((response) => response.json())
      .then((data) => {
        console.log("Budgets reçus :", data);
        setFilteredBudgets(data);
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

   // Charger les budgets filtrés en fonction du pôle sélectionné
   useEffect(() => {
    const fetchFilteredBudgets = async () => {
      try {
        const response = await fetch("filtrage_budget_selon_pole.php");
        const data = await response.json();

        // Filtrer les budgets pour le pôle sélectionné
        const budgetsForPole = data.filter((item) => item.code_pole === selectedPole);
        setFilteredBudgets(budgetsForPole);
      } catch (error) {
        console.error("Erreur lors de la récupération des budgets filtrés :", error);
      }
    };

    if (selectedPole) {
      fetchFilteredBudgets();
    }
  }, [selectedPole]);

  // Mettre à jour les lignes initiales lorsque `initialRows` change
  useEffect(() => {
    if (initialRows.length > 0) {
      console.log("Chargement des lignes initiales :", initialRows);
      setRows(initialRows);
    }
  }, [initialRows]);
  

  const handleAddRow = () => {
    const updatedRows = [
      ...rows,
      { budgetAction: "", categorie: "", quantite: 0, prixUnitaire: 0, total: 0 },
    ];
    setRows(updatedRows);
    onRowsChange(updatedRows); // Met à jour au parent
  };

  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    onRowsChange(updatedRows); // Met à jour au parent
  };

  // const handleChange = (index, field, value) => {
  //   const updatedRows = [...rows];
  //   updatedRows[index][field] = value;

  //   // Recalculer le total
  //   if (field === "quantite" || field === "prixUnitaire") {
  //     updatedRows[index]["total"] =
  //       parseFloat(updatedRows[index].quantite || 0) *
  //       parseFloat(updatedRows[index].prixUnitaire || 0);
  //   }

  //   setRows(updatedRows);
  //   onRowsChange(updatedRows); // Transmet l'état au composant parent
  // };

  const handleChange = async (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
  
    // Recalculer le total si la quantité ou le prix change
    if (field === "quantite" || field === "prixUnitaire") {
      updatedRows[index]["total"] =
        parseFloat(updatedRows[index].quantite || 0) *
        parseFloat(updatedRows[index].prixUnitaire || 0);
    }
    setRows(updatedRows);
    onRowsChange(updatedRows);
  
    // Si la catégorie change, récupérer le budget initial
    if (field === "categorie" && value) {
      if (!formData || !selectedPole) {
        console.error("Les valeurs de formData ou selectedPole sont manquantes");
        return;
      }
  
      // S'assurer que `actions` contient toujours une valeur correcte
      const selectedBudget = updatedRows[index].budgetAction || formData.budgetsActions;

      const montant = await fetchBudgetInitial(
        formData.exerciceBudgetaire,
        selectedPole,
        selectedBudget,  // ✅ Toujours conserver la valeur du budget sélectionné
        value
      );
    }
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
              <Grid item xs={10} md={2}>
                <TextField
                  select
                  fullWidth
                  value={row.budgetAction}
                  onChange={(e) => handleChange(index, "budgetAction", e.target.value)}
                  label="Budgets / Actions"
                >
                  {filteredBudgets.map((budget, i) => (
                    <MenuItem key={i} value={budget.budget}>
                      {budget.budget}
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
            <Grid item xs={6} md={1}>
              <TextField
                fullWidth
                type="number"
                value={row.quantite}
                onChange={(e) => handleChange(index, "quantite", e.target.value)}
                label="Quantité"
              />
            </Grid>

            {/* Prix unitaire */}
            <Grid item xs={6} md={1}>
              <TextField
                fullWidth
                type="number"
                value={row.prixUnitaire}
                onChange={(e) => handleChange(index, "prixUnitaire", e.target.value)}
                label="Prix Unitaire"
              />
            </Grid>

            {/* Total */}
            <Grid item xs={6} md={1}>
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
            {/* Gestion des budgets */}
              <Grid item xs={12} md={3}>
                
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    backgroundColor: "#f4f4f4",
                    padding: 2,
                    borderRadius: "8px",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body1">Budget initial</Typography>
                    <Typography variant="body1" color="textSecondary">
                      {budgetInitial}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body1">Budget restant</Typography>
                    <Typography variant="body1" color="textSecondary">
                      {formData.montant_initial || "non connu"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
          </Grid>
        );
      })}

      {/* Total général */}
      <Box 
        sx={{ 
          marginTop: 2, 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", // Centre verticalement
          height: "100px" // Exemple d'une hauteur fixe pour centrer verticalement
        }}
      >
        <Typography variant="h6">
          Total Général : {totalGeneral.toFixed(2)} €
        </Typography>
      </Box>
    </Box>
  );
};

export default LignesEngagements;
