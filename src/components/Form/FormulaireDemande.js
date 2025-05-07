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
import { newRow } from "../_config/config";


const initialState = {
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
  pieceJointe: [],
  copieDocument: false, // Première checkbox
  lignesTransversales: false, // Deuxième checkbox
};

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
      pieceJointe: [],
      copieDocument: false, // Première checkbox
      lignesTransversales: false, // Deuxième checkbox
    });
    const [lignesEngagement, setLignesEngagement] = useState([
      newRow
    ]);

    const [open, setOpen] = useState(false); // État pour la popup
    const [budgetInitial, setBudgetInitial] = useState("non connu");
    const [budgetRestant, setBudgetRestant] = useState("non connu");
    const [rowBudgetsInitial, setRowBudgetsInitial] = useState([]);
    const [filteredBudgetss, setFilteredBudgets] = useState([]); // Budgets filtrés
    
    const [nom, setNom] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        fetch("https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/recuperer_user_id.php")
          .then((response) => response.json())
          .then((data) => {
            
            setNom(data);
          })
          .catch((error) => console.error("Erreur lors de la récupération de l'utilisateur connecté:", error));
      }, []);
  useEffect(() => {
    fetch("https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/data.php")
      .then((response) => response.json())
      .then((data) => {
        
        setFilteredBudgets(data);
      })
      .catch((error) => console.error("Erreur lors de la récupération des budgets :", error));
  }, []);
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const jsonData = urlParams.get("json");
      const action = urlParams.get("action");
      console.log('👌👌👌👌👌👌👌👌👌👌👌👌👌👌👌👌formData avant action',formData)
    
      if (jsonData) {
        
        try {
          const parsedData = JSON.parse(jsonData);
    
          
    
          // Incrémenter le numéro de pièce uniquement si l'action est "duplicate"
          if (action === "duplicate" && parsedData.numeroPiece) {
            const currentNumeroPiece = parsedData.numeroPiece;
            const prefix = currentNumeroPiece.slice(0, -6); // Récupère tout sauf les 6 derniers caractères
            const sequence = parseInt(currentNumeroPiece.slice(-6)) + 1; // Incrémente la séquence
            const newNumeroPiece = `${prefix}${sequence.toString().padStart(6, "0")}`; // Reformate avec les zéros

            parsedData.numeroPiece = newNumeroPiece;
             // Met à jour le numéro de pièce
      console.log('👌👌👌👌👌👌👌👌👌👌👌👌👌👌👌👌formData dans action',formData)

          }
    
          // Mettre à jour les données du formulaire
          setFormData((prev) => ({
            ...prev,
            ...parsedData,
          }));
          console.log('👌👌👌👌👌👌👌👌👌👌👌👌👌👌👌👌formData avant action',formData)
    
          // Mettre à jour les lignes d'engagement
          if (parsedData.lignesEngagement) {
            
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

    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
      const {checked, name} = e.target;
        const isChecked = checked;
        setFormData((prevData) => ({
        ...prevData,
        [name]: isChecked,
        }));
    };

    // const handleFileChange = (e) => {
    //   const files = e.target.files;
    //   setFormData((prevData) => ({
    //     ...prevData,
    //     pieceJointe: files,
    //   }));
    // };

    const handleFileChange = (event) => {
      const files = Array.from(event.target.files);
      
      // Mise à jour du state formData pour conserver les fichiers
      setFormData((prevData) => ({
        ...prevData,
        pieceJointe: files,
      }));
    
      // Mise à jour de selectedFiles pour l'affichage
      setSelectedFiles(files);
    
      
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

      const adresseParDefaut = `VAINCRE LA MUCOVISCIDOSE\n181 RUE DE TOLBIAC\n75013 Paris\nfactures@vaincrelamuco.org`;


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

        // Ajout du budget initial et restant dans chaque ligne d'engagement
        const lignesEngagementAvecBudget = lignesEngagement.map((ligne) => ({
          ...ligne,
          budgetInitial: ligne.budgetInitial || "non connu",
          budgetRestant: ligne.budgetRestant || "non connu",
      }));

        // Mettre à jour formData avec l'adresse par défaut si elles ne sont pas remplies
        const formDataUpdated = {
          ...formData,
          adresseLivraison: adresseParDefaut,
          adresseFacturation: adresseParDefaut,
        };
  
        // Préparer les données à soumettre avec le numéro de pièce mis à jour
        const dataSoumise = {
          ...formDataUpdated,
          lignesEngagement: lignesEngagementAvecBudget,
          numeroPiece: generatedNumeroPiece, // Mise à jour du numéro de pièce
          demandeur,
        };

        console.log("📌 Données soumises :", dataSoumise);
  
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
          
          
          setOpen(true); // Ouvre la popup de confirmation
  
          if (formData.pieceJointe && formData.pieceJointe.length > 0) {
            const formDataFile = new FormData();
          
            // Ajout de toutes les données du formulaire
            for (const key in formData) {
              if (formData.hasOwnProperty(key)) {
                formDataFile.append(key, formData[key]);
              }
            }
          
            // Ajout des fichiers
            for (let i = 0; i < formData.pieceJointe.length; i++) {
              formDataFile.append("pieceJointe[]", formData.pieceJointe[i]); // Ajouter chaque fichier
            }
          
            // Ajout du numéro de pièce
            formDataFile.append("numeroPiece", generatedNumeroPiece); 
            formDataFile.append("totalGeneral", totalGeneral);
            formDataFile.append("lignesEngagement", JSON.stringify(lignesEngagement));
          
            try {
              const fileResponse = await fetch("upload_file.php", {
                method: "POST",
                body: formDataFile, // Envoi du fichier avec toutes les données
              });
          
              const fileData = await fileResponse.json();
          
              if (fileData.status === "success") {
                
              } else {
                console.error("⚠️ Erreur lors de l'envoi des pièces jointes :", fileData.message);
              }
            } catch (error) {
              console.error("⚠️ Erreur lors de l'upload des pièces jointes :", error);
            }
          }
  
        } else {
          console.error("❌ Erreur lors de la soumission :", data.message);
          alert("Une erreur est survenue lors de la soumission.");
        }
      } catch (error) {
        console.error("❌ Erreur lors de la soumission :", error);
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

  const fetchBudgetInitial = async (annee, codePole, budget, categorie) => {
    console.log("🔍 Fetching Budget Initial avec :", { annee, codePole, budget, categorie });
    try {
      const response = await fetch("https://armoires.zeendoc.com/vaincre_la_mucoviscidose/_ClientSpecific/66579/affichage_budget_sur_da.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ annee, code_pole: codePole, actions: budget, categorie }),
      });
  
      const data = await response.json();
      console.log("📌 Réponse Budget Initial :", data);

      return data.montant_initial || "non connu";
    } catch (error) {
      console.error("❌ Erreur lors de la récupération du budget initial :", error);

      return "non connu";
    }
  };

  const fetchBudgetRestant = async (annee, codePole, budget, categorie) => {
    console.log("🔍 Fetching Budget Restant avec :", { annee, codePole, budget, categorie });
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
                  <strong>Initiateur de la demande :</strong> {nom || "Non connu..."}
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
            setFormData={setFormData}
            fetchBudgetInitial={fetchBudgetInitial}
            budgetInitial={budgetInitial}
            fetchBudgetRestant={fetchBudgetRestant}
            budgetRestant={budgetRestant}
          />

          {/* Section Propriété de la demande */}
          <LignesEngagements 
            filteredBudgetss={filteredBudgetss}
            formData={formData} 
            handleChange={handleChange} 
            selectedBudgetAction={formData.budgetsActions}
            selectedBudget={formData.budgetsActions}
            lignesEngagements={lignesEngagement}
            setLignesEngagement={setLignesEngagement}
            setFormData={setFormData}
            fetchBudgetInitial={fetchBudgetInitial}
            budgetInitial={budgetInitial}
            fetchBudgetRestant={fetchBudgetRestant}
            budgetRestant={budgetRestant}
            selectedPole={formData.services} 
            initialBudgetsInitial={rowBudgetsInitial} 
          />

          <InformationLivraison 
              formData={formData}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
              selectedFiles={selectedFiles} 
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
