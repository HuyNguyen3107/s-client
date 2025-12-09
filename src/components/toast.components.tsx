import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useToastStore } from "../store/toast.store";

export default function Toast() {
  const { open, message, severity, closeToast } = useToastStore();
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={closeToast}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={closeToast} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
