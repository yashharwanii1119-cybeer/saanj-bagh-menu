# Saanj Bagh — Luxury Interactive Menu Book

**Luxury Interactive Digital Menu Book with Realistic Paper Curl Page Turning**  
*Saanj Bagh — Botanical Bar & Kitchen, Jodhpur, Rajasthan, India*

---

## Overview

This project presents the **Saanj Bagh Interactive Digital Menu Book**, featuring:
1. **Front Cover (Page 0)**: Luxury Saanj Bagh parchment cover artwork with antique gold emblem, typography, and botanical bougainvillea accents.
2. **01 · Soup — A Warm Beginning (Page 1)**: Ceramic soup bowl with **photorealistic, continuously rising warm water vapour/steam**.
3. **02 · Garde Manger — Fresh Starts & Relishes (Page 2)**: Crisp salads, artisanal papad, chaat, and continental appetizers.
4. **03 · Around the World (Page 3)**: Global starters, platters, dim sums & momos, noodles, and Asian delicacies.
5. **04 · Pasta & Pizza (Page 4)**: Handcrafted pasta, Neapolitan wood-fired pizzas, gourmet sourdough toasts, and sandwiches.
6. **05 · Tandoor — Kebabs & Rice/Biryani (Page 5)**: Clay oven roasted kebabs, paneer tikka, aromatic rice, and Dum biryani.
7. **06 · Tandoor — Breads & Accompaniments (Page 6)**: Fresh clay oven rotis, naans, stuffed kulchas, parathas, and raita.
8. **07 · Indian, Dal & Sizzler (Page 7)**: Rich North Indian curries, paneer delicacies, slow-cooked dal, and hot sizzling platters.

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
Open in your browser to experience the 8-page menu book with animations.

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
