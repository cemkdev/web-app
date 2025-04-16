export class List_Basket_Item {
    basketItemId: string;
    productId: string;
    name: string;
    description: string;
    stock: number;
    price: number;
    quantity: number;
    productImageFile: BasketProductImageFile;
}

export class BasketProductImageFile {
    productImageFileId: string;
    fileName: string;
    path: string;
}

export class List_Basket_Item_VM {
    basketItemId: string;
    productId: string;
    name: string;
    description: string;
    stock: number;
    priceIntegerPart: string;
    priceFractionPart: string;
    quantity: number;
    productImageFile: BasketProductImageFile;
}