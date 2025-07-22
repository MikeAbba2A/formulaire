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

const LignesEngagements = ({
  filteredBudgetss,
  formData,
  selectedPole,
  selectedBudget,
  setFormData,
  fetchBudgetInitial,
  fetchBudgetRestant,
  setLignesEngagement,
  lignesEngagements,
  onCategorieChange,
  typeDemande,
}) => {
  // const [budgets, setBudgets] = useState([]); // Liste des budgets
  const [filteredBudgets, setFilteredBudgets] = useState(filteredBudgetss); // Budgets filtrés
  const [categories, setCategories] = useState([]); // Liste des catégories

  // Détermination du mode à partir des paramètres URL
  const urlParams = new URLSearchParams(window.location.search);
  const actionParam = urlParams.get("action");
  const isEditOrDuplicate =
    actionParam === "edit" || actionParam === "duplicate";

  const newRow = {
    categorie: "",
    quantite: 0,
    prixUnitaire: 0,
    total: 0,
    budgetInitial: null,
    budgetRestant: null,
    budgetAction: "",
  };

  const [anneeSelectionnee, setAnneeSelectionnee] = useState("");

  //   useEffect(() => {
  //   if (formData?.exerciceBudgetaire && !isNaN(parseInt(formData.exerciceBudgetaire))) {
  //     const annee = parseInt(formData.exerciceBudgetaire);

  //     setLignesEngagement({
  //       [annee]: [{ ...newRow }],
  //       [annee + 1]: [{ ...newRow }]
  //     });
  //   }
  // }, [formData?.exerciceBudgetaire]);

  useEffect(() => {
    const annee = parseInt(formData?.exerciceBudgetaire);

    if (!isNaN(annee)) {
      if (formData.lignesTransversales) {
        setLignesEngagement({
          [annee]: lignesEngagements[annee] || [{ ...newRow }],
          [annee + 1]: lignesEngagements[annee + 1] || [{ ...newRow }],
        });
      } else {
        setLignesEngagement({
          [annee]: lignesEngagements[annee] || [{ ...newRow }],
        });
      }
    }
  }, [formData.exerciceBudgetaire, formData.lignesTransversales]);

  useEffect(() => {
    const updateBudgetInitial = async () => {
      if (
        formData.exerciceBudgetaire &&
        formData.services &&
        formData.budgetsActions
      ) {
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
      if (
        formData.exerciceBudgetaire &&
        formData.services &&
        formData.budgetsActions
      ) {
        const montant = await fetchBudgetRestant(
          formData.exerciceBudgetaire,
          formData.services,
          formData.budgetsActions,
          "" // Catégorie vide ici
        );
      }
    };
    updateBudgetRestant();
  }, [formData.exerciceBudgetaire, formData.services, formData.budgetsActions]);

  // Charger les catégories
  // useEffect(() => {
  //   fetch("https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/categories.php")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Catégories reçues :", data);
  //       setCategories(data);
  //     })
  //     .catch((error) => console.error("Erreur lors de la récupération des catégories :", error));
  // }, []);

  useEffect(() => {
    fetch(
      "https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/categories.php"
    )
      .then((response) => response.json())
      .then((data) => {
        const arrayData = Object.values(data); // ✅ transforme l’objet en tableau
        console.log("Catégories reçues :", arrayData);
        setCategories(arrayData);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des catégories :", error)
      );
  }, []);

  useEffect(() => {
    const fetchFilteredBudgets = async () => {
      if (!formData.services) return;

      try {
        const response = await fetch("filtrage_budget_selon_pole2.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selectedPole: formData.services }),
        });

        const data = await response.json();

        if (data.status === "error") {
          console.error("Erreur :", data.message);
          return;
        }

        setFilteredBudgets(data ? data : "");
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des budgets filtrés :",
          error
        );
      }
    };

    fetchFilteredBudgets();
  }, [formData.services]);

  // --- Pré-remplissage du formulaire via le paramètre "json" dans l'URL ---
  useEffect(() => {
    const json = urlParams.get("json");
    if (json) {
      try {
        const parsed = JSON.parse(decodeURIComponent(json));

        setFormData((prev) => {
          // Vérifier si les données sont identiques pour éviter une mise à jour inutile
          if (JSON.stringify(prev) === JSON.stringify({ ...prev, ...parsed })) {
          }

          return { ...prev, ...parsed };
        });
      } catch (error) {
        console.error("Erreur lors du parsing du JSON dans l'URL :", error);
      }
    }
  }, [urlParams]);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isEditOrDuplicate && formData.services) {
      const fetchFilteredBudgets = async () => {
        try {
          const response = await fetch("filtrage_budget_selon_pole2.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ selectedPole: formData.services }), // Envoie le pôle sélectionné
          });

          const data = await response.json();

          if (data.status === "error") {
            console.error("Erreur :", data.message);
            return;
          }

          setFilteredBudgets(data);
        } catch (error) {
          console.error(
            "⚠️ Erreur lors de la récupération des budgets filtrés :",
            error
          );
        }
      };
      fetchFilteredBudgets();
    }
  }, [formData.services, isEditOrDuplicate]);

  useEffect(() => {
    // En mode création (pas edit/duplicate) et si aucune valeur n'est renseignée, on prend la première option filtrée
    if (
      !isEditOrDuplicate &&
      filteredBudgets.length > 0 &&
      (!formData.budgetsActions || formData.budgetsActions.trim() === "")
    ) {
      setFormData((prev) => ({
        ...prev,
        budgetsActions: filteredBudgets[0].budget,
      }));
    }
  }, [
    filteredBudgets,
    formData.budgetsActions,
    setFormData,
    isEditOrDuplicate,
  ]);

  // --- Initialisation du type de demande à "achat" par défaut ---
  useEffect(() => {
    if (!formData.typeDemande) {
      setFormData((prev) => ({
        ...prev,
        typeDemande: "achat",
      }));
    }
  }, [formData.typeDemande, setFormData]);

  // 🔹 Vérifie si les budgets disparaissent après une mise à jour de l'état
  useEffect(() => {}, [formData]);

  useEffect(() => {}, [formData.lignesEngagement]);

  // const handleAddRow = () => {
  //   setLignesEngagement(prevRows => [...prevRows, { ...newRow }]);
  // };

  const handleAddRow = (annee) => {
    setLignesEngagement((prev) => {
      const lignesPourAnnee = prev[annee] || [];
      return {
        ...prev,
        [annee]: [...lignesPourAnnee, { ...newRow }],
      };
    });
  };

  // const handleRemoveRow = (index) => {
  //   const updatedRows = lignesEngagements.filter((_, i) => i !== index);
  //   setLignesEngagement(updatedRows);
  // };

  const handleRemoveRow = (annee, index) => {
    setLignesEngagement((prev) => {
      const lignesPourAnnee = prev[annee] || [];
      const updated = lignesPourAnnee.filter((_, i) => i !== index);
      return {
        ...prev,
        [annee]: updated.length > 0 ? updated : [{ ...newRow }], // éviter un tableau vide
      };
    });
  };

  // const handleChangeLigne = async (index, e) => {
  //   const { name: field, value } = e.target;

  //   // Vérifier si l'index est valide
  //   if (!lignesEngagements[index]) {
  //     console.error("Index invalide :", index);
  //     return;
  //   }

  //   // Cloner l'objet pour éviter la mutation directe
  //   const updatedRows = [...lignesEngagements];
  //   const updatedRow = { ...updatedRows[index] };

  //   updatedRow[field] = value;

  //   // Recalculer le total si la quantité ou le prix change
  //   if (field === "quantite" || field === "prixUnitaire") {
  //     updatedRow["total"] =
  //       parseFloat(updatedRow.quantite || 0) * parseFloat(updatedRow.prixUnitaire || 0);
  //   }

  //   // Mettre à jour l'état
  //   updatedRows[index] = updatedRow;
  //   setLignesEngagement(updatedRows);

  //   // Si la catégorie change
  //   if (field === "categorie" && value) {
  //     // 🟢 Notifie le parent (ProprieteDemande) de la catégorie sélectionnée
  //     if (typeof onCategorieChange === "function") {
  //       console.log("✅ Catégorie transmise au parent :", value);
  //       onCategorieChange(value);
  //     }

  //     if (!formData || !selectedPole) {
  //       console.error("Les valeurs de formData ou selectedPole sont manquantes");
  //       return;
  //     }

  //     const selectedBudget = updatedRow.budgetAction || formData.budgetsActions;

  //     try {
  //       updatedRow.budgetInitial = await fetchBudgetInitial(
  //         formData.exerciceBudgetaire,
  //         selectedPole,
  //         selectedBudget,
  //         value
  //       );
  //       updatedRow.budgetRestant = await fetchBudgetRestant(
  //         formData.exerciceBudgetaire,
  //         selectedPole,
  //         selectedBudget,
  //         value
  //       );

  //       // Vérification : Bloquer si le montant initial est "non connu"
  //       if (updatedRow.budgetInitial === "non connu") {
  //         alert("Le montant initial est 'non connu'. Veuillez sélectionner une autre catégorie.");
  //         updatedRow["categorie"] = ""; // Réinitialiser la catégorie
  //       }

  //       // Mettre à jour l'état après récupération des budgets
  //       updatedRows[index] = updatedRow;
  //       setLignesEngagement([...updatedRows]);
  //     } catch (error) {
  //       console.error("Erreur lors de la récupération du budget initial :", error);
  //     }
  //   }
  // };

  // const totalGeneral = lignesEngagements?.reduce((acc, row) => acc + row.total, 0);

  const handleChangeLigne = async (annee, index, e) => {
    const { name: field, value } = e.target;

    const lignesPourAnnee = lignesEngagements[annee];
    if (!lignesPourAnnee || !lignesPourAnnee[index]) {
      console.error("Index ou année invalide :", annee, index);
      return;
    }

    const updatedRow = { ...lignesPourAnnee[index], [field]: value };

    // Recalcul du total si besoin
    if (field === "quantite" || field === "prixUnitaire") {
      updatedRow["total"] =
        parseFloat(updatedRow.quantite || 0) *
        parseFloat(updatedRow.prixUnitaire || 0);
    }

    // Si la catégorie change → traitement spécial
    if (field === "categorie" && value) {
      if (typeof onCategorieChange === "function") {
        console.log("✅ Catégorie transmise au parent :", value);
        onCategorieChange(value);
      }

      if (!formData || !selectedPole) {
        console.error("Valeurs manquantes pour récupération du budget");
        return;
      }

      const selectedBudget = updatedRow.budgetAction || formData.budgetsActions;

      try {
        updatedRow.budgetInitial = await fetchBudgetInitial(
          annee,
          selectedPole,
          selectedBudget,
          value
        );
        updatedRow.budgetRestant = await fetchBudgetRestant(
          annee,
          selectedPole,
          selectedBudget,
          value
        );

        if (updatedRow.budgetInitial === "non connu") {
          alert(
            "Le montant initial est 'non connu'. Veuillez sélectionner une autre catégorie."
          );
          updatedRow["categorie"] = "";
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des budgets :", error);
      }
    }

    // Mise à jour finale
    setLignesEngagement((prev) => ({
      ...prev,
      [annee]: prev[annee].map((row, i) => (i === index ? updatedRow : row)),
    }));
  };

  const totalGeneral = Object.values(lignesEngagements || {})
    .flat()
    .reduce((acc, row) => acc + (row.total || 0), 0);

  const totalGeneral2 = Object.values(lignesEngagements).reduce(
    (acc, lignes) => {
      return (
        acc + lignes.reduce((sousTotal, ligne) => sousTotal + ligne.total, 0)
      );
    },
    0
  );

  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h6" gutterBottom>
        {formData.lignesTransversales
          ? "Dépense pluriannuelle"
          : "Lignes d'engagements"}
      </Typography>

      {Object.entries(lignesEngagements).map(([annee, lignes], blocIndex) => (
        <Box key={annee} sx={{ mb: 5 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {/* Lignes d'engagement {parseInt(formData.exerciceBudgetaire) + blocIndex} */}
            {!isNaN(parseInt(formData?.exerciceBudgetaire))
              ? `Lignes d'engagement ${
                  parseInt(formData.exerciceBudgetaire) + blocIndex
                }`
              : `Lignes d'engagement`}
          </Typography>

          {lignes.map((row, index) => {
            const activeBudget = row.budgetAction || selectedBudget;
            // const filteredCategories = categories.filter(cat => cat.parent === activeBudget);
            const filteredCategories = categories.filter((cat) => {
              return cat.parent === activeBudget && cat.annee === annee;
            });

            return (
              <Grid
                container
                spacing={2}
                key={index}
                alignItems="center"
                sx={{ marginBottom: 1 }}
              >
                {/* Catégorie */}
                <Grid item xs={12} md={5}>
                  <TextField
                    select
                    fullWidth
                    label="Catégorie"
                    value={row.categorie}
                    onChange={(e) => handleChangeLigne(annee, index, e)}
                    disabled={!activeBudget}
                    name="categorie"
                  >
                    <MenuItem value="">
                      -- Sélectionner une catégorie --
                    </MenuItem>
                    {filteredCategories.map((category, i) => (
                      <MenuItem key={i} value={category.titre}>
                        {category.titre}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Quantité */}
                <Grid item xs={6} md={2}>
                  <TextField
                    fullWidth
                    type="number"
                    value={row.quantite}
                    onChange={(e) => handleChangeLigne(annee, index, e)}
                    label="Quantité"
                    name="quantite"
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                {/* Prix unitaire */}
                <Grid item xs={6} md={2}>
                  <TextField
                    fullWidth
                    type="number"
                    value={row.prixUnitaire}
                    onChange={(e) => handleChangeLigne(annee, index, e)}
                    label="Prix Unitaire"
                    name="prixUnitaire"
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                {/* Total */}
                <Grid item xs={6} md={2}>
                  <TextField
                    fullWidth
                    value={row.total.toFixed(2)}
                    InputProps={{ readOnly: true }}
                    label="Total"
                  />
                </Grid>

                {/* Actions */}
                <Grid item xs={12} md={1}>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveRow(annee, index)}
                    disabled={lignes.length === 1}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                  {index === lignes.length - 1 && (
                    <IconButton
                      color="primary"
                      onClick={() => handleAddRow(annee)}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  )}
                </Grid>

                {/* Affichage des budgets */}
                <Grid item xs={12} md={3} sx={{ display: "none" }}>
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
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body1">Budget initial</Typography>
                      <Typography variant="body1" color="textSecondary">
                        {row.budgetInitial || "non connu"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body1">Budget restant</Typography>
                      <Typography variant="body1" color="textSecondary">
                        {row.budgetRestant || "non connu"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            );
          })}

          {/* Total par bloc */}
          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
            <Typography variant="h6">
              {/* {formData?.exerciceBudgetaire && !isNaN(parseInt(annee)) 
              ? `Total ${annee} : ${lignes.reduce((acc, row) => acc + row.total, 0).toFixed(2)} €`
              : `Total : ${lignes.reduce((acc, row) => acc + row.total, 0).toFixed(2)} €`} */}

              {!isNaN(parseInt(formData?.exerciceBudgetaire))
                ? `Total ${
                    parseInt(formData.exerciceBudgetaire) + blocIndex
                  } : ${lignes
                    .reduce((acc, row) => acc + row.total, 0)
                    .toFixed(2)} €`
                : `Total : ${lignes
                    .reduce((acc, row) => acc + row.total, 0)
                    .toFixed(2)} €`}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
            <Typography variant="h6" color="error">
              {typeDemande === "lucratif"
                ? "Attention, pour cette demande d'achat, merci de saisir le montant HT"
                : "Attention, pour cette demande d'achat, merci de saisir le montant TTC."}
            </Typography>
          </Box>
        </Box>
      ))}
      {formData?.lignesTransversales && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Typography variant="h6">
            Total général : {totalGeneral.toFixed(2)} €
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LignesEngagements;
