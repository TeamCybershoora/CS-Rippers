"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const useGSAPAnimations = () => {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Create main timeline
    timelineRef.current = gsap.timeline({ paused: true });
    
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  const animateDesktopSequence = () => {
    if (!timelineRef.current) return;

    const tl = timelineRef.current;

    // Set initial states - all elements hidden
    gsap.set([
      '.macos-menubar',
      '.macos-dock',
      '.customization-panel',
      '.main-window',
      '.csr-window'
    ], {
      opacity: 0,
      y: -50,
      scale: 0.8
    });

    // Sequential animations
    tl.clear()
      // 1. Menu Bar appears first
      .to('.macos-menubar', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      })
      
      // 2. Menu bar items animate in
      .to('.menu-item, .system-icon', {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.3")
      
      // 3. Dock slides up from bottom
      .to('.macos-dock', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.2")
      
      // 4. Dock icons bounce in
      .to('.dock-item', {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.08,
        ease: "bounce.out"
      }, "-=0.4")
      
      // 5. Dock separators fade in
      .to('.dock-separator', {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.2")
      
      // 6. Desktop background fade in
      .to('.macos-desktop', {
        opacity: 1,
        duration: 1,
        ease: "power2.inOut"
      }, "-=0.6");

    // Play the timeline
    tl.play();
  };

  const animateWindowOpen = (windowSelector: string) => {
    gsap.fromTo(windowSelector, 
      {
        opacity: 0,
        scale: 0.3,
        y: 100,
        rotationX: -15
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotationX: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      }
    );
  };

  const animateWindowClose = (windowSelector: string, onComplete?: () => void) => {
    gsap.to(windowSelector, {
      opacity: 0,
      scale: 0.3,
      y: -50,
      rotationX: 15,
      duration: 0.4,
      ease: "back.in(1.7)",
      onComplete
    });
  };

  const animatePanelSlide = (panelSelector: string, isOpen: boolean) => {
    if (isOpen) {
      gsap.fromTo(panelSelector,
        {
          opacity: 0,
          x: 300,
          scale: 0.9
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.5,
          ease: "power3.out"
        }
      );
    } else {
      gsap.to(panelSelector, {
        opacity: 0,
        x: 300,
        scale: 0.9,
        duration: 0.4,
        ease: "power3.in"
      });
    }
  };

  const animateHeroSection = () => {
    const tl = gsap.timeline();
    
    // First animate the section container
    tl.fromTo('.window-section-1',
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" }
    )
    .fromTo('.hero-icon', 
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" },
      "-=0.3"
    )
    .fromTo('.hero-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo('.hero-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    )
    .fromTo('.hero-desc',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.2"
    )
    .fromTo('.hero-btns .macos-btn',
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" },
      "-=0.2"
    );
  };

  const animateAppsGrid = () => {
    const tl = gsap.timeline();
    
    // First animate the section container
    tl.fromTo('.window-section-2',
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" }
    )
    .fromTo('.app-card',
      {
        opacity: 0,
        y: 50,
        scale: 0.9,
        rotationY: -15
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationY: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out"
      },
      "-=0.3"
    );
  };

  const animateCTASection = () => {
    const tl = gsap.timeline();
    
    tl.fromTo('.window-section-3',
      {
        opacity: 0,
        y: 30,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
      }
    )
    .fromTo('.cta-content',
      {
        opacity: 0,
        y: 20
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      },
      "-=0.4"
    )
    .fromTo('.cta-btn',
      {
        opacity: 0,
        scale: 0.9,
        y: 10
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
      },
      "-=0.2"
    );
  };

  return {
    animateDesktopSequence,
    animateWindowOpen,
    animateWindowClose,
    animatePanelSlide,
    animateHeroSection,
    animateAppsGrid,
    animateCTASection
  };
};