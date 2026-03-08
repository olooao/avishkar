import './index.css';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Custom Cursor
const cursor = document.querySelector('.cursor');
if (cursor) {
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.15,
      ease: 'power2.out'
    });
  });

  const hoverElements = document.querySelectorAll('a, button, .hover-target');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Parallax Hero Background
  gsap.to('.hero-bg', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Parallax Hero Title
  gsap.to('.hero-title', {
    yPercent: -40,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Reveal Animations
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    gsap.fromTo(el, 
      { y: 80, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 1.2, 
        ease: 'power4.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Image Parallax inside containers
  const imgContainers = document.querySelectorAll('.img-container');
  imgContainers.forEach(container => {
    const img = container.querySelector('img');
    if (img) {
      gsap.to(img, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  });

  // Video Gallery Logic
  const galleryCards = document.querySelectorAll('.gallery-card');
  galleryCards.forEach(card => {
    const video = card.querySelector('video');
    
    card.addEventListener('mouseenter', () => {
      if (video) video.play();
      if (cursor) cursor.classList.add('hover');
    });
    
    card.addEventListener('mouseleave', () => {
      if (video) {
        video.pause();
        // Optional: reset video to start
        // video.currentTime = 0; 
      }
      if (cursor) cursor.classList.remove('hover');
    });
  });

  // Timeline Data
  const timelineData = [
    { year: '2021', title: 'Inception', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop' },
    { year: '2022', title: 'First Breakthrough', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop' },
    { year: '2023', title: 'Global Expansion', img: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1000&auto=format&fit=crop' },
    { year: '2024', title: 'The Next Frontier', img: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop' },
    { year: '2025', title: 'Awards Level', img: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?q=80&w=1000&auto=format&fit=crop' }
  ];

  // Build Timeline HTML
  const cardsContainer = document.getElementById('cards-container');
  const listContainer = document.getElementById('list-container');
  const timelineNav = document.getElementById('timeline-nav');

  if (cardsContainer && listContainer && timelineNav) {
    timelineData.forEach((item, i) => {
      // Nav
      const navItem = document.createElement('div');
      navItem.className = 'font-mono text-sm font-bold text-[#1A1814]/40 cursor-pointer hover:text-[#C5A059] transition-colors nav-year';
      navItem.textContent = item.year;
      timelineNav.appendChild(navItem);

      // Card
      const card = document.createElement('div');
      card.className = 'time-card absolute top-1/2 left-1/2 w-full md:w-[60%] h-full md:h-[80%] rounded-2xl overflow-hidden shadow-2xl shadow-[#C5A059]/10';
      card.innerHTML = `
        <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover" crossorigin="anonymous" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#1A1814]/90 via-[#1A1814]/20 to-transparent"></div>
        <div class="absolute bottom-0 left-0 w-full p-8 md:p-12 text-[#FDFBF7]">
          <div class="font-mono text-[#C5A059] mb-2 font-semibold">${item.year}</div>
          <h3 class="font-display text-3xl md:text-5xl font-bold uppercase">${item.title}</h3>
        </div>
      `;
      cardsContainer.appendChild(card);

      // List Item
      const listItem = document.createElement('div');
      listItem.className = 'list-item hover-target flex items-center gap-8 py-6 border-b border-[#1A1814]/10 cursor-none';
      listItem.dataset.img = item.img;
      listItem.innerHTML = `
        <span class="font-mono text-xl text-[#C5A059] w-20">${item.year}</span>
        <span class="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter">${item.title}</span>
      `;
      listContainer.appendChild(listItem);
    });

    // 3D Scroll Logic
    const cards = gsap.utils.toArray('.time-card');
    const navYears = gsap.utils.toArray('.nav-year');
    
    // Initial Set
    cards.forEach((card, i) => {
      gsap.set(card, {
        xPercent: -50,
        yPercent: -50 + (i * 5),
        z: -i * 300,
        opacity: 1 - (i * 0.25),
        scale: 1
      });
    });

    let timelineST = ScrollTrigger.create({
      trigger: '#timeline',
      start: 'top top',
      end: '+=3000',
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const currentIndex = progress * (cards.length - 1);
        
        cards.forEach((card, i) => {
          const offset = i - currentIndex;
          
          if (offset < 0) {
            // Passed camera
            gsap.set(card, {
              z: -offset * 500, // Move towards camera
              yPercent: -50 + (offset * 20),
              opacity: 1 + offset, // Fade out quickly
              visibility: offset < -1 ? 'hidden' : 'visible'
            });
          } else {
            // In stack
            gsap.set(card, {
              z: -offset * 300, // Move away
              yPercent: -50 + (offset * 5),
              opacity: 1 - (offset * 0.25),
              visibility: 'visible'
            });
          }
        });

        // Update Nav
        const activeIdx = Math.round(currentIndex);
        navYears.forEach((nav, i) => {
          if (i === activeIdx) {
            nav.classList.add('text-[#C5A059]');
            nav.classList.remove('text-[#1A1814]/40');
          } else {
            nav.classList.remove('text-[#C5A059]');
            nav.classList.add('text-[#1A1814]/40');
          }
        });
      }
    });

    // Toggle Logic
    const viewToggle = document.getElementById('view-toggle');
    const stackView = document.getElementById('stack-view');
    const listView = document.getElementById('list-view');
    let isListView = false;

    viewToggle.addEventListener('click', () => {
      isListView = !isListView;
      
      // Scroll to top of timeline section to prevent jumping
      window.scrollTo({
        top: document.getElementById('timeline').offsetTop,
        behavior: 'smooth'
      });

      setTimeout(() => {
        if (isListView) {
          viewToggle.textContent = 'Stack View';
          gsap.to(stackView, { opacity: 0, duration: 0.5, onComplete: () => stackView.classList.add('hidden') });
          listView.classList.remove('hidden');
          gsap.fromTo(listView, { opacity: 0 }, { opacity: 1, duration: 0.5 });
          timelineST.disable();
        } else {
          viewToggle.textContent = 'List View';
          gsap.to(listView, { opacity: 0, duration: 0.5, onComplete: () => listView.classList.add('hidden') });
          stackView.classList.remove('hidden');
          gsap.fromTo(stackView, { opacity: 0 }, { opacity: 1, duration: 0.5 });
          timelineST.enable();
        }
      }, 300); // Wait for scroll
    });

    // Floating Preview Logic
    const floatingPreview = document.getElementById('floating-preview');
    const previewImg = floatingPreview.querySelector('img');
    const listItems = document.querySelectorAll('.list-item');

    document.addEventListener('mousemove', (e) => {
      if (isListView) {
        // Use GSAP set for instant follow, or to for smooth follow
        gsap.to(floatingPreview, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });

    listItems.forEach(item => {
      item.addEventListener('mouseenter', (e) => {
        previewImg.src = e.currentTarget.dataset.img;
        floatingPreview.classList.add('active');
        // Add hover class to cursor
        if (cursor) cursor.classList.add('hover');
      });
      item.addEventListener('mouseleave', () => {
        floatingPreview.classList.remove('active');
        if (cursor) cursor.classList.remove('hover');
      });
    });
  }

  // 3D Carousel Logic
  const carouselSpinner = document.getElementById('carousel-spinner');
  const carouselPrev = document.getElementById('carousel-prev');
  const carouselNext = document.getElementById('carousel-next');

  if (carouselSpinner) {
    const carouselData = [
      { img: 'https://images.unsplash.com/photo-1516280440503-66f804040071?q=80&w=800&auto=format&fit=crop', title: 'The Pitch' },
      { img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop', title: 'Brainstorm' },
      { img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop', title: 'Strategy' },
      { img: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop', title: 'Workshop' },
      { img: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=800&auto=format&fit=crop', title: 'Teamwork' },
      { img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop', title: 'Hackathon' }
    ];

    const numItems = carouselData.length;
    const angle = 360 / numItems;
    // Calculate radius based on width of item (approx 300px)
    const radius = Math.round((300 / 2) / Math.tan(Math.PI / numItems)) + 50; 

    carouselData.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'carousel-item group cursor-none';
      el.style.transform = `rotateY(${i * angle}deg) translateZ(${radius}px)`;
      el.innerHTML = `
        <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" crossorigin="anonymous" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#1A1814]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="absolute bottom-0 left-0 w-full p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <h3 class="font-display text-2xl font-bold text-[#FDFBF7] uppercase">${item.title}</h3>
        </div>
      `;
      
      // Add cursor hover effect
      el.addEventListener('mouseenter', () => { if (cursor) cursor.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { if (cursor) cursor.classList.remove('hover'); });
      
      carouselSpinner.appendChild(el);
    });

    let currentAngle = 0;

    const rotateCarousel = () => {
      carouselSpinner.style.transform = `rotateY(${currentAngle}deg)`;
    };

    carouselPrev.addEventListener('click', () => {
      currentAngle += angle;
      rotateCarousel();
    });

    carouselNext.addEventListener('click', () => {
      currentAngle -= angle;
      rotateCarousel();
    });
  }
});
