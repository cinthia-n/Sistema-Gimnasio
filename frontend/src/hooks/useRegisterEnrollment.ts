import { useMutation } from '@tanstack/react-query';

import {
    
    createEnrollment,

} from '../services/enrollment.service';

export function useRegisterEnrollment() {

    return useMutation({

        mutationFn: createEnrollment,

    });

}