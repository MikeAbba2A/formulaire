import React, { createContext, useContext, useState } from "react";

// Création du contexte
const BudgetContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useBudget = () => useContext(BudgetContext);

// Provider pour encapsuler les composants
export const BudgetProvider = ({ children }) => {
  const [selectedBudget, setSelectedBudget] = useState(""); // Budget sélectionné

  return (
    <BudgetContext.Provider value={{ selectedBudget, setSelectedBudget }}>
      {children}
    </BudgetContext.Provider>
  );
};
