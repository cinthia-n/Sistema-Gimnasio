import api from "../api/axios";

export interface Employee {
  id: number;
  username: string;
  fullName: string;
  role: "EMPLOYEE";
  isActive: boolean;
  mustChangePassword: boolean;
  passwordChangedAt: string | null;
  createdAt: string;
}

export interface CreateEmployeeDto {
  username: string;
  fullName: string;
  password: string;
}

export const userService = {

  getEmployees: async (): Promise<Employee[]> => {
    const { data } = await api.get("/users/employees");
    return data;
  },

  createEmployee: async (
    dto: CreateEmployeeDto,
  ) => {
    const { data } = await api.post(
      "/users/employees",
      dto,
    );

    return data;
  },

  changeStatus: async (
    id: number,
    isActive: boolean,
  ) => {
    const { data } = await api.patch(
      `/users/employees/${id}/status`,
      {
        isActive,
      },
    );

    return data;
  },

  resetPassword: async (
    id: number,
    password: string,
  ) => {
    const { data } = await api.patch(
      `/users/employees/${id}/reset-password`,
      {
        password,
      },
    );

    return data;
  },

};