type BackendResponse = {
    status: string;
    message: string;
    data: Service[] | User | string;
};
type Service = {
    id: number;
    name: string;
    subTitle: string | null;
    slug: string;
    shortDescription: string | null;
    description: string | null;
    position: number | null;
    active: boolean;
    showHome: boolean;
    list: any[];
    imageUrl: string;
    image: string | null;
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
    image: string | null;
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
    image: string | null;
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
    image_url: string;
    key: string;
    order_id: number;
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
    items: Item[]; // Replace any with the appropriate type for the items array
    position: number;
    pageId: number;
    imageUrl: string;
    image: string | null;
};
