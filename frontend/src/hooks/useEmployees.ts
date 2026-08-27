import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  userService,
  type CreateEmployeeDto,
} from "../services/user.service";

export function useEmployees() {

  const queryClient = useQueryClient();

  const employeesQuery = useQuery({
    queryKey: ["employees"],
    queryFn: userService.getEmployees,
  });

  const createEmployee = useMutation({
    mutationFn: (dto: CreateEmployeeDto) =>
      userService.createEmployee(dto),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });

  const changeStatus = useMutation({
    mutationFn: ({
      id,
      isActive,
    }: {
      id: number;
      isActive: boolean;
    }) =>
      userService.changeStatus(id, isActive),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });

  const resetPassword = useMutation({
    mutationFn: ({
      id,
      password,
    }: {
      id: number;
      password: string;
    }) =>
      userService.resetPassword(id, password),
  });

  return {
    employees: employeesQuery.data ?? [],
    isLoading: employeesQuery.isLoading,
    isError: employeesQuery.isError,

    createEmployee,
    changeStatus,
    resetPassword,
  };
}