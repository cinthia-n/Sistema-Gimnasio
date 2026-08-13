import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

import { usePurchases } from "../../hooks/usePurchases";

import PurchaseTable from "./components/PurchaseTable";
import PurchaseDialog from "./components/PurchaseDialog";
import { useSuppliers } from "../../hooks/useSuppliers";
import { useCreatePurchase } from "../../hooks/useCreatePurchase";
export default function PurchasesPage() {

  const { data = [] } = usePurchases();

  const { data: suppliers = [] } = useSuppliers();

  const [openDialog, setOpenDialog] = useState(false);

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
        alert("Seleccione un proveedor");
        return;
      }

      if (!purchase.paymentMethod) {
        alert("Seleccione el método de pago");
        return;
      }

      if (!purchase.details.length) {
        alert("Agregue al menos un producto");
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

    await createPurchase.mutateAsync(dto);

    setOpenDialog(false);

    setPurchase({

        supplierId: "",

        invoiceNumber: "",

        notes: "",

        paymentMethod: "CASH",

        details: [],

    });

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
        onView={() => {}}
      />

      <PurchaseDialog

        open={openDialog}

        value={purchase}

        onChange={setPurchase}
        suppliers={suppliers}
        
        onClose={()=>setOpenDialog(false)}

        onSave={handleSave}

      />

    </>

  );

}