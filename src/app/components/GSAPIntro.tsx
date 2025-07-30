"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

interface GSAPIntroProps {
  onComplete: () => void;
}

export default function GSAPIntro({ onComplete }: GSAPIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('Initializing...');

  useEffect(() => {
    const container = containerRef.current;
    const logo = logoRef.current;
    const text = textRef.current;
    const subtitle = subtitleRef.current;
    const particles = particlesRef.current;
    const progressBar = progressRef.current;
    const glow = glowRef.current;

    if (!container || !logo || !text || !subtitle || !particles || !progressBar || !glow) return;

    // Create timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 500);
      }
    });

    // Initial states
    gsap.set([logo, text, particles, progressBar], { 
      opacity: 0,
      scale: 0.5,
      y: 50
    });

    // Create floating particles
    const createParticles = () => {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        // Set particle properties using GSAP instead of inline styles
        gsap.set(particle, {
          position: 'absolute',
          width: Math.random() * 6 + 2,
          height: Math.random() * 6 + 2,
          background: 'linear-gradient(45deg, #00d4ff, #0099cc)',
          borderRadius: '50%',
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          opacity: 0,
          boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
        });
        
        particles.appendChild(particle);

        // Animate each particle
        gsap.to(particle, {
          opacity: 1,
          duration: 0.5,
          delay: Math.random() * 2,
          ease: "power2.out"
        });

        gsap.to(particle, {
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200,
          rotation: 360,
          duration: 3 + Math.random() * 2,
          repeat: -1,
          ease: "none"
        });

        gsap.to(particle, {
          scale: Math.random() * 0.5 + 0.5,
          duration: 1 + Math.random(),
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut"
        });
      }
    };

    // Animation sequence
    tl
      // Stage 1: Container fade in
      .to(container, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      })
      
      // Stage 2: Particles appear
      .to(particles, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        onStart: createParticles
      }, "-=0.3")
      
      // Stage 3: Logo entrance with bounce
      .to(logo, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
        onStart: () => {
          // Add glow effect
          gsap.to(logo, {
            filter: "drop-shadow(0 0 20px rgba(0, 212, 255, 0.8))",
            duration: 0.5,
            yoyo: true,
            repeat: 1
          });
        }
      }, "-=0.5")
      
      // Stage 4: Text slide up
      .to(text, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6")
      
      // Stage 5: Progress bar
      .to(progressBar, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.4")
      
      // Stage 6: Progress animation
      .to({}, {
        duration: 2,
        ease: "power2.inOut",
        onUpdate: function() {
          const prog = Math.round(this.progress() * 100);
          setProgress(prog);
          
          // Update progress bar width
          gsap.set(progressBar.querySelector('.gsap-intro-progress-fill'), {
            width: `${prog}%`
          });
        }
      })
      
      // Stage 7: Final logo pulse
      .to(logo, {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      }, "-=0.5")
      
      // Stage 8: Fade out everything
      .to([logo, text, progressBar], {
        opacity: 0,
        scale: 0.9,
        y: -30,
        duration: 0.8,
        ease: "power2.in",
        stagger: 0.1
      }, "+=0.5")
      
      .to(particles, {
        opacity: 0,
        scale: 0.5,
        duration: 0.6,
        ease: "power2.in"
      }, "-=0.6")
      
      .to(container, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in"
      }, "-=0.3");

    // Cleanup
    return () => {
      tl.kill();
      if (particles) {
        particles.innerHTML = '';
      }
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="gsap-intro-container"
    >
      {/* Animated Background */}
      <div className="gsap-intro-background" />

      {/* Floating Particles Container */}
      <div 
        ref={particlesRef}
        className="gsap-intro-particles"
      />

      {/* Logo */}
      <div 
        ref={logoRef}
        className="gsap-intro-logo"
      >
        <Image
          src="/images/CSR-logo.svg"
          alt="CS RIPPERS"
          width={120}
          height={120}
        />
      </div>

      {/* Text */}
      <div 
        ref={textRef}
        className="gsap-intro-text"
      >
        <h1 className="gsap-intro-title">
          CS RIPPERS
        </h1>
        <p className="gsap-intro-subtitle">
          Initializing Experience...
        </p>
      </div>

      {/* Progress Bar */}
      <div 
        ref={progressRef}
        className="gsap-intro-progress-bar"
      >
        <div className="gsap-intro-progress-fill" />
      </div>

      {/* Progress Text */}
      <div className="gsap-intro-progress-text">
        {progress}%
      </div>
    </div>
  );
}