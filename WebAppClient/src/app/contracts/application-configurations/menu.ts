import { ActionType } from "../../enums/application_action_type";

export class Menu {
    name: string;
    actions: Action[];
}

export class Action {
    actionType: ActionType;
    httpType: string;
    definition: string;
    code: string;
    adminOnly: boolean;
}