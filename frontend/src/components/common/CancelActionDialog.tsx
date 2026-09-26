import { useState } from "react";
import { Stack, TextField, Typography } from "@mui/material";
import FormDialog from "../common/FormDialog";
import { toast } from "react-toastify";
interface Props {
    open: boolean;
    title: string;
    description: string;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

export default function CancelActionDialog({
    open,
    title,
    description,
    onClose,
    onConfirm,
}: Props) {

    const [reason, setReason] = useState("");

    const handleSave = () => {

        if (!reason.trim()) {
            toast.warning("Debe indicar el motivo de la anulación");
            return;
         }

        onConfirm(reason);
        setReason("");
    };

    return (

        <FormDialog
            open={open}
            title={title}
            onClose={() => {
                setReason("");
                onClose();
            }}
            onSave={handleSave}
        >

            <Stack spacing={2}>

                <Typography color="text.secondary">
                    {description}
                </Typography>

                <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    label="Motivo de la anulación"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                />

            </Stack>

        </FormDialog>

    );

}