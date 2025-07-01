import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'ScrollWebPartStrings';
import '../../../assets/dist/tailwind.css';
import { Ripple, initTWE } from 'tw-elements';

export interface IScrollWebPartProps {
  description: string;
}

export default class ScrollWebPart extends BaseClientSideWebPart<IScrollWebPartProps> {
  public render(): void {
    console.log('Rendering ScrollWebPart');
    this.domElement.innerHTML = `
      <button
        type="button"
        data-twe-ripple-init
        data-twe-ripple-color="light"
        class="
          fixed bottom-10 right-10 w-16 h-16 rounded-full
          bg-white/20 hover:bg-white/100
          backdrop-blur-sm focus:outline-none shadow-md
          transition duration-150 ease-in-out
          flex items-center justify-center z-50
        "
        style="position: fixed !important; right: 2.5rem !important; left: auto !important; bottom: 2.5rem !important;"
        id="btn-back-to-top"
        title="${this.properties.description || 'Back to Top'}"
        aria-label="Scroll to top">
        <svg class="w-10 h-10" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 311.8 311.8" preserveAspectRatio="xMidYMid meet" style="enable-background:new 0 0 311.8 311.8;">
          <style type="text/css">
            .st0{fill:#4F2D7F;}
          </style>
          <g id="arrow_x5F_up_x5F_core_purple">
            <g>
              <path class="st0" d="M155.9,10c39,0,75.6,15.2,103.2,42.7c27.6,27.6,42.7,64.2,42.7,103.2s-15.2,75.6-42.7,103.2
                c-27.6,27.6-64.2,42.7-103.2,42.7s-75.6-15.2-103.2-42.7C25.2,231.5,10,194.9,10,155.9S25.2,80.3,52.7,52.7
                C80.3,25.2,116.9,10,155.9,10 M155.9,0C69.8,0,0,69.8,0,155.9s69.8,155.9,155.9,155.9S311.8,242,311.8,155.9S242,0,155.9,0
                L155.9,0z"/>
            </g>
            <g>
              <path class="st0" d="M179.8,256h-47.6c-2.8,0-5-2.2-5-5V145.2H94.4c-1.9,0-3.6-1.1-4.5-2.7s-0.7-3.7,0.4-5.2L151.9,54
                c0.9-1.3,2.4-2,4-2s3.1,0.7,4,2l61.6,83.2c1.1,1.5,1.3,3.5,0.4,5.2c-0.8,1.7-2.6,2.7-4.5,2.7h-32.7V251
                C184.8,253.8,182.6,256,179.8,256z M137.2,246h37.6V140.2c0-2.8,2.2-5,5-5h27.8L156,65.4l-51.6,69.8h27.9c2.8,0,5,2.2,5,5
                L137.2,246L137.2,246z"/>
            </g>
          </g>
        </svg>
      </button>`;

    this.initializeButton();
  }

  private initializeButton(): void {
    const button = this.domElement.querySelector('#btn-back-to-top') as HTMLButtonElement;
    if (!button) {
      console.error("Button with ID 'btn-back-to-top' not found");
      return;
    }
    console.log('Button found:', button);

    // Try to find the SharePoint scrollable container
    const scrollContainer = document.querySelector('.spAppAndPropertyPanelContainer') || 
                          document.body || // Fallback to body
                          document.documentElement; // Fallback to html

    // Debug: Log all potential containers and their scrollTop
    console.log('Checking scroll containers:');
    console.log('.spAppAndPropertyPanelContainer:', document.querySelector('.spAppAndPropertyPanelContainer'), document.querySelector('.spAppAndPropertyPanelContainer')?.scrollTop);
    console.log('.SPPageChrome:', document.querySelector('.SPPageChrome'), document.querySelector('.SPPageChrome')?.scrollTop);
    console.log('.CanvasZone:', document.querySelector('.CanvasZone'), document.querySelector('.CanvasZone')?.scrollTop);
    console.log('.CanvasSection:', document.querySelector('.CanvasSection'), document.querySelector('.CanvasSection')?.scrollTop);
    console.log('document.body:', document.body, document.body.scrollTop);
    console.log('document.documentElement:', document.documentElement, document.documentElement.scrollTop);

    if (!scrollContainer) {
      console.error("Scrollable container not found");
      return;
    } else {
      console.log('Scrollable container found:', scrollContainer);
      console.log('Initial scrollTop:', scrollContainer.scrollTop);
    }

    const scrollFunction = (): void => {
      const scrollTop = scrollContainer.scrollTop;
      console.log('Scroll position:', scrollTop);
      button.classList.remove('hidden'); // Force button visible for testing
      console.log('Button shown (forced for testing)');
    };

    const backToTop = (): void => {
      console.log('Button clicked, scrolling to top');
      console.log('Scrolling to top of:', scrollContainer);
      scrollContainer.scrollTo({
        top: 0,
        left:0,
        behavior: 'smooth'
      });
    };

    button.addEventListener('click', backToTop);
    scrollContainer.addEventListener('scroll', scrollFunction);

    // Attach scroll listener to window and body as fallbacks
    window.addEventListener('scroll', () => {
      console.log('Scroll event fired');
      console.log('Window scrollTop:', document.documentElement.scrollTop);
      console.log('Body scrollTop:', document.body.scrollTop);
      console.log('Container scrollTop:', scrollContainer.scrollTop);
      console.log('spAppAndPropertyPanelContainer scrollTop:', document.querySelector('.spAppAndPropertyPanelContainer')?.scrollTop);
      console.log('SPCanvas scrollTop:', document.querySelector('.SPCanvas')?.scrollTop);
      console.log('SPPageChrome scrollTop:', document.querySelector('.SPPageChrome')?.scrollTop);
      console.log('CanvasZone scrollTop:', document.querySelector('.CanvasZone')?.scrollTop);
    });

    // Initial check
    scrollFunction();
  }

  protected onInit(): Promise<void> {
    return super.onInit().then(() => {
      console.log('onInit called');
    });
  }

  protected onAfterRender(): void {
    try {
      initTWE({ Ripple });
      console.log('TW-Elements initialized');
    } catch (error) {
      console.error('Error initializing TW-Elements:', error);
    }
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