import { Component } from '@angular/core';
import { GuidePageComponent } from './components/guide-page/guide-page.component';

@Component({
  selector: 'app-root', // el selector del componente base, no es relevante para el Web Component
  standalone: true,
  imports: [GuidePageComponent],
  template: `<app-guide-page></app-guide-page>`,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'homes';
}
