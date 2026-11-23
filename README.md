# Syed Sarfaraz Hussain Zaidi — Portfolio Website

A high-aesthetic, interactive design and hardware prototyping portfolio website created for **Syed Sarfaraz Hussain Zaidi** (`Sarfaraz - D lite`).

Built to showcase your digital fabrication journey, physical computing projects, and reflections from your Notion workspace: **[Week 1 - Principles, Practices & Digital Exploration](https://brick-era-0b8.notion.site/Week-1-Principles-Practices-Digital-Exploration-41c4243c7bad806cad31f09661c93367)** and Miro design boards.

---

## ✨ Features Included

1. **Aesthetic Hero Profile Card**:
   - Modern typography (`Plus Jakarta Sans`, `Space Grotesk`, `JetBrains Mono`).
   - Clean dark-mode by default with an aesthetic light mode toggle.
   - **Interactive Hero Photo Uploader**: You can click the hero photo card directly on the page to upload your actual portrait image from your computer — it automatically persists in your browser (`localStorage`)!
   - Highlighted maker ethos: *"I go back home and work on my ideas."*

2. **Featured Flagship: Pocket Rocket (Handheld Game Box)**:
   - Full project breakdown: split dual-tone industrial design (cyan & yellow), custom PCB, battery management, and 3D printing.
   - **Playable On-Page Console Simulator**: An interactive 8-bit retro runner game on the console screen! Play using the on-screen D-Pad and A/B buttons or keyboard (Spacebar / Up Arrow).
   - Deep dive tabs for CAD/Enclosure, Custom PCB, and Firmware.

3. **Featured Hardware: GESTULATOR (Robotic Hand Gesture Calculator)**:
   - Interactive Animatronic Gesture Simulator: SVG articulated robotic hand that performs kinematic finger gestures for digits 0–9.
   - Interactive Calculator: Punch in math equations (e.g. `234 + 1111 = 1345`), and watch the robotic hand articulate each digit of the computed answer sequentially!

4. **Kinetic Sculptures & Additional Concepts**:
   - **Kinetic Clock**: Live physical 7-segment clock widget running real time.
   - **Crux Board**: Transparent engineering R&D log documenting multi-bar linkage tests (Stages 1A to 5A) and lessons learned.
   - **Flicker Glasses**: Optical shutter and frequency perception exploration.

5. **Digital Exploration Timeline (Week 1 and Beyond)**:
   - Interactive documentation timeline linked directly to your Notion workspace and Miro canvas.
   - Clean layout to easily append Week 2, Week 3, etc.

6. **Prototyping Toolbox**:
   - Grouped into CAD & Digital Fabrication, Electronics & Embedded Systems, and Ideation & Software with progress meters.

7. **Sound Effects & Micro-Interactions**:
   - Synthesized tactile feedback using the Web Audio API (zero external audio files needed). Toggleable at the top right.
   - One-click email copy button with toast feedback.

---

## 🚀 How to Run & Preview

You can open the website instantly in any modern web browser:

### Option A: Double-Click
Navigate to:
`C:\Users\sarfaraz\.gemini\antigravity\scratch\sarfaraz-portfolio`
Double-click `index.html` to open it in Chrome, Edge, or your default browser.

### Option B: Local Development Server (Recommended)
From PowerShell inside this directory:
```powershell
cd "C:\Users\sarfaraz\.gemini\antigravity\scratch\sarfaraz-portfolio"
npx serve .
# or: python -m http.server 3000
```
Then open `http://localhost:3000` in your browser.

---

## 📸 Adding Your Hero Photo Permanently

You have two easy ways to set your hero photo:
1. **Directly in the Browser UI**: Hover over the avatar card in the Hero section, click **"Upload Your Photo"**, and choose your picture. It will stay saved in your browser automatically.
2. **Static Image File**: Save your photo as `hero-photo.jpg` in the project root directory, and in `index.html`, replace:
   ```html
   <img id="userHeroPhoto" class="hero-img-element" src="hero-photo.jpg" alt="Syed Sarfaraz Hussain Zaidi" />
   ```

---

## 🌐 Deploying to the Web for Free

When you are ready to publish this live to share with mentors and the community:

### GitHub Pages (Recommended)
1. Initialize git and push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio release"
   git remote add origin https://github.com/<your-username>/portfolio.git
   git push -u origin main
   ```
2. In your GitHub repo settings, go to **Pages** > choose **main branch** as source > Save. Your site will be live at `https://<your-username>.github.io/portfolio/`!

### Vercel / Netlify
- Drag and drop this folder directly into [Netlify Drop](https://app.netlify.com/drop) or import via Vercel for instant deployment.

---

## 📁 Recommended Workspace Note
To work seamlessly in Antigravity IDE on this portfolio, set your active workspace to:
`C:\Users\sarfaraz\.gemini\antigravity\scratch\sarfaraz-portfolio`
