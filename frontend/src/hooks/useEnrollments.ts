import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import {

    getEnrollments,

    createEnrollment,

} from '../services/enrollment.service';

export function useEnrollments() {

    return useQuery<any[]>({

        queryKey: ['enrollments'],

        queryFn: getEnrollments,

    });

}

export function useCreateEnrollment() {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: createEnrollment,

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ['enrollments'],

            });

        },

    });

}