/**
 * SAANJ BAGH — LUXURY INTERACTIVE MENU BOOK
 * Photorealistic Physical Page-Turn Engine & Travelling Fold Simulation
 * 
 * Menus & Page Sequences:
 * 
 * 1. FOOD MENU (8 Pages):
 *    Page 0: Cover (Closed Book)
 *    Page 1: 01 · Soup (A Warm Beginning with Continuous Live Steam)
 *    Page 2: 02 · Garde Manger (Fresh Starts & Relishes)
 *    Page 3: 03 · Around the World
 *    Page 4: 04 · Pasta & Pizza
 *    Page 5: 05 · Tandoor — Kebabs & Rice/Biryani
 *    Page 6: 06 · Tandoor — Breads & Accompaniments
 *    Page 7: 07 · Indian, Dal & Sizzler
 * 
 * 2. BAR MENU (3 Pages):
 *    Page 0: Single Malt & Scotch Whisky
 *    Page 1: Tequila, Gin, Vodka & Liqueur
 *    Page 2: Beer, Wine, Rum & Breezer
 * 
 * 3. COCKTAIL MENU (4 Pages):
 *    Page 0: Signature Cocktails
 *    Page 1: Tequila & Whisky Cocktails
 *    Page 2: Gin Cocktails
 *    Page 3: Classic Cocktails
 * 
 * Features:
 * - Dynamic curved Bezier fold contour (heavy-stock uncoated luxury paper sheet)
 * - Cylindrical travelling wave swelling mid-turn and relaxing at landing
 * - Dual-layer lighting: contact ambient occlusion + diffused penumbra shadow
 * - Continuous live steam on Soup page is never interrupted, paused, or restarted
 * - Minimal antique-gold arrow navigation controls
 * - Gesture-aware pointer and touch dragging with momentum release
 * - Floating "✦ EXPAND MENU" button & high-legibility reading mode for Bar and Cocktail menus
 * - Zero image zooming in expanded view: fit to width, natural vertical scrolling
 * - Full reduced-motion and keyboard accessibility
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const menuBook = document.getElementById('menuBook');
  const curlCanvas = document.getElementById('curlCanvas');

  // Food Menu Layers & Artworks
  const coverLayer = document.getElementById('coverLayer');
  const soupLayer = document.getElementById('soupLayer');
  const gardeLayer = document.getElementById('gardeLayer');
  const aroundWorldLayer = document.getElementById('aroundWorldLayer');
  const pastaLayer = document.getElementById('pastaLayer');
  const tandoorKebabsLayer = document.getElementById('tandoorKebabsLayer');
  const tandoorBreadsLayer = document.getElementById('tandoorBreadsLayer');
  const indianLayer = document.getElementById('indianLayer');

  const coverArtwork = document.getElementById('coverArtwork');
  const soupArtwork = document.getElementById('soupArtwork');
  const gardeArtwork = document.getElementById('gardeArtwork');
  const aroundWorldArtwork = document.getElementById('aroundWorldArtwork');
  const pastaArtwork = document.getElementById('pastaArtwork');
  const tandoorKebabsArtwork = document.getElementById('tandoorKebabsArtwork');
  const tandoorBreadsArtwork = document.getElementById('tandoorBreadsArtwork');
  const indianArtwork = document.getElementById('indianArtwork');

  // Bar Menu Layers & Artworks
  const barWhiskey1Layer = document.getElementById('barWhiskey1Layer');
  const barWhiskey2Layer = document.getElementById('barWhiskey2Layer');
  const barWhiskey3Layer = document.getElementById('barWhiskey3Layer');
  const barTequilaGinLayer = document.getElementById('barTequilaGinLayer');
  const barVodkaRumLayer = document.getElementById('barVodkaRumLayer');
  const barBeerBreezerLayer = document.getElementById('barBeerBreezerLayer');
  const barWineLayer = document.getElementById('barWineLayer');

  const barWhiskey1Artwork = document.getElementById('barWhiskey1Artwork');
  const barWhiskey2Artwork = document.getElementById('barWhiskey2Artwork');
  const barWhiskey3Artwork = document.getElementById('barWhiskey3Artwork');
  const barTequilaGinArtwork = document.getElementById('barTequilaGinArtwork');
  const barVodkaRumArtwork = document.getElementById('barVodkaRumArtwork');
  const barBeerBreezerArtwork = document.getElementById('barBeerBreezerArtwork');
  const barWineArtwork = document.getElementById('barWineArtwork');

  // Cocktail Menu Layers & Artworks
  const cocktailSigLayer = document.getElementById('cocktailSigLayer');
  const cocktailTequilaWhiskyLayer = document.getElementById('cocktailTequilaWhiskyLayer');
  const cocktailGinLayer = document.getElementById('cocktailGinLayer');
  const cocktailClassicsLayer = document.getElementById('cocktailClassicsLayer');

  const cocktailSigArtwork = document.getElementById('cocktailSigArtwork');
  const cocktailTequilaWhiskyArtwork = document.getElementById('cocktailTequilaWhiskyArtwork');
  const cocktailGinArtwork = document.getElementById('cocktailGinArtwork');
  const cocktailClassicsArtwork = document.getElementById('cocktailClassicsArtwork');

  // 3-Way Menu Switcher Controls
  const btnFoodMenu = document.getElementById('btnFoodMenu');
  const btnBarMenu = document.getElementById('btnBarMenu');
  const btnCocktailMenu = document.getElementById('btnCocktailMenu');

  // Book Arrow Navigation Controls
  const btnNavPrev = document.getElementById('btnNavPrev');
  const btnNavNext = document.getElementById('btnNavNext');

  // Floating Expand Menu Button
  const btnExpandMenu = document.getElementById('btnExpandMenu');

  // Dedicated Expanded Reading Viewer
  const menuExpandedViewer = document.getElementById('menuExpandedViewer');
  const expandedPageTitle = document.getElementById('expandedPageTitle');
  const btnCloseExpanded = document.getElementById('btnCloseExpanded');
  const expandedViewport = document.getElementById('expandedViewport');
  const expandedMenuImg = document.getElementById('expandedMenuImg');
  const btnExpPrev = document.getElementById('btnExpPrev');
  const btnExpNext = document.getElementById('btnExpNext');
  const expandedPageIndicator = document.getElementById('expandedPageIndicator');
  const expDotsWrap = document.getElementById('expDotsWrap');
  const expPageNumber = document.getElementById('expPageNumber');

  // --- Expanded Viewer Data Manifests ---
  const BAR_MENU_PAGES = [
    { title: 'WHISKEY — SINGLE MALT', src: 'assets/images/bar-whiskey-1.jpg', alt: 'Saanj Bagh — Single Malt Whiskey Menu' },
    { title: 'SCOTCH WHISKY', src: 'assets/images/bar-whiskey-2.jpg', alt: 'Saanj Bagh — Scotch Whisky Menu (Part 1)' },
    { title: 'SCOTCH & BLENDED WHISKY', src: 'assets/images/bar-whiskey-3.png', alt: 'Saanj Bagh — Scotch & Blended Whisky Menu (Part 2)' },
    { title: 'TEQUILA & GIN', src: 'assets/images/bar-tequila-gin.jpg', alt: 'Saanj Bagh — Tequila & Gin Menu' },
    { title: 'VODKA, BRANDY, LIQUEUR & RUM', src: 'assets/images/bar-vodka-rum.jpg', alt: 'Saanj Bagh — Vodka, Brandy, Liqueur & Rum Menu' },
    { title: 'WINE SELECTION', src: 'assets/images/bar-wine.jpg', alt: 'Saanj Bagh — Wine Selection Menu' },
    { title: 'BEER & BREEZER', src: 'assets/images/bar-beer-breezer.jpg', alt: 'Saanj Bagh — Beer & Breezer Menu' }
  ];

  const COCKTAIL_MENU_PAGES = [
    { title: 'SIGNATURE COCKTAILS', src: 'assets/images/cocktail-1-signature.jpg', alt: 'Saanj Bagh — Signature Cocktails Menu' },
    { title: 'TEQUILA & WHISKY COCKTAILS', src: 'assets/images/cocktail-2-tequila-whisky.jpg', alt: 'Saanj Bagh — Tequila & Whisky Cocktails Menu' },
    { title: 'GIN COCKTAILS', src: 'assets/images/cocktail-3-gin.jpg', alt: 'Saanj Bagh — Gin Cocktails Menu' },
    { title: 'CLASSIC COCKTAILS', src: 'assets/images/cocktail-4-classics.jpg', alt: 'Saanj Bagh — Classic Cocktails Menu' }
  ];

  // --- High-DPI Canvas 2D Setup (Uniform 682 x 1024 Aspect Ratio) ---
  const ctx = curlCanvas.getContext('2d');
  const VIRTUAL_W = 682;
  const VIRTUAL_H = 1024;
  let currentVirtualW = VIRTUAL_W;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas() {
    currentVirtualW = VIRTUAL_W;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetPixelW = Math.round(VIRTUAL_W * dpr);
    const targetPixelH = Math.round(VIRTUAL_H * dpr);
    if (curlCanvas.width !== targetPixelW || curlCanvas.height !== targetPixelH) {
      curlCanvas.width = targetPixelW;
      curlCanvas.height = targetPixelH;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // --- 3-Way Menu Book State ---
  let currentMenu = 'food';     // 'food' | 'bar' | 'cocktail'
  let foodPage = 0;             // [0..7]
  let barPage = 0;              // [0..6]
  let cocktailPage = 0;         // [0..3]
  let currentPage = 0;          // Active page within the active menu
  let currentState = 'cover';   // Current data-state attribute
  let activeTurningPage = 0;    // Active turning page index
  let currentProgress = 0.0;    // [0, 1] relative to the active turning page
  let currentLiftBias = 0.45;   // Positive = bottom corner leads, Negative = top leads
  let isAnimating = false;
  let animationId = null;

  // Expanded viewer active page
  let expandedPageIndex = 0;

  function getMaxPage() {
    if (currentMenu === 'food') return 7;
    if (currentMenu === 'bar') return 6;
    if (currentMenu === 'cocktail') return 3;
    return 7;
  }

  function getAnimatingStateName(turningPg) {
    if (currentMenu === 'food') {
      return `animating-${turningPg}-${turningPg + 1}`;
    } else if (currentMenu === 'bar') {
      return `animating-bar-${turningPg}-${turningPg + 1}`;
    } else {
      return `animating-cocktail-${turningPg}-${turningPg + 1}`;
    }
  }

  // --- Drag Tracking State ---
  let isPointerDown = false;
  let hasMovedPastDeadband = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartTime = 0;
  let lastPointerX = 0;
  let lastPointerTime = 0;
  let dragVelocity = 0;         // px/ms
  let dragDirectionLocked = null; // 'forward' | 'backward'

  // ==========================================================================
  // 1. PHYSICAL PAPER FOLD & TRAVELLING WAVE GEOMETRY
  // ==========================================================================
  function getFoldGeometry(p, liftBias) {
    const W = currentVirtualW;
    const H = VIRTUAL_H;
    const clampedP = Math.max(0.0, Math.min(1.0, p));
    const bias = Math.max(-1.0, Math.min(1.0, liftBias));

    const bottomLeadFactor = bias >= 0 ? (0.65 + 0.35 * bias) : 0.20;
    const topLeadFactor = bias < 0 ? (0.65 - 0.35 * bias) : 0.20;

    const pb = Math.min(1.0, Math.max(0.0, clampedP * (1.0 + 0.16 * bottomLeadFactor)));
    const pt = Math.min(1.0, Math.max(0.0, (clampedP - (bias >= 0 ? 0.04 : 0.0)) * (1.0 + 0.16 * topLeadFactor)));

    const xt = W * (1.02 - pt * 1.04);
    const xb = W * (1.02 - pb * 1.04);

    const dx = xb - xt;
    const dy = H;
    const len = Math.hypot(dx, dy) || 1;
    const nx = dy / len;
    const ny = -dx / len;

    const midX = (xt + xb) / 2;
    const midY = H / 2;

    const waveHeight = Math.sin(Math.PI * clampedP);
    const waveWidth = 36 * Math.pow(waveHeight, 0.88);
    const radius = Math.max(14, waveWidth * 1.15);

    const bulge = 18 * Math.sin(Math.PI * clampedP);
    const cp1x = xt + (xb - xt) * 0.33 + nx * bulge;
    const cp1y = H * 0.33 + ny * bulge;
    const cp2x = xt + (xb - xt) * 0.67 + nx * bulge;
    const cp2y = H * 0.67 + ny * bulge;

    return {
      W, H,
      xt, xb,
      midX, midY,
      nx, ny,
      radius,
      waveWidth,
      cp1x, cp1y,
      cp2x, cp2y
    };
  }

  // ==========================================================================
  // 2. PHOTOREALISTIC CANVAS RENDERER (Dual-Layer Lighting & Specular Wave)
  // ==========================================================================
  function renderCurl(p, liftBias, turningPage = activeTurningPage) {
    ctx.clearRect(0, 0, currentVirtualW, VIRTUAL_H);
    if (p <= 0.001 || p >= 0.999) return;

    const geom = getFoldGeometry(p, liftBias);
    const { W, H, xt, xb, midX, midY, nx, ny, radius, waveWidth, cp1x, cp1y, cp2x, cp2y } = geom;

    ctx.save();

    // LAYER A: CONTACT AMBIENT OCCLUSION SHADOW
    ctx.save();
    const contactDist = Math.max(18, radius * 0.75);
    const contactGrad = ctx.createLinearGradient(
      midX, midY,
      midX + nx * contactDist, midY + ny * contactDist
    );
    const contactAlpha = 0.52 * Math.sin(Math.PI * p);
    contactGrad.addColorStop(0.00, `rgba(10, 18, 12, ${contactAlpha})`);
    contactGrad.addColorStop(0.35, `rgba(10, 18, 12, ${contactAlpha * 0.55})`);
    contactGrad.addColorStop(1.00, 'rgba(10, 18, 12, 0.0)');

    ctx.fillStyle = contactGrad;
    ctx.beginPath();
    ctx.moveTo(xt, 0);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, xb, H);
    ctx.lineTo(xb + nx * contactDist, H);
    ctx.bezierCurveTo(
      cp2x + nx * contactDist, cp2y,
      cp1x + nx * contactDist, cp1y,
      xt + nx * contactDist, 0
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // LAYER B: DIFFUSED PENUMBRA DROP SHADOW CAST ON UNDERLYING MENU
    ctx.save();
    const penumbraDist = Math.max(35, radius * 2.8 * Math.sin(Math.PI * p));
    const penumbraGrad = ctx.createLinearGradient(
      midX, midY,
      midX + nx * penumbraDist, midY + ny * penumbraDist
    );
    const penumbraAlpha = 0.38 * Math.sin(Math.PI * p);
    penumbraGrad.addColorStop(0.00, `rgba(8, 16, 11, ${penumbraAlpha})`);
    penumbraGrad.addColorStop(0.25, `rgba(8, 16, 11, ${penumbraAlpha * 0.70})`);
    penumbraGrad.addColorStop(0.65, `rgba(8, 16, 11, ${penumbraAlpha * 0.25})`);
    penumbraGrad.addColorStop(1.00, 'rgba(8, 16, 11, 0.0)');

    ctx.fillStyle = penumbraGrad;
    ctx.beginPath();
    ctx.moveTo(xt, 0);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, xb, H);
    ctx.lineTo(xb + nx * penumbraDist, H);
    ctx.bezierCurveTo(
      cp2x + nx * penumbraDist, cp2y,
      cp1x + nx * penumbraDist, cp1y,
      xt + nx * penumbraDist, 0
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // LAYER C: CLIPPED PAGE ARTWORK FOR THE TURNING SHEET
    let turningArt;
    if (currentMenu === 'food') {
      if (turningPage === 6) turningArt = tandoorBreadsArtwork;
      else if (turningPage === 5) turningArt = tandoorKebabsArtwork;
      else if (turningPage === 4) turningArt = pastaArtwork;
      else if (turningPage === 3) turningArt = aroundWorldArtwork;
      else if (turningPage === 2) turningArt = gardeArtwork;
      else if (turningPage === 1) turningArt = soupArtwork;
      else turningArt = coverArtwork;
    } else if (currentMenu === 'bar') {
      if (turningPage === 5) turningArt = barWineArtwork;
      else if (turningPage === 4) turningArt = barVodkaRumArtwork;
      else if (turningPage === 3) turningArt = barTequilaGinArtwork;
      else if (turningPage === 2) turningArt = barWhiskey3Artwork;
      else if (turningPage === 1) turningArt = barWhiskey2Artwork;
      else turningArt = barWhiskey1Artwork;
    } else {
      if (turningPage === 2) turningArt = cocktailGinArtwork;
      else if (turningPage === 1) turningArt = cocktailTequilaWhiskyArtwork;
      else turningArt = cocktailSigArtwork;
    }

    if (turningArt && turningArt.complete) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(xt, 0);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, xb, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.clip();

      if (currentMenu === 'bar') {
        if (turningArt === barWhiskey1Artwork || turningArt === barWhiskey2Artwork || turningArt === barWhiskey3Artwork) {
          ctx.fillStyle = '#0E1F0E';
        } else {
          ctx.fillStyle = '#E8D5B7';
        }
        ctx.fillRect(0, 0, W, H);
        const nw = turningArt.naturalWidth || 571;
        const nh = turningArt.naturalHeight || 1024;
        const artW = Math.round(H * (nw / nh));
        const artX = Math.round((W - artW) / 2);
        ctx.drawImage(turningArt, artX, 0, artW, H);
      } else if (currentMenu === 'cocktail') {
        if (turningArt === cocktailSigArtwork || turningArt === cocktailGinArtwork) {
          ctx.fillStyle = '#F5DCDA';
        } else {
          ctx.fillStyle = '#EFE5D0';
        }
        ctx.fillRect(0, 0, W, H);
        const nw = turningArt.naturalWidth || 571;
        const nh = turningArt.naturalHeight || 1024;
        const artW = Math.round(H * (nw / nh));
        const artX = Math.round((W - artW) / 2);
        ctx.drawImage(turningArt, artX, 0, artW, H);
      } else {
        ctx.drawImage(turningArt, 0, 0, W, H);
      }

      // Crease Ambient Darkening
      const creaseDist = Math.max(22, radius * 0.65);
      const creaseShadow = ctx.createLinearGradient(
        midX - nx * creaseDist, midY - ny * creaseDist,
        midX, midY
      );
      creaseShadow.addColorStop(0.0, 'rgba(0, 0, 0, 0.0)');
      creaseShadow.addColorStop(0.70, 'rgba(16, 32, 24, 0.16)');
      creaseShadow.addColorStop(1.0, 'rgba(16, 32, 24, 0.42)');
      ctx.fillStyle = creaseShadow;
      ctx.fillRect(0, 0, W, H);

      // Spine Binding Shadow
      if (p > 0.45) {
        const spineShadowDist = 40;
        const spineShade = ctx.createLinearGradient(0, 0, spineShadowDist, 0);
        const spineAlpha = 0.38 * ((p - 0.45) / 0.55);
        spineShade.addColorStop(0.0, `rgba(10, 20, 15, ${spineAlpha})`);
        spineShade.addColorStop(1.0, 'rgba(10, 20, 15, 0.0)');
        ctx.fillStyle = spineShade;
        ctx.fillRect(0, 0, spineShadowDist, H);
      }

      ctx.restore();
    }

    // LAYER D: THE 3D CURLED PAPER WAVE
    if (waveWidth > 2.0) {
      ctx.save();
      const ox = nx * waveWidth;
      const oy = ny * waveWidth;

      ctx.beginPath();
      ctx.moveTo(xt, 0);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, xb, H);
      ctx.lineTo(xb + ox, H);
      ctx.bezierCurveTo(
        cp2x + ox, cp2y,
        cp1x + ox, cp1y,
        xt + ox, 0
      );
      ctx.closePath();
      ctx.clip();

      const waveGrad = ctx.createLinearGradient(
        midX, midY,
        midX + ox, midY + oy
      );
      waveGrad.addColorStop(0.00, '#EAE0CC');
      waveGrad.addColorStop(0.18, '#F6EFE2');
      waveGrad.addColorStop(0.38, '#FAF5EB');
      waveGrad.addColorStop(0.54, '#FFFDF8');
      waveGrad.addColorStop(0.72, '#EFE3CE');
      waveGrad.addColorStop(0.88, '#E1D1B6');
      waveGrad.addColorStop(1.00, '#D4C19E');

      ctx.fillStyle = waveGrad;
      ctx.fillRect(0, 0, W, H);

      const undersideGrad = ctx.createLinearGradient(
        midX + ox * 0.75, midY + oy * 0.75,
        midX + ox, midY + oy
      );
      undersideGrad.addColorStop(0.0, 'rgba(16, 32, 24, 0.0)');
      undersideGrad.addColorStop(1.0, 'rgba(16, 32, 24, 0.28)');
      ctx.fillStyle = undersideGrad;
      ctx.fillRect(0, 0, W, H);

      // Gilded Antique-Gold Hairline
      const goldAlpha = 0.75 * Math.sin(Math.PI * p);
      ctx.strokeStyle = `rgba(201, 164, 92, ${goldAlpha})`;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(xt + ox, 0);
      ctx.bezierCurveTo(cp1x + ox, cp1y, cp2x + ox, cp2y, xb + ox, H);
      ctx.stroke();

      // Card Thickness Bevel
      const bevelAlpha = 0.45 * Math.sin(Math.PI * p);
      ctx.strokeStyle = `rgba(255, 255, 255, ${bevelAlpha})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(xt + ox - 1, 0);
      ctx.bezierCurveTo(cp1x + ox - 1, cp1y, cp2x + ox - 1, cp2y, xb + ox - 1, H);
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();
  }

  // ==========================================================================
  // 3. PHYSICAL PAPER ANIMATION CONTROLLER
  // ==========================================================================
  function updateArrowNav() {
    if (!btnNavPrev || !btnNavNext) return;
    if (isAnimating) {
      btnNavPrev.disabled = true;
      btnNavNext.disabled = true;
      return;
    }
    const maxP = getMaxPage();
    btnNavPrev.disabled = (currentPage === 0);
    btnNavNext.disabled = (currentPage === maxP);
    btnNavPrev.setAttribute('aria-disabled', currentPage === 0 ? 'true' : 'false');
    btnNavNext.setAttribute('aria-disabled', currentPage === maxP ? 'true' : 'false');
  }

  function setFinalState(page) {
    currentPage = page;
    if (currentMenu === 'food') {
      foodPage = page;
      if (page === 0) currentState = 'cover';
      else if (page === 1) currentState = 'soup';
      else if (page === 2) currentState = 'garde-manger';
      else if (page === 3) currentState = 'around-the-world';
      else if (page === 4) currentState = 'pasta-pizza';
      else if (page === 5) currentState = 'tandoor-kebabs';
      else if (page === 6) currentState = 'tandoor-breads';
      else if (page === 7) currentState = 'indian-dal';
    } else if (currentMenu === 'bar') {
      barPage = page;
      if (page === 0) currentState = 'bar-0';
      else if (page === 1) currentState = 'bar-1';
      else if (page === 2) currentState = 'bar-2';
      else if (page === 3) currentState = 'bar-3';
      else if (page === 4) currentState = 'bar-4';
      else if (page === 5) currentState = 'bar-5';
      else if (page === 6) currentState = 'bar-6';
    } else {
      cocktailPage = page;
      if (page === 0) currentState = 'cocktail-0';
      else if (page === 1) currentState = 'cocktail-1';
      else if (page === 2) currentState = 'cocktail-2';
      else if (page === 3) currentState = 'cocktail-3';
    }

    menuBook.dataset.menu = currentMenu;
    menuBook.dataset.state = currentState;
    document.body.dataset.activeMenu = currentMenu;

    // Toggle Floating Expand Button Visibility
    if (btnExpandMenu) {
      const isExpandable = (currentMenu === 'bar' || currentMenu === 'cocktail');
      btnExpandMenu.classList.toggle('visible', isExpandable);
    }

    updateArrowNav();
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animateTransition(turningPage, startProg, targetProg, durationMs = 880, liftBias = 0.45, onComplete = null) {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    isAnimating = true;
    updateArrowNav();
    activeTurningPage = turningPage;

    menuBook.dataset.state = getAnimatingStateName(turningPage);
    resizeCanvas();

    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const t = Math.min(1.0, elapsed / durationMs);
      const easedT = easeInOutCubic(t);
      currentProgress = startProg + (targetProg - startProg) * easedT;

      renderCurl(currentProgress, liftBias, turningPage);

      if (t < 1.0) {
        animationId = requestAnimationFrame(step);
      } else {
        isAnimating = false;
        animationId = null;
        ctx.clearRect(0, 0, currentVirtualW, VIRTUAL_H);

        if (targetProg >= 0.99) {
          setFinalState(turningPage + 1);
        } else {
          setFinalState(turningPage);
        }

        if (typeof onComplete === 'function') {
          onComplete();
        }
      }
    }

    animationId = requestAnimationFrame(step);
  }

  function goToPage(targetPage, liftBias = 0.45) {
    if (isAnimating || targetPage === currentPage) return;
    const maxP = getMaxPage();
    if (targetPage < 0 || targetPage > maxP) return;

    if (Math.abs(targetPage - currentPage) === 1) {
      if (targetPage > currentPage) {
        animateTransition(currentPage, 0.0, 1.0, 880, liftBias);
      } else {
        animateTransition(targetPage, 1.0, 0.0, 880, liftBias);
      }
    } else {
      const step = targetPage > currentPage ? 1 : -1;
      const turnPage = step > 0 ? currentPage : targetPage;
      const startP = step > 0 ? 0.0 : 1.0;
      const targetP = step > 0 ? 1.0 : 0.0;
      animateTransition(turnPage, startP, targetP, 750, liftBias, () => {
        setFinalState(targetPage);
      });
    }
  }

  // ==========================================================================
  // 4. HAND-CONNECTED POINTER & TOUCH DRAGGING ENGINE
  // ==========================================================================
  menuBook.addEventListener('pointerdown', (e) => {
    if (isAnimating) return;
    if (e.target.closest('.book-arrow-nav')) return;

    isPointerDown = true;
    hasMovedPastDeadband = false;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragStartTime = performance.now();
    lastPointerX = e.clientX;
    lastPointerTime = dragStartTime;
    dragVelocity = 0;
    dragDirectionLocked = null;

    const rect = menuBook.getBoundingClientRect();
    const touchYNorm = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    currentLiftBias = (touchYNorm - 0.5) * 1.8;
  });

  menuBook.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;

    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;

    if (!hasMovedPastDeadband) {
      if (Math.hypot(dx, dy) < 7) return;
      hasMovedPastDeadband = true;
      menuBook.setPointerCapture(e.pointerId);

      const maxP = getMaxPage();
      if (dx < 0) {
        if (currentPage < maxP) {
          activeTurningPage = currentPage;
          dragDirectionLocked = 'forward';
          menuBook.dataset.state = getAnimatingStateName(activeTurningPage);
          resizeCanvas();
        }
      } else {
        if (currentPage > 0) {
          activeTurningPage = currentPage - 1;
          dragDirectionLocked = 'backward';
          menuBook.dataset.state = getAnimatingStateName(activeTurningPage);
          resizeCanvas();
        }
      }
    }

    if (!dragDirectionLocked) return;

    const now = performance.now();
    const dt = now - lastPointerTime;
    if (dt > 8) {
      dragVelocity = (e.clientX - lastPointerX) / dt;
      lastPointerX = e.clientX;
      lastPointerTime = now;
    }

    const rect = menuBook.getBoundingClientRect();
    const bookWidth = rect.width;

    let newProgress = currentProgress;
    if (dragDirectionLocked === 'forward') {
      newProgress = Math.max(0.0, Math.min(1.0, -dx / bookWidth));
    } else if (dragDirectionLocked === 'backward') {
      newProgress = Math.max(0.0, Math.min(1.0, 1.0 - (dx / bookWidth)));
    }

    currentProgress = newProgress;
    renderCurl(currentProgress, currentLiftBias, activeTurningPage);
  });

  function handlePointerEnd(e) {
    if (!isPointerDown) return;
    isPointerDown = false;

    if (menuBook.hasPointerCapture(e.pointerId)) {
      menuBook.releasePointerCapture(e.pointerId);
    }

    // A. Handle Simple Click/Tap on the Book
    if (!hasMovedPastDeadband) {
      const rect = menuBook.getBoundingClientRect();
      const clickXNorm = (e.clientX - rect.left) / rect.width;
      const maxP = getMaxPage();

      if (currentMenu === 'bar' || currentMenu === 'cocktail') {
        if (clickXNorm > 0.80) {
          if (currentPage < maxP) goToPage(currentPage + 1, currentLiftBias);
        } else if (clickXNorm < 0.20) {
          if (currentPage > 0) goToPage(currentPage - 1, currentLiftBias);
        } else {
          openExpanded(currentPage);
        }
      } else {
        if (clickXNorm > 0.6) {
          if (currentPage < maxP) goToPage(currentPage + 1, currentLiftBias);
        } else if (clickXNorm < 0.4) {
          if (currentPage > 0) goToPage(currentPage - 1, currentLiftBias);
        }
      }
      return;
    }

    if (!dragDirectionLocked) return;

    // B. Handle Gesture Release with Momentum
    if (dragDirectionLocked === 'forward') {
      if (currentProgress > 0.32 || dragVelocity < -0.22) {
        const remainingDist = 1.0 - currentProgress;
        const dur = Math.max(380, Math.min(850, 750 * remainingDist / Math.max(0.4, Math.abs(dragVelocity) * 1.5)));
        animateTransition(activeTurningPage, currentProgress, 1.0, dur, currentLiftBias);
      } else {
        const dur = Math.max(320, Math.min(700, 600 * currentProgress));
        animateTransition(activeTurningPage, currentProgress, 0.0, dur, currentLiftBias);
      }
    } else if (dragDirectionLocked === 'backward') {
      if (currentProgress < 0.68 || dragVelocity > 0.22) {
        const remainingDist = currentProgress;
        const dur = Math.max(380, Math.min(850, 750 * remainingDist / Math.max(0.4, Math.abs(dragVelocity) * 1.5)));
        animateTransition(activeTurningPage, currentProgress, 0.0, dur, currentLiftBias);
      } else {
        const dur = Math.max(320, Math.min(700, 600 * (1.0 - currentProgress)));
        animateTransition(activeTurningPage, currentProgress, 1.0, dur, currentLiftBias);
      }
    }
  }

  menuBook.addEventListener('pointerup', handlePointerEnd);
  menuBook.addEventListener('pointercancel', handlePointerEnd);

  // ==========================================================================
  // 5. MINIMAL ARROW NAVIGATION CONTROLS
  // ==========================================================================
  if (btnNavPrev) {
    btnNavPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isAnimating) return;
      if (currentPage > 0) {
        goToPage(currentPage - 1, 0.45);
      }
    });
  }

  if (btnNavNext) {
    btnNavNext.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isAnimating) return;
      const maxP = getMaxPage();
      if (currentPage < maxP) {
        goToPage(currentPage + 1, 0.45);
      }
    });
  }

  // ==========================================================================
  // 6. THREE-WAY MENU SWITCHER ENGINE (FOOD MENU | BAR MENU | COCKTAIL MENU)
  // ==========================================================================
  function switchMenu(targetMenu) {
    if (targetMenu === currentMenu) return;

    if (isAnimating) {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      isAnimating = false;
    }
    ctx.clearRect(0, 0, currentVirtualW, VIRTUAL_H);

    if (menuExpandedViewer && !menuExpandedViewer.hidden) {
      closeExpanded();
    }

    currentMenu = targetMenu;
    document.body.dataset.activeMenu = targetMenu;

    if (btnFoodMenu) {
      const isFood = (targetMenu === 'food');
      btnFoodMenu.classList.toggle('active', isFood);
      btnFoodMenu.setAttribute('aria-selected', isFood ? 'true' : 'false');
    }
    if (btnBarMenu) {
      const isBar = (targetMenu === 'bar');
      btnBarMenu.classList.toggle('active', isBar);
      btnBarMenu.setAttribute('aria-selected', isBar ? 'true' : 'false');
    }
    if (btnCocktailMenu) {
      const isCocktail = (targetMenu === 'cocktail');
      btnCocktailMenu.classList.toggle('active', isCocktail);
      btnCocktailMenu.setAttribute('aria-selected', isCocktail ? 'true' : 'false');
    }

    let restoredPage = 0;
    if (targetMenu === 'food') restoredPage = foodPage;
    else if (targetMenu === 'bar') restoredPage = barPage;
    else if (targetMenu === 'cocktail') restoredPage = cocktailPage;

    setFinalState(restoredPage);
  }

  if (btnFoodMenu) {
    btnFoodMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      switchMenu('food');
    });
  }
  if (btnBarMenu) {
    btnBarMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      switchMenu('bar');
    });
  }
  if (btnCocktailMenu) {
    btnCocktailMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      switchMenu('cocktail');
    });
  }

  // ==========================================================================
  // 7. HIGH-LEGIBILITY EXPANDED READING VIEWER CONTROLLER
  //    Fit to width, natural vertical scrolling, strict ZERO zoom
  // ==========================================================================
  function getCurrentMenuManifest() {
    if (currentMenu === 'bar') return BAR_MENU_PAGES;
    if (currentMenu === 'cocktail') return COCKTAIL_MENU_PAGES;
    return null;
  }

  function renderExpandedPage() {
    const pages = getCurrentMenuManifest();
    if (!pages || !pages[expandedPageIndex]) return;

    const pageData = pages[expandedPageIndex];
    expandedMenuImg.src = pageData.src;
    expandedMenuImg.alt = pageData.alt;

    if (expandedPageTitle) {
      expandedPageTitle.textContent = pageData.title;
    }

    if (btnExpPrev) {
      btnExpPrev.disabled = (expandedPageIndex === 0);
    }
    if (btnExpNext) {
      btnExpNext.disabled = (expandedPageIndex === pages.length - 1);
    }

    if (expDotsWrap) {
      let dotsHtml = '';
      for (let i = 0; i < pages.length; i++) {
        dotsHtml += `<span class="exp-dot${i === expandedPageIndex ? ' active' : ''}" data-index="${i}" role="button" aria-label="Go to page ${i + 1}"></span>`;
      }
      expDotsWrap.innerHTML = dotsHtml;
    }
    if (expPageNumber) {
      expPageNumber.textContent = `PAGE ${expandedPageIndex + 1} OF ${pages.length}`;
    }

    if (expandedViewport) {
      expandedViewport.scrollTop = 0;
    }
  }

  function openExpanded(pageIdx = currentPage) {
    const pages = getCurrentMenuManifest();
    if (!pages) return;

    expandedPageIndex = Math.max(0, Math.min(pages.length - 1, pageIdx));
    renderExpandedPage();

    if (menuExpandedViewer) {
      menuExpandedViewer.hidden = false;
      requestAnimationFrame(() => {
        menuExpandedViewer.classList.add('active');
        if (btnCloseExpanded) btnCloseExpanded.focus();
      });
    }
    document.body.classList.add('expanded-open');
  }

  function closeExpanded() {
    if (!menuExpandedViewer) return;

    menuExpandedViewer.classList.remove('active');
    menuExpandedViewer.hidden = true;
    document.body.classList.remove('expanded-open');

    setFinalState(expandedPageIndex);

    if (btnExpandMenu) {
      btnExpandMenu.focus();
    }
  }

  if (btnExpandMenu) {
    btnExpandMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      openExpanded(currentPage);
    });
  }

  if (btnCloseExpanded) {
    btnCloseExpanded.addEventListener('click', (e) => {
      e.stopPropagation();
      closeExpanded();
    });
  }

  if (btnExpPrev) {
    btnExpPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      if (expandedPageIndex > 0) {
        expandedPageIndex--;
        renderExpandedPage();
      }
    });
  }

  if (btnExpNext) {
    btnExpNext.addEventListener('click', (e) => {
      e.stopPropagation();
      const pages = getCurrentMenuManifest();
      if (pages && expandedPageIndex < pages.length - 1) {
        expandedPageIndex++;
        renderExpandedPage();
      }
    });
  }

  if (expandedPageIndicator) {
    expandedPageIndicator.addEventListener('click', (e) => {
      const dot = e.target.closest('.exp-dot');
      if (dot && dot.dataset.index !== undefined) {
        expandedPageIndex = parseInt(dot.dataset.index, 10);
        renderExpandedPage();
      }
    });
  }

  if (expandedViewport) {
    expandedViewport.addEventListener('click', (e) => {
      if (e.target === expandedViewport) {
        closeExpanded();
      }
    });
  }

  // ==========================================================================
  // 8. KEYBOARD ACCESSIBILITY & GLOBAL SHORTCUTS
  // ==========================================================================
  window.addEventListener('keydown', (e) => {
    if (menuExpandedViewer && !menuExpandedViewer.hidden) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeExpanded();
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        if (btnExpNext && !btnExpNext.disabled) btnExpNext.click();
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (btnExpPrev && !btnExpPrev.disabled) btnExpPrev.click();
        return;
      }
      return;
    }

    const maxP = getMaxPage();
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && currentPage < maxP)) {
      e.preventDefault();
      if (isAnimating) return;
      if (currentPage < maxP) {
        goToPage(currentPage + 1, 0.45);
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || (e.key === ' ' && currentPage === maxP)) {
      e.preventDefault();
      if (isAnimating) return;
      if (currentPage > 0) {
        goToPage(currentPage - 1, 0.45);
      }
    }

    if (e.key.toLowerCase() === 'e' && !e.ctrlKey && !e.metaKey) {
      if (currentMenu === 'bar' || currentMenu === 'cocktail') {
        openExpanded(currentPage);
      }
    }

    if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.metaKey) {
      if (currentMenu === 'food') switchMenu('bar');
      else if (currentMenu === 'bar') switchMenu('cocktail');
      else switchMenu('food');
    }

    if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  });

  // ==========================================================================
  // 9. PRELOAD ALL MENU ASSETS
  // ==========================================================================
  const preloadSources = [
    'assets/images/menu-cover.jpg',
    'assets/images/menu-reference.jpg',
    'assets/images/garde-manger.jpg',
    'assets/images/around-the-world.jpg',
    'assets/images/pasta-pizza.jpg',
    'assets/images/tandoor-kebabs.jpg',
    'assets/images/tandoor-breads.jpg',
    'assets/images/indian-dal.jpg',
    'assets/images/bar-whiskey-1.jpg',
    'assets/images/bar-whiskey-2.jpg',
    'assets/images/bar-whiskey-3.png',
    'assets/images/bar-tequila-gin.jpg',
    'assets/images/bar-vodka-rum.jpg',
    'assets/images/bar-wine.jpg',
    'assets/images/bar-beer-breezer.jpg',
    'assets/images/cocktail-1-signature.jpg',
    'assets/images/cocktail-2-tequila-whisky.jpg',
    'assets/images/cocktail-3-gin.jpg',
    'assets/images/cocktail-4-classics.jpg'
  ];

  preloadSources.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  setFinalState(0);
});
