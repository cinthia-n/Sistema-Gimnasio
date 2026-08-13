import { useRef } from "react";

import { Button } from "@mui/material";

import { exportCashPdf } from "../../../hooks/useExportCashPdf";

import CashReport from "./CashReport";

import FormDialog from "../../../components/common/FormDialog";

interface Props {

    open: boolean;

    onClose: () => void;

    detail: any;

}

export default function CashDetailDialog({

    open,

    onClose,

    detail,

}: Props) {

    const reportRef =
    useRef<HTMLDivElement>(null);

    if (!detail) return null;

    return (

        <FormDialog

            open={open}

            title="Detalle del cierre de caja"

            onClose={onClose}

            onSave={onClose}

        >
            <Button

                variant="contained"

                sx={{ mb: 2 }}

                onClick={() => {

                    if (!reportRef.current) return;

                    exportCashPdf(

                        reportRef.current,

                        `CierreCaja-${detail.id}`,

                    );

                }}

            >

                Exportar PDF

            </Button>

            <CashReport 
                ref={reportRef}
                detail={detail}/>
        </FormDialog>

    );

}