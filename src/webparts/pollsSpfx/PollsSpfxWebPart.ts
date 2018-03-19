import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'PollsSpfxWebPartStrings';
import PollsSpfx from './components/PollsSpfx';
import { IPollsSpfxProps } from './components/IPollsSpfxProps';
import IDataProvider from './dataproviders/IDataprovider';
import MockUpDataProvider from './dataproviders/DummyDataProvider';
import SharepointDataProvider from './dataproviders/SharepointDataProvider';

export interface IPollsSpfxWebPartProps {
  description: string;
}

export default class PollsSpfxWebPart extends BaseClientSideWebPart<IPollsSpfxWebPartProps> {

  private _dataProvider: IDataProvider;
  private _sharepointdataProvider:IDataProvider;

  protected onInit(): Promise<void> {

    this._dataProvider = new MockUpDataProvider();
    this._sharepointdataProvider= new SharepointDataProvider(this.context);
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IPollsSpfxProps> = React.createElement(
      PollsSpfx,
      {
        description: this.properties.description,
        dataProvider: this._dataProvider,
        sharepointdataProvider:this._sharepointdataProvider
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
