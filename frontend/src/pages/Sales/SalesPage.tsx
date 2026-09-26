import { useState, useRef } from "react";

import Typography from "@mui/material/Typography";

import TableToolbar from "../../components/table/TableToolbar";
import DataTable from "../../components/table/DataTable";
import FormDialog from "../../components/common/FormDialog";

import SaleForm from "./components/SaleForm";
import type { SaleFormRef } from "./components/SaleForm";
import SaleDetail from "./components/SaleDetail";

import { useSales } from "../../hooks/useSales";
import { useSale } from "../../hooks/useSale";
import { useRegisterSale } from "../../hooks/useRegisterSale";

import { toast } from "react-toastify";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useCancelSale } from "../../hooks/useCancelSale";
import CancelActionDialog from "../../components/common/CancelActionDialog";
import { useAuth } from "../auth/AuthContext";
import { useNotification } from "../../context/NotificationContext";


export default function SalesPage() {

    const [search, setSearch] = useState("");

    const [open, setOpen] = useState(false);

    const formRef = useRef<SaleFormRef>(null);

    const registerSale = useRegisterSale();

    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";

    const cancelSale = useCancelSale();

    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [saleToCancel, setSaleToCancel] = useState<number | null>(null);

    const handleCancelSale = async (reason: string) => {

        if (!saleToCancel) return;

        try {

            await cancelSale.mutateAsync({ id: saleToCancel, reason });

            toast.success("Venta anulada correctamente");

            setCancelDialogOpen(false);
            setSaleToCancel(null);

        } catch (error) {

            console.error(error);
            toast.error(getErrorMessage(error, "No se pudo anular la venta"));

        }

    };

    const columns = [
        { field: "saleDate", headerName: "Fecha" },
        { field: "code", headerName: "Código" },
        { field: "total", headerName: "Total" },
        { field: "paymentMethod", headerName: "Forma de pago" },
    ];

    const [selectedSaleId, setSelectedSaleId] =
        useState<number | null>(null);

    const [detailOpen, setDetailOpen] = useState(false);

    const { data: sales = [] } = useSales();

    const { data: selectedSale } = useSale(selectedSaleId ?? undefined);

    const { showSuccess, showError } = useNotification();

    const rows = sales.map((sale: any) => ({
        id: sale.id,
        saleDate: new Date(sale.saleDate).toLocaleString(),
        code: `VTA-${sale.id.toString().padStart(5, '0')}${sale.status === 'CANCELLED' ? ' (Anulada)' : ''}`,
        total: `Bs ${sale.total}`,
        paymentMethod: sale.paymentMethod === 'CASH' ? 'Efectivo' : 'QR',
    }));

    const handleView = (row: any) => {
        setSelectedSaleId(row.id);
        setDetailOpen(true);
    };

    const handleRegisterSale = async () => {

    const dto = formRef.current?.submit();

    if (!dto) {
        return;
    }

    try {
        await registerSale.mutateAsync(dto);
        showSuccess("Venta registrada correctamente");
        setOpen(false);
    } catch (error) {
        console.error("Error al registrar venta:", error);
        showError(getErrorMessage(error, "Error al registrar la venta"));
    }
};

    const isSameDay = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    };

    const canCancel = (sale: any) => {
        if (isAdmin) return true;
        return sale.userId === user?.id && isSameDay(sale.saleDate);
    };

    return (
        <>
            <Typography variant="h4" mb={3}>
                Ventas
            </Typography>

            <TableToolbar
                title="Ventas"
                search={search}
                onSearchChange={setSearch}
                onNew={() => setOpen(true)}
            />

            <DataTable
                columns={columns}
                rows={rows}
                onEdit={handleView}
                onCancel={(row: any) => {

                    const sale = sales.find((s: any) => s.id === row.id);

                    if (sale?.status === 'CANCELLED') {
                        showError("Esta venta ya fue anulada");
                        return;
                    }

                    if (!canCancel(sale)) {
                        showError("Solo puede anular sus propias ventas del día de hoy");
                        return;
                    }

                    setSaleToCancel(row.id);
                    setCancelDialogOpen(true);
                }}
            />
            <FormDialog
                open={open}
                title="Nueva Venta"
                onClose={() => setOpen(false)}
                onSave={handleRegisterSale}
            >
                <SaleForm ref={formRef} />
            </FormDialog>

            <FormDialog
                open={detailOpen}
                title="Detalle de Venta"
                onClose={() => {
                    setDetailOpen(false);
                    setSelectedSaleId(null);
                }}
                onSave={() => {}}
                hideSaveButton
            >
                <SaleDetail sale={selectedSale} />
            </FormDialog>

            <CancelActionDialog
                open={cancelDialogOpen}
                title={`Anular Venta #${saleToCancel}`}
                description="Esta acción devolverá el stock de los productos y revertirá el movimiento de caja correspondiente."
                onClose={() => {
                    setCancelDialogOpen(false);
                    setSaleToCancel(null);
                }}
                onConfirm={handleCancelSale}
            />
        </>
    );
}