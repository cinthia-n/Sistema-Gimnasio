export interface Client {

  id: number;

  fullName: string;

  ci: string;

  phone: string;

  isStudent: boolean;

  birthDate?: string;

  gender?: 'MALE' | 'FEMALE';

  address?: string;

  active: boolean;

  createdAt: string;

}