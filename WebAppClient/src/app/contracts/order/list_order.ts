export class List_Order {
    id: string;
    orderCode: string;
    customerName: string;
    totalPrice: number;
    dateCreated: Date;
}

export class List_Order_VM {
    id: string;
    orderCode: string;
    customerName: string;
    totalPrice: string;
    dateCreated: Partial<any>;
}