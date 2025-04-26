import { List_Product_Image } from "./list_product_image";

export class List_Products {
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

export class List_Products_VM {
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