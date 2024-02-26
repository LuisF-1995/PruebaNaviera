import { Component, Input } from '@angular/core';

@Component({
  selector: 'spinner',
  standalone: true,
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  @Input() show: boolean = false;
  @Input() message: string = 'Loading...';
}
