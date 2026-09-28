import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  loading?: boolean;
  hideSaveButton?: boolean;
  children: React.ReactNode;
}

export default function FormDialog({
  open,
  title,
  onClose,
  onSave,  
  hideSaveButton = false,
  children,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle
        sx={{
          pb: 1,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h6"
            fontWeight="bold"
          >
            {title}
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          py: 3,
        }}
      >
        {children}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Button
          onClick={onClose}
        >
          Cancelar
        </Button>

        {!hideSaveButton && (

          <Button
            variant="contained"
            type="button"
            onClick={onSave}
          >
            Guardar
          </Button>

        )}
      </DialogActions>
    </Dialog>
  );
}