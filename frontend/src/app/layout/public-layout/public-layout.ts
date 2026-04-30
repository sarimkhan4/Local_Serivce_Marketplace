import { Component, AfterViewInit, NgZone } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { gsap } from 'gsap';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterModule, MenubarModule, ButtonModule],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout implements AfterViewInit {
  menuOpen = false;
  menuTimeline: gsap.core.Timeline | null = null;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.menuTimeline = gsap.timeline({ paused: true });

      this.menuTimeline
        .to('.fullscreen-menu', {
          autoAlpha: 1,
          duration: 0.6,
          ease: 'power3.inOut'
        })
        .fromTo('.menu-links li a',
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.8, stagger: 0.7, ease: 'power3.out' },
          "-=0.2"
        );
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen; console.log("Menu toggled! State:", this.menuOpen);
    if (this.menuOpen) {
      this.menuTimeline?.timeScale(1).play();
    } else {
      this.menuTimeline?.timeScale(1.5).reverse();
    }
  }
}
