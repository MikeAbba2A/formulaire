import FormulaireDemande from "../Form/FormulaireDemande";
import { useState } from "react";
const App = () => {
  const [typeDemande, setTypeDemande] = useState("");
  return (
    <FormulaireDemande
      typeDemande={typeDemande}
      setTypeDemande={setTypeDemande}
    />
  );
};

export default App;
