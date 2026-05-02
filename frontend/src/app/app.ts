import { Component, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Lenis from 'lenis';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {
  protected readonly title = signal('frontend');
  private lenis!: Lenis;

  ngAfterViewInit() {
    this.lenis = new Lenis({
      autoRaf: true,
    });
  }

  ngOnDestroy() {
    if (this.lenis) {
      this.lenis.destroy();
    }
  }
}
