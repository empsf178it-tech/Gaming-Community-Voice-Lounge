/* ==========================================================================
   NEXUS LOUNGE — Main JavaScript Engine
   Play Together. Talk Freely. Create More.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initBackToTop();
  initNavigation();
  initAuth();
  initScrollAnimations();
  initCounters();
  initToasts();
  initHeroEffects();
  initMassHeroEngine();

  // Page specific initializations
  initVoiceRooms();
  initCommunityFilters();
  initCreatorFollow();
  initGalleryLightbox();
  initEvents();
  initDashboard();
  initDashboardTabs();
  initProfile();
  initAdmin();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. THEME ENGINE
   -------------------------------------------------------------------------- */
function initTheme() {
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('nexusTheme', 'dark');
}

function initNavigation() {
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-menu-links a');

  // Highlight Active Menu Item based on current path (All Devices)
  let currentPath = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPath === '') currentPath = 'index.html';

  const allNavLinks = document.querySelectorAll('.nav-link-item, .dropdown-item-link, .mobile-nav-item-link, .mobile-sublink-card');
  
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const cleanHref = href.split('/').pop();
    if (cleanHref === currentPath) {
      link.classList.add('active');

      // Highlight parent dropdown button on desktop
      const parentDropdown = link.closest('.nav-item-dropdown');
      if (parentDropdown) {
        const parentToggle = parentDropdown.querySelector('.nav-link-item');
        if (parentToggle) parentToggle.classList.add('active');
      }

      // Highlight & open parent accordion group on mobile
      const parentMobileGroup = link.closest('.mobile-dropdown-group');
      if (parentMobileGroup) {
        parentMobileGroup.classList.add('active');
      }
    }
  });

  // Mobile Toggle Click
  if (mobileToggleBtn && mobileNavOverlay) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = mobileNavOverlay.classList.contains('active');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  // Mobile Dropdown Accordion Toggles
  const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
  mobileDropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const group = toggle.closest('.mobile-dropdown-group');
      if (group) {
        group.classList.toggle('active');
      }
    });
  });

  // Auto Close Mobile Nav on Any Sublink or Nav Item Click
  const mobileCloseableLinks = document.querySelectorAll('#mobileNavOverlay a');
  mobileCloseableLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  function openMobileNav() {
    mobileNavOverlay.classList.add('active');
    if (mobileToggleBtn) {
      const icon = mobileToggleBtn.querySelector('i');
      if (icon) icon.className = 'bi bi-x-lg';
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (mobileNavOverlay) mobileNavOverlay.classList.remove('active');
    if (mobileToggleBtn) {
      const icon = mobileToggleBtn.querySelector('i');
      if (icon) icon.className = 'bi bi-list';
    }
    document.body.style.overflow = '';
  }

  // Navbar Background Blur on Scroll
  const navbar = document.querySelector('.nexus-navbar');
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
}

/* --------------------------------------------------------------------------
   3. AUTHENTICATION & DEMO SESSION SYSTEM
   -------------------------------------------------------------------------- */
function initAuth() {
  // Check auth header buttons
  const authNavContainer = document.getElementById('navAuthContainer');
  const user = getCurrentUser();

  if (authNavContainer) {
    if (user) {
      authNavContainer.innerHTML = `
        <a href="dashboard.html" class="btn-nexus-secondary btn-sm me-2">
          <i class="bi bi-speedometer2"></i> Dashboard
        </a>
        <button id="logoutBtn" class="btn-nexus-outline btn-sm">
          <i class="bi bi-box-arrow-right"></i> Logout
        </button>
      `;
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
      }
    } else {
      authNavContainer.innerHTML = `
        <a href="login.html" class="btn-nexus-secondary btn-sm me-2">Login</a>
        <a href="register.html" class="btn-nexus-primary btn-sm">Join Community</a>
      `;
    }
  }

  // Handle Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      if (!email || !password) {
        showToast('Please fill in all credentials.', 'error');
        return;
      }

      const userData = {
        name: 'Apex Striker',
        username: '@apex_striker',
        email: email,
        avatar: 'assets/images/img9.png',
        joinedDate: 'October 2026',
        bio: 'Competitive FPS & Esports enthusiast. Leader of Vanguard Squad.'
      };

      localStorage.setItem('nexusUser', JSON.stringify(userData));
      showToast('Logged in successfully! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    });
  }

  // Handle Demo Login Button
  const demoLoginBtn = document.getElementById('demoLoginBtn');
  if (demoLoginBtn) {
    demoLoginBtn.addEventListener('click', () => {
      const demoUser = {
        name: 'Nexus Gamer',
        username: '@nexus_legend',
        email: 'gamer@nexuslounge.gg',
        avatar: 'assets/images/img9.png',
        joinedDate: 'October 2026',
        bio: 'Gaming Creator & Voice Lounge Regular. Streaming every weekend!'
      };
      localStorage.setItem('nexusUser', JSON.stringify(demoUser));
      showToast('Welcome, Demo User! Redirecting to Dashboard...', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    });
  }

  // Handle Register Form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const username = document.getElementById('regUsername').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value.trim();
      const confirmPassword = document.getElementById('regConfirmPassword').value.trim();
      const agree = document.getElementById('regAgree').checked;

      if (!name || !username || !email || !password) {
        showToast('Please complete all required fields.', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'error');
        return;
      }

      if (!agree) {
        showToast('You must accept the Community Guidelines.', 'error');
        return;
      }

      const newUser = {
        name: name,
        username: username.startsWith('@') ? username : `@${username}`,
        email: email,
        avatar: 'assets/images/img10.png',
        joinedDate: 'October 2026',
        bio: 'New NEXUS LOUNGE community member!'
      };

      localStorage.setItem('nexusUser', JSON.stringify(newUser));
      showToast('Registration successful! Welcome to NEXUS LOUNGE.', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    });
  }
}

function getCurrentUser() {
  const user = localStorage.getItem('nexusUser');
  return user ? JSON.parse(user) : null;
}

function logoutUser() {
  localStorage.removeItem('nexusUser');
  showToast('Logged out successfully.', 'info');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 800);
}

/* --------------------------------------------------------------------------
   4. TOAST NOTIFICATION ENGINE
   -------------------------------------------------------------------------- */
function initToasts() {
  if (!document.getElementById('toastContainer')) {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer') || document.body;
  const toast = document.createElement('div');
  toast.className = `nexus-toast ${type}`;

  let iconClass = 'bi-info-circle-fill';
  if (type === 'success') iconClass = 'bi-check-circle-fill';
  if (type === 'error') iconClass = 'bi-exclamation-triangle-fill';

  toast.innerHTML = `
    <i class="bi ${iconClass}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* --------------------------------------------------------------------------
   5. VOICE ROOM MODAL & FRONTEND SIMULATION
   -------------------------------------------------------------------------- */
function initVoiceRooms() {
  const voiceModal = document.getElementById('voiceRoomModal');
  const joinBtns = document.querySelectorAll('.js-join-room-btn');
  const closeModalBtn = document.getElementById('closeVoiceModal');
  const leaveRoomBtn = document.getElementById('leaveVoiceRoomBtn');
  const muteBtn = document.getElementById('toggleMuteBtn');

  if (joinBtns.length > 0 && voiceModal) {
    joinBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const roomTitle = btn.getAttribute('data-room-name') || 'Late Night Squad Lounge';
        const modalTitle = voiceModal.querySelector('.nexus-modal-title');
        if (modalTitle) modalTitle.textContent = `Live Voice Room: ${roomTitle}`;
        
        voiceModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        showToast(`Joined ${roomTitle}`, 'success');
      });
    });
  }

  if (closeModalBtn && voiceModal) {
    closeModalBtn.addEventListener('click', closeVoiceModal);
  }

  if (leaveRoomBtn && voiceModal) {
    leaveRoomBtn.addEventListener('click', () => {
      closeVoiceModal();
      showToast('Left the voice lounge.', 'info');
    });
  }

  if (muteBtn) {
    let isMuted = false;
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      const icon = muteBtn.querySelector('i');
      if (isMuted) {
        muteBtn.classList.add('active-muted');
        if (icon) icon.className = 'bi bi-mic-mute-fill';
        showToast('Microphone Muted', 'info');
      } else {
        muteBtn.classList.remove('active-muted');
        if (icon) icon.className = 'bi bi-mic-fill';
        showToast('Microphone Unmuted', 'success');
      }
    });
  }

  function closeVoiceModal() {
    if (voiceModal) voiceModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* --------------------------------------------------------------------------
   6. COMMUNITY & CREATOR FILTERS (JS SEARCH & FILTERING)
   -------------------------------------------------------------------------- */
function initCommunityFilters() {
  const searchInput = document.getElementById('nexusSearchInput');
  const filterPills = document.querySelectorAll('.filter-pill');
  const filterCards = document.querySelectorAll('.js-filter-card');

  if (!filterCards.length) return;

  function filterItems() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activePill = document.querySelector('.filter-pill.active');
    const category = activePill ? activePill.getAttribute('data-category') : 'all';

    filterCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || 'all';
      const cardText = card.textContent.toLowerCase();

      const matchesCategory = (category === 'all' || cardCategory === category);
      const matchesSearch = (!query || cardText.includes(query));

      if (matchesCategory && matchesSearch) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterItems);
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterItems();
    });
  });
}

/* --------------------------------------------------------------------------
   7. CREATOR FOLLOW SYSTEM
   -------------------------------------------------------------------------- */
function initCreatorFollow() {
  const followBtns = document.querySelectorAll('.js-follow-btn');
  let followedCreators = JSON.parse(localStorage.getItem('nexusFollowedCreators') || '[]');

  followBtns.forEach(btn => {
    const creatorId = btn.getAttribute('data-creator-id');
    
    // Set initial state
    if (followedCreators.includes(creatorId)) {
      btn.classList.replace('btn-nexus-outline', 'btn-nexus-primary');
      btn.innerHTML = '<i class="bi bi-check-lg"></i> Following';
    }

    btn.addEventListener('click', () => {
      if (followedCreators.includes(creatorId)) {
        followedCreators = followedCreators.filter(id => id !== creatorId);
        btn.classList.replace('btn-nexus-primary', 'btn-nexus-outline');
        btn.innerHTML = '<i class="bi bi-person-plus-fill"></i> Follow';
        showToast('Unfollowed creator', 'info');
      } else {
        followedCreators.push(creatorId);
        btn.classList.replace('btn-nexus-outline', 'btn-nexus-primary');
        btn.innerHTML = '<i class="bi bi-check-lg"></i> Following';
        showToast('Creator followed!', 'success');
      }
      localStorage.setItem('nexusFollowedCreators', JSON.stringify(followedCreators));
    });
  });
}

/* --------------------------------------------------------------------------
   8. GALLERY LIGHTBOX MODAL & KEYBOARD NAV
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const lightboxModal = document.getElementById('galleryLightboxModal');
  const galleryItems = document.querySelectorAll('.js-lightbox-trigger');
  const closeBtn = document.getElementById('closeLightboxBtn');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');

  if (!galleryItems.length || !lightboxModal) return;

  let currentIndex = 0;
  const itemsArray = Array.from(galleryItems);

  function openLightbox(index) {
    currentIndex = index;
    const item = itemsArray[currentIndex];
    const imgSrc = item.getAttribute('data-src') || item.querySelector('img').src;
    const title = item.getAttribute('data-title') || 'Gallery Photo';
    const creator = item.getAttribute('data-creator') || 'Nexus Creator';

    const modalImg = lightboxModal.querySelector('.js-lightbox-img');
    const modalTitle = lightboxModal.querySelector('.js-lightbox-title');
    const modalCreator = lightboxModal.querySelector('.js-lightbox-creator');

    if (modalImg) modalImg.src = imgSrc;
    if (modalTitle) modalTitle.textContent = title;
    if (modalCreator) modalCreator.textContent = `Captured by ${creator}`;

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + itemsArray.length) % itemsArray.length;
      openLightbox(currentIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % itemsArray.length;
      openLightbox(currentIndex);
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
  });
}

/* --------------------------------------------------------------------------
   9. EVENTS REGISTRATION LOGIC
   -------------------------------------------------------------------------- */
function initEvents() {
  const registerBtns = document.querySelectorAll('.js-event-register-btn');
  let registeredEvents = JSON.parse(localStorage.getItem('nexusRegisteredEvents') || '[]');

  registerBtns.forEach(btn => {
    const eventId = btn.getAttribute('data-event-id');

    if (registeredEvents.includes(eventId)) {
      btn.classList.replace('btn-nexus-primary', 'btn-nexus-secondary');
      btn.innerHTML = '<i class="bi bi-check2-circle"></i> Registered';
    }

    btn.addEventListener('click', () => {
      if (registeredEvents.includes(eventId)) {
        registeredEvents = registeredEvents.filter(id => id !== eventId);
        btn.classList.replace('btn-nexus-secondary', 'btn-nexus-primary');
        btn.innerHTML = '<i class="bi bi-ticket-perforated"></i> Register Now';
        showToast('Cancelled event registration', 'info');
      } else {
        registeredEvents.push(eventId);
        btn.classList.replace('btn-nexus-primary', 'btn-nexus-secondary');
        btn.innerHTML = '<i class="bi bi-check2-circle"></i> Registered';
        showToast('Successfully registered for tournament!', 'success');
      }
      localStorage.setItem('nexusRegisteredEvents', JSON.stringify(registeredEvents));
    });
  });
}

/* --------------------------------------------------------------------------
   10. DASHBOARD HYDRATION
   -------------------------------------------------------------------------- */
function initDashboard() {
  const dashUserName = document.getElementById('dashUserName');
  const user = getCurrentUser();

  if (dashUserName && user) {
    dashUserName.textContent = `Welcome back, ${user.name.split(' ')[0]}!`;
  }
}

/* --------------------------------------------------------------------------
   11. PROFILE EDIT MODAL
   -------------------------------------------------------------------------- */
function initProfile() {
  const editBtn = document.getElementById('editProfileBtn');
  const profileModal = document.getElementById('editProfileModal');
  const closeBtn = document.getElementById('closeProfileModal');
  const profileForm = document.getElementById('editProfileForm');

  if (editBtn && profileModal) {
    editBtn.addEventListener('click', () => {
      profileModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn && profileModal) {
    closeBtn.addEventListener('click', () => {
      profileModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newName = document.getElementById('editName').value.trim();
      const newBio = document.getElementById('editBio').value.trim();

      const user = getCurrentUser() || {};
      if (newName) user.name = newName;
      if (newBio) user.bio = newBio;

      localStorage.setItem('nexusUser', JSON.stringify(user));
      showToast('Profile updated successfully!', 'success');

      if (profileModal) profileModal.classList.remove('active');
      document.body.style.overflow = '';

      setTimeout(() => window.location.reload(), 800);
    });
  }
}

/* --------------------------------------------------------------------------
   12. ADMIN PANEL INTERACTION
   -------------------------------------------------------------------------- */
function initAdmin() {
  const adminNavItems = document.querySelectorAll('.admin-nav-item');
  const adminSections = document.querySelectorAll('.admin-tab-section');

  if (!adminNavItems.length) return;

  adminNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabTarget = item.getAttribute('data-tab');

      adminNavItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      adminSections.forEach(sec => {
        if (sec.id === `adminTab-${tabTarget}`) {
          sec.style.display = 'block';
        } else {
          sec.style.display = 'none';
        }
      });
    });
  });

  // Admin Action Buttons Simulation
  document.addEventListener('click', (e) => {
    if (e.target.closest('.js-admin-suspend')) {
      const row = e.target.closest('tr');
      showToast('User suspended by Moderator.', 'error');
      if (row) row.style.opacity = '0.5';
    }
    if (e.target.closest('.js-admin-delete')) {
      const row = e.target.closest('tr');
      if (confirm('Are you sure you want to delete this record?')) {
        showToast('Record deleted.', 'info');
        if (row) row.remove();
      }
    }
  });
}

/* --------------------------------------------------------------------------
   13. CONTACT FORM
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Your message has been sent to NEXUS support.', 'success');
      contactForm.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   14. ANIMATED COUNTERS & SCROLL REVEAL
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.strip-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const duration = 1500;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target.toLocaleString();
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current).toLocaleString();
          }
        }, stepTime);

        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}


/* --------------------------------------------------------------------------
   HERO EXTRA PREMIUM JS (3D TILT + DYNAMIC WORD CYCLER)
   -------------------------------------------------------------------------- */
function initHeroEffects() {
  // 1. Ultra-Smooth Typewriter Character Animation with Glowing Cursor
  const wordElem = document.getElementById('heroDynamicWord');
  if (wordElem) {
    const words = ['Your Lounge.', 'Your Squad.', 'Your Studio.', 'Your Arena.', 'Your World.'];
    let wordIndex = 0;
    let charIndex = words[0].length;
    let isDeleting = false;
    let isWaiting = false;

    // Create glowing animated cursor
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor-glow';
    cursor.innerHTML = '|';
    wordElem.after(cursor);

    function typeLoop() {
      const currentWord = words[wordIndex];

      if (isWaiting) {
        setTimeout(typeLoop, 2200);
        isWaiting = false;
        isDeleting = true;
        return;
      }

      if (isDeleting) {
        wordElem.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(typeLoop, 350);
          return;
        }
        setTimeout(typeLoop, 45);
      } else {
        wordElem.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentWord.length) {
          isWaiting = true;
          setTimeout(typeLoop, 150);
          return;
        }
        setTimeout(typeLoop, 85);
      }
    }

    setTimeout(typeLoop, 1200);
  }

  // 2. Interactive 3D Card Parallax Tilt
  const tiltCard = document.getElementById('heroTiltCard');
  if (tiltCard) {
    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }
}
function initMassHeroEngine() {
  // 1. Particle Node Matrix Canvas
  const canvas = document.getElementById('heroParticleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.offsetWidth;
    let height = canvas.height = canvas.parentElement.offsetHeight;

    window.addEventListener('resize', () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
      }
    });

    const particles = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(91, 140, 255, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#5B8CFF';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(155, 108, 255, ${0.15 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // 2. Automatic Hero Image Slideshow & Interactive Tab Switcher
  const gameTabs = document.querySelectorAll('.game-tab-btn');
  const mainImg = document.getElementById('heroMainImage');
  const roomTitle = document.getElementById('heroRoomTitle');
  const statMembers = document.getElementById('heroStatMembers');

  if (gameTabs.length && mainImg) {
    let currentTabIndex = 0;
    let autoSlideTimer = null;

    function switchHeroSlide(index, isUserClick = false) {
      currentTabIndex = index;
      const tab = gameTabs[currentTabIndex];

      gameTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const newImg = tab.getAttribute('data-img');
      const newName = tab.getAttribute('data-name');
      const newVal = tab.getAttribute('data-val');

      mainImg.style.opacity = '0.2';
      mainImg.style.transform = 'scale(1.04)';
      setTimeout(() => {
        mainImg.src = newImg;
        mainImg.style.opacity = '1';
        mainImg.style.transform = 'scale(1)';
        if (roomTitle) roomTitle.textContent = newName;
        if (statMembers) statMembers.textContent = newVal;
      }, 120);

      if (isUserClick && window.showToast) {
        showToast(`Switched to ${tab.textContent.trim()} Hub`, 'info');
      }
    }

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideTimer = setInterval(() => {
        const nextIndex = (currentTabIndex + 1) % gameTabs.length;
        switchHeroSlide(nextIndex, false);
      }, 2200); // Rotates image fast every 2.2 seconds
    }

    function stopAutoSlide() {
      if (autoSlideTimer) clearInterval(autoSlideTimer);
    }

    gameTabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        switchHeroSlide(idx, true);
        startAutoSlide(); // Reset auto timer on manual click
      });
    });

    // Start auto slide timer loop
    startAutoSlide();
  }

  // 3. Live Voice Audio Preview Click Simulation
  const voiceBtn = document.getElementById('voiceEqPreviewBtn');
  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      if (window.showToast) {
        showToast('🔊 Listening Live: Apex Squad #4 (14ms Opus HD Stream Active)', 'success');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   DASHBOARD SIDEBAR TAB SWITCHER
   -------------------------------------------------------------------------- */
function initDashboardTabs() {
  const navItems = document.querySelectorAll('.dashboard-sidebar .dashboard-nav-item');
  const tabContents = document.querySelectorAll('.dashboard-tab-content');

  if (navItems.length && tabContents.length) {
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetTab = item.getAttribute('data-tab');
        if (!targetTab) return;

        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        tabContents.forEach(content => {
          if (content.id === `dashTab-${targetTab}`) {
            content.classList.add('active');
          } else {
            content.classList.remove('active');
          }
        });
      });
    });
  }
}

/* --------------------------------------------------------------------------
   BACK TO TOP BUTTON LOGIC
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backBtn = document.getElementById('backToTopBtn');
  if (!backBtn) return;

  const scrollContainer = document.querySelector('.dashboard-content-area, .admin-content-area') || window;

  scrollContainer.addEventListener('scroll', () => {
    const scrollPos = scrollContainer.scrollTop || window.scrollY;
    if (scrollPos > 300) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  backBtn.addEventListener('click', () => {
    if (scrollContainer.scrollTo) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
