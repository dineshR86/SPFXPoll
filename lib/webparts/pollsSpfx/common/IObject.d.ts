import { IChoiceGroupOption } from "office-ui-fabric-react/lib/ChoiceGroup";
export interface IPollObject {
    Id?: number;
    PollQuestion?: string;
    Options?: IChoiceGroupOption[];
    PublishedDate?: Date;
    ExpiryDate?: Date;
    CurrentPollItem?: boolean;
    SelectedOptionkey?: string;
    Showresults?: boolean;
    PollCount?: number;
}
export interface IResultObject {
    OptionName?: string;
    VotesCount?: number;
}
