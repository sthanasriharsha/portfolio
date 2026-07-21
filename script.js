/* ================================================================
   SCRIPT.JS — Portfolio of Gundumalla Sthana Sriharsha
   ================================================================

   TABLE OF CONTENTS
   -----------------
   1.  AOS (Animate on Scroll) — init
   2.  Typed Text Animation — hero roles
   3.  Active Nav Link on Scroll
   4.  Cursor Glow — follows mouse
   5.  Project Card Spotlight — mouse spotlight inside cards
   6.  Hamburger Mobile Menu
   7.  Nav Scroll Shadow
   8.  Back to Top smooth scroll
   ================================================================ */


/* ----------------------------------------------------------------
   Wait for the page to fully load before running any JS.
   This prevents errors where JS tries to access HTML elements
   that haven't been created yet.
   ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {


  /* ==============================================================
     1. AOS — ANIMATE ON SCROLL
     ==============================================================
     AOS is a small library loaded from CDN in index.html.
     Elements with data-aos="fade-up" (or similar) will animate
     when they scroll into the viewport.

     OPTIONS:
     - duration: how long the animation takes (ms)
     - easing:   the speed curve of the animation
     - once:     true = animate only the first time (recommended)
     - offset:   how many pixels before the element is considered
                 "in view" to trigger the animation
     ============================================================== */
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });


  /* ==============================================================
     2. TYPED TEXT ANIMATION
     ==============================================================
     This creates the "typing" effect in the hero section.
     It cycles through the `roles` array, typing each word
     letter by letter, pausing, then deleting it.

     TO CHANGE YOUR ROLES: edit the array below.
     ============================================================== */
  const roles = [
    'AI & ML Engineer',
    'GenAI / LLM Developer',
    'Deep Learning Developer',
    'Data Science Graduate',
    'Python Developer',
  ];

  let roleIndex = 0;   // which role we're currently typing
  let charIndex = 0;   // how many characters have been typed
  let isDeleting = false;  // are we currently deleting?

  const typedEl = document.getElementById('typed-text');

  function typeLoop() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      // TYPE: add one character
      typedEl.textContent = currentRole.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        // Finished typing — pause before deleting
        setTimeout(() => {
          isDeleting = true;
          typeLoop();
        }, 1800);  // pause duration (ms) — change this to type longer/shorter
        return;
      }
    } else {
      // DELETE: remove one character
      typedEl.textContent = currentRole.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Finished deleting — move to next role
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    // Speed: typing is slower than deleting
    const speed = isDeleting ? 50 : 90;
    setTimeout(typeLoop, speed);
  }

  typeLoop(); // start the animation


  /* ==============================================================
     3. ACTIVE NAV LINK ON SCROLL
     ==============================================================
     Uses IntersectionObserver — a browser API that tells you
     when an element enters or exits the viewport.

     When a section enters view, we:
     1. Find the nav link whose href matches that section's id
     2. Add the "active" class to it (this makes it green in CSS)
     3. Remove "active" from all other links
     ============================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Remove active from all links
          navAnchors.forEach((link) => link.classList.remove('active'));

          // Add active to the matching link
          const activeLink = document.querySelector(
            `.nav-links a[href="#${entry.target.id}"]`
          );
          if (activeLink) activeLink.classList.add('active');
        }
      });
    },
    {
      threshold: 0.4, // section needs to be 40% visible to count as active
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));


  /* ==============================================================
     4. CURSOR GLOW
     ==============================================================
     Moves a big soft circle to wherever the mouse is.
     The circle itself is a <div id="cursorGlow"> in index.html,
     styled in style.css as a radial gradient blob.

     We use CSS transform: translate(-50%, -50%) so the CENTER
     of the circle is at the mouse, not the top-left corner.
     ============================================================== */
  const cursorGlow = document.getElementById('cursorGlow');

  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  });

  // Hide glow when mouse leaves the window
  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorGlow.style.opacity = '1';
  });


  /* ==============================================================
     5. PROJECT CARD SPOTLIGHT
     ==============================================================
     When you hover a project card, a spotlight follows your mouse
     INSIDE the card (not the whole page like the cursor glow).

     How it works:
     - We track the mouse position RELATIVE to the card
     - We convert that to a percentage (0%–100%)
     - We set CSS custom properties --mx and --my on the card
     - In style.css, .project-card::after uses these variables
       in a radial-gradient to create the spotlight
     ============================================================== */
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });


  /* ==============================================================
     6. HAMBURGER MOBILE MENU
     ==============================================================
     On mobile, the nav links are hidden. Clicking the hamburger
     button toggles the "open" class, which shows the menu.

     We also:
     - Toggle the hamburger animation (X shape)
     - Close the menu when any nav link is clicked
     ============================================================== */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');

    // Prevent body scrolling when menu is open
    document.body.style.overflow =
      navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /* ==============================================================
     7. NAV SCROLL SHADOW
     ==============================================================
     Adds a subtle shadow under the nav bar once the user
     has scrolled down a bit. Makes the nav feel "elevated"
     and helps it stand out from the content below.
     ============================================================== */
  const mainNav = document.getElementById('mainNav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      mainNav.style.boxShadow = '0 4px 40px rgba(0, 0, 0, 0.5)';
    } else {
      mainNav.style.boxShadow = '';
    }
  });


  /* ==============================================================
     8. SKILL TAG HOVER RIPPLE
     ==============================================================
     Small touch: when you hover a skill tag, it briefly
     highlights with a staggered delay so nearby tags
     appear to "react" to the hovered one.
     ============================================================== */
  const skillTags = document.querySelectorAll('.skill-tag');

  skillTags.forEach((tag, index) => {
    tag.style.transitionDelay = (index % 6) * 20 + 'ms';
  });


}); // end DOMContentLoaded
