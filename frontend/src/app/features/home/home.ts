import { Component, OnInit, signal, inject, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Services
import { AuthService } from '../../core/services/auth';
import { DataService } from '../../core/services/data.service';
import { ApiService } from '../../core/services/api.service';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
interface ServiceItem {
  id: string;
  name: string;
  startingPrice: number;
  image: string
}

interface FeatureItem {
  image: string;
  title: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  services: ServiceItem[];
}

interface Testimonial {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  serviceReceived: string;
  avatarInitials: string;
}

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    ButtonModule,
    CarouselModule,
    InputTextModule,
    TabsModule,
    CardModule,
    SkeletonModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, AfterViewInit {
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;
  selectedCategoryId: string = '';
  loadingCategories = signal(true);
  categories: any[] = [];

  // --- Testimonial Carousel State ---
  currentTestimonialIndex = 0;
  readonly totalTestimonials = 4;

  apiService = inject(ApiService);

  constructor(private authService: AuthService, private router: Router, private dataService: DataService, private ngZone: NgZone) { }


  ngOnInit() {
    const testimonialHeader = document.querySelector('.testimonial-header') as HTMLElement;
    if (testimonialHeader) testimonialHeader.style.opacity = '0';
    const scrollInd = document.querySelector('.scroll-indicator') as HTMLElement;
    if (scrollInd) scrollInd.style.opacity = '0';
    const navbar = document.querySelector('.custom-navbar') as HTMLElement;
    if (navbar) navbar.style.opacity = '0';

    const heroHeading = document.querySelector('.hero-heading') as HTMLElement;
    if (heroHeading) heroHeading.style.opacity = '0';

    const devCredits = document.querySelector('.developer-credits') as HTMLElement;
    if (devCredits) devCredits.style.opacity = '0';

    this.apiService.getCategories().subscribe({
      next: (cats: any) => {
        this.apiService.getServices().subscribe({
          next: (srvs: any) => {
            const dynamicCategories = cats.map((cat: any) => {
              return {
                id: cat.categoryId,
                name: cat.categoryName,
                icon: 'pi-cog',
                services: srvs.filter((s: any) => s.category.categoryId === cat.categoryId).map((s: any) => ({
                  id: s.serviceId,
                  name: s.name,
                  startingPrice: 50,
                  image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg'
                }))
              }
            });
            this.categories = dynamicCategories;
            if (this.categories.length > 0) {
              this.selectedCategoryId = this.categories[0].id;
            }
            this.loadingCategories.set(false);
          },
          error: (err) => {
            console.error('Failed to load services', err);
            this.loadingCategories.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.loadingCategories.set(false);
      }
    });
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {

    setTimeout(() => {
      const tlHeader = gsap.timeline({
        scrollTrigger: {
          trigger: ".testimonial-header",
          start: "top 40%",
          toggleActions: "play none none none"
        }
      });

      tlHeader.from(".testimonial-header .reveal-wrapper > *", {
        y: "0",            // Moves from completely below the 'window'
        opacity: 0,
        duration: 1.0,        // Time for each line to rise
        ease: "power4.out",
        // By setting stagger to 0.8 or 1.0, the next line 
        // only begins once the previous one is nearly finished.
        stagger: 0.4
      });
    }, 100);

    const assemblyTl = gsap.timeline();

    // Assembly: Move K, D down and O, A up into the center line
    assemblyTl.to(".letter", {
      y: 0,
      opacity: 1,
      duration: 2.5,
      stagger: 0.3,
      ease: "expo.inOut",
    })

      // The Hold
      .to({}, { duration: 0.8 })

    // Curtain Reveal
    assemblyTl.to(".reveal-curtain", {
      yPercent: -100,
      duration: 2,
      ease: "power4.inOut",
    })
      .add("revealContent", "-=0.5") // Create a timestamp label here
      .fromTo(".hero-heading", { opacity: 0 }, { opacity: 1, duration: 2.5 }, "revealContent")
      .to('.custom-navbar', { opacity: 1, duration: 2.5 }, "revealContent") // Starts at the same time
      .fromTo(".developer-credits", { opacity: 0 }, { opacity: 1, duration: 2.5 }, "revealContent+=0.2") // Starts slightly after
      .fromTo(".scroll-indicator",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          y: 0,
          duration: 2.5,
          ease: "power2.out"
        },
        "revealContent+=0.3" // Starts a tiny bit after the heading for a staggered look
      );

    // Cinematic Deep Parallax
    gsap.to(".hero-video-bg", {
      yPercent: 80, // High value = much slower background movement
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true, // Tied 1:1 with the scrollbar
      }
    });

    // Shrink effect on the content for added depth
    gsap.to(".hero-content", {
      scale: 0.8,
      opacity: 0,
      y: -200, // Moves up faster to get out of the way
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "70% top",
        scrub: true
      }
    });

    if (this.heroVideo && this.heroVideo.nativeElement) {
      this.heroVideo.nativeElement.muted = true;
      this.heroVideo.nativeElement.play().catch(e => console.error('Video play error:', e));
    }

    // Developer Names Animation Loop
    const names = ["Sarim", "Hunain", "Umer", "Maaz"];
    let currentIndex = 0;
    const devNameElement = document.querySelector('.dev-name');
    if (devNameElement) {
      setInterval(() => {
        gsap.to(devNameElement, {
          y: -10, opacity: 0, duration: 0.4, ease: "power2.in", onComplete: () => {
            currentIndex = (currentIndex + 1) % names.length;
            devNameElement.textContent = names[currentIndex];
            gsap.fromTo(devNameElement,
              { y: 10, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
            );
          }
        });
      }, 3000);
    }

    const cursor = document.querySelector('.custom-cursor');
    const section = document.querySelector('.testimonials-editorial');

    window.addEventListener('mousemove', (e) => {
      gsap.to(cursor, {
        x: e.clientX - 14, // Offset by half width
        y: e.clientY - 14, // Offset by half height
        duration: 0.1,    // Tiny delay for that 'fluid' follow feel
        ease: "power2.out"
      });

      // 2. Directional Logic
      const target = e.target as Element;
      const hoveredCard = target && target.closest ? target.closest('.editorial-card') : null;
      if (hoveredCard) {
        const rect = hoveredCard.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;

        if (e.clientX < cardCenter) {
          gsap.set(cursor, { scaleX: -1 });
        } else {
          gsap.set(cursor, { scaleX: 1 });
        }
      } else if (section) {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.left + rect.width / 2;
        if (e.clientX < sectionCenter) {
          gsap.set(cursor, { scaleX: -1 });
        } else {
          gsap.set(cursor, { scaleX: 1 });
        }
      }
    });

    // 2. Show/Hide on hover
    section?.addEventListener('mouseenter', () => {
      gsap.to(cursor, { opacity: 1, scale: 1 });
    });

    section?.addEventListener('mouseleave', () => {
      gsap.to(cursor, { opacity: 0, scale: 0 });
    });

    // home.ts inside ngAfterViewInit
    setTimeout(() => {
      gsap.fromTo(
        ".testimonial-content-wrapper",
        {
          scale: 0.5,      // Start even smaller for a more dramatic growth
          y: 150           // More vertical travel makes the timing feel longer
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          ease: "none", // A slight ease-out makes the final landing smoother
          scrollTrigger: {
            trigger: ".testimonials-editorial",
            // Start: When the top of the section enters the bottom of the screen
            start: "top bottom",
            // End: Exactly when the top of the section reaches the center of the screen
            end: "center center",
            /* Increasing scrub to 1.5 or 2 makes the animation 'lag' behind the scroll slightly,
               creating the illusion of a much longer, smoother transition.
            */
            scrub: 3,
            invalidateOnRefresh: true,
            // markers: true // Highly recommend turning this on to see the 'end' line at the center
          }
        }
      );
    }, 100);

    setTimeout(() => {
      gsap.fromTo(
        ".main-gallery-heading",
        {
          fontSize: "8rem",
        },
        {
          fontSize: "5rem",
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".gallery-header",
            start: "top bottom",
            end: "top center",
            scrub: 1, // Smooth "catch up" effect
            invalidateOnRefresh: true,
            // markers: true // Turn this on to see the bottom start line!
          }
        }
      );
    }, 100);

    // Force ScrollTrigger to recalculate after potential image loading
    // to prevent sudden jumps from incorrect pin-spacer heights
    setTimeout(() => ScrollTrigger.refresh(), 500);
    setTimeout(() => ScrollTrigger.refresh(), 1500);
    });
  }



  async onSaveService(service: any, categoryName: string) {
    if (this.authService.isAuthenticated()) {
      try {
        await this.dataService.saveService(+service.id, undefined, `Saved from Home page - ${categoryName}`);
        this.router.navigate(['/app/customer/saved']);
      } catch (error) {
        console.error('Failed to save service:', error);
      }
    } else {
      localStorage.setItem('pendingAction', JSON.stringify({ type: 'save', service, categoryName }));
      this.router.navigate(['/login']);
    }
  }

  onBookService(service: any) {
    if (this.authService.isAuthenticated()) {
      // Add to cart for checkout
      this.dataService.addToCart({
        service: {
          id: service.id,
          title: service.name,
          description: `Professional ${service.name} service`,
          categoryId: '0',
          categoryName: 'General',
          basePrice: service.startingPrice,
          providers: []
        },
        provider: {
          id: '1',
          name: 'Available Provider',
          companyName: 'LSM Local Provider',
          rating: 4.5,
          reviews: 10,
          yearsExperience: 5,
          price: service.startingPrice,
          bio: 'Professional service provider'
        },
        date: new Date().toISOString()
      });
      this.router.navigate(['/app/customer/checkout']);
    } else {
      localStorage.setItem('pendingAction', JSON.stringify({ type: 'book', service }));
      this.router.navigate(['/login']);
    }
  }

  onCardClick(event: MouseEvent) {
    const target = event.target as Element;
    const card = target && target.closest ? target.closest('.editorial-card') : null;
    if (card) {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;

      if (event.clientX < cardCenter) {
        this.prevTestimonial();
      } else {
        this.nextTestimonial();
      }
    }
  }

  // --- Testimonial Carousel Methods ---
  nextTestimonial() {
    this.currentTestimonialIndex =
      (this.currentTestimonialIndex + 1) % this.totalTestimonials;
    this.animateToSlide(this.currentTestimonialIndex);
  }

  prevTestimonial() {
    this.currentTestimonialIndex =
      (this.currentTestimonialIndex - 1 + this.totalTestimonials) % this.totalTestimonials;
    this.animateToSlide(this.currentTestimonialIndex);
  }

  private animateToSlide(index: number) {
    const track = document.querySelector('.testimonial-track') as HTMLElement;
    if (!track) return;

    const firstCard = track.firstElementChild as HTMLElement;
    if (!firstCard) return;

    // getBoundingClientRect().width is reliable regardless of min-width/vw units
    // offsetWidth can return 0 when min-width is set in vw under certain render timings
    const slideWidth = firstCard.getBoundingClientRect().width
      || window.innerWidth * 0.9; // fallback: matches the 90vw CSS

    gsap.to(track, {
      x: -(index * slideWidth),
      duration: 0.7,
      ease: 'power3.inOut'
    });
  }

  trustedBrands = [
    { name: 'LocalBuilders', icon: 'pi-building' },
    { name: 'UrbanCare', icon: 'pi-heart' },
    { name: 'ProFix', icon: 'pi-wrench' },
    { name: 'CleanSweep', icon: 'pi-sparkles' },
    { name: 'EliteTutors', icon: 'pi-book' },
    { name: 'AutoMobileCare', icon: 'pi-car' },
    { name: 'GreenThumb', icon: 'pi-chart-line' }
  ];

  testimonials: Testimonial[] = [
    {
      id: 'rev-1',
      customerName: 'Sarah Jenkins',
      rating: 5,
      comment: 'Found an incredible plumber within minutes. They arrived the same day and fixed the leak perfectly. The whole ecosystem is seamless.',
      serviceReceived: 'Basic Plumbing Repair',
      avatarInitials: 'SJ'
    },
    {
      id: 'rev-2',
      customerName: 'Marcus T.',
      rating: 5,
      comment: 'I use this platform for all my cleaning requirements. The providers are vetted, and the payment and booking interface is incredibly easy.',
      serviceReceived: 'Deep Cleaning',
      avatarInitials: 'MT'
    },
    {
      id: 'rev-3',
      customerName: 'Elena Rostova',
      rating: 4,
      comment: 'Excellent TV Mounting! Fast, efficient, and exactly what I needed. Will definitely rebook for my next assembly project.',
      serviceReceived: 'TV Mounting',
      avatarInitials: 'ER'
    },
    {
      id: 'rev-4',
      customerName: 'David Chen',
      rating: 5,
      comment: 'Moved my entire 3-bedroom house in a single day. The truck assisted moving team was absolutely phenomenal.',
      serviceReceived: 'Truck Assisted Moving',
      avatarInitials: 'DC'
    }
  ];

}