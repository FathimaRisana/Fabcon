/**
 * Voltix Power & IT Infrastructure - Navigation Menu Interaction Controller
 * Handles accessible keyboard navigation, mega-menu interactions, and mobile drawer.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const siteHeader = document.getElementById('siteHeader');
  
  // Desktop Mega Menu Elements
  const servicesDropdownContainer = document.getElementById('servicesDropdownContainer');
  const servicesMenuBtn = document.getElementById('servicesMenuBtn');
  const servicesMegaMenu = document.getElementById('servicesMegaMenu');

  // Mobile Drawer Elements
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileServicesBtn = document.getElementById('mobileServicesBtn');
  const mobileAccordion = document.querySelector('.mobile-accordion');

  // All interactive links in drawer
  const mobileLinks = mobileNavDrawer.querySelectorAll('a');

  // --- Sticky Header Shadow on Scroll ---
  const handleScroll = () => {
    if (window.scrollY > 10) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Desktop Mega Menu Controller ---
  let isMegaMenuOpen = false;

  const openMegaMenu = () => {
    isMegaMenuOpen = true;
    servicesDropdownContainer.classList.add('is-active');
    servicesMenuBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMegaMenu = () => {
    isMegaMenuOpen = false;
    servicesDropdownContainer.classList.remove('is-active');
    servicesMenuBtn.setAttribute('aria-expanded', 'false');
  };

  const toggleMegaMenu = () => {
    if (isMegaMenuOpen) {
      closeMegaMenu();
    } else {
      openMegaMenu();
    }
  };

  if (servicesMenuBtn && servicesDropdownContainer) {
    // Click navigation & chevron toggle
    servicesMenuBtn.addEventListener('click', (e) => {
      const chevron = servicesMenuBtn.querySelector('.chevron-icon');
      // If user specifically clicked the chevron toggle icon, toggle the mega menu without navigating
      if (chevron && (e.target === chevron || chevron.contains(e.target))) {
        e.preventDefault();
        e.stopPropagation();
        toggleMegaMenu();
      }
      // Otherwise, natural navigation to /services proceeds
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!servicesDropdownContainer.contains(e.target)) {
        closeMegaMenu();
      }
    });

    // Close on Escape key and refocus button
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (isMegaMenuOpen) {
          closeMegaMenu();
          servicesMenuBtn.focus();
        }
        if (isDrawerOpen) {
          closeDrawer();
          mobileMenuToggle.focus();
        }
      }
    });

    // Focus tracking to close when tab leaves mega-menu
    servicesDropdownContainer.addEventListener('focusout', (e) => {
      if (!servicesDropdownContainer.contains(e.relatedTarget)) {
        closeMegaMenu();
      }
    });
  }

  // --- Mobile Drawer Controller ---
  let isDrawerOpen = false;

  const openDrawer = () => {
    isDrawerOpen = true;
    mobileNavDrawer.classList.add('is-active');
    mobileBackdrop.classList.add('is-active');
    mobileMenuToggle.classList.add('is-active');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    mobileMenuToggle.setAttribute('aria-label', 'Close Navigation Menu');
    document.body.classList.add('drawer-open');
    drawerCloseBtn.focus();
  };

  const closeDrawer = () => {
    isDrawerOpen = false;
    mobileNavDrawer.classList.remove('is-active');
    mobileBackdrop.classList.remove('is-active');
    mobileMenuToggle.classList.remove('is-active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-label', 'Open Navigation Menu');
    document.body.classList.remove('drawer-open');
  };

  if (mobileMenuToggle && mobileNavDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
      if (isDrawerOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', () => {
        closeDrawer();
        mobileMenuToggle.focus();
      });
    }

    if (mobileBackdrop) {
      mobileBackdrop.addEventListener('click', () => {
        closeDrawer();
      });
    }

    // Auto-close drawer when clicking any link
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });
  }

  // --- Mobile Services Accordion Controller ---
  if (mobileServicesBtn && mobileAccordion) {
    mobileServicesBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = mobileAccordion.classList.toggle('is-expanded');
      mobileServicesBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });
  }

  // --- Viewport Resize Handler ---
  window.addEventListener('resize', () => {
    // If resized to desktop view (>= 1024px), close mobile drawer if open
    if (window.innerWidth >= 1024 && isDrawerOpen) {
      closeDrawer();
    }
  });

  // --- Contact Form Handling & Validation ---
  const contactForm = document.getElementById('contactForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');
  const sendAnotherBtn = document.getElementById('sendAnotherBtn');

  if (contactForm && formSuccessMessage) {
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const phoneInput = document.getElementById('contactPhone');
    const messageInput = document.getElementById('contactMessage');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const messageError = document.getElementById('messageError');

    const validateField = (input, errorElem, condition, message) => {
      if (!input || !errorElem) return false;
      if (!condition) {
        input.classList.add('is-invalid');
        errorElem.textContent = message;
        errorElem.classList.add('is-visible');
        return false;
      } else {
        input.classList.remove('is-invalid');
        errorElem.textContent = '';
        errorElem.classList.remove('is-visible');
        return true;
      }
    };

    const validateForm = () => {
      let isValid = true;

      // Name validation: at least 2 chars
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!validateField(nameInput, nameError, nameVal.length >= 2, 'Please enter your full name (minimum 2 characters).')) {
        isValid = false;
      }

      // Email validation
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!validateField(emailInput, emailError, emailRegex.test(emailVal), 'Please enter a valid email address.')) {
        isValid = false;
      }

      // Phone validation: at least 6 digits/characters
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      if (!validateField(phoneInput, phoneError, phoneVal.length >= 6, 'Please enter a valid phone number.')) {
        isValid = false;
      }

      // Message validation: at least 10 chars
      const messageVal = messageInput ? messageInput.value.trim() : '';
      if (!validateField(messageInput, messageError, messageVal.length >= 10, 'Please enter your message (minimum 10 characters).')) {
        isValid = false;
      }

      return isValid;
    };

    // Live validation on blur & input
    [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          if (input.classList.contains('is-invalid')) {
            validateForm();
          }
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm()) {
        // Show submission success message without claiming email sent via backend
        contactForm.style.display = 'none';
        formSuccessMessage.style.display = 'flex';
        formSuccessMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    if (sendAnotherBtn) {
      sendAnotherBtn.addEventListener('click', () => {
        contactForm.reset();
        [nameInput, emailInput, phoneInput, messageInput].forEach(inp => {
          if (inp) inp.classList.remove('is-invalid');
        });
        [nameError, emailError, phoneError, messageError].forEach(err => {
          if (err) {
            err.textContent = '';
            err.classList.remove('is-visible');
          }
        });
        formSuccessMessage.style.display = 'none';
        contactForm.style.display = 'flex';
        if (nameInput) nameInput.focus();
      });
    }
  }

  // Request a Quote smooth scroll to form on Contact page
  const requestQuoteBtn = document.getElementById('requestQuoteBtn');
  if (requestQuoteBtn) {
    requestQuoteBtn.addEventListener('click', (e) => {
      const formCard = document.getElementById('contactFormCard');
      const nameInput = document.getElementById('contactName');
      if (formCard) {
        e.preventDefault();
        formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (nameInput) setTimeout(() => nameInput.focus(), 400);
      }
    });
  }

  // --- Why Choose Fabcon Carousel Controller ---
  const whyCarousel = document.querySelector('.why-carousel-wrapper');
  if (whyCarousel) {
    const track = whyCarousel.querySelector('.why-carousel-track');
    const slides = whyCarousel.querySelectorAll('.why-carousel-slide');
    const prevBtn = whyCarousel.querySelector('.why-carousel-prev');
    const nextBtn = whyCarousel.querySelector('.why-carousel-next');
    const dots = whyCarousel.querySelectorAll('.why-carousel-dot');

    const totalCategories = 4;
    let currentIndex = 0;
    let autoPlayTimer = null;
    const intervalTime = 4000;

    const getSlideStep = () => {
      if (!slides || slides.length === 0) return 0;
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = 20; // 20px gap defined in CSS
      return slideWidth + gap;
    };

    const updateCarousel = (animate = true) => {
      if (!track || slides.length === 0) return;
      const step = getSlideStep();
      const shift = currentIndex * step;

      track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
      track.style.transform = `translateX(-${shift}px)`;

      // Update active dot indicator (0 to 3)
      const activeDotIndex = currentIndex % totalCategories;
      dots.forEach((dot, idx) => {
        if (idx === activeDotIndex) {
          dot.classList.add('active');
          dot.setAttribute('aria-selected', 'true');
        } else {
          dot.classList.remove('active');
          dot.setAttribute('aria-selected', 'false');
        }
      });
    };

    const handleTransitionEnd = () => {
      // Seamless circular wrap-around when reaching duplicate set boundary
      if (currentIndex === totalCategories) {
        track.style.transition = 'none';
        currentIndex = 0;
        track.style.transform = 'translateX(0px)';
      }
    };

    track.addEventListener('transitionend', handleTransitionEnd);

    const nextSlide = () => {
      if (currentIndex >= totalCategories) {
        track.style.transition = 'none';
        currentIndex = 0;
        track.style.transform = 'translateX(0px)';
        track.offsetHeight; // Force DOM reflow
      }
      currentIndex++;
      updateCarousel(true);
    };

    const prevSlide = () => {
      if (currentIndex <= 0) {
        track.style.transition = 'none';
        currentIndex = totalCategories;
        const step = getSlideStep();
        track.style.transform = `translateX(-${currentIndex * step}px)`;
        track.offsetHeight; // Force DOM reflow
      }
      currentIndex--;
      updateCarousel(true);
    };

    const goToSlide = (idx) => {
      currentIndex = idx % totalCategories;
      updateCarousel(true);
    };

    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayTimer = setInterval(nextSlide, intervalTime);
    };

    const stopAutoPlay = () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoPlay();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        startAutoPlay();
      });
    });

    // Pause on hover
    whyCarousel.addEventListener('mouseenter', stopAutoPlay);
    whyCarousel.addEventListener('mouseleave', startAutoPlay);

    // Pause on touch
    whyCarousel.addEventListener('touchstart', stopAutoPlay, { passive: true });
    whyCarousel.addEventListener('touchend', startAutoPlay, { passive: true });

    // Handle responsive resize adjustment
    window.addEventListener('resize', () => {
      updateCarousel(false);
    });

    // Initialize state
    updateCarousel(false);
    startAutoPlay();
  }

  // --- Our Services Carousel Controller (Modern Native Smooth-Scroll Engine) ---
  const initServicesCarousel = () => {
    const carouselWrapper = document.getElementById('servicesCarousel');
    const viewport = document.getElementById('servicesViewport');
    const track = document.getElementById('servicesTrack');
    const prevBtn = document.getElementById('servicesPrevBtn');
    const nextBtn = document.getElementById('servicesNextBtn');
    const pagination = document.getElementById('servicesPagination');

    if (!carouselWrapper || !viewport || !track || !prevBtn || !nextBtn) return;

    const cards = Array.from(track.querySelectorAll('.service-carousel-card'));
    const totalCards = cards.length;
    if (totalCards === 0) return;

    let autoPlayTimer = null;
    let isPaused = false;

    // 1. Dynamic visible cards count
    const getCardsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1024) return 3;
      if (width >= 640) return 2;
      return 1;
    };

    // 2. Computed gap from track
    const getGap = () => {
      const style = window.getComputedStyle(track);
      const gapVal = parseFloat(style.gap) || parseFloat(style.columnGap);
      if (!isNaN(gapVal)) return gapVal;
      const width = window.innerWidth;
      if (width >= 1024) return 28;
      if (width >= 640) return 20;
      return 16;
    };

    // 3. Set exact card widths so N cards fit per view
    const updateCardSizes = () => {
      const visible = getCardsPerView();
      const gap = getGap();
      const viewportWidth = viewport.clientWidth;
      if (viewportWidth <= 0) return;

      const cardWidth = Math.floor((viewportWidth - (gap * (visible - 1))) / visible);
      cards.forEach(card => {
        card.style.flex = `0 0 ${cardWidth}px`;
        card.style.width = `${cardWidth}px`;
      });
    };

    // 4. Calculate scroll step (1 card width + gap)
    const getScrollStep = () => {
      if (cards.length === 0) return 300;
      return cards[0].offsetWidth + getGap();
    };

    // 5. Update pagination dots and navigation button states based on scroll position
    const updateControls = () => {
      const scrollLeft = viewport.scrollLeft;
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      
      const isAtStart = scrollLeft <= 5;
      const isAtEnd = scrollLeft >= maxScroll - 5;

      prevBtn.disabled = isAtStart;
      prevBtn.setAttribute('aria-disabled', isAtStart ? 'true' : 'false');

      nextBtn.disabled = isAtEnd;
      nextBtn.setAttribute('aria-disabled', isAtEnd ? 'true' : 'false');

      if (pagination) {
        const step = getScrollStep();
        const activeIdx = Math.min(totalCards - 1, Math.round(scrollLeft / step));
        const dots = pagination.querySelectorAll('.services-dot');
        dots.forEach((dot, idx) => {
          if (idx === activeIdx) {
            dot.classList.add('is-active');
            dot.setAttribute('aria-selected', 'true');
          } else {
            dot.classList.remove('is-active');
            dot.setAttribute('aria-selected', 'false');
          }
        });
      }
    };

    // 6. Build pagination dots
    const renderPagination = () => {
      if (!pagination) return;
      pagination.innerHTML = '';
      const visible = getCardsPerView();
      const dotCount = Math.max(1, totalCards - visible + 1);

      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `services-dot ${i === 0 ? 'is-active' : ''}`;
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Go to service slide ${i + 1}`);
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        dot.addEventListener('click', () => {
          const step = getScrollStep();
          viewport.scrollTo({
            left: i * step,
            behavior: 'smooth'
          });
        });
        pagination.appendChild(dot);
      }
    };

    // 7. Scroll action helpers
    const scrollNext = () => {
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      const step = getScrollStep();
      if (viewport.scrollLeft >= maxScroll - 10) {
        // Loop back to start
        viewport.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        viewport.scrollBy({ left: step, behavior: 'smooth' });
      }
    };

    const scrollPrev = () => {
      const step = getScrollStep();
      if (viewport.scrollLeft > 0) {
        viewport.scrollBy({ left: -step, behavior: 'smooth' });
      }
    };

    // Button event listeners
    nextBtn.addEventListener('click', () => {
      scrollNext();
    });

    prevBtn.addEventListener('click', () => {
      scrollPrev();
    });

    // Keyboard support
    carouselWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') scrollNext();
      if (e.key === 'ArrowLeft') scrollPrev();
    });

    // Listen to scroll events to update buttons & dots in real time
    let scrollDebounce = null;
    viewport.addEventListener('scroll', () => {
      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(updateControls, 40);
    }, { passive: true });

    // 8. Autoplay (every 4 seconds)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const startAutoPlay = () => {
      if (prefersReducedMotion || isPaused) return;
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        scrollNext();
      }, 4000);
    };

    const stopAutoPlay = () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    };

    // Pause on hover
    carouselWrapper.addEventListener('mouseenter', () => {
      isPaused = true;
      stopAutoPlay();
    });

    carouselWrapper.addEventListener('mouseleave', () => {
      isPaused = false;
      startAutoPlay();
    });

    // Pause on focus
    carouselWrapper.addEventListener('focusin', () => {
      isPaused = true;
      stopAutoPlay();
    });

    carouselWrapper.addEventListener('focusout', () => {
      isPaused = false;
      startAutoPlay();
    });

    // Pause on manual touch scroll
    viewport.addEventListener('touchstart', () => {
      isPaused = true;
      stopAutoPlay();
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
      isPaused = false;
      startAutoPlay();
    }, { passive: true });

    // 9. Resize recalculations
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateCardSizes();
        renderPagination();
        updateControls();
      }, 100);
    });

    // Initial setup
    updateCardSizes();
    renderPagination();
    updateControls();
    startAutoPlay();
  };

  initServicesCarousel();

  // --- Industries Navigation Handler ---
  const scrollToIndustries = () => {
    const industriesSection = document.getElementById('industries');
    if (industriesSection) {
      industriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // If page loads with #industries in URL hash (e.g. navigated from another page)
  if (window.location.hash === '#industries') {
    setTimeout(scrollToIndustries, 250);
  }

  // Intercept in-page clicks to #industries or /#industries
  document.querySelectorAll('a[href="#industries"], a[href="/#industries"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '';
      if (isHomePage) {
        const target = document.getElementById('industries');
        if (target) {
          e.preventDefault();
          if (history.pushState) {
            history.pushState(null, '', '#industries');
          } else {
            window.location.hash = '#industries';
          }
          scrollToIndustries();
        }
      }
    });
  });
});
