import { forwardRef, useImperativeHandle, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
    Box,
    Checkbox,
    Divider,
    FormControlLabel,
    MenuItem,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@mui/material';

import ExistingClient from './ExistingClient';
import NewClient from './NewClient';
import PlanSection from './PlanSection';
import SummarySection from './SummarySection';
import PaymentSection from './PaymentSection';

import { useClients } from '../../../hooks/useClients';

import { getServices } from '../../../services/service.service';
import { getServicePrices } from '../../../services/service-price.service';
import { getPromotions } from '../../../services/promotion.service';

import type { RegisterEnrollmentDto } from '../../../services/enrollment.service';

export interface EnrollmentFormRef {
    submit: () => RegisterEnrollmentDto | null;
}

interface ServicePrice {
    serviceId: number;
    isStudent: boolean;
    price: number | string;
}

interface Promotion {
    id: number;
    name: string;
    description?: string;
    price: number | string;
    startDate: string;
    endDate: string;
    active: boolean;
}

const EnrollmentForm = forwardRef<
    EnrollmentFormRef,
    {}
>((props, ref) => {

    // --------------------------------------------------
    // CLIENTE
    // --------------------------------------------------

    const [existingClient, setExistingClient] = useState(true);

    const [clientId, setClientId] =
        useState<number | ''>('');

    const [newClient, setNewClient] = useState({
        fullName: '',
        ci: '',
        phone: '',
    });

    // --------------------------------------------------
    // PLAN / PROMOCIÓN
    // --------------------------------------------------

    const [serviceId, setServiceId] =
        useState('');

    const [promotionId, setPromotionId] =
        useState<number | ''>('');

    // --------------------------------------------------
    // ESTUDIANTE
    // --------------------------------------------------

    const [isStudent, setIsStudent] =
        useState(false);

    // --------------------------------------------------
    // PAGO
    // --------------------------------------------------

    const [paymentMethod, setPaymentMethod] =
        useState<'CASH' | 'QR'>('CASH');

    const [paymentAmount, setPaymentAmount] =
        useState('');

    // --------------------------------------------------
    // CLIENTES
    // --------------------------------------------------

    const {
        data: clients = [],
    } = useClients('');

    // --------------------------------------------------
    // SERVICIOS
    // --------------------------------------------------

    const {
        data: services = [],
    } = useQuery<any[]>({
        queryKey: ['services'],
        queryFn: getServices,
    });

    // --------------------------------------------------
    // PRECIOS DE SERVICIOS
    // --------------------------------------------------

    const {
        data: servicePrices = [],
    } = useQuery<ServicePrice[]>({
        queryKey: ['service-prices'],
        queryFn: getServicePrices,
    });

    // --------------------------------------------------
    // PROMOCIONES
    // --------------------------------------------------

    const {
        data: promotions = [],
    } = useQuery<Promotion[]>({
        queryKey: ['promotions'],
        queryFn: getPromotions,
    });

    // --------------------------------------------------
    // SERVICIO SELECCIONADO
    // --------------------------------------------------

    const selectedService =
        services.find(
            (service: any) =>
                service.id === Number(serviceId),
        );

    // --------------------------------------------------
    // PRECIO ESTUDIANTE
    // --------------------------------------------------

    const studentServicePrice =
        selectedService
            ? servicePrices.find(
                (item) =>
                    Number(item.serviceId) ===
                        Number(selectedService.id) &&
                    item.isStudent === true,
            )
            : undefined;

    const hasStudentPrice =
        selectedService?.code === 'MONTHLY' ||
        selectedService?.code === 'GROUP';

    // --------------------------------------------------
    // PRECIO DEL PLAN
    // --------------------------------------------------

    const basePrice =
        selectedService
            ? (
                isStudent &&
                hasStudentPrice &&
                studentServicePrice
                    ? Number(studentServicePrice.price)
                    : Number(selectedService.basePrice)
            )
            : 0;

    // --------------------------------------------------
    // PROMOCIONES VIGENTES
    // --------------------------------------------------

    const today = new Date();

    const availablePromotions =
        promotions.filter((promotion) => {

            if (!promotion.active) {
                return false;
            }

            const startDate =
                new Date(promotion.startDate);

            const endDate =
                new Date(promotion.endDate);

            const currentDate = new Date(today);

            currentDate.setHours(0, 0, 0, 0);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);

            return (
                currentDate >= startDate &&
                currentDate <= endDate
            );
        });

    // --------------------------------------------------
    // PROMOCIÓN SELECCIONADA
    // --------------------------------------------------

    const selectedPromotion =
        availablePromotions.find(
            (promotion) =>
                promotion.id ===
                Number(promotionId),
        );

    // --------------------------------------------------
    // PRECIO DE LA PROMOCIÓN
    // --------------------------------------------------

    const promotionPrice =
        selectedPromotion
            ? Number(selectedPromotion.price)
            : 0;

    // --------------------------------------------------
    // PRECIO FINAL
    // --------------------------------------------------

    const total =
        selectedPromotion
            ? promotionPrice
            : basePrice;

    // --------------------------------------------------
    // PAGO Y SALDO
    // --------------------------------------------------

    const paid =
        Number(paymentAmount) || 0;

    const balance =
        Math.max(total - paid, 0);

    // --------------------------------------------------
    // SUBMIT
    // --------------------------------------------------

    useImperativeHandle(ref, () => ({

        submit() {

            // Debe existir plan O promoción
            if (!serviceId && !promotionId) {

                alert(
                    'Seleccione un plan o una promoción',
                );

                return null;
            }

            // No pueden existir ambos
            if (serviceId && promotionId) {

                alert(
                    'Seleccione solamente un plan o una promoción',
                );

                return null;
            }

            // Cliente existente
            if (
                existingClient &&
                !clientId
            ) {

                alert(
                    'Seleccione un cliente',
                );

                return null;
            }

            // Cliente nuevo
            if (!existingClient) {

                if (
                    !newClient.fullName ||
                    !newClient.ci
                ) {

                    alert(
                        'Complete los datos del cliente',
                    );

                    return null;
                }
            }

            // Pago
            if (!paymentAmount) {

                alert(
                    'Ingrese el monto pagado',
                );

                return null;
            }

            // --------------------------------------------------
            // DTO
            // --------------------------------------------------

            return {

                existingClient,

                clientId:
                    existingClient
                        ? Number(clientId)
                        : undefined,

                client:
                    existingClient
                        ? undefined
                        : newClient,

                // El estado de estudiante solo tiene
                // sentido cuando se selecciona un plan.
                isStudent:
                    serviceId
                        ? isStudent
                        : false,

                // IMPORTANTE:
                // Si hay promoción no enviamos serviceId.
                serviceId:
                    serviceId
                        ? Number(serviceId)
                        : undefined,

                // Si hay plan no enviamos promotionId.
                promotionId:
                    promotionId
                        ? Number(promotionId)
                        : undefined,

                paymentMethod,

                paymentAmount:
                    Number(paymentAmount),

                userId: 1,
            };
        },
    }));

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------

    return (
        <>

            {/* ==================================================
                CLIENTE
            ================================================== */}

            <Typography
                variant="h6"
                gutterBottom
            >
                Cliente
            </Typography>

            <RadioGroup
                row
                value={
                    existingClient
                        ? 'YES'
                        : 'NO'
                }
                onChange={(e) =>
                    setExistingClient(
                        e.target.value === 'YES',
                    )
                }
            >

                <FormControlLabel
                    value="YES"
                    control={<Radio />}
                    label="Cliente existente"
                />

                <FormControlLabel
                    value="NO"
                    control={<Radio />}
                    label="Cliente nuevo"
                />

            </RadioGroup>

            <Divider sx={{ my: 3 }} />

            {existingClient ? (

                <ExistingClient
                    clients={clients}
                    clientId={clientId}
                    onClientChange={setClientId}
                />

            ) : (

                <NewClient
                    value={newClient}
                    onChange={setNewClient}
                />

            )}

            {/* ==================================================
                ESTUDIANTE
            ================================================== */}

            <FormControlLabel
                control={
                    <Checkbox
                        checked={isStudent}
                        disabled={!!promotionId}
                        onChange={(e) =>
                            setIsStudent(
                                e.target.checked,
                            )
                        }
                    />
                }
                label="Alumno de colegio"
            />

            {/* ==================================================
                PLAN
            ================================================== */}

            <PlanSection
                services={services}
                serviceId={serviceId}
                disabled={!!promotionId}
                onServiceChange={(value) => {

                    setServiceId(value);

                    if (value) {
                        setPromotionId('');
                    }

                }}
            />

            {/* ==================================================
                PROMOCIÓN
            ================================================== */}

            <Box mt={3}>

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Promoción
                </Typography>

                <TextField
                    select
                    fullWidth
                    label="Promoción"
                    value={promotionId}
                    disabled={!!serviceId}
                    onChange={(e) => {

                        const value =
                            e.target.value;

                        setPromotionId(
                            value
                                ? Number(value)
                                : '',
                        );

                        if (value) {

                            setServiceId('');
                            setIsStudent(false);

                        }

                    }}
                >

                    <MenuItem value="">
                        Sin promoción
                    </MenuItem>

                    {availablePromotions.map(
                        (promotion) => (

                            <MenuItem
                                key={promotion.id}
                                value={promotion.id}
                            >
                                {promotion.name}
                                {' — '}
                                Bs {promotion.price}
                            </MenuItem>

                        ),
                    )}

                </TextField>

            </Box>

            {/* ==================================================
                RESUMEN
            ================================================== */}

            <SummarySection
                basePrice={basePrice}
                promotionPrice={promotionPrice}
                total={total}
            />

            {/* ==================================================
                PAGO
            ================================================== */}

            <Box mt={4}>

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Pago
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <PaymentSection
                    paymentMethod={paymentMethod}
                    paymentAmount={paymentAmount}
                    balance={balance}
                    onPaymentMethodChange={(value) =>
                        setPaymentMethod(
                            value as 'CASH' | 'QR',
                        )
                    }
                    onPaymentAmountChange={
                        setPaymentAmount
                    }
                />

            </Box>

        </>
    );
});

export default EnrollmentForm;