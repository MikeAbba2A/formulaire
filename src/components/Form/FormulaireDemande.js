import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import HeaderBar from "./HeaderBar";
import AdresseSection from "./AdresseSection";
import FournisseurSection from "./FournisseurSection";
import CheckboxSection from "./CheckboxSection";
import ProprieteDemande from "./ProprieteDemande"; // Import du nouveau composant
import LignesEngagements from "./LignesEngagements";
import InformationLivraison from "./InformationLivraison";

const FormulaireDemande = () => {

    const [formData, setFormData] = useState({
        adresseLivraison: "",
        adresseFacturation: "",
        fournisseur: "",
        numeroPiece: "",
        copieDocument: false,
        typeDemande: "",
        exerciceBudgetaire: "",
        services: "",
        budgetsActions: "",
        budgetInitial: "non connu",
        budgetRestant: "non connu",
        dateReception: "",
        descriptionDemande: "",
        justification: "",
        pieceJointe: null,
        copieDocument: false, // Première checkbox
        lignesTransversales: false, // Deuxième checkbox
      });
    const [lignesEngagement, setLignesEngagement] = useState([
      { budgetAction: "", categorie: "", sousCategorie: "", quantite: 0, prixUnitaire: 0, total: 0 },
    ]);
    const [isTransversal, setIsTransversal] = useState(false);
    const [open, setOpen] = useState(false); // État pour la popup
    const [budgetInitial, setBudgetInitial] = useState("non connu");
    const [budgetRestant, setBudgetRestant] = useState("non connu");
    const [rowBudgetsInitial, setRowBudgetsInitial] = useState([]);

    const updateBudgetInitial = (index, montant) => {
      setRowBudgetsInitial((prev) => {
        const updatedBudgets = [...prev];
        updatedBudgets[index] = montant;
        return updatedBudgets;
      });
    };
    // useEffect(() => {
    //   const urlParams = new URLSearchParams(window.location.search);
    //   const jsonData = urlParams.get("json");
    
    //   if (jsonData) {
    //     console.log("JSON brut reçu :", jsonData);
    //     try {
    //       const parsedData = JSON.parse(jsonData);
    
    //       console.log("Données analysées :", parsedData);
    
    //       // Mettre à jour les données du formulaire
    //       setFormData((prev) => ({
    //         ...prev,
    //         ...parsedData,
    //       }));
    
    //       // Mettre à jour les lignes d'engagement séparément
    //       if (parsedData.lignesEngagement) {
    //         console.log("Lignes d'engagement analysées :", parsedData.lignesEngagement);
    
    //         setLignesEngagement(() => {
    //           console.log("Mise à jour de l'état des lignes d'engagement...");
    //           return parsedData.lignesEngagement; // Retourne directement les données analysées
    //         });
    
    //         setTimeout(() => {
    //           console.log("État actuel des lignes d'engagement :", lignesEngagement);
    //         }, 100); // Vérifie l'état après une petite pause
    //       }
    //     } catch (error) {
    //       console.error("Erreur lors du parsing du JSON :", error);
    //     }
    //   }
    // }, []);

    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const jsonData = urlParams.get("json");
      const action = urlParams.get("action");
    
      if (jsonData) {
        console.log("JSON brut reçu :", jsonData);
        try {
          const parsedData = JSON.parse(jsonData);
    
          console.log("Données analysées :", parsedData);
    
          // Incrémenter le numéro de pièce uniquement si l'action est "duplicate"
          if (action === "duplicate" && parsedData.numeroPiece) {
            const currentNumeroPiece = parsedData.numeroPiece;
            const prefix = currentNumeroPiece.slice(0, -6); // Récupère tout sauf les 6 derniers caractères
            const sequence = parseInt(currentNumeroPiece.slice(-6)) + 1; // Incrémente la séquence
            const newNumeroPiece = `${prefix}${sequence.toString().padStart(6, "0")}`; // Reformate avec les zéros

            parsedData.numeroPiece = newNumeroPiece; // Met à jour le numéro de pièce
          }
    
          // Mettre à jour les données du formulaire
          setFormData((prev) => ({
            ...prev,
            ...parsedData,
          }));
    
          // Mettre à jour les lignes d'engagement
          if (parsedData.lignesEngagement) {
            console.log("Lignes d'engagement analysées :", parsedData.lignesEngagement);
            setLignesEngagement([...parsedData.lignesEngagement]);
          }
        } catch (error) {
          console.error("Erreur lors du parsing du JSON :", error);
        }
      }
    }, []);

    const today = new Date().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  
    const handleFormDataChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleRowsChange = (updatedRows) => {
      setLignesEngagement(updatedRows);
    };
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e, field) => {
        const isChecked = e.target.checked;
    
        // Mettre à jour l'état des cases à cocher
        setFormData((prevData) => ({
        ...prevData,
        [field]: isChecked,
        }));
    
        // Mettre à jour l'état du titre si la checkbox "Lignes d'engagement transversale" est modifiée
        if (field === "lignesTransversales") {
        setIsTransversal(isChecked);
        }
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        pieceJointe: file,
      }));
    };

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

    // Fonction pour obtenir la date actuelle au format YYMMDD
    const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear().toString().slice(2); // Année sur deux chiffres
    const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Mois sur deux chiffres
    const day = today.getDate().toString().padStart(2, "0"); // Jour sur deux chiffres
    return `${year}${month}${day}`; // Format YYMMDD
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

     // Vérifier si toutes les lignes ont une catégorie sélectionnée
    const categorieManquante = lignesEngagement.some((row) => !row.categorie);

    if (categorieManquante) {
      alert("Toutes les lignes doivent avoir une catégorie sélectionnée.");
      return; // Bloquer la soumission
    }
  
    // Calculer le total général
    const totalGeneral = lignesEngagement.reduce((acc, row) => acc + (row.total || 0), 0);
    const montantInitialInconnu = rowBudgetsInitial.some((montant) => montant === "non connu");

    if (montantInitialInconnu) {
      alert("Le montant initial d'une ou plusieurs lignes est 'non connu', validation non permise.");
      return; // Bloque la validation du formulaire
    }
  
    // Vérifier si le montant total est 0.00
    if (totalGeneral === 0) {
      alert("Le montant de la demande d'achat est de 0.00€, validation non permise.");
      return; // Bloque la validation du formulaire
    }

    // Récupérer le demandeur depuis l'élément #demandeur
    const demandeurElement = document.getElementById("demandeur");
    const demandeur = demandeurElement
      ? demandeurElement.textContent.replace("Initiateur de la demande :", "").trim()
      : "Inconnu";
  
    // Récupérer Res_Id depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const resId = urlParams.get("Res_Id"); // Extraction de Res_Id
    const etat_action = urlParams.get("action");
  
    // Envoyer le Res_Id pour le traitement
    if (etat_action === "edit" && resId) {
      try {
        const resIdResponse = await fetch("traitement_res_id.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resId }), // Envoyer le Res_Id dans le body
        });
  
        const resIdData = await resIdResponse.json();
  
        if (resIdData.status !== "success") {
          console.error("Erreur lors du traitement du Res_Id :", resIdData.message);
        } else {
          console.log("Traitement Res_Id réussi :", resIdData.message);
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi du Res_Id :", error);
      }
    }
  
    try {
      // Récupération et incrémentation de la séquence
      const sequenceResponse = await fetch("generate_sequence.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ year: new Date().getFullYear(), preview: false }), // preview:false pour incrémenter
      });
  
      const sequenceData = await sequenceResponse.json();
  
      if (!sequenceData.sequence) {
        throw new Error("Erreur lors de la récupération de la séquence : " + sequenceData.error);
      }
  
      // Construction du numéro de pièce avec la séquence générée
      const generatedNumeroPiece = `${polesMap[formData.services]}${getCurrentDate()}${sequenceData.sequence}`;
  
      // Préparer les données à soumettre avec le numéro de pièce mis à jour
      const dataSoumise = {
        ...formData,
        lignesEngagement,
        numeroPiece: generatedNumeroPiece, // Mise à jour du numéro de pièce
        demandeur,
      };
  
      // Soumission des données
      const response = await fetch("process_form.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataSoumise),
      });
  
      const data = await response.json();
  
      if (data.status === "success") {
        console.log("Formulaire soumis avec succès !");
        setOpen(true); // Ouvre la popup de confirmation
      } else {
        console.error("Erreur lors de la soumission :", data.message);
        alert("Une erreur est survenue lors de la soumission.");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      alert("Une erreur est survenue.");
    }
    };
  
    const handleClose = () => {
      setOpen(false); // Ferme la popup
      if (window.opener) {
        window.close(); // Ferme la fenêtre si elle a été ouverte via JavaScript
      } else {
        alert("Cette fenêtre ne peut pas être fermée automatiquement.");
      }
    };

  const handleDuplicate = () => {
    console.log("Duplication de la demande d'achat.");
    // Logique pour dupliquer la demande d'achat
    setOpen(false);
  };

  const fetchBudgetInitial = async (annee, codePole, budget, categorie) => {
    try {
      const response = await fetch("https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/affichage_budget_sur_da.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ annee, code_pole: codePole, actions: budget, categorie }),
      });
  
      const data = await response.json();
      return data.montant_initial || "non connu";
    } catch (error) {
      console.error("Erreur lors de la récupération du budget initial :", error);
      return "non connu";
    }
  };

  const fetchBudgetRestant = async (annee, codePole, budget, categorie) => {
    try {
      const response = await fetch("https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/affichage_budget_restant_sur_da.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ annee, code_pole: codePole, actions: budget, categorie }),
      });
  
      const data2 = await response.json();
      return data2.montant_restant || "non connu";
    } catch (error) {
      console.error("Erreur lors de la récupération du budget initial :", error);
      return "non connu";
    }
  };

  return (
    <>
      {/* Barre verte */}
      <HeaderBar />

      {/* Contenu du formulaire */}
      <Paper
        elevation={3}
        sx={{
          padding: "20px",
          maxWidth: "70%",
          margin: "20px auto",
          borderRadius: "10px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box sx={{ marginBottom: 2 }}>
              <Box sx={{ marginBottom: 2 }}>
                  <img
                  src={`${process.env.PUBLIC_URL}/vlm_logo.png`}
                  alt="Logo"
                  style={{ height: "100px" }}
                  />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1">
                      <strong>Date :</strong> {today}
                  </Typography>
                  <Typography variant="body1" id="demandeur">
                  <strong>Initiateur de la demande :</strong> Admin 365
                  </Typography>
              </Box>
          </Box>

        
          {/* Section Adresses */}
          <AdresseSection formData={formData} handleChange={handleChange} />

          {/* Section Fournisseur */}
          <FournisseurSection
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
          />

          {/* Section Checkbox */}
          <CheckboxSection
            formData={formData}
            handleCheckboxChange={handleCheckboxChange}
          />

          {/* Section Propriété de la demande */}
          <ProprieteDemande 
            formData={formData} 
            handleChange={handleFormDataChange} 
            isTransversal={isTransversal} 
            setFormData={setFormData}
            fetchBudgetInitial={fetchBudgetInitial}
            budgetInitial={budgetInitial}
            fetchBudgetRestant={fetchBudgetRestant}
            budgetRestant={budgetRestant}
          />

          {/* Section Propriété de la demande */}
          <LignesEngagements 
            formData={formData} 
            handleChange={handleChange} 
            isTransversal={isTransversal} 
            selectedBudgetAction={formData.budgetsActions}
            selectedBudget={formData.budgetsActions}
            onRowsChange={handleRowsChange}
            setFormData={setFormData}
            fetchBudgetInitial={fetchBudgetInitial}
            budgetInitial={budgetInitial}
            fetchBudgetRestant={fetchBudgetRestant}
            budgetRestant={budgetRestant}
            initialRows={lignesEngagement}
            selectedPole={formData.services} 
            initialBudgetsInitial={rowBudgetsInitial} 
          />

          <InformationLivraison 
              formData={formData}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
          />

          {/* Bouton de soumission */}
          <Box sx={{ textAlign: "center", marginTop: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ textTransform: "none" }}
            >
              Soumettre
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Popup */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Demande d'achat créée</DialogTitle>
        <DialogContent>
          <DialogContentText>
            La demande d'achat a été créée avec succès, elle est en cours de
            dépôt sur le classeur.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fermer la fenêtre
          </Button>
          {/* <Button onClick={handleDuplicate} color="secondary">
            Dupliquer la D.A.
          </Button> */}
        </DialogActions>
      </Dialog>  

    </>
  );
};

export default FormulaireDemande;
