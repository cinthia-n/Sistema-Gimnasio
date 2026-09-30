import { useState } from "react";
import {
    Button,
    Chip,
    Stack,
    Typography,
    TextField,
    IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import TableToolbar from "../../../components/table/TableToolbar";
import DataTable from "../../../components/table/DataTable";
import FormDialog from "../../../components/common/FormDialog";

import ServiceForm from "./ServiceForm";

import { useServices } from "../../../hooks/useServices";
import { useCreateService } from "../../../hooks/useCreateService";
import { useUpdateService } from "../../../hooks/useUpdateService";
import { useToggleService } from "../../../hooks/useToggleService";
import { useServicePrices } from "../../../hooks/useServicePrices";
import {
    useCreateServicePrice,
    useUpdateServicePrice,
} from "../../../hooks/useServicePrices";

export default function ServicesSettings() {

    const [open, setOpen] = useState(false);

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [service, setService] = useState({
        code: "",
        name: "",
        description: "",
        type: "MONTHLY",
        durationDays: 30,
        basePrice: 0,
        studentPrice: 0,
    });

    const [studentPriceOpen, setStudentPriceOpen] =
        useState(false);

    const [editingStudentPriceId, setEditingStudentPriceId] =
        useState<number | null>(null);

    const [studentPriceForm, setStudentPriceForm] =
        useState({
            serviceId: 0,
            price: '',
        });

    const { data: services = [] } = useServices();

    const createService = useCreateService();
    const updateService = useUpdateService();
    const toggleService = useToggleService();

    const { data: servicePrices = [] } = useServicePrices();
    const createServicePrice = useCreateServicePrice();
    const updateServicePrice = useUpdateServicePrice();

    const getStudentPrice = (serviceId: number) => {
        return servicePrices.find(
            (item: any) =>
                Number(item.serviceId) === Number(serviceId) &&
                item.isStudent === true,
        );
    };

    const handleSave = async () => {
        try {

            if (editingId) {
                await updateService.mutateAsync({
                    id: editingId,
                    dto: {
                        name: service.name,
                        description: service.description,
                        type: service.type,
                        durationDays: service.durationDays,
                        basePrice: Number(service.basePrice),
                    },
                });
            } else {
                await createService.mutateAsync({
                    name: service.name,
                    description: service.description,
                    type: service.type,
                    durationDays: service.durationDays,
                    basePrice: Number(service.basePrice),
                });
            }

            setEditingId(null);
            setOpen(false);

            setService({
                code: "",
                name: "",
                description: "",
                type: "MEMBERSHIP",
                durationDays: 30,
                basePrice: 0,
                studentPrice: 0,
            });

        } catch (error) {
            console.error(error);
            alert("No se pudo guardar el servicio");
        }
    };

    const handleEdit = (row: any) => {

        setEditingId(row.id);

        const studentPrice = getStudentPrice(row.id);

        setService({
            code: row.code,
            name: row.name,
            description: row.description ?? "",
            type: row.type,
            durationDays: row.durationDays,
            basePrice: Number(row.basePrice),
            studentPrice: studentPrice ? Number(studentPrice.price) : 0,
        });

        setOpen(true);
    };

    const handleCreateStudentPrice = (row: any) => {
        setEditingStudentPriceId(null);

        setStudentPriceForm({
            serviceId: row.id,
            price: '',
        });

        setStudentPriceOpen(true);
    };

    const handleEditStudentPrice = (row: any) => {

        const studentPrice = getStudentPrice(row.id);

        setEditingStudentPriceId(studentPrice?.id ?? null);

        setStudentPriceForm({
            serviceId: row.id,
            price: studentPrice ? String(studentPrice.price) : '',
        });

        setStudentPriceOpen(true);
    };

    const handleSaveStudentPrice = async () => {

        const price = Number(studentPriceForm.price);

        if (!price || price <= 0) {
            alert('Ingrese un precio válido');
            return;
        }

        const dto = {
            serviceId: studentPriceForm.serviceId,
            isStudent: true,
            price,
        };

        try {

            if (editingStudentPriceId) {

                await updateServicePrice.mutateAsync({
                    id: editingStudentPriceId,
                    dto,
                });

            } else {

                await createServicePrice.mutateAsync(dto);

            }

            setStudentPriceOpen(false);
            setEditingStudentPriceId(null);

            setStudentPriceForm({
                serviceId: 0,
                price: '',
            });

        } catch (error: any) {

            console.error(error);

            alert(
                error?.response?.data?.message ??
                'No se pudo guardar el precio estudiantil',
            );

        }

    };

    const handleToggle = async (row: any) => {

        const action = row.active ? "desactivar" : "activar";

        if (window.confirm(`¿Desea ${action} "${row.name}"?`)) {

            try {
                await toggleService.mutateAsync(row.id);
            } catch (error: any) {
                console.error(error);
                alert(
                    error?.response?.data?.message ??
                    `No se pudo ${action} el servicio`,
                );
            }

        }

    };

    const columns = [

        {
            field: "code",
            headerName: "Código",
            flex: 1,
        },

        {
            field: "name",
            headerName: "Servicio",
            flex: 2,
        },

        {
            field: "type",
            headerName: "Tipo",
            flex: 1,
        },

        {
            field: "durationDays",
            headerName: "Duración",
            flex: 1,
        },

        {
            field: "basePrice",
            headerName: "Tarifa normal",
            flex: 1,
            render: (row: any) =>
                `Bs ${Number(row.basePrice).toFixed(2)}`,
        },

        {
            field: "studentPrice",
            headerName: "Estudiante colegio",
            flex: 1,

            render: (row: any) => {

                const hasStudentPrice =
                    row.code === "MENSUAL" ||
                    row.code === "GRUPAL";

                if (!hasStudentPrice) {
                    return "—";
                }

                const studentPrice = getStudentPrice(row.id);

                if (!studentPrice) {
                    return (
                        <Button
                            size="small"
                            color="success"
                            onClick={() => handleCreateStudentPrice(row)}
                        >
                            + Est.
                        </Button>
                    );
                }

                return (
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography>
                            Bs {Number(studentPrice.price).toFixed(2)}
                        </Typography>
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditStudentPrice(row)}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                );
            },
        },

        {
            field: "status",
            headerName: "Estado",
            flex: 1,

            render: (row: any) => (
                <Chip
                    label={row.active ? "Activo" : "Inactivo"}
                    color={row.active ? "success" : "default"}
                    size="small"
                />
            ),
        },

        {
            field: "actions",
            headerName: "Acciones",
            flex: 1,

            render: (row: any) => (
                <Stack direction="row" spacing={1}>

                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(row)}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                        size="small"
                        color={row.active ? "error" : "success"}
                        onClick={() => handleToggle(row)}
                    >
                        <PowerSettingsNewIcon fontSize="small" />
                    </IconButton>

                </Stack>
            ),
        },

    ];

    const studentService = services.find(
        (service: any) => service.id === studentPriceForm.serviceId,
    );

    return (

        <>

            <TableToolbar
                title="Servicios"
                search=""
                onSearchChange={() => {}}
                onNew={() => {
                    setEditingId(null);
                    setOpen(true);
                }}
            />

            <DataTable
                rows={services}
                columns={columns}
            />

            <FormDialog
                open={open}
                title="Servicio"
                onClose={() => setOpen(false)}
                onSave={handleSave}
            >
                <ServiceForm
                    value={service}
                    onChange={setService}
                />
            </FormDialog>

            <FormDialog
                open={studentPriceOpen}
                title={
                    editingStudentPriceId
                        ? "Editar tarifa estudiante"
                        : "Nueva tarifa estudiante"
                }
                onClose={() => {
                    setStudentPriceOpen(false);
                    setEditingStudentPriceId(null);
                }}
                onSave={handleSaveStudentPrice}
            >
                <Stack spacing={3}>

                    <TextField
                        fullWidth
                        label="Servicio"
                        value={studentService?.name ?? ''}
                        disabled
                    />

                    <TextField
                        fullWidth
                        label="Precio estudiante colegio"
                        type="number"
                        value={studentPriceForm.price}
                        onChange={(e) =>
                            setStudentPriceForm({
                                ...studentPriceForm,
                                price: e.target.value,
                            })
                        }
                        slotProps={{
                            htmlInput: { min: 0, step: "0.01" },
                        }}
                        InputProps={{
                            startAdornment: (
                                <Typography sx={{ mr: 1 }}>Bs</Typography>
                            ),
                        }}
                    />

                </Stack>
            </FormDialog>

        </>

    );

}