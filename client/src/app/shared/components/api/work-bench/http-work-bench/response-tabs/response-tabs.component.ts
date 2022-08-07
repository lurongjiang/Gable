import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpApiResponse} from '../../../../../../core/services/entity/HttpApi';
import {BodyTextComponent} from './body-text/body-text.component';

@Component({
  selector: 'app-response-tabs',
  templateUrl: './response-tabs.component.html',
  styleUrls: ['./response-tabs.component.scss']
})
export class ResponseTabsComponent implements OnInit {
  @ViewChild('textComponent', {static: true}) textCom: BodyTextComponent;
  tabs = ['Body', 'Cookies', 'Headers', 'Post-Script'];
  curTab = 'Body';
  code: number;
  timeTakes: number;
  size: number;

  constructor() {
  }

  ngOnInit(): void {
  }

  setResp(response: HttpApiResponse): void {
    this.code = response.code;
    this.timeTakes = response.timeTakes;
    this.size = response.size;
    this.textCom.setText(response.content);
  }
}
