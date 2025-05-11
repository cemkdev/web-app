export class List_Order {
    id: string;
    orderCode: string;
    customerName: string;
    totalPrice: number;
    dateCreated: Date;
    statusId: number;
}


export class List_Order_VM {
    id: string;
    orderCode: string;
    customerName: string;
    totalPrice: string;
    dateCreated: Partial<any>;
    status: OrderStatusInfo;
}
export interface OrderStatusInfo {
    badgeClass: string;
    statusText: string;
}