import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

import { usePurchases } from "../../hooks/usePurchases";
import { usePurchaseDetail } from "../../hooks/usePurchaseDetail";

import PurchaseTable from "./components/PurchaseTable";
import PurchaseDialog from "./components/PurchaseDialog";
import PurchaseDetailDialog from "./components/PurchaseDetailDialog";

import { useSuppliers } from "../../hooks/useSuppliers";
import { useCreatePurchase } from "../../hooks/useCreatePurchase";

import { useNotification } from "../../context/NotificationContext";
import { getErrorMessage } from "../../utils/getErrorMessage";

import { useCancelPurchase } from "../../hooks/useCancelPurchase";
import CancelActionDialog from "../../components/common/CancelActionDialog";
import { useAuth } from "../auth/AuthContext";

export default function PurchasesPage() {

  const { showSuccess, showError } = useNotification();
  const { data = [] } = usePurchases();

  const { data: suppliers = [] } = useSuppliers();

  const [openDialog, setOpenDialog] = useState(false);

  const [selectedPurchase, setSelectedPurchase] =
      useState<number | undefined>();

  const [detailOpen, setDetailOpen] = useState(false);

  const { data: detail } = usePurchaseDetail(selectedPurchase);

  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const cancelPurchase = useCancelPurchase();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [purchaseToCancel, setPurchaseToCancel] = useState<number | null>(null);

  const handleCancelPurchase = async (reason: string) => {

    if (!purchaseToCancel) return;

    try {

        await cancelPurchase.mutateAsync({ id: purchaseToCancel, reason });
        showSuccess("Compra anulada correctamente");

        setCancelDialogOpen(false);
        setPurchaseToCancel(null);

    } catch (error) {

        console.error(error);
        showError(getErrorMessage(error, "No se pudo anular la compra"));

    }

  };

  const [purchase, setPurchase] = useState({
    supplierId: "",
    invoiceNumber: "",
    notes: "",
    paymentMethod: "",
    details: [],
  });

  const rows = data.map((purchase: any) => ({
    id: purchase.id,
    purchaseDate: purchase.purchaseDate,
    supplier: purchase.supplier?.name,
    invoiceNumber: purchase.invoiceNumber,
    paymentMethod: purchase.paymentMethod,
    total: purchase.total,
    status: purchase.status,
  }));

  const createPurchase = useCreatePurchase();

  const handleSave = async () => {

    if (!purchase.supplierId) {
      showError("Seleccione un proveedor");
      return;
    }

    if (!purchase.paymentMethod) {
      showError("Seleccione el método de pago");
      return;
    }

    if (!purchase.details.length) {
      showError("Agregue al menos un producto");
      return;
    }

    const dto = {
      supplierId: Number(purchase.supplierId),
      invoiceNumber: purchase.invoiceNumber,
      paymentMethod: purchase.paymentMethod,
      notes: purchase.notes,
      details: purchase.details.map((item: any) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        unitCost: Number(item.unitCost),
      })),
    };

    try {

      await createPurchase.mutateAsync(dto);

      showSuccess("Compra registrada correctamente");

      setOpenDialog(false);

      setPurchase({
        supplierId: "",
        invoiceNumber: "",
        notes: "",
        paymentMethod: "CASH",
        details: [],
      });

    } catch (error) {

      console.error("Error al registrar compra:", error);
      showError(getErrorMessage(error, "Error al registrar la compra"));

    }

  };

  const canCancel = (purchase: any) => {

    if (isAdmin) return true;

    if (purchase.createdById !== user?.id) return false;

    const date = new Date(purchase.purchaseDate);
    const today = new Date();

    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
  };

  return (

    <>

      <Stack
        direction="row"
        justifyContent="space-between"
        mb={3}
      >

        <Typography variant="h4">
          Compras
        </Typography>

        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
        >
          Nueva compra
        </Button>

      </Stack>

      <PurchaseTable
        rows={rows}
        onView={(row) => {
          setSelectedPurchase(row.id);
          setDetailOpen(true);
        }}
        onCancel={(row: any) => {

            const purchase = data.find((p: any) => p.id === row.id);

            if (purchase?.status === 'CANCELLED') {
                showError("Esta compra ya fue anulada");
                return;
            }

            if (!canCancel(purchase)) {
                showError("Solo puede anular sus propias compras del día de hoy");
                return;
              }

            setPurchaseToCancel(row.id);
            setCancelDialogOpen(true);
        }}
      />

      <PurchaseDialog
        open={openDialog}
        value={purchase}
        onChange={setPurchase}
        suppliers={suppliers}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
      />

      <PurchaseDetailDialog
        open={detailOpen}
        detail={detail}
        onClose={() => {
          setDetailOpen(false);
          setSelectedPurchase(undefined);
        }}
      />

      <CancelActionDialog
        open={cancelDialogOpen}
        title="Anular Compra"
        description="Esta acción revertirá el stock recibido y el movimiento de caja correspondiente."
        onClose={() => {
            setCancelDialogOpen(false);
            setPurchaseToCancel(null);
        }}
        onConfirm={handleCancelPurchase}
      />

    </>

  );

}