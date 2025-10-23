// types/index.ts

export interface Employee {
    id: number;
    type_login: string;
    name: string;
    email: string;
    phone: string;
    user_name: string;
    post_nummer: string;
    experience_certificate: string;
    address: string;
    skills: string;
    nationality: string;
    city: string;
    country: string;
    keyCode: string;
    type_job: string;
    languages: string[];
    favorite_work: string[];
    image: string;
    cv: string;
    application: string;
    created_at: string;
}

export interface LoginCredentials {
    user_name: string;
    password: string;
    remember?: boolean;
}

export interface AuthResponse {
    result: string;
    message: string;
    data: {
        employee: Employee;
        token: string;
    };
}