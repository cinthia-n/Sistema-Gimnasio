import { useState } from "react";

import Typography from "@mui/material/Typography";

import TableToolbar from "../../components/table/TableToolbar";
import DataTable from "../../components/table/DataTable";
import FormDialog from "../../components/common/FormDialog";

import SaleForm from "./components/SaleForm";
import SaleDetail from "./components/SaleDetail";
import { useSales } from "../../hooks/useSales";
import { useSale } from "../../hooks/useSale";

export default function SalesPage() {

    const [search, setSearch] = useState("");

    const [open, setOpen] = useState(false);

    const columns = [

        {
            field: "saleDate",
            headerName: "Fecha",
        },

        {
            field: "code",
            headerName: "Código",
        },

        {
            field: "total",
            headerName: "Total",
        },

        {
            field: "paymentMethod",
            headerName: "Forma de pago",
        },

    ];

    const [selectedSaleId, setSelectedSaleId] =
        useState<number | null>(null);

    const [detailOpen, setDetailOpen] =
        useState(false);

    const { data: sales = [] } = useSales();

    const {

        data: selectedSale,

    } = useSale(

        selectedSaleId ?? undefined,

    );

    const rows = sales.map((sale: any) => ({

        id: sale.id,

        saleDate: new Date(sale.saleDate).toLocaleString(),

        code: `VTA-${sale.id.toString().padStart(5, '0')}`,

        total: `Bs ${sale.total}`,

        paymentMethod:
            sale.paymentMethod === 'CASH'
                ? 'Efectivo'
                : 'QR',

        }));
    
    const handleView = (row: any) => {

        setSelectedSaleId(row.id);

        setDetailOpen(true);

    };

    return (

        <>

            <Typography
                variant="h4"
                mb={3}
            >
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

            />

            <FormDialog

                open={open}

                title="Nueva Venta"

                onClose={() => setOpen(false)}

                onSave={() => {}}

            >

                <SaleForm />

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

                <SaleDetail

                    sale={selectedSale}

                />

            </FormDialog>

        </>

    );

}