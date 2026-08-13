import {

    Typography,

    Button,

    Stack,

} from "@mui/material";

import { useSuppliers } from "../../hooks/useSuppliers";

import SupplierTable from "./components/SupplierTable";

import { useState } from "react";

import FormDialog from "../../components/common/FormDialog";
import SupplierForm from "./components/SupplierForm";

import { useCreateSupplier } from "../../hooks/useCreateSupplier";
import { useUpdateSupplier } from "../../hooks/useUpdateSupplier";

import SupplierDetailDialog from "./components/SupplierDetailDialog";

import { useSupplierDetail } from "../../hooks/useSupplierDetail";

export default function SuppliersPage(){

    const {

        data=[],

    }=useSuppliers();

    const [selectedSupplier, setSelectedSupplier] =
        useState<number | undefined>();

    const [detailOpen, setDetailOpen] =
        useState(false);
    const createSupplier = useCreateSupplier();

    const updateSupplier = useUpdateSupplier();

    const {

        data: detail,

    } = useSupplierDetail(

        selectedSupplier,

    );

    const [openDialog, setOpenDialog] = useState(false);

    const [editing, setEditing] = useState<any>(null);

    const [supplier, setSupplier] = useState({

        name: "",

        contactPerson: "",

        phone: "",

        address: "",

        nit: "",

        notes: "",

    });

    const rows=data.map((s:any)=>({

        id:s.id,

        name:s.name,

        contactPerson:s.contactPerson,

        phone:s.phone,

        purchases:s._count.purchases,

        status:s.isActive

            ?"Activo"

            :"Inactivo",

    }));

    const handleSave = async () => {

        if (editing) {

                await updateSupplier.mutateAsync({

                id: editing.id,

                dto: supplier,

            });

        } else {

            await createSupplier.mutateAsync(

                supplier,

            );

        }

        setOpenDialog(false);

    };

    return(

        <>

            <Stack

                direction="row"

                justifyContent="space-between"

                mb={3}

            >

                <Typography variant="h4">

                    Proveedores

                </Typography>

                <Button

                    variant="contained"

                    onClick={() => {

                        setEditing(null);

                        setSupplier({

                             name: "",

                            contactPerson: "",

                            phone: "",

                            address: "",

                            nit: "",

                            notes: "",

                        });

                        setOpenDialog(true);

                    }}

                >

                     Nuevo proveedor

                </Button>

            </Stack>

            <SupplierTable

                rows={rows}

                onView={(row)=>{

                    setSelectedSupplier(row.id);

                    setDetailOpen(true);

                }}

                onEdit={(row)=>{

                    setEditing(row);

                    setSupplier({

                        name: row.name,

                        contactPerson: row.contactPerson,

                        phone: row.phone,

                        address: row.address,

                        nit: row.nit,

                        notes: row.notes,

                    });

                    setOpenDialog(true);

                }}

            />

            <FormDialog

                open={openDialog}

                title={

                    editing

                        ? "Editar proveedor"

                        : "Nuevo proveedor"

                }

                onClose={() =>

                    setOpenDialog(false)

                }

                onSave={handleSave}

            >

                <SupplierForm

                    value={supplier}

                    onChange={setSupplier}

                />

            </FormDialog>

            <SupplierDetailDialog

                open={detailOpen}

                detail={detail}

                onClose={()=>

                    setDetailOpen(false)

                }

            />

        </>

    );

}