import React, { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
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

    const today = new Date().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const [lignesEngagement, setLignesEngagement] = useState([]); // État pour les lignes

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
      setFormData({ ...formData, pieceJointe: file });
    };

    const [isTransversal, setIsTransversal] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Formulaire soumis :", formData);
      const dataSoumise = {
        ...formData,
        lignesEngagement, // Inclut les lignes d'engagement
      };
      console.log("Formulaire soumis :", dataSoumise);

       // Envoi des données via Fetch API
       fetch("process_form.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataSoumise),
      })
        .then((response) => response.text()) // Utilisez `.text()` au lieu de `.json()` pour voir la réponse brute
        .then((data) => {
          console.log("Réponse brute du serveur :", data);
          try {
            const parsedData = JSON.parse(data);
            console.log("Réponse JSON parsée :", parsedData);
          } catch (error) {
            console.error("Erreur lors du parsing JSON :", error);
          }
        })
        .catch((error) => {
          console.error("Erreur lors de l'envoi du formulaire :", error);
        });


    };

   

  return (
    <>
      {/* Barre rouge */}
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
                <Typography variant="body1">
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
    </>
  );
};

export default FormulaireDemande;
