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
import { newRow } from "../_config/config";

const LignesEngagements = ({ formData, selectedPole, selectedBudget, fetchBudgetInitial, fetchBudgetRestant, setLignesEngagement, lignesEngagements}) => {
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

  useEffect(() => {
    const updateBudgetRestant = async () => {
      if (formData.exerciceBudgetaire && formData.services && formData.budgetsActions) {
        const montant = await fetchBudgetRestant (
          formData.exerciceBudgetaire,
          formData.services,
          formData.budgetsActions,
          "" // Catégorie vide ici
        );
      }
    };
    updateBudgetRestant ();
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

    console.log("lancement");
    const fetchFilteredBudgets = async () => {
      try {
        const response = await fetch("filtrage_budget_selon_pole.php");
        const data = await response.json();

        // Filtrer les budgets pour le pôle sélectionné
        const budgetsForPole = data.filter((item) => item.code_pole === selectedPole);

        console.log(budgetsForPole);
        setFilteredBudgets(budgetsForPole);
      } catch (error) {
        console.error("Erreur lors de la récupération des budgets filtrés :", error);
      }
    };

    if (selectedPole) {
      fetchFilteredBudgets();
    }
  }, [selectedPole]);

  const handleAddRow = () => {
    setLignesEngagement(prevRows => [...prevRows, { ...newRow }]);
  };
  
  const handleRemoveRow = (index) => {
    const updatedRows = lignesEngagements.filter((_, i) => i !== index);
    setLignesEngagement(updatedRows);
  };
  
  const handleChangeLigne = async (index, e) => {
    const { name: field, value } = e.target;
  
    // Vérifier si l'index est valide
    if (!lignesEngagements[index]) {
      console.error("Index invalide :", index);
      return;
    }
  
    // Cloner l'objet pour éviter la mutation directe
    const updatedRows = [...lignesEngagements];
    const updatedRow = { ...updatedRows[index] };
  
    updatedRow[field] = value;
  
    // Recalculer le total si la quantité ou le prix change
    if (field === "quantite" || field === "prixUnitaire") {
      updatedRow["total"] =
        parseFloat(updatedRow.quantite || 0) * parseFloat(updatedRow.prixUnitaire || 0);
    }
    // Mettre à jour l'état
    updatedRows[index] = updatedRow;
    setLignesEngagement(updatedRows);
  
    // Si la catégorie change, récupérer le montant initial pour cette ligne
    if (field === "categorie" && value) {
      if (!formData || !selectedPole) {
        console.error("Les valeurs de formData ou selectedPole sont manquantes");
        return;
      }
  
      const selectedBudget = updatedRow.budgetAction || formData.budgetsActions;
  
      try {
        updatedRow.budgetInitial = await fetchBudgetInitial(
          formData.exerciceBudgetaire,
          selectedPole,
          selectedBudget,
          value
        );
        updatedRow.budgetRestant = await fetchBudgetRestant(
          formData.exerciceBudgetaire,
          selectedPole,
          selectedBudget,
          value
        );
  
        // Vérification : Bloquer si le montant initial est "non connu"
        if (updatedRow.budgetInitial === "non connu") {
          alert("Le montant initial est 'non connu'. Veuillez sélectionner une autre catégorie.");
          updatedRow["categorie"] = ""; // Réinitialiser la catégorie
        }
  
        // Mettre à jour l'état après récupération des budgets
        updatedRows[index] = updatedRow;
        setLignesEngagement([...updatedRows]);
  
      } catch (error) {
        console.error("Erreur lors de la récupération du budget initial :", error);
      }
    }
  };
  


  const totalGeneral = lignesEngagements?.reduce((acc, row) => acc + row.total, 0);

  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h6" gutterBottom>
        {formData.lignesTransversales
          ? "Lignes d'engagements Transversaux"
          : "Lignes d'engagements"}
      </Typography>

      {lignesEngagements?.map((row, index) => {
        // Priorité au budget local (row.budgetAction), sinon selectedBudget global
        const activeBudget = row.budgetAction || selectedBudget;

        // Filtrer les catégories selon le budget actif
        const filteredCategories = categories.filter(
          (cat) => cat.parent === activeBudget
        );

        return (
          <Grid container spacing={2} key={index} alignItems="center" sx={{ marginBottom: 1 }}>
            {/* Budgets / Actions */}
            {formData.lignesTransversales && selectedPole.length > 0 &&  (
              <Grid item xs={10} md={2}>
                <TextField
                  select
                  fullWidth
                  value={row.budgetAction}
                  onChange={(e) => handleChangeLigne(index, e)}
                  name="budgetAction"
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
                onChange={(e) => handleChangeLigne(index, e)}
                disabled={!activeBudget}
                name="categorie"
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
                onChange={(e) => handleChangeLigne(index, e)}
                label="Quantité"
                name="quantite"
              />
            </Grid>

            {/* Prix unitaire */}
            <Grid item xs={6} md={1}>
              <TextField
                fullWidth
                type="number"
                value={row.prixUnitaire}
                onChange={(e) => handleChangeLigne(index, e)}
                label="Prix Unitaire"
                name="prixUnitaire"
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
                disabled={lignesEngagements.length === 1}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
              {index === lignesEngagements.length - 1 && (
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
                      {lignesEngagements[index].budgetInitial || "non connu"} {/* Affiche le montant de la ligne */}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body1">Budget restant</Typography>
                    <Typography variant="body1" color="textSecondary">
                    {lignesEngagements[index].budgetRestant || "non connu"}
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
          Total Général : {totalGeneral?.toFixed(2)} €
        </Typography>
      </Box>
    </Box>
  );
};

export default LignesEngagements;
