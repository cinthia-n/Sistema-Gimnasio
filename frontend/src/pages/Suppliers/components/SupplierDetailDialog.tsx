import {

    Typography,

    Divider,    

} from "@mui/material";

import FormDialog from "../../../components/common/FormDialog";

import SupplierStatistics from "./SupplierStatistics";

import SupplierPurchaseHistory from "./SupplierPurchaseHistory";

interface Props {

    open: boolean;

    detail: any;

    onClose: () => void;
    

}

export default function SupplierDetailDialog({

    open,

    detail,

    onClose,

}: Props) {

    return (

        <FormDialog

            open={open}

            title="Proveedor"

            onClose={onClose}

            onSave={() => {}}

            hideSaveButton

        >

            {

                detail && (

                    <>

                        <Typography variant="h6">

                            {detail.name}

                        </Typography>

                        <Typography>

                            Contacto:

                            {" "}

                            {detail.contactPerson || "-"}

                        </Typography>

                        <Typography>

                            Teléfono:

                            {" "}

                            {detail.phone || "-"}

                        </Typography>

                        <Typography>

                            Dirección:

                            {" "}

                            {detail.address || "-"}

                        </Typography>

                        <Divider sx={{ my:3 }}/>

                        <SupplierStatistics

                            statistics={detail.statistics}

                        />

                        <Typography

                            variant="h6"

                            mb={2}

                        >

                            Historial de compras

                        </Typography>

                        <SupplierPurchaseHistory

                            purchases={detail.purchases}

                        />

                    </>

                )

            }

        </FormDialog>

    );

}