import IDataProvider from "../dataproviders/IDataprovider";
export interface IPollsSpfxProps {
    description: string;
    dataProvider: IDataProvider;
    sharepointdataProvider: IDataProvider;
}
