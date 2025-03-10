import { Button, Typography, Grid } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const FileUpload = ({ handleFileChange, selectedFiles }) => {
  return (
    <>
    <Grid item xs={12} md={3}>
      <Typography variant="body1" gutterBottom>
        Pièce jointe
      </Typography>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        Pièce(s) jointe(s)
        <input
          type="file"
          name="pieceJointe[]"
          onChange={handleFileChange}
          multiple
          style={{ display: "none" }}
        />
      </Button>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
        {selectedFiles.length > 0
          ? selectedFiles.map((file) => file.name).join(", ")
          : "Aucun fichier sélectionné."}
      </Typography>
    </Grid>
    </>
  );
};

export default FileUpload;
