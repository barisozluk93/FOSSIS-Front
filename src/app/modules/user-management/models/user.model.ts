export class UserModel {
    id: number;
    name: string;
    surname: string;
    nameSurname: string;
    phone: string;
    email: string;
    password?: string;
    username: string;
    isDeleted: boolean;
    isSystemData: boolean;
    organizations: number[];
    roles: number[];
    address: string;
    country: string;
    city: string;
    district: string;
    fileId?: number;
    fileResult?: any;
}