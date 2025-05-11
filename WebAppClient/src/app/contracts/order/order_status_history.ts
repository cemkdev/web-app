export class OrderStatusHistory {
    currentStatusId: number;
    history: StatusChangeEntry[];
}

export class StatusChangeEntry {
    newStatusId: number;
    changedDate: Date;
}