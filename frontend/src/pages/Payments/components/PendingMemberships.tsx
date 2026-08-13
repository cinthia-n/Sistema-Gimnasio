
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';

interface Props {
  memberships: any[];
  selectedId: number | '';
  onSelect: (id: number) => void;
}

export default function PendingMemberships({
  memberships,
  selectedId,
  onSelect,
}: Props) {
  return (
    <>
      <Typography
        variant="h6"
        mt={4}
      >
        Inscripciones pendientes
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <TextField
        fullWidth
        select
        label="Inscripción"
        value={selectedId}
        onChange={(e) =>
          onSelect(Number(e.target.value))
        }
      >
        {memberships.map((membership: any) => {
          /*
           * Una inscripción puede ser:
           *
           * 1. Servicio
           *    service != null
           *
           * 2. Promoción
           *    service == null
           *    promotion != null
           */

          const concept =
            membership.service?.name ??
            membership.promotion?.name ??
            'Sin servicio / promoción';

          const balance =
            Number(
              membership.balanceDue ?? 0,
            );

          return (
            <MenuItem
              key={membership.id}
              value={membership.id}
            >
              {membership.membershipCode}
              {' - '}
              {concept}
              {' - Saldo Bs '}
              {balance.toFixed(2)}
            </MenuItem>
          );
        })}
      </TextField>
    </>
  );
}

