import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";
import { racineAPI } from "../_config/config";

const ProprieteDemande = ({
  formData,
  handleChange,
  setFormData,
  fetchBudgetInitial,
  fetchBudgetRestant,
  montantsBudget,
  setMontantsBudget,
  budgetSelectionManuelle,
  setBudgetSelectionManuelle,
  categoriePrincipale,
  setCategoriePrincipale,
  typeDemande,
  setTypeDemande,
}) => {
  const [budgets, setBudgets] = useState([]);
  const [poles, setPoles] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [fournisseurType, setFournisseurType] = useState(null);
  const [dataBudgets, setDataBudgets] = useState([]);
  // const [categoriePrincipale, setCategoriePrincipale] = useState(null);

  // Détermination du mode à partir des paramètres URL
  const urlParams = new URLSearchParams(window.location.search);
  const actionParam = urlParams.get("action");
  const isEditOrDuplicate =
    actionParam === "edit" || actionParam === "duplicate";

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

  const [montantProjet, setMontantProjet] = useState(null);

  const [pluriAnnuel, setPluriAnnuel] = useState(false);
  const [validationPossible, setValidationPossible] = useState(true);

  const verifierBudgetPluriannuel = async (budgetCode, annee1, annee2) => {
    try {
      const response = await fetch(`${racineAPI}data.php`); // Ajuste le chemin si besoin
      const data = await response.json();

      // Filtrer les budgets correspondant à l'année et au code
      const budgetAnnee1 = data.find(
        (item) =>
          item.annee === annee1.toString() && item.budget.startsWith(budgetCode)
      );
      const budgetAnnee2 = data.find(
        (item) =>
          item.annee === annee2.toString() && item.budget.startsWith(budgetCode)
      );

      return {
        existeAnnee1: !!budgetAnnee1,
        existeAnnee2: !!budgetAnnee2,
      };
    } catch (error) {
      console.error("Erreur lors de la vérification des budgets :", error);
      return { existeAnnee1: false, existeAnnee2: false };
    }
  };

  useEffect(() => {
    const fetchMontantProjet = async () => {
      if (!formData?.budgetsActions) {
        setMontantProjet(null);
        return;
      }

      try {
        const response = await fetch(
          `${racineAPI}projet.php?type=${typeDemande}`
        );
        const data = await response.json();

        const matching = data.find(
          (item) => item.budget === formData.budgetsActions
        );

        if (matching) {
          setMontantProjet(matching); // contient .montant et .projet
        } else {
          setMontantProjet(null); // pas dans un projet
        }
      } catch (error) {
        console.error("Erreur fetch montant projet :", error);
        setMontantProjet(null);
      }
    };

    fetchMontantProjet();
  }, [formData?.budgetsActions]);

  // --- Pré-remplissage du formulaire via le paramètre "json" dans l'URL ---
  // useEffect(() => {
  //   const json = urlParams.get("json");
  //   if (json) {
  //     try {
  //       const parsed = JSON.parse(decodeURIComponent(json));

  //       setFormData((prev) => {
  //         // Vérifier si les données sont identiques pour éviter une mise à jour inutile
  //         if (JSON.stringify(prev) === JSON.stringify({ ...prev, ...parsed })) {
  //           return prev; // Pas de changement, éviter un re-render
  //         }
  //         return { ...prev, ...parsed };
  //       });
  //     } catch (error) {
  //       console.error("Erreur lors du parsing du JSON dans l'URL :", error);
  //     }
  //   }
  // }, [urlParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${racineAPI}data.php`);
        const data = await response.json();

        console.log("✅ Données budgets chargées", data);

        console.log("✅ Données budgets chargées", data.data);
        setDataBudgets(data.data);
        setTypeDemande(data.type);

        console.log(
          "✅ Type de demande en fonction du coll_id d'appel",
          data.type
        );
      } catch (error) {
        console.error(
          "⛔ Erreur lors du chargement initial des budgets :",
          error
        );
      }
    };

    fetchData();
  }, []);

  // --- Récupération des pôles depuis pole.php ---

  useEffect(() => {
    const fetchPoles = async () => {
      try {
        const response = await fetch(`${racineAPI}pole.php`);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const data = await response.json();

        setPoles(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des pôles :", error);
      }
    };
    fetchPoles();
  }, []);

  useEffect(() => {
    const fetchFilteredBudgets = async () => {
      if (!formData.services) return; // Vérifie si un pôle est sélectionné

      try {
        const response = await fetch(
          `${racineAPI}filtrage_budget_selon_pole2.php`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ selectedPole: formData.services }), // Envoie le pôle sélectionné
          }
        );

        const data = await response.json();

        if (data.status === "error") {
          console.error("Erreur :", data.message);
          setFilteredBudgets([]);
          return;
        }

        setFilteredBudgets(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des budgets filtrés :",
          error
        );
        setFilteredBudgets([]);
      }
    };

    fetchFilteredBudgets();
  }, [formData.services]);

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

  const handleBudgetChange = async (e) => {
    handleChange(e); // ✅ garde le comportement normal
    if (e.target.name === "budgetsActions") {
      setBudgetSelectionManuelle(true); // ✅ utilisateur a choisi un budget

      const selectedBudgetCode = e.target.value;

      // ➕ Vérification uniquement si la case pluriannuelle est cochée
      if (formData.lignesTransversales) {
        const annee1 = parseInt(formData.exerciceBudgetaire);
        const annee2 = annee1 + 1;

        try {
          const data = dataBudgets;

          const budgetAnnee1 = data.find(
            (item) =>
              item.annee === annee1.toString() &&
              item.budget.startsWith(selectedBudgetCode)
          );
          const budgetAnnee2 = data.find(
            (item) =>
              item.annee === annee2.toString() &&
              item.budget.startsWith(selectedBudgetCode)
          );
          console.log("annee 1 =>", budgetAnnee1);
          console.log("annee 2 =>", budgetAnnee2);

          if (!budgetAnnee1 || !budgetAnnee2) {
            alert(
              `❌ Le budget "${selectedBudgetCode}" n'est pas disponible pour :\n` +
                `${!budgetAnnee1 ? `- l'année ${annee1}\n` : ""}` +
                `${!budgetAnnee2 ? `- l'année ${annee2}` : ""}`
            );
            setValidationPossible(false); // 🔒 bloquer la validation
          } else {
            setValidationPossible(true); // ✅ OK
          }
        } catch (error) {
          console.error("⛔ Erreur lors du chargement des budgets :", error);
          alert("Erreur lors de la vérification des budgets pluriannuels.");
          setValidationPossible(false);
        }
      } else {
        // Si ce n'est pas une dépense pluriannuelle, réactiver la validation
        setValidationPossible(true);
      }
    }
  };

  // --- Gestion du changement de pôle ---
  const handlePoleChange = async (e) => {
    const selectedPole = e.target.value;
    const poleNumber = (polesMap[selectedPole] || "0").toString();
    const datePart = getCurrentDate();

    try {
      const response = await fetch(`${racineAPI}generate_sequence.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: new Date().getFullYear(),
          preview: false,
        }),
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
        console.error(
          "Erreur lors de la récupération de la séquence :",
          data.error
        );
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
  }, [
    formData.exerciceBudgetaire,
    formData.services,
    formData.budgetsActions,
    fetchBudgetInitial,
  ]);

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
  }, [
    formData.exerciceBudgetaire,
    formData.services,
    formData.budgetsActions,
    fetchBudgetRestant,
  ]);

  useEffect(() => {
    const allReady =
      formData.exerciceBudgetaire &&
      formData.services &&
      formData.budgetsActions;

    if (allReady) {
      fetchMontantsBudget();
    }
  }, [formData.exerciceBudgetaire, formData.services, formData.budgetsActions]);

  const fetchMontantsBudget = async () => {
    try {
      const response = await fetch(`${racineAPI}total_budget.php`);
      const data = await response.json();

      // ✅ Sécurisation de la récupération du code budget
      const rawBudget = formData.budgetsActions || "";
      const budgetCode = rawBudget.includes(" - ")
        ? rawBudget.split(" - ")[0]
        : rawBudget;

      if (!budgetCode) {
        console.warn("❌ Aucun code budget fourni.");
        return;
      }

      const budget = data.find((item) => item.actions === budgetCode);

      if (budget) {
        setMontantsBudget({
          montant_initial: budget.montant_initial,
          montant_restant: budget.montant_restant,
        });
      } else {
        console.warn("❌ Aucun budget trouvé pour :", budgetCode);
        setMontantsBudget({
          montant_initial: "non connu",
          montant_restant: "non connu",
        });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des montants du budget :",
        error
      );
    }
  };

  useEffect(() => {
    console.log("🆕 categoriePrincipale a changé :", categoriePrincipale);
  }, [categoriePrincipale]);

  useEffect(() => {
    if (categoriePrincipale === null) {
      console.log("⏸️ categoriePrincipale pas encore définie. Attente…");
      return;
    }

    console.log("🚀 useEffect triggered");

    const fetchFournisseurType = async () => {
      console.log("📊 Déclenchement useEffect avec : ", {
        exerciceBudgetaire: formData.exerciceBudgetaire,
        services: formData.services,
        budgetsActions: formData.budgetsActions,
        categoriePrincipale,
      });

      if (
        formData.exerciceBudgetaire &&
        formData.services &&
        formData.budgetsActions &&
        categoriePrincipale
      ) {
        console.log(
          "🟢 Tentative de fetch du fichier fournisseur_lucra_nonLucra.php"
        );

        try {
          const response = await fetch(
            `${racineAPI}fournisseur_lucra_nonLucra.php`
          );
          const data = await response.json();
          console.log("✅ Données reçues :", data);

          const budgetCode = formData.budgetsActions.split(" - ")[0];
          const matching = data.find(
            (item) =>
              item.annee === formData.exerciceBudgetaire.toString() &&
              item.pole === formData.services &&
              item.budget.startsWith(budgetCode) &&
              item.categorie === categoriePrincipale
          );

          if (matching) {
            console.log("🎯 Type fournisseur trouvé :", matching.type);
            setFournisseurType(matching.type);
          } else {
            console.warn("❌ Aucun fournisseur correspondant trouvé.");
            setFournisseurType(null);
          }
        } catch (error) {
          console.error("⛔ Erreur fetch :", error);
        }
      } else {
        console.log(
          "⏳ En attente de toutes les données nécessaires pour lancer la vérification du fournisseur."
        );
      }
    };

    fetchFournisseurType();
  }, [
    formData.exerciceBudgetaire,
    formData.services,
    formData.budgetsActions,
    categoriePrincipale,
  ]);

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
                onChange={handleBudgetChange}
                required
                sx={{ marginBottom: 2 }}
              >
                {filteredBudgets.map((budget, index) => (
                  <MenuItem key={index} value={budget.split(" - ")[0]}>
                    {budget}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {(montantProjet ||
              (formData.exerciceBudgetaire &&
                formData.services &&
                budgetSelectionManuelle)) && (
              <Grid item xs={12} md={6}>
                {/* Bloc projet */}
                {montantProjet && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      backgroundColor: "#d1ecf1",
                      padding: 2,
                      borderRadius: "8px",
                      marginBottom: 2,
                      border: "1px solid #bee5eb",
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Projet : {montantProjet.projet}
                    </Typography>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body1">
                        Montant total du projet
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {montantProjet.montant.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Bloc budget global */}
                {montantsBudget && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      backgroundColor: "#d1ecf1",
                      padding: 2,
                      borderRadius: "8px",
                      marginBottom: 2,
                      border: "1px solid #bee5eb",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Typography variant="body1">Budget global</Typography>
                      <Typography variant="body1" color="textSecondary">
                        {/* {montantsBudget.montant_initial || "non connu"} */}
                        {montantsBudget.montant_initial
                          ? montantsBudget.montant_initial.toLocaleString(
                              "fr-FR",
                              {
                                style: "currency",
                                currency: "EUR",
                              }
                            )
                          : "non connu"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Typography variant="body1">
                        Budget global restant
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {/* {montantsBudget.montant_restant || "non connu"} */}
                        {montantsBudget.montant_restant
                          ? montantsBudget.montant_restant.toLocaleString(
                              "fr-FR",
                              {
                                style: "currency",
                                currency: "EUR",
                              }
                            )
                          : "non connu"}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Grid>
            )}

            {fournisseurType === "1" && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginY: 4,
                  }}
                >
                  <Alert
                    severity="info"
                    sx={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      backgroundColor: "#e3f2fd",
                      color: "#0d47a1",
                      paddingX: 4,
                      paddingY: 2,
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    ⚠️ Attention, pour cette demande d'achat, merci de saisir le
                    montant <strong>HT</strong>
                  </Alert>
                </Box>
              </Grid>
            )}

            {fournisseurType === "2" && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginY: 4,
                  }}
                >
                  <Alert
                    severity="success"
                    sx={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      backgroundColor: "#e8f5e9",
                      color: "#1b5e20",
                      paddingX: 4,
                      paddingY: 2,
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    ⚠️ Attention, pour cette demande d'achat, merci de saisir le
                    montant <strong>TTC</strong>.
                  </Alert>
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
