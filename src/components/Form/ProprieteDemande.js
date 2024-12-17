import React, { useEffect, useState } from "react";
import { Grid, MenuItem, TextField, Typography, Box } from "@mui/material";

const ProprieteDemande = ({ formData, handleChange, isTransversal }) => {
  const [budgets, setBudgets] = useState([]); // Liste des budgets/actions
  const [categories, setCategories] = useState([]); // Liste des catégories

  // Récupération des budgets/actions
  useEffect(() => {
    fetch("https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/data.php")
      .then((response) => response.json())
      .then((data) => {
        console.log("Budgets reçus :", data);
        setBudgets(data);
      })
      .catch((error) => console.error("Erreur lors de la récupération des budgets :", error));
  }, []);

  // Récupération des catégories
  useEffect(() => {
    fetch("https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/categories.php")
      .then((response) => response.json())
      .then((data) => {
        console.log("Catégories reçues :", data);
        setCategories(data);
      })
      .catch((error) => console.error("Erreur lors de la récupération des catégories :", error));
  }, []);

  // Filtrage des catégories en fonction du budget/action sélectionné
  const filteredCategories = categories.filter(
    (category) => category.parent === formData.budgetsActions
  );

  return (
    <Box sx={{ marginTop: 3, padding: 2 }}>
      <Grid container spacing={4}>
        {/* Propriété de la demande */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Propriété de la demande
          </Typography>
          <Box>
            {/* Type de demande */}
            <TextField
              select
              fullWidth
              label="Type de la demande"
              name="typeDemande"
              value={formData.typeDemande}
              onChange={handleChange}
              required
              sx={{ marginBottom: 2 }}
            >
              <MenuItem value="achat">Achat</MenuItem>
              <MenuItem value="location">Location</MenuItem>
              <MenuItem value="service">Service</MenuItem>
            </TextField>

            {/* Exercice budgétaire */}
            <TextField
              select
              fullWidth
              label="Exercice budgétaire"
              name="exerciceBudgetaire"
              value={formData.exerciceBudgetaire}
              onChange={handleChange}
              required
              sx={{ marginBottom: 2 }}
            >
              <MenuItem value="2023">2023</MenuItem>
              <MenuItem value="2024">2024</MenuItem>
              <MenuItem value="2025">2025</MenuItem>
            </TextField>

            {/* Pôle */}
            <TextField
              select
              fullWidth
              label="Pôle"
              name="services"
              value={formData.services}
              onChange={handleChange}
              required
              sx={{ marginBottom: 2 }}
            >
              <MenuItem value="it">IT</MenuItem>
              <MenuItem value="rh">RH</MenuItem>
              <MenuItem value="logistique">Logistique</MenuItem>
            </TextField>

            {/* Budgets / Actions */}
            {!isTransversal && (
              <TextField
                select
                fullWidth
                label="Budgets / Actions *"
                name="budgetsActions" // Nom de la propriété
                value={formData.budgetsActions}
                onChange={handleChange} // Appelle la fonction parent pour mettre à jour l'état
                required
                sx={{ marginBottom: 2 }}
              >
                {budgets.map((budget, index) => (
                  <MenuItem key={index} value={budget}>
                    {budget} {/* Affiche le budget */}
                  </MenuItem>
                ))}
            </TextField>
            )}

            
          </Box>
        </Grid>

        {/* Gestion des budgets */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Gestion des budgets
          </Typography>
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
                {formData.budgetInitial || "non connu"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1">Budget restant</Typography>
              <Typography variant="body1" color="textSecondary">
                {formData.budgetRestant || "non connu"}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProprieteDemande;

