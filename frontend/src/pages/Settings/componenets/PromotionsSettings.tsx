import { useState } from "react";

import {
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

import TableToolbar from "../../../components/table/TableToolbar";
import DataTable from "../../../components/table/DataTable";
import FormDialog from "../../../components/common/FormDialog";

import PromotionForm from "./PromotionForm";

import {
  usePromotions,
  useCreatePromotion,
  useUpdatePromotion,
  useTogglePromotion,
} from "../../../hooks/usePromotions";

interface PromotionFormValue {
  name: string;
  description: string;
  price: number;
  durationDays: number;
  startDate: string;
  endDate: string;
}

const emptyPromotion: PromotionFormValue = {
  name: "",
  description: "",
  price: 0,
  durationDays: 30,
  startDate: "",
  endDate: "",
};

export default function PromotionsSettings() {

  const [open, setOpen] = useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [promotion, setPromotion] =
    useState<PromotionFormValue>(
      emptyPromotion,
    );

  const {
    data: promotions = [],
  } = usePromotions();

  const createPromotion =
    useCreatePromotion();

  const updatePromotion =
    useUpdatePromotion();

  const togglePromotion =
    useTogglePromotion();

  const handleNew = () => {

    setEditingId(null);

    setPromotion({
      ...emptyPromotion,
    });

    setOpen(true);
  };

  const handleEdit = (row: any) => {

    setEditingId(row.id);

    setPromotion({
      name: row.name,
      description: row.description ?? "",
      price:
        row.price !== null &&
        row.price !== undefined
          ? Number(row.price)
          : 0,
      durationDays: row.durationDays ?? 30,
      startDate:
        row.startDate
          ? row.startDate.substring(0, 10)
          : "",
      endDate:
        row.endDate
          ? row.endDate.substring(0, 10)
          : "",
    });

    setOpen(true);
  };

  const handleSave = async () => {

    if (!promotion.name.trim()) {
        alert("Ingrese el nombre de la promoción");
        return;
    }

    if (!promotion.durationDays || promotion.durationDays <= 0) {
        alert("Ingrese la duración de la membresía en días");
        return;
    }

    if (!promotion.startDate) {
        alert("Ingrese la fecha de inicio");
        return;
    }

    if (!promotion.endDate) {
        alert("Ingrese la fecha de fin");
        return;
    }

    if (promotion.endDate < promotion.startDate) {
        alert("La fecha de fin no puede ser anterior a la fecha de inicio");
        return;
    }

    try {

        const dto = {
            name: promotion.name,
            description: promotion.description || undefined,
            price: promotion.price > 0 ? promotion.price : undefined,
            durationDays: promotion.durationDays,
            startDate: promotion.startDate,
            endDate: promotion.endDate,
        };

        if (editingId) {
            await updatePromotion.mutateAsync({ id: editingId, dto });
        } else {
            await createPromotion.mutateAsync(dto);
        }

        setOpen(false);
        setEditingId(null);
        setPromotion({ ...emptyPromotion });

    } catch (error) {
        console.error(error);
        alert("No se pudo guardar la promoción");
    }

};

  const handleToggle = async (
    row: any,
  ) => {

    try {

      await togglePromotion.mutateAsync(
        row.id,
      );

    } catch (error) {

      console.error(error);

      alert(
        "No se pudo cambiar el estado de la promoción",
      );

    }

  };

  const getStatus = (
    row: any,
  ) => {

    const today = new Date();

    const start =
      new Date(row.startDate);

    const end =
      new Date(row.endDate);

    if (!row.active) {

      return {
        label: "Desactivada",
        color: "default" as const,
      };

    }

    if (today < start) {

      return {
        label: "Programada",
        color: "info" as const,
      };

    }

    if (today > end) {

      return {
        label: "Vencida",
        color: "warning" as const,
      };

    }

    return {
      label: "Vigente",
      color: "success" as const,
    };

  };

  const columns = [

    {
      field: "name",
      headerName: "Promoción",
      flex: 2,
    },

    {
      field: "description",
      headerName: "Descripción",
      flex: 3,
    },

    {
      field: "price",
      headerName: "Precio",
      flex: 1,

      render: (row: any) =>
        row.price !== null &&
        row.price !== undefined
          ? `Bs ${Number(
              row.price,
            ).toFixed(2)}`
          : "—",
    },

    {
      field: "startDate",
      headerName: "Inicio",
      flex: 1,

      render: (row: any) =>
        new Date(
          row.startDate,
        ).toLocaleDateString(),
    },

    {
      field: "endDate",
      headerName: "Fin",
      flex: 1,

      render: (row: any) =>
        new Date(
          row.endDate,
        ).toLocaleDateString(),
    },

    {
      field: "status",
      headerName: "Estado",
      flex: 1,

      render: (row: any) => {

        const status =
          getStatus(row);

        return (
          <Chip
            label={status.label}
            color={status.color}
            size="small"
          />
        );

      },
    },

    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,

      render: (row: any) => (
        <Stack
          direction="row"
          spacing={1}
        >

          <IconButton
            size="small"
            color="primary"
            onClick={() =>
              handleEdit(row)
            }
          >
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            color={
              row.active
                ? "error"
                : "success"
            }
            onClick={() =>
              handleToggle(row)
            }
          >
            <PowerSettingsNewIcon
              fontSize="small"
            />
          </IconButton>

        </Stack>
      ),
    },

  ];

  return (
    <>
      <Typography
        variant="h5"
        mb={2}
      >
        Promociones
      </Typography>

      <TableToolbar
        title="Promociones"
        search=""
        onSearchChange={() => {}}
        onNew={handleNew}
      />

      <DataTable
        rows={promotions}
        columns={columns}
      />

      <FormDialog
        open={open}
        title={
          editingId
            ? "Editar promoción"
            : "Nueva promoción"
        }
        onClose={() => {
          setOpen(false);
          setEditingId(null);
        }}
        onSave={handleSave}
      >
        <PromotionForm
          value={promotion}
          onChange={setPromotion}
        />
      </FormDialog>
    </>
  );
}