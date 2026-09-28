// Initialize Lucide Icons
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  
  // Set current year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

// Register GSAP ScrollTrigger
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Header fade-in on load
  gsap.from("#site-header", {
    y: -25,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  });

  // 2. Hero Section Animations (Page Load)
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

  heroTl
    .from("section.grid-backdrop span.rounded-full", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.1,
      clearProps: "opacity,transform"
    })
    .from("section.grid-backdrop h1", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      clearProps: "opacity,transform"
    }, "-=0.45")
    .from("section.grid-backdrop p", {
      y: 25,
      opacity: 0,
      duration: 0.8,
      clearProps: "opacity,transform"
    }, "-=0.6")
    .fromTo("section.grid-backdrop .hero-ctas a", 
      { scale: 0.95, y: 15, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.6, stagger: 0.1, clearProps: "opacity,transform" },
      "-=0.55"
    )
    .from("section.grid-backdrop dl > div", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      clearProps: "opacity,transform"
    }, "-=0.45")
    .from("section.grid-backdrop .hero-visual", {
      scale: 0.96,
      opacity: 0,
      duration: 0.9,
      ease: "power2.out",
      clearProps: "opacity,transform"
    }, "-=0.8");

  // 3. Scroll Trigger Reveal Animations (Staggered Grid Cards & Elements)
  const scrollReveals = gsap.utils.toArray(".reveal-el");
  scrollReveals.forEach((el) => {
    // Skip elements inside the hero section since they are animated on load
    const heroSection = document.querySelector("main > section");
    if (el.closest("section") === heroSection) return;

    let delay = 0;
    const parent = el.parentElement;
    
    // Apply staggering if sibling items in a grid/list
    if (parent && (parent.tagName === "UL" || parent.tagName === "OL" || parent.classList.contains("grid"))) {
      const siblings = Array.from(parent.children);
      const index = siblings.indexOf(el);
      if (index !== -1) {
        delay = (index % 5) * 0.08; // smooth stagger
      }
    }

    gsap.fromTo(el,
      {
        opacity: 0,
        y: 35
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        delay: delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // 4. "How It Works" Timeline Progress Bar Scroll Animation
  const timelineProgress = document.getElementById("timeline-progress");
  const timelineTrigger = document.querySelector("#how-it-works .timeline-container") || document.querySelector("#how-it-works");
  if (timelineProgress && timelineTrigger) {
    gsap.to(timelineProgress, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: timelineTrigger,
        start: "top 60%",
        end: "bottom 70%",
        scrub: true
      }
    });
  }

  // 5. Email Traffic Overview Chart (dynamic bars animation)
  const trafficBars = gsap.utils.toArray("#traffic-bars > div");
  if (trafficBars.length > 0) {
    gsap.fromTo(trafficBars,
      {
        height: "0%"
      },
      {
        height: (i, target) => target.getAttribute("data-height") + "%",
        duration: 1.3,
        stagger: 0.04,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#traffic-bars",
          start: "top 82%",
          toggleActions: "play none none none"
        }
      }
    );
  }

  // Refresh ScrollTrigger after Tailwind CDN loads and parses layout
  window.addEventListener("load", () => {
    setTimeout(() => {
      ScrollTrigger.refresh();
      if (window.lucide) {
        lucide.createIcons();
      }
    }, 350);
  });

  window.addEventListener("scroll", () => {
    ScrollTrigger.refresh();
  }, { once: true, passive: true });

  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
}

// 6. Header Scrolled State handler
const header = document.getElementById("site-header");
const updateHeaderState = () => {
  if (header) {
    if (window.scrollY > 12) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  }
};
window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();

// 7. Mobile Navigation Toggle Interactivity
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const menuIcon = document.getElementById("menu-icon");
let menuOpen = false;

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
      menuToggle.setAttribute("aria-expanded", "true");
      mobileMenu.classList.remove("hidden");
      
      if (window.gsap) {
        gsap.fromTo(mobileMenu,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.35, ease: "power2.out" }
        );
      }
      if (menuIcon) {
        menuIcon.setAttribute("data-lucide", "x");
      }
    } else {
      menuToggle.setAttribute("aria-expanded", "false");
      
      if (window.gsap) {
        gsap.to(mobileMenu, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            mobileMenu.classList.add("hidden");
          }
        });
      } else {
        mobileMenu.classList.add("hidden");
      }
      if (menuIcon) {
        menuIcon.setAttribute("data-lucide", "menu");
      }
    }
    if (window.lucide) {
      lucide.createIcons();
    }
  });

  const mobileLinks = document.querySelectorAll(".mobile-nav-link");
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (menuOpen) {
        menuOpen = false;
        menuToggle.setAttribute("aria-expanded", "false");
        if (window.gsap) {
          gsap.to(mobileMenu, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              mobileMenu.classList.add("hidden");
            }
          });
        } else {
          mobileMenu.classList.add("hidden");
        }
        if (menuIcon) {
          menuIcon.setAttribute("data-lucide", "menu");
        }
        if (window.lucide) {
          lucide.createIcons();
        }
      }
    });
  });
}

// 8. FAQ Accordion Logic using GSAP
const accordionItems = document.querySelectorAll(".accordion-item");
accordionItems.forEach(item => {
  const trigger = item.querySelector(".accordion-trigger");
  const content = item.querySelector(".accordion-content");

  if (trigger && content) {
    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // Close all other items
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active");
          const otherContent = otherItem.querySelector(".accordion-content");
          const otherIcon = otherItem.querySelector('[data-lucide="chevron-down"]');
          
          if (window.gsap) {
            gsap.to(otherContent, {
              height: 0,
              duration: 0.35,
              ease: "power2.inOut"
            });
            if (otherIcon) {
              gsap.to(otherIcon, { rotate: 0, duration: 0.25 });
            }
          } else {
            otherContent.style.height = "0px";
          }
        }
      });

      // Toggle current item
      const icon = trigger.querySelector('[data-lucide="chevron-down"]');
      if (isOpen) {
        item.classList.remove("active");
        if (window.gsap) {
          gsap.to(content, {
            height: 0,
            duration: 0.35,
            ease: "power2.inOut"
          });
          if (icon) {
            gsap.to(icon, { rotate: 0, duration: 0.25 });
          }
        } else {
          content.style.height = "0px";
        }
      } else {
        item.classList.add("active");
        if (window.gsap) {
          gsap.to(content, {
            height: "auto",
            duration: 0.35,
            ease: "power2.inOut"
          });
          if (icon) {
            gsap.to(icon, { rotate: 180, duration: 0.25 });
          }
        } else {
          content.style.height = "auto";
        }
      }
    });
  }
});

// 9. Contact Form Handling
const contactForm = document.getElementById("contact-form");
const formFeedback = document.getElementById("form-feedback");
if (contactForm && formFeedback) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formFeedback.textContent = "Thank you! Our security engineering team will reach out within one business day.";
    
    if (window.gsap) {
      gsap.fromTo(formFeedback,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
    
    contactForm.reset();
  });
}
