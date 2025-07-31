import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { CommonModule } from '@angular/common'; // 👈 Importá esto


@Component({
  selector: 'app-guide-page',
  imports: [MatExpansionModule, CommonModule ],
  standalone: true, 
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './guide-page.component.html',
  styleUrl: './guide-page.component.scss'
})
export class GuidePageComponent {
  readonly panelOpenState = signal(false);

  faqList = [
    {
      question: '¿Qué es HSI?',
      answer: 'HSI es una plataforma digital que permite a los profesionales de la salud acceder a la información clínica de los pacientes de manera rápida y segura.'
    },
    {
      question: '¿Cómo accedo a HSI?',
      answer: 'Puedes acceder a HSI a través de un navegador web utilizando tus credenciales proporcionadas por tu institución de salud.'
    }
  ];

  
}
