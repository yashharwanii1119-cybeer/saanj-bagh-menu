/**
 * SAANJ BAGH — LUXURY INTERACTIVE MENU BOOK
 * Photorealistic Physical Page-Turn Engine & Travelling Fold Simulation
 * 
 * Sequence:
 *   Page 0: Cover (Closed Book)
 *   Page 1: 01 · Soup (A Warm Beginning with Continuous Live Steam)
 *   Page 2: 02 · Garde Manger (Fresh Starts & Relishes)
 *   Page 3: 03 · Contie Chinese (Dancing Kathputli Puppet)
 * 
 * Features:
 * - Dynamic curved Bezier fold contour (heavy-stock uncoated luxury paper sheet)
 * - Cylindrical travelling wave swelling mid-turn and relaxing at landing
 * - Dual-layer lighting: contact ambient occlusion + diffused penumbra shadow
 * - Continuous live steam on Soup page is never interrupted, paused, or restarted
 * - Minimal antique-gold arrow navigation controls
 * - Gesture-aware pointer and touch dragging with momentum release
 * - Full reduced-motion and keyboard accessibility
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const menuBook = document.getElementById('menuBook');
  const coverLayer = document.getElementById('coverLayer');
  const soupLayer = document.getElementById('soupLayer');
  const gardeLayer = document.getElementById('gardeLayer');
  const contieLayer = document.getElementById('contieLayer');
  const pastaLayer = document.getElementById('pastaLayer');
  const tandoorLayer = document.getElementById('tandoorLayer');
  const indianLayer = document.getElementById('indianLayer');
  const curlCanvas = document.getElementById('curlCanvas');

  // Minimal Antique-Gold Arrow Navigation Controls
  const btnNavPrev = document.getElementById('btnNavPrev');
  const btnNavNext = document.getElementById('btnNavNext');

  // Artwork references
  const coverArtwork = document.getElementById('coverArtwork');
  const soupArtwork = document.getElementById('soupArtwork');
  const gardeArtwork = document.getElementById('gardeArtwork');
  const contieArtwork = document.getElementById('contieArtwork');
  const pastaArtwork = document.getElementById('pastaArtwork');
  const tandoorArtwork = document.getElementById('tandoorArtwork');
  const indianArtwork = document.getElementById('indianArtwork');

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

  // --- Multi-Page Book State ---
  // Sequence: 0 = Cover, 1 = Soup, 2 = Garde Manger, 3 = Contie Chinese
  let currentPage = 0;          // 0 = Cover, 1 = Soup, 2 = Garde Manger, 3 = Contie Chinese
  let currentState = 'cover';   // 'cover' | 'soup' | 'garde-manger' | 'contie-chinese'
  let activeTurningPage = 0;    // 0 (Cover↔Soup) | 1 (Soup↔Garde) | 2 (Garde↔Contie)
  let currentProgress = 0.0;    // [0, 1] relative to the active turning page
  let currentLiftBias = 0.45;   // Positive = bottom corner leads, Negative = top leads
  let isAnimating = false;
  let animationId = null;

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

    // A. Corner Lift Mechanics: Pulled corner moves ahead
    const bottomLeadFactor = bias >= 0 ? (0.65 + 0.35 * bias) : 0.20;
    const topLeadFactor = bias < 0 ? (0.65 - 0.35 * bias) : 0.20;

    const pb = Math.min(1.0, Math.max(0.0, clampedP * (1.0 + 0.16 * bottomLeadFactor)));
    const pt = Math.min(1.0, Math.max(0.0, (clampedP - (bias >= 0 ? 0.04 : 0.0)) * (1.0 + 0.16 * topLeadFactor)));

    // Top and bottom edge travel coordinates
    const xt = W * (1.02 - pt * 1.04);
    const xb = W * (1.02 - pb * 1.04);

    // Normal vector perpendicular to the general fold line
    const dx = xb - xt;
    const dy = H;
    const len = Math.hypot(dx, dy) || 1;
    const nx = dy / len;   // Perpendicular vector pointing right (towards turning paper)
    const ny = -dx / len;

    // B. Organic Bowed Fold Contour (developable paper curvature)
    const bowMax = 28.0;
    const bow = bowMax * Math.sin(Math.PI * clampedP);

    const delta1 = (bias >= 0 ? 0.30 : -0.70) * bow;
    const delta2 = (bias >= 0 ? -0.70 : 0.30) * bow;

    const cp1x = xt + delta1;
    const cp1y = H * 0.34;
    const cp2x = xb + delta2;
    const cp2y = H * 0.68;

    // C. Dynamic Wave Radius & Swell
    const maxRadius = 56.0;
    const radius = maxRadius * Math.pow(Math.sin(Math.PI * clampedP), 0.72);
    const waveWidth = Math.PI * radius;

    return {
      W, H,
      xt, xb,
      cp1x, cp1y,
      cp2x, cp2y,
      nx, ny,
      radius,
      waveWidth,
      p: clampedP
    };
  }

  // ==========================================================================
  // 2. PHOTOREALISTIC CANVAS RENDERER
  // ==========================================================================
  function renderCurl(progress, liftBias = 0.45, turningPage = activeTurningPage) {
    resizeCanvas();
    ctx.clearRect(0, 0, currentVirtualW, VIRTUAL_H);

    // If completely closed or open for this page transition, no curl needed on canvas
    if (progress <= 0.001 || progress >= 0.999) return;

    const geom = getFoldGeometry(progress, liftBias);
    const { W, H, xt, xb, cp1x, cp1y, cp2x, cp2y, nx, ny, radius, waveWidth, p } = geom;

    ctx.save();

    // ------------------------------------------------------------------------
    // LAYER A: REVEALED PAGE TRANSPARENCY
    // The canvas remains completely transparent over the revealed page area,
    // allowing the live DOM page underneath (including continuous SVG soup steam
    // or live Garde Manger elements) to shine through at 60fps without occlusion.
    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------
    // LAYER B: DUAL-LAYER RESPONSIVE DROP SHADOW CAST ONTO UNDERNEATH PAGE
    // ------------------------------------------------------------------------
    ctx.save();
    ctx.beginPath();
    // Clip strictly to the uncovered area to the right of the curved fold
    ctx.moveTo(xt, 0);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, xb, H);
    ctx.lineTo(W, H);
    ctx.lineTo(W, 0);
    ctx.closePath();
    ctx.clip();

    const midX = (xt + xb) * 0.5;
    const midY = H * 0.5;

    // 1. Ambient Occlusion Contact Shadow (narrow, deep shadow right at contact)
    const aoDist = Math.max(8, radius * 0.32);
    const aoGrad = ctx.createLinearGradient(
      midX, midY,
      midX + nx * aoDist, midY + ny * aoDist
    );
    aoGrad.addColorStop(0.0, 'rgba(10, 22, 16, 0.62)');
    aoGrad.addColorStop(0.35, 'rgba(10, 22, 16, 0.32)');
    aoGrad.addColorStop(1.0, 'rgba(10, 22, 16, 0.0)');
    ctx.fillStyle = aoGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Soft Diffuse Penumbra Shadow (spreads with wave elevation)
    const penumbraDist = Math.max(35, radius * 1.55);
    const penumbraGrad = ctx.createLinearGradient(
      midX, midY,
      midX + nx * penumbraDist, midY + ny * penumbraDist
    );
    const shadowIntensity = 0.46 * Math.sin(Math.PI * p);
    penumbraGrad.addColorStop(0.0, `rgba(16, 32, 24, ${shadowIntensity})`);
    penumbraGrad.addColorStop(0.25, `rgba(16, 32, 24, ${shadowIntensity * 0.68})`);
    penumbraGrad.addColorStop(0.60, `rgba(16, 32, 24, ${shadowIntensity * 0.24})`);
    penumbraGrad.addColorStop(1.0, 'rgba(16, 32, 24, 0.0)');
    ctx.fillStyle = penumbraGrad;
    ctx.fillRect(0, 0, W, H);

    ctx.restore();

    // ------------------------------------------------------------------------
    // LAYER C: UNPEELED FLAT TURNING PAGE BODY (Left side of curved fold)
    // Turning page: Cover (page 0), Soup (page 1), or Garde Manger (page 2)
    // ------------------------------------------------------------------------
    let turningArt;
    if (turningPage === 5) turningArt = tandoorArtwork;
    else if (turningPage === 4) turningArt = pastaArtwork;
    else if (turningPage === 3) turningArt = contieArtwork;
    else if (turningPage === 2) turningArt = gardeArtwork;
    else if (turningPage === 1) turningArt = soupArtwork;
    else turningArt = coverArtwork;
    if (turningArt && turningArt.complete) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(xt, 0);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, xb, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.clip();

      // 100% full uncropped artwork drawing matching container proportions
      ctx.drawImage(turningArt, 0, 0, W, H);

      // Crease Ambient Darkening: Valley formed where paper curves upward
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

      // Spine Binding Shadow: Deepens as page sweeps toward binding (x = 0)
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

    // ------------------------------------------------------------------------
    // LAYER D: THE 3D CURLED PAPER WAVE (Cylindrical roll & moving highlight)
    // ------------------------------------------------------------------------
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

      // Matte Cylindrical Shading with Specular Sheen along Ridge
      const waveGrad = ctx.createLinearGradient(
        midX, midY,
        midX + ox, midY + oy
      );
      waveGrad.addColorStop(0.00, '#EAE0CC'); // Crease contact shadow
      waveGrad.addColorStop(0.18, '#F6EFE2'); // Rajasthani parchment body
      waveGrad.addColorStop(0.38, '#FAF5EB'); // Diffuse illumination
      waveGrad.addColorStop(0.54, '#FFFDF8'); // Specular sheen highlight
      waveGrad.addColorStop(0.72, '#EFE3CE'); // Downward roll shading
      waveGrad.addColorStop(0.88, '#E1D1B6'); // Soft underside shading
      waveGrad.addColorStop(1.00, '#D4C19E'); // Under-fold roll tone

      ctx.fillStyle = waveGrad;
      ctx.fillRect(0, 0, W, H);

      // Narrow soft shadow on the underside of the curled fold
      const undersideGrad = ctx.createLinearGradient(
        midX + ox * 0.75, midY + oy * 0.75,
        midX + ox, midY + oy
      );
      undersideGrad.addColorStop(0.0, 'rgba(16, 32, 24, 0.0)');
      undersideGrad.addColorStop(1.0, 'rgba(16, 32, 24, 0.28)');
      ctx.fillStyle = undersideGrad;
      ctx.fillRect(0, 0, W, H);

      // Gilded Antique-Gold Hairline along curling paper edge
      const goldAlpha = 0.75 * Math.sin(Math.PI * p);
      ctx.strokeStyle = `rgba(201, 164, 92, ${goldAlpha})`;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(xt + ox, 0);
      ctx.bezierCurveTo(cp1x + ox, cp1y, cp2x + ox, cp2y, xb + ox, H);
      ctx.stroke();

      // Subtle 280gsm Card Thickness Bevel (warm white paper core)
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
  // 3. PHYSICAL PAPER ANIMATION CONTROLLER (Easing & State Machine)
  // ==========================================================================
  function updateArrowNav() {
    if (!btnNavPrev || !btnNavNext) return;
    if (isAnimating) {
      btnNavPrev.disabled = true;
      btnNavNext.disabled = true;
      return;
    }
    btnNavPrev.disabled = (currentPage === 0);
    btnNavNext.disabled = (currentPage === 6);
    btnNavPrev.setAttribute('aria-disabled', currentPage === 0 ? 'true' : 'false');
    btnNavNext.setAttribute('aria-disabled', currentPage === 6 ? 'true' : 'false');
  }

  function setFinalState(page) {
    currentPage = page;
    if (page === 0) currentState = 'cover';
    else if (page === 1) currentState = 'soup';
    else if (page === 2) currentState = 'garde-manger';
    else if (page === 3) currentState = 'contie-chinese';
    else if (page === 4) currentState = 'pasta-pizza';
    else if (page === 5) currentState = 'tandoor-rice';
    else if (page === 6) currentState = 'indian-dal';

    menuBook.dataset.state = currentState;
    updateArrowNav();
  }

  // Natural physical paper turn easing curve (Symmetric cubic ease-in-out)
  // Gentle start from rest (0 velocity), natural mid-turn sweep, gentle settling flat
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * Smooth physics-based turn animation for a single page turn
   * @param {number} turningPage - 0 to 5
   * @param {number} startProg - Starting progress [0, 1]
   * @param {number} targetProg - Target progress [0, 1]
   * @param {number} duration - Turn duration in ms
   * @param {number} liftBias - Corner lift bias
   * @param {function} callback - Completion callback
   */
  function animateTransition(turningPage, startProg, targetProg, duration = 880, liftBias = 0.45, callback = null) {
    if (animationId) cancelAnimationFrame(animationId);
    isAnimating = true;
    updateArrowNav();
    activeTurningPage = turningPage;
    currentLiftBias = liftBias;
    resizeCanvas();

    // Set the animating data-state for CSS layer visibility
    menuBook.dataset.state = `animating-${turningPage}-${turningPage + 1}`;

    const delta = targetProg - startProg;
    const startTime = performance.now();

    function frame(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1.0);
      const ease = easeInOutCubic(t);
      currentProgress = startProg + delta * ease;

      renderCurl(currentProgress, currentLiftBias, turningPage);

      if (t < 1.0) {
        animationId = requestAnimationFrame(frame);
      } else {
        currentProgress = targetProg;
        // Compute resulting page and set final state FIRST
        const endPage = (targetProg >= 0.5) ? turningPage + 1 : turningPage;
        setFinalState(endPage);

        // Seamless handover: clear canvas on next frame once DOM layer is established
        requestAnimationFrame(() => {
          ctx.clearRect(0, 0, currentVirtualW, VIRTUAL_H);
          isAnimating = false;
          updateArrowNav();
          if (callback) callback();
        });
      }
    }

    animationId = requestAnimationFrame(frame);
  }

  function goToPage(targetPage, liftBias = 0.45) {
    if (isAnimating || targetPage === currentPage) return;
    if (targetPage < 0 || targetPage > 6) return;

    if (Math.abs(targetPage - currentPage) === 1) {
      if (targetPage > currentPage) {
        animateTransition(currentPage, 0.0, 1.0, 880, liftBias);
      } else {
        animateTransition(targetPage, 1.0, 0.0, 880, liftBias);
      }
    } else {
      // Direct smooth turn to target page
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

      if (dx < 0) {
        // Dragging left = forward turn
        if (currentPage < 6) {
          activeTurningPage = currentPage;
          dragDirectionLocked = 'forward';
          menuBook.dataset.state = `animating-${activeTurningPage}-${activeTurningPage + 1}`;
          resizeCanvas(activeTurningPage);
        }
      } else {
        // Dragging right = backward turn
        if (currentPage > 0) {
          activeTurningPage = currentPage - 1;
          dragDirectionLocked = 'backward';
          menuBook.dataset.state = `animating-${activeTurningPage}-${activeTurningPage + 1}`;
          resizeCanvas(activeTurningPage);
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

    // A. Handle Simple Click/Tap on the Book (Did not move past deadband)
    if (!hasMovedPastDeadband) {
      const rect = menuBook.getBoundingClientRect();
      const clickXNorm = (e.clientX - rect.left) / rect.width;

      if (clickXNorm > 0.6) {
        if (currentPage < 6) goToPage(currentPage + 1, currentLiftBias);
      } else if (clickXNorm < 0.4) {
        if (currentPage > 0) goToPage(currentPage - 1, currentLiftBias);
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
  // 5. MINIMAL ARROW NAVIGATION & KEYBOARD CONTROLS
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
      if (currentPage < 6) {
        goToPage(currentPage + 1, 0.45);
      }
    });
  }

  // Floating Quick-Action Menu Jump Button (Navigates directly to first main menu page)
  const btnJumpMenu = document.getElementById('btnJumpMenu');
  if (btnJumpMenu) {
    btnJumpMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isAnimating) return;
      goToPage(1, 0.45);
    });
  }

  // Keyboard accessibility
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && currentPage < 6)) {
      e.preventDefault();
      if (isAnimating) return;
      if (currentPage < 6) {
        goToPage(currentPage + 1, 0.45);
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || (e.key === ' ' && currentPage === 6)) {
      e.preventDefault();
      if (isAnimating) return;
      if (currentPage > 0) {
        goToPage(currentPage - 1, 0.45);
      }
    }

    // 'F' key for Fullscreen presentation
    if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  });

  // Preload and verify image assets in memory
  if (!coverArtwork.complete) coverArtwork.onload = () => {};
  if (!soupArtwork.complete) soupArtwork.onload = () => {};
  if (!gardeArtwork.complete) gardeArtwork.onload = () => {};
  if (contieArtwork && !contieArtwork.complete) contieArtwork.onload = () => {};
  if (pastaArtwork && !pastaArtwork.complete) pastaArtwork.onload = () => {};
  if (tandoorArtwork && !tandoorArtwork.complete) tandoorArtwork.onload = () => {};
  if (indianArtwork && !indianArtwork.complete) indianArtwork.onload = () => {};

  // Initialize initial arrow navigation states
  updateArrowNav();
});
