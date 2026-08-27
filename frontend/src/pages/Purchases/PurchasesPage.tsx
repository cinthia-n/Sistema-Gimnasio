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

export default function PurchasesPage() {

  const { showSuccess, showError } = useNotification();
  const { data = [] } = usePurchases();

  const { data: suppliers = [] } = useSuppliers();

  const [openDialog, setOpenDialog] = useState(false);

  const [selectedPurchase, setSelectedPurchase] =
      useState<number | undefined>();

  const [detailOpen, setDetailOpen] = useState(false);

  const { data: detail } = usePurchaseDetail(selectedPurchase);

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

    </>

  );

}