export class CurrentOrderStatusDates {
    cancelled: DateFormat;
    pending: DateFormat;
    approved: DateFormat;
    shipping: DateFormat;
    delivered: DateFormat;
}

export class DateFormat {
    weekDay: string;
    fullDate: string;
    time: string;
}