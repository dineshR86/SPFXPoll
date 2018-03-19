import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
export interface IPollsSpfxWebPartProps {
    description: string;
}
export default class PollsSpfxWebPart extends BaseClientSideWebPart<IPollsSpfxWebPartProps> {
    private _dataProvider;
    private _sharepointdataProvider;
    protected onInit(): Promise<void>;
    render(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
