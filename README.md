# Saanj Bagh — Luxury Interactive Menu Book

**Luxury Interactive Digital Menu Book with Realistic Paper Curl Page Turning**  
*Saanj Bagh — Botanical Bar & Kitchen, Jodhpur, Rajasthan, India*

---

## Overview

This project presents the **Saanj Bagh Interactive Digital Menu Book**, featuring:
1. **Front Cover (Page 0)**: The approved beige-and-gold Saanj Bagh menu cover artwork showcasing the sunlit royal courtyard, Mughal/Rajasthani cusped arch, climbing botanical branches, floral cartouche emblem, and `MENU` title.
2. **01 · Soup — A Warm Beginning (Page 1)**: Ceramic tomato soup bowl with **photorealistic, continuously rising warm water vapour/steam**.
3. **02 · Garde Manger — Fresh Starts & Relishes (Page 2)**: Garden architectural courtyard with **organic botanical foliage breeze** swaying isolated leaf clusters.
4. **03 · Contie Chinese (Page 3)**: Royal pavilion and bridge landscape with **subtle marionette sway of the traditional Rajasthani dancing puppet** ($\pm 0.95^\circ$ graceful suspension loop).
5. **04 · Pasta & Pizza (Page 4)**: Sunlit fort view with artisanal pasta and Neapolitan wood-fired pizza selections.
6. **05 · Tandoor, Rice & Biryani, Breads & Accompaniments (Page 5)**: Sunset terrace overlooking the Blue City with tandoor kebabs, biryanis, and artisanal breads.
7. **06 · Indian, Dal & Sizzler (Page 6)**: Grand royal banquet view featuring traditional curries, slow-cooked dal, and sizzler specialties.

---

## Interactive Features & Controls

- **Realistic Paper Curl Physics**: Custom canvas-rendered paper curl with physically natural corner peel and underside shading.
- **Pointer / Touch Drag**: Drag across the page to peel the page forward or backward, with automatic snap-back or turn completion based on velocity and release position.
- **Antique-Gold Arrow Navigation**: Discreet navigation arrows at the bottom right corner with boundary detection (disabled at ends).
- **Keyboard Navigation**:
  - `ArrowRight`, `PageDown`, `Space`: Turn forward to the next page.
  - `ArrowLeft`, `PageUp`: Turn backward to the previous page.
- **Accessibility & Assistive Tech**: Complete hidden semantic HTML structure (`sr-only-content`) mirroring all 7 pages with dishes, descriptions, and prices for screen readers and SEO.
- **Motion Preferences**: Full support for `prefers-reduced-motion: reduce`, gracefully freezing animated layers.

---

## How to Run Locally

### Option 1: Live Local Server
The server is running on:
```
http://localhost:3000
```
Open in your browser to experience the 7-page menu book with animations.

### Option 2: Terminal
```bash
cd "D:\sample menu"
npx serve -l 3000 .
# or
python -m http.server 3000
```

---

## Deploying to GitHub Pages

1. **Initialize Git & Commit**:
   ```bash
   git init
   git add .
   git commit -m "Deploy Saanj Bagh digital flipbook menu"
   ```

2. **Push to GitHub**:
   - Create a new public repository on GitHub (e.g., `saanj-bagh-menu`).
   - Add your remote and push:
     ```bash
     git remote add origin https://github.com/USERNAME/REPOSITORY.git
     git branch -M main
     git push -u origin main
     ```

3. **Enable GitHub Pages**:
   - Go to your repository **Settings** $\rightarrow$ **Pages**.
   - Under **Build and deployment** $\rightarrow$ **Source**, choose **Deploy from a branch**.
   - Under **Branch**, select **`main`** and **`/ (root)`**, then click **Save**.
   - Your menu will be live at `https://USERNAME.github.io/REPOSITORY/`.

---

*Curated for Saanj Bagh — Botanical Bar & Kitchen, Ratanada, Jodhpur, Rajasthan.*
