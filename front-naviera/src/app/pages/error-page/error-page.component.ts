import { Component } from '@angular/core';
import { root } from '../../../constants/Routes';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'error-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css'
})
export class ErrorPage {
  rootPath = root.path;
}
