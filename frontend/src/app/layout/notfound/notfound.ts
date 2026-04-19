import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-notfound',
  imports: [RouterModule, ButtonModule],
  templateUrl: './notfound.html',
  styleUrl: './notfound.css',
})
export class Notfound {}
