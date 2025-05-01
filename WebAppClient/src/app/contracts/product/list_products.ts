import { List_Product_Image } from "./list_product_image";

export class List_Product {
    id: string;
    name: string;
    stock: number;
    price: number;
    dateCreated: Date;
    dateUpdated: Date;
    title: string;
    description: string;
    rating: number;
    productImageFiles: List_Product_Image[];
}

export class List_Product_Admin_VM {
    id: string;
    name: string;
    stock: number;
    price: string;
    dateCreated: Partial<any>;
    dateUpdated: Partial<any>;
    title: string;
    description: string;
    rating: Partial<any>;
}

export class List_Product_VM {
    id: string;
    name: string;
    stock: number;
    priceIntegerPart: string;
    priceFractionPart: string;
    dateCreated: Date;
    dateUpdated: Date;
    title: string;
    description: string;
    rating: number;
    hasCover: boolean;
    productImageFilePath: string;
}