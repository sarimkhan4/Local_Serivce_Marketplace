import { Component, AfterViewInit, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { gsap } from 'gsap';

@Component({
  selector: 'app-public-layout',
  imports: [CommonModule, RouterOutlet, RouterModule, MenubarModule, ButtonModule],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout implements AfterViewInit {
  menuOpen = false;
  menuTimeline: gsap.core.Timeline | null = null;
  isAuthPage = false;

  constructor(private ngZone: NgZone, private router: Router) {
    // Detect navigation to auth routes to hide navbar/footer
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url;
        this.isAuthPage = url.startsWith('/login') || url.startsWith('/signup');
      }
    });
  }

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
