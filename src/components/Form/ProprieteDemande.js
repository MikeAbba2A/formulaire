import React, { useState, useEffect, useMemo } from "react";
import { Box, Grid, Typography, TextField, MenuItem } from "@mui/material";

const ProprieteDemande = ({
  formData,
  handleChange,
  setFormData,
  fetchBudgetInitial,
  fetchBudgetRestant,
  montantsBudget,
  setMontantsBudget,
}) => {
  const [budgets, setBudgets] = useState([]);
  const [poles, setPoles] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  

  // Détermination du mode à partir des paramètres URL
  const urlParams = new URLSearchParams(window.location.search);
  const actionParam = urlParams.get("action");
  const isEditOrDuplicate = actionParam === "edit" || actionParam === "duplicate";

  // Map pour convertir le nom du pôle en code
  const polesMap = {
    DG: "0",
    PAF: "1",
    POGEMOB: "2",
    PCOM: "3",
    PRECH: "4",
    PDONNEES: "5",
    PSANTE: "5",
    PQDV: "6",
  };

  // --- Pré-remplissage du formulaire via le paramètre "json" dans l'URL ---
  useEffect(() => {
    const json = urlParams.get("json");
    if (json) {
      try {
        const parsed = JSON.parse(decodeURIComponent(json));
        

        setFormData((prev) => {
          // Vérifier si les données sont identiques pour éviter une mise à jour inutile
          if (JSON.stringify(prev) === JSON.stringify({ ...prev, ...parsed })) {
            return prev; // Pas de changement, éviter un re-render
          }
          return { ...prev, ...parsed };
        });
      } catch (error) {
        console.error("Erreur lors du parsing du JSON dans l'URL :", error);
      }
    }
  }, [urlParams]);


  // --- Récupération des budgets depuis data.php ---
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch(
          "https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/data.php"
        );
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const data = await response.json();
        console.log(data);
        
        setBudgets(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des budgets :", error);
      }
    };
    fetchBudgets();
  }, []);

  // --- Récupération des pôles depuis pole.php ---
  useEffect(() => {
    const fetchPoles = async () => {
      try {
        const response = await fetch(
          "https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/pole.php"
        );
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const data = await response.json();
        
        setPoles(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des pôles :", error);
      }
    };
    fetchPoles();
  }, []);

  // --- Calcul des budgets filtrés en fonction du pôle sélectionné ---
  // const filteredBudgets = useMemo(() => {
  //   if (!budgets.length || !formData.services) return [];
  //   const poleCode = (polesMap[formData.services] || formData.services).toString();
  //   
  //   const filtered = budgets.filter(
  //     (item) => item.code_pole && item.code_pole.toString() === poleCode
  //   );
  //   
  //   return filtered;
  // }, [budgets, formData.services]);

  useEffect(() => {
    const fetchFilteredBudgets = async () => {
      if (!formData.services) return; // Vérifie si un pôle est sélectionné
  
      try {
        const response = await fetch("filtrage_budget_selon_pole2.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selectedPole: formData.services }) // Envoie le pôle sélectionné
        });
  
        const data = await response.json();
  
        if (data.status === "error") {
          console.error("Erreur :", data.message);
          setFilteredBudgets([]);
          return;
        }
  
        
        setFilteredBudgets(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des budgets filtrés :", error);
        setFilteredBudgets([]);
      }
    };
  
    fetchFilteredBudgets();
  }, [formData.services]);

  // --- Mise à jour automatique du champ budgetsActions (seulement en mode création) ---
  useEffect(() => {
    // En mode création (pas edit/duplicate) et si aucune valeur n'est renseignée, on prend la première option filtrée
    if (!isEditOrDuplicate && filteredBudgets.length > 0 && (!formData.budgetsActions || formData.budgetsActions.trim() === "")) {
      
      setFormData((prev) => ({
        ...prev,
        budgetsActions: filteredBudgets[0].budget,
      }));
    }
  }, [filteredBudgets, formData.budgetsActions, setFormData, isEditOrDuplicate]);

  // --- Initialisation du type de demande à "achat" par défaut ---
  useEffect(() => {
    if (!formData.typeDemande) {
      setFormData((prev) => ({
        ...prev,
        typeDemande: "achat",
      }));
    }
  }, [formData.typeDemande, setFormData]);

  // --- Utilitaire pour générer la date au format AAAAMMJJ ---
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

  // --- Gestion du changement de pôle ---
  const handlePoleChange = async (e) => {
    const selectedPole = e.target.value;
    const poleNumber = (polesMap[selectedPole] || "0").toString();
    const datePart = getCurrentDate();

    try {
      const response = await fetch("generate_sequence.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: new Date().getFullYear(), preview: false }),
      });
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const data = await response.json();
      if (data.sequence) {
        const generatedNumeroPiece = `${poleNumber}${datePart}${data.sequence}`;
        setFormData((prev) => ({
          ...prev,
          services: selectedPole,
          numeroPiece: generatedNumeroPiece,
          typeDemande: "achat",
        }));
      } else {
        console.error("Erreur lors de la récupération de la séquence :", data.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à generate_sequence.php :", error);
    }
  };

  // --- Mises à jour des budgets initiaux et restants ---
  useEffect(() => {
    const updateBudgetInitial = async () => {
      if (
        formData.exerciceBudgetaire &&
        formData.services &&
        formData.budgetsActions
      ) {
        await fetchBudgetInitial(
          formData.exerciceBudgetaire,
          formData.services,
          formData.budgetsActions,
          ""
        );
      }
    };
    updateBudgetInitial();
  }, [formData.exerciceBudgetaire, formData.services, formData.budgetsActions, fetchBudgetInitial]);

  useEffect(() => {
    const updateBudgetRestant = async () => {
      if (
        formData.exerciceBudgetaire &&
        formData.services &&
        formData.budgetsActions
      ) {
        await fetchBudgetRestant(
          formData.exerciceBudgetaire,
          formData.services,
          formData.budgetsActions,
          ""
        );
      }
    };
    updateBudgetRestant();
  }, [formData.exerciceBudgetaire, formData.services, formData.budgetsActions, fetchBudgetRestant]);

  useEffect(() => {
    if (formData.budgetsActions) {
      fetchMontantsBudget();
    }
  }, [formData.budgetsActions]);


  const fetchMontantsBudget = async () => {
    try {
      const response = await fetch("https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/total_budget.php");
      const data = await response.json();
  
      const budgetCode = formData.budgetsActions.split(" - ")[0]; // ✅ Comparaison plus fiable
      const budget = data.find(item => item.actions === budgetCode);
  
      if (budget) {
        console.log("✅ Budget trouvé :", budget);
        setMontantsBudget({
          montant_initial: budget.montant_initial,
          montant_restant: budget.montant_restant,
        });
      } else {
        console.warn("❌ Aucun budget trouvé pour :", budgetCode);
        setMontantsBudget({ montant_initial: "non connu", montant_restant: "non connu" });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des montants du budget :", error);
    }
  };
  



  

  return (
  <Box
    sx={{
      marginTop: 3,
      padding: 2,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Propriété de la demande
        </Typography>

        <Grid container spacing={2}>
          {/* ➤ Colonne de gauche : champs de formulaire */}
          <Grid item xs={12} md={6}>
            {/* Type de demande */}
            <TextField
              select
              fullWidth
              label="Type de la demande"
              name="typeDemande"
              value={formData.typeDemande || ""}
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
              value={formData.exerciceBudgetaire || ""}
              onChange={handleChange}
              required
              sx={{ marginBottom: 2 }}
            >
              {[-1, 0, 1].map((offset) => {
                const year = new Date().getFullYear() + offset;
                return (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                );
              })}
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
                  {pole}
                </MenuItem>
              ))}
            </TextField>

            {/* Budgets / Actions */}
            <TextField
              select
              fullWidth
              label="Budgets / Actions"
              name="budgetsActions"
              value={formData.budgetsActions || ""}
              onChange={handleChange}
              required
              sx={{ marginBottom: 2 }}
            >
              {filteredBudgets.map((budget, index) => (
                <MenuItem key={index} value={budget.budget.split(" - ")[0]}>
                  {budget.budget}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* ➤ Colonne de droite : cadre des budgets */}
          {formData.budgetsActions && (
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  backgroundColor: "#f4f4f4",
                  padding: 2,
                  borderRadius: "8px",
                  height: "100%",
                  justifyContent: "center",
                }}
              >

                {montantsBudget && (
                  <>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body1">Budget initial</Typography>
                      <Typography variant="body1" color="textSecondary">
                        {montantsBudget.montant_initial || "non connu"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body1">Budget restant</Typography>
                      <Typography variant="body1" color="textSecondary">
                        {montantsBudget.montant_restant || "non connu"}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  </Box>
);

};

export default ProprieteDemande;

