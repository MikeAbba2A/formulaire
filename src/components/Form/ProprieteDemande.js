import React, { useEffect, useState } from "react";
import { Grid, MenuItem, TextField, Typography, Box } from "@mui/material";

const ProprieteDemande = ({ formData, handleChange, isTransversal, setFormData }) => {
  const [budgets, setBudgets] = useState([]); // Liste des budgets/actions
  const [categories, setCategories] = useState([]); // Liste des catégories
  const [poles, setPoles] = useState([]); // Liste des catégories
  const [annees, setAnnees] = useState([]); // Liste des catégories

  // Map des pôles avec leurs numéros
  const polesMap = {
    "DG": "0",
    "PAF": "1",
    "POGEMOB": "2",
    "PCOM": "3",
    "PRECH": "4",
    "PDONNEES": "5",
    "PSANTE": "5",
    "PQDV": "6"
  };

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

  // Récupération des pôles
  useEffect(() => {
    fetch("https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/pole.php")
      .then((response) => response.json())
      .then((data) => {
        console.log("Pôles reçus :", data);
        setPoles(data);
      })
      .catch((error) => console.error("Erreur lors de la récupération des Poles :", error));
  }, []);

  // Récupération des années
  useEffect(() => {
    fetch("https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/annee_budgetaire.php")
      .then((response) => response.json())
      .then((data) => {
        console.log("Années budgetaire reçues :", data);
        setAnnees(data);
      })
      .catch((error) => console.error("Erreur lors de la récupération des années budgetaire :", error));
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

  // Fonction pour générer la date au format AAAAMMJJ
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

  // Mise à jour du numéro de pièce lorsque le pôle change

  // const handlePoleChange = (e) => {
  //   const selectedPole = e.target.value;
  //   const poleNumber = polesMap[selectedPole] || "0";
  //   const datePart = getCurrentDate();
  //   const sequence = "000001"; // Numéro séquentiel par défaut

  //   // Générer le numéro de pièce
  //   const generatedNumeroPiece = `${poleNumber}${datePart}${sequence}`;

  //   // Mettre à jour le formulaire
  //   setFormData({
  //     ...formData,
  //     services: selectedPole, // Met à jour le pôle sélectionné
  //     numeroPiece: generatedNumeroPiece, // Met à jour le numéro de pièce
  //   });
  // };

  const handlePoleChange = async (e) => {
    const selectedPole = e.target.value;
    const poleNumber = polesMap[selectedPole] || "0"; // Récupérer le numéro du pôle
    const datePart = getCurrentDate();
  
    try {
      // Appeler generate_sequence.php pour récupérer la séquence
      const response = await fetch("generate_sequence.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: new Date().getFullYear() }),
      });
  
      const data = await response.json();
  
      if (data.sequence) {
        const generatedNumeroPiece = `${poleNumber}${datePart}${data.sequence}`;
  
        // Mettre à jour le formulaire avec le numéro généré
        setFormData({
          ...formData,
          services: selectedPole,
          numeroPiece: generatedNumeroPiece,
        });
      } else {
        console.error("Erreur lors de la récupération de la séquence :", data.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à generate_sequence.php :", error);
    }
  };
  

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
              <MenuItem value="achat">Demande d'achat</MenuItem>
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
              {annees.map((annee, index) => (
                  <MenuItem key={index} value={annee}>
                    {annee} {/* Affiche les années budgetaires */}
                  </MenuItem>
                ))}
            </TextField>

            {/* Pôle */}
            <TextField
              select
              fullWidth
              label="Pôle"
              name="services"
              value={formData.services || ""}
              onChange={handlePoleChange}
              required
              sx={{ marginBottom: 2 }}
            >
              {poles.map((pole, index) => (
                  <MenuItem key={index} value={pole}>
                    {pole} {/* Affiche les pôles */}
                  </MenuItem>
                ))}
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

