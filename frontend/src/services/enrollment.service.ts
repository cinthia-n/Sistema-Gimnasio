import api from '../api/axios';

export interface RegisterEnrollmentDto {
    existingClient: boolean;

    clientId?: number;

    client?: {
        fullName: string;
        ci: string;
        phone: string;
        
    };

    isStudent: boolean;

    serviceId?: number;

    promotionId?: number;

    paymentMethod: 'CASH' | 'QR';

    paymentAmount: number;

    userId: number;

    paymentReference?: string;
}

// Obtener todas las inscripciones
export async function getEnrollments() {
    const { data } = await api.get('/memberships');
    return data;
}

// Registrar una nueva inscripción
export async function createEnrollment(
    dto: RegisterEnrollmentDto,
) {
    const { data } = await api.post(
        '/memberships/register',
        dto,
    );

    return data;
}

// Obtener una inscripción por código
export async function getEnrollmentByCode(
    code: string,
) {
    const { data } = await api.get(
        `/memberships/code/${code}`,
    );

    return data;
}