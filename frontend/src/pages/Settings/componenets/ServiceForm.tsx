import {
  Stack,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";

interface Props {
  value: any;
  onChange: (value: any) => void;
}

export default function ServiceForm({
  value,
  onChange,
}: Props) {

  const canHaveStudentPrice =
    value.name === "Mensual" ||
    value.name === "Grupal";

  const hasStudentPrice =
    value.studentPrice !== null &&
    value.studentPrice !== undefined &&
    value.studentPrice !== "";

  
  return (
    <Stack spacing={3}>

      <TextField
        fullWidth
        label="Nombre"
        value={value.name || ""}
        onChange={(e) =>
          onChange({
            ...value,
            name: e.target.value,
          })
        }
      />

      <TextField
        fullWidth
        multiline
        minRows={2}
        label="Descripción"
        value={value.description || ""}
        onChange={(e) =>
          onChange({
            ...value,
            description: e.target.value,
          })
        }
      />

      <TextField
        select
        fullWidth
        label="Tipo"
        value={value.type || ""}
        onChange={(e) =>
          onChange({
            ...value,
            type: e.target.value,
          })
        }
      >
        <MenuItem value="MEMBERSHIP">
          Membresía
        </MenuItem>

        <MenuItem value="PROGRAM">
          Programa
        </MenuItem>

        <MenuItem value="ADDITIONAL">
          Adicional
        </MenuItem>
      </TextField>

      <TextField
        fullWidth
        type="number"
        label="Duración (días)"
        value={value.durationDays ?? ""}
        onChange={(e) =>
          onChange({
            ...value,
            durationDays:
              e.target.value === ""
                ? ""
                : Number(e.target.value),
          })
        }
        slotProps={{
          htmlInput: {
            min: 1,
            step: 1,
          },
        }}
      />

      <TextField
        fullWidth
        type="number"
        label="Precio normal"
        value={value.basePrice ?? ""}
        onChange={(e) =>
          onChange({
            ...value,
            basePrice:
              e.target.value === ""
                ? ""
                : Number(e.target.value),
          })
        }
        slotProps={{
          htmlInput: {
            min: 0,
            step: "0.01",
          },
        }}
        InputProps={{
          startAdornment: (
            <Typography sx={{ mr: 1 }}>
              Bs
            </Typography>
          ),
        }}
      />

      {canHaveStudentPrice && (
        <>
          <FormControlLabel
            control={
              <Checkbox
                checked={hasStudentPrice}
                onChange={(e) =>
                  onChange({
                    ...value,
                    studentPrice: e.target.checked
                      ? (
                          value.studentPrice !== null &&
                          value.studentPrice !== undefined &&
                          value.studentPrice !== ""
                            ? value.studentPrice
                            : ""
                        )
                      : null,
                  })
                }
              />
            }
            label="Tiene precio preferencial para estudiantes de colegio"
          />

          {hasStudentPrice && (
            <TextField
              fullWidth
              type="number"
              label="Precio estudiante colegio"
              value={value.studentPrice ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  studentPrice:
                    e.target.value === ""
                      ? ""
                      : Number(e.target.value),
                })
              }
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: "0.01",
                },
              }}
              InputProps={{
                startAdornment: (
                  <Typography sx={{ mr: 1 }}>
                    Bs
                  </Typography>
                ),
              }}
            />
          )}
        </>
      )}

    </Stack>
  );
}