import {API, BlockTool, BlockToolConstructorOptions} from '@editorjs/editorjs';

export class I18nTitle implements BlockTool {
  private wrapper: HTMLElement;
  private api: API;
  private readOnly: boolean;
  private data: any;
  private dataElement: any;
  private config: any;

  constructor({data, api, config, readOnly}: BlockToolConstructorOptions<any>) {
    this.data = data;
    this.config = config;
    this.api = api;
    this.readOnly = readOnly;
  }

  static get isReadOnlySupported(): boolean {
    return true;
  }

  static get toolbox(): any {
    return {
      title: 'I18n Title',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"' +
        ' stroke="currentColor" stroke-width="2">' +
        '  <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />' +
        '</svg>'
    };
  }

  destroy(): void {
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.dataElement = document.createElement('i18n-title-component');
    this.dataElement.readonly = this.readOnly;
    this.dataElement.data = this.data;
    this.wrapper.appendChild(this.dataElement);
    return this.wrapper;
  }


  save(blockContent: HTMLElement): any {
    const data = this.dataElement.getData;
    return data;
  }

  validate(savedData: any): any {
    return true;
  }
}
