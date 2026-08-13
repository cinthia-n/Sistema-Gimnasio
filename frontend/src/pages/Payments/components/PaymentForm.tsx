import { useState } from "react";

import {
    Typography,
    Divider,
    Button,
} from "@mui/material";

import ExistingClient from "../../Enrollments/components/ExistingClient";
import PendingMemberships from "./PendingMemberships";
import PaymentSummary from "./PaymentSummary";
import PaymentMethod from "./PaymentMethod";

import { useClients } from "../../../hooks/useClients";
import { usePendingMemberships } from "../../../hooks/usePendingMemberships";
import { useRegisterPayment } from "../../../hooks/useRegisterPayment";
import { useEffect } from "react";

interface Props {
    initialMembership?: any;
    onSuccess?:()=> void;
}

export default function PaymentForm({
    initialMembership,
    onSuccess,
}: Props) {

    //------------------------------------
    // Estados
    //------------------------------------

    const [clientId, setClientId] =
        useState<number | "">("");

    const [selectedMembershipId, setSelectedMembershipId] =
        useState<number | "">("");

    const [paymentMethod, setPaymentMethod] =
        useState<"CASH" | "QR">("CASH");

    const [paymentAmount, setPaymentAmount] =
        useState("");

    const [paymentReference, setPaymentReference] =
        useState("");
    
    useEffect(() => {

        if (!initialMembership) return;

        setClientId(initialMembership.clientId);

        setSelectedMembershipId(initialMembership.id);

    }, [initialMembership]);
    
    //------------------------------------
    // Hooks
    //------------------------------------

    const {

        data: clients = [],

    } = useClients("");

    const {

        data: pendingMemberships = [],

    } = usePendingMemberships(

        clientId
            ? Number(clientId)
            : undefined,

    );

    const registerPayment =
        useRegisterPayment();

    //------------------------------------
    // Membresía seleccionada
    //------------------------------------

    const membership =
        pendingMemberships.find(

            (m: any) =>

                m.id === selectedMembershipId,

    );

    

    //------------------------------------
    // Registrar pago
    //------------------------------------

    const handlePayment = async () => {

        if (!membership) return;

        try {

            await registerPayment.mutateAsync({

                clientServiceId:
                    membership.id,

                amount:
                    Number(paymentAmount),

                paymentMethod,

                reference:
                    paymentReference,

                userId: 1,

            });

            setPaymentAmount("");

            setPaymentReference("");

            setSelectedMembershipId("");
            setClientId("");
            onSuccess?.();

        }

        catch (error) {

            console.error(error);

            alert("Error al registrar pago");

        }

    };

    //------------------------------------
    // Vista
    //------------------------------------

    return (

        <>

            <Typography
                variant="h6"
            >

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

            <PaymentMethod

                paymentMethod={paymentMethod}

                paymentAmount={paymentAmount}

                paymentReference={paymentReference}

                balance={membership?.balanceDue ?? 0}

                onPaymentMethodChange={(value) =>

                    setPaymentMethod(

                        value as "CASH" | "QR",

                    )

                }

                onPaymentAmountChange={

                    setPaymentAmount

                }

                onReferenceChange={

                    setPaymentReference

                }

            />

            <Button

                sx={{ mt: 3 }}

                fullWidth

                variant="contained"

                onClick={handlePayment}

            >

                Registrar pago

            </Button>

        </>

    );

}