import { isAxiosError } from 'axios';

export function getErrorMessage(
    error: unknown,
    fallback = 'Ocurrió un error inesperado',
): string {

    if (isAxiosError(error)) {
        return (
            error.response?.data?.message ??
            error.message ??
            fallback
        );
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
}