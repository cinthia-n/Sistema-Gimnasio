import { useState, useEffect } from "react";

import {
    Typography,
    Divider,
    Button,
} from "@mui/material";

import ExistingClient from "../../Enrollments/components/ExistingClient";
import PendingMemberships from "./PendingMemberships";
import PaymentSummary from "./PaymentSummary";

import { useClients } from "../../../hooks/useClients";
import { usePendingMemberships } from "../../../hooks/usePendingMemberships";
import { useRegisterPayment } from "../../../hooks/useRegisterPayment";
import { useAuth } from "../../auth/AuthContext";

import PaymentLinesInput from "../../../components/common/PaymentLinesInput";
import type { PaymentLine } from "../../../components/common/PaymentLinesInput";

import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/getErrorMessage";

interface Props {
    initialMembership?: any;
    onSuccess?: () => void;
}

export default function PaymentForm({
    initialMembership,
    onSuccess,
}: Props) {

    const { user } = useAuth();

    //------------------------------------
    // Estados
    //------------------------------------

    const [clientId, setClientId] =
        useState<number | "">("");

    const [selectedMembershipId, setSelectedMembershipId] =
        useState<number | "">("");

    const [payments, setPayments] = useState<PaymentLine[]>([
        { paymentMethod: "CASH", amount: "" },
    ]);

    useEffect(() => {

        if (!initialMembership) return;

        setClientId(initialMembership.clientId);
        setSelectedMembershipId(initialMembership.id);

    }, [initialMembership]);

    //------------------------------------
    // Hooks
    //------------------------------------

    const { data: clients = [] } = useClients("");

    const { data: pendingMemberships = [] } = usePendingMemberships(
        clientId ? Number(clientId) : undefined,
    );

    const registerPayment = useRegisterPayment();

    //------------------------------------
    // Membresía seleccionada
    //------------------------------------

    const membership = pendingMemberships.find(
        (m: any) => m.id === selectedMembershipId,
    );

    //------------------------------------
    // Registrar pago
    //------------------------------------

    const handlePayment = async () => {

        if (!membership) return;

        const totalPaid = payments.reduce(
            (sum, p) => sum + (Number(p.amount) || 0),
            0,
        );

        if (totalPaid <= 0) {
            toast.warning("Ingrese un monto válido");
            return;
        }

        if (totalPaid > Number(membership.balanceDue)) {
            toast.warning(
                `El pago excede el saldo pendiente de Bs ${Number(membership.balanceDue).toFixed(2)}`,
            );
            return;
        }

        try {

            await registerPayment.mutateAsync({
                clientServiceId: membership.id,
                userId: user!.id,
                payments: payments.map(p => ({
                    paymentMethod: p.paymentMethod,
                    amount: Number(p.amount),
                    reference: p.reference,
                })),
            });

            setPayments([{ paymentMethod: "CASH", amount: "" }]);
            setSelectedMembershipId("");
            setClientId("");

            toast.success("Pago registrado correctamente");

            onSuccess?.();

        } catch (error) {

            console.error(error);
            toast.error(getErrorMessage(error, "Error al registrar pago"));

        }

    };

    //------------------------------------
    // Vista
    //------------------------------------

    return (

        <>

            <Typography variant="h6">
                Cliente
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <ExistingClient
                clients={clients}
                clientId={clientId}
                onClientChange={setClientId}
            />

            <PendingMemberships
                memberships={pendingMemberships}
                selectedId={selectedMembershipId}
                onSelect={setSelectedMembershipId}
            />

            <PaymentSummary
                membership={membership}
            />

            {membership && (
                <PaymentLinesInput
                    lines={payments}
                    onChange={setPayments}
                    total={Number(membership.balanceDue)}
                    requireExactMatch={false}
                />
            )}

            <Button
                sx={{ mt: 3 }}
                fullWidth
                variant="contained"
                onClick={handlePayment}
                disabled={!membership}
            >
                Registrar pago
            </Button>

        </>

    );

}