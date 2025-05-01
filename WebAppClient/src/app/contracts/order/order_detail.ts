export class Order_Detail {
    id: string;
    orderCode: string;
    address: string;
    description: string;
    dateCreated: Date;
    orderBasketItems: OrderBasketItem[];
}

export class OrderBasketItem_VM {
    imagePath: string;
    productName: string;
    productDescription: string;
    itemPrice: string;
    quantity: number;
    rating: Partial<any>;
    totalItemAmount: string;
}

export class OrderBasketItem {
    name: string;
    description: string;
    price: number;
    quantity: number;
    rating: number;
    orderProductImageFile: OrderProductImageFile;
}

export class OrderProductImageFile {
    productImageFileId: string;
    fileName: string;
    path: string;
}