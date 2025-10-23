// types/auth.ts
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


type BackendResponse = {
    status: string;
    message: string;
    data: Service[] | Section[] | User | string;
};
type Service = {
    id: number;
    name: string | null;
    subTitle: string | null;
    slug: string | null;
    shortDescription: string | null;
    description: string | null;
    position: number | null;
    active: boolean;
    showHome: boolean;
    list: ServiceItem[];
    imageUrl: string;
    image: Media | null;
};

type Media = {
    id: string;
    name: number;
    mimeType: string;
    size: number;
    authorId: string;
    previewUrl: string;
    fullUrl: string;
};

type ServiceItem = {
    url: string | null;
    icon: string | null;
    title: string;
    active: boolean;
    target: string | null;
    description: string;
};

type Item = {
    id: number;
    name: string;
    icon: string | null;
    url: string | null;
    shortDescription: string;
    description: string;
    position: number;
    sectionId: number;
    imageUrl: string;
    image: Media | null;
};
type Button = {
    label: string | null;
    url: string | null;
    target: string | null;
    icon: string | null;
    style: string | null;
};

type Divider = {
    active: boolean;
    position: string | null;
    style: string | null;
};
type ContactForm = {
    name: string | undefined;
    email: string | undefined;
    subject: string | undefined;
    content: string | undefined;
    countryId: any | undefined;
};
type ToastItem = {
    title: string | null | undefined;
    message: string | null | undefined;
    type: string | null | undefined;
    duration: number | null | undefined;
};

type Credentials = {
    email: string;
    password: string;
};

type User = {
    id: number;
    name: string;
    email: string;
    imageUrl: string;
    image: Media | null;
};

type SettingsData = {
    id: number;
    name: string;
    value: any;
};
type CountryData = {
    id: number;
    name: string;
    active: boolean;
    code: string;
    imagUrl: string;
    key: string;
    position: number;
};

type Section = {
    id: number;
    name: string;
    slug: string;
    postTitle: string;
    title: string;
    subTitle: string | null;
    description: string | null;
    shortDescription: string | null;
    videoUrl: string | null;
    buttonOneActive: boolean;
    buttonTwoActive: boolean;
    buttonOne: Button;
    buttonTwo: Button;
    divider: Divider;
    useDefault: boolean;
    active: boolean;
    items: Item[] | Service[]; // Replace any with the appropriate type for the items array
    position: number;
    pageId: number;
    imageUrl: string;
    image: Media | null;
};
