// import React, { useState, useEffect } from "react";
// import { Box, Grid, Typography, TextField, MenuItem } from "@mui/material";

// const ProprieteDemande = ({ 
//   formData, 
//   handleChange, 
//   setFormData, 
//   fetchBudgetInitial, 
//   fetchBudgetRestant 
// }) => {
//   const [budgets, setBudgets] = useState([]); // Liste complète des budgets/actions
//   const [poles, setPoles] = useState([]); // Liste des pôles
//   const [filteredBudgets, setFilteredBudgets] = useState([]); // Budgets filtrés selon le pôle sélectionné

//   // Map des pôles avec leurs numéros
//   const polesMap = {
//     "DG": "0",
//     "PAF": "1",
//     "POGEMOB": "2",
//     "PCOM": "3",
//     "PRECH": "4",
//     "PDONNEES": "5",
//     "PSANTE": "5",
//     "PQDV": "6"
//   };

//   /* --- Récupération des données au montage du composant --- */

//   // Récupérer l'ensemble des budgets depuis data.php
//   useEffect(() => {
//     const fetchBudgets = async () => {
//       try {
//         const response = await fetch(
//           "https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/data.php"
//         );
//         if (!response.ok) {
//           throw new Error(`Erreur HTTP: ${response.status}`);
//         }
//         const data = await response.json();
//         
//         setBudgets(data);
//       } catch (error) {
//         console.error("Erreur lors de la récupération des budgets :", error);
//       }
//     };

//     fetchBudgets();
//   }, []);

//   // Récupérer la liste des pôles depuis pole.php
//   useEffect(() => {
//     const fetchPoles = async () => {
//       try {
//         const response = await fetch(
//           "https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/pole.php"
//         );
//         if (!response.ok) {
//           throw new Error(`Erreur HTTP: ${response.status}`);
//         }
//         const data = await response.json();
//         
//         setPoles(data);
//       } catch (error) {
//         console.error("Erreur lors de la récupération des pôles :", error);
//       }
//     };

//     fetchPoles();
//   }, []);

//   /* --- Synchroniser les budgets filtrés avec le pôle sélectionné --- */
//   useEffect(() => {
//     if (formData.services) {
//       const filtered = budgets.filter(
//         (item) => item.code_pole === formData.services
//       );
//       setFilteredBudgets(filtered);
//     }
//   }, [budgets, formData.services]);

//   /* --- Initialiser le type de demande à "achat" si non défini --- */
//   useEffect(() => {
//     if (!formData.typeDemande) {
//       setFormData((prevData) => ({
//         ...prevData,
//         typeDemande: "achat",
//       }));
//     }
//   }, [formData.typeDemande, setFormData]);

//   /* --- Utilitaire pour générer la date au format AAAAMMJJ --- */
//   const getCurrentDate = () => {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, "0");
//     const day = String(now.getDate()).padStart(2, "0");
//     return `${year}${month}${day}`;
//   };

//   /* --- Mise à jour lors du changement de pôle --- */
//   const handlePoleChange = async (e) => {
//     const selectedPole = e.target.value;
//     const poleNumber = polesMap[selectedPole] || "0"; // Récupérer le numéro du pôle
//     const datePart = getCurrentDate();

//     try {
//       // Appeler generate_sequence.php pour récupérer la séquence
//       const response = await fetch("generate_sequence.php", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ year: new Date().getFullYear(), preview: false }),
//       });

//       if (!response.ok) {
//         throw new Error(`Erreur HTTP: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.sequence) {
//         const generatedNumeroPiece = `${poleNumber}${datePart}${data.sequence}`;

//         // Mise à jour du formulaire avec le pôle sélectionné et le numéro généré
//         setFormData((prevData) => ({
//           ...prevData,
//           services: selectedPole,
//           numeroPiece: generatedNumeroPiece,
//           typeDemande: "achat",
//         }));
//         // La mise à jour de filteredBudgets s'effectuera via le useEffect dédié
//       } else {
//         console.error("Erreur lors de la récupération de la séquence :", data.error);
//       }
//     } catch (error) {
//       console.error("Erreur lors de l'appel à generate_sequence.php :", error);
//     }
//   };

//   /* --- Mises à jour des budgets initiaux et restants --- */
//   useEffect(() => {
//     const updateBudgetInitial = async () => {
//       if (formData.exerciceBudgetaire && formData.services && formData.budgetsActions) {
//         await fetchBudgetInitial(
//           formData.exerciceBudgetaire,
//           formData.services,
//           formData.budgetsActions,
//           "" // Catégorie vide ici
//         );
//       }
//     };
//     updateBudgetInitial();
//   }, [
//     formData.exerciceBudgetaire,
//     formData.services,
//     formData.budgetsActions,
//     fetchBudgetInitial,
//   ]);

//   useEffect(() => {
//     const updateBudgetRestant = async () => {
//       if (formData.exerciceBudgetaire && formData.services && formData.budgetsActions) {
//         await fetchBudgetRestant(
//           formData.exerciceBudgetaire,
//           formData.services,
//           formData.budgetsActions,
//           "" // Catégorie vide ici
//         );
//       }
//     };
//     updateBudgetRestant();
//   }, [
//     formData.exerciceBudgetaire,
//     formData.services,
//     formData.budgetsActions,
//     fetchBudgetRestant,
//   ]);

//   /* --- Rendu du composant --- */
//   return (
//     <Box 
//       sx={{ 
//         marginTop: 3, 
//         padding: 2, 
//         display: "flex", 
//         justifyContent: "center"
//       }}
//     >
//       <Grid container spacing={4} justifyContent="center">
//         {/* Propriété de la demande */}
//         <Grid item xs={12} md={6}>
//           <Typography variant="h6" gutterBottom>
//             Propriété de la demande
//           </Typography>
//           <Box>
//             {/* Type de demande */}
//             <TextField
//               select
//               fullWidth
//               label="Type de la demande"
//               name="typeDemande"
//               value={formData.typeDemande}
//               onChange={handleChange}
//               required
//               sx={{ marginBottom: 2 }}
//             >
//               <MenuItem value="achat">Demande d'achat</MenuItem>
//             </TextField>

//             {/* Exercice budgétaire */}
//             <TextField
//               select
//               fullWidth
//               label="Exercice budgétaire"
//               name="exerciceBudgetaire"
//               value={formData.exerciceBudgetaire}
//               onChange={handleChange}
//               required
//               sx={{ marginBottom: 2 }}
//             >
//               {[-1, 0, 1].map((offset) => {
//                 const year = new Date().getFullYear() + offset;
//                 return (
//                   <MenuItem key={year} value={year}>
//                     {year}
//                   </MenuItem>
//                 );
//               })}
//             </TextField>

//             {/* Pôle */}
//             <TextField
//               select
//               fullWidth
//               label="Pôle"
//               name="services"
//               value={formData.services || ""}
//               onChange={handlePoleChange}
//               required
//               sx={{ marginBottom: 2 }}
//             >
//               {poles.map((pole, index) => (
//                 <MenuItem key={index} value={pole}>
//                   {pole}
//                 </MenuItem>
//               ))}
//             </TextField>

//             {/* Budgets / Actions */}
//             {!formData.lignesTransversales && (
//               <TextField
//                 select
//                 fullWidth
//                 label="Budgets / Actions"
//                 name="budgetsActions"
//                 value={formData.budgetsActions || ""}
//                 onChange={handleChange}
//                 required
//                 sx={{ marginBottom: 2 }}
//               >
//                 {filteredBudgets.map((budget, index) => (
//                   <MenuItem key={index} value={budget.budget}>
//                     {budget.budget}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             )}
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default ProprieteDemande;







import React, { useState, useEffect, useMemo } from "react";
import { Box, Grid, Typography, TextField, MenuItem } from "@mui/material";

const ProprieteDemande = ({
  formData,
  handleChange,
  setFormData,
  fetchBudgetInitial,
  fetchBudgetRestant,
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

  // --- Rendu du composant ---
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
            {!formData.lignesTransversales && (
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
                  <MenuItem key={index} value={budget.budget}>
                    {budget.budget}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProprieteDemande;

