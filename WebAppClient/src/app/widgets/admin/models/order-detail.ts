import { Type } from "@angular/core";

export interface Widget {
    id: number;
    label: string;
    content: Type<unknown>;
    inputs?: Record<string, unknown>;
    rows?: number;
    columns?: number;
}