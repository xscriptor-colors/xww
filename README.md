<h1 align="center">Xwall</h1>

<div align="center">
  <a href="https://github.com/xscriptor/xwall/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/xscriptor/xwall/ci.yml?branch=main&style=for-the-badge&label=CI" alt="CI status" /></a>
  <a href="https://github.com/xscriptor/xwall/actions/workflows/deploy-pages.yml"><img src="https://img.shields.io/github/actions/workflow/status/xscriptor/xwall/deploy-pages.yml?branch=main&style=for-the-badge&label=Deploy" alt="Deploy status" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-111827?style=for-the-badge&logo=opensourceinitiative&logoColor=white" alt="License: MIT" /></a>
  <img src="https://img.shields.io/badge/React-19-111827?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-111827?style=for-the-badge&logo=typescript&logoColor=3178C6" alt="TypeScript 5.9" />
  <img src="https://img.shields.io/badge/Vite-7-111827?style=for-the-badge&logo=vite&logoColor=646CFF" alt="Vite 7" />
  
  <p>Interactive, aesthetic wallpaper generator that creates fluid, liquid-like visuals in real-time. It runs directly in your browser and allows you to customize the color palette, texture, and various distortion effects to create unique 4k wallpapers.</p>
</div>

<h2>Features</h2>
<ul>
  <li><strong>16-Color Palette</strong>: Fully customizable color selection (0-15) to match your aesthetic.</li>
  <li><strong>Visual Effects</strong>:
    <ul>
      <li><strong>Pixelation</strong>: Turn the fluid into retro pixel art.</li>
      <li><strong>Distortion</strong>: Control the chaos and warping of the liquid.</li>
      <li><strong>Relief</strong>: Adjust the 3D depth and thickness of the paint.</li>
    </ul>
  </li>
  <li><strong>High Performance</strong>: Built with React Three Fiber and custom GLSL shaders.</li>
  <li><strong>Export 4k</strong>: Render and download high-resolution (3840x2160) images instantly.</li>
</ul>

<h2>In case you want to try this locally:</h2>
<ol>
  <li>Install dependencies:
    <pre><code class="language-bash">npm install</code></pre>
  </li>
  <li>Run the full quality gate when needed:
    <pre><code class="language-bash">npm run check</code></pre>
  </li>
  <li>Start the development server:
    <pre><code class="language-bash">npm run dev</code></pre>
  </li>
  <li>Open the local URL in your browser.</li>
</ol>

<h2>Quality and Automation</h2>
<ul>
  <li><strong>Type Safety</strong>: <code>npm run typecheck</code> validates the full TypeScript project before building.</li>
  <li><strong>Targeted Tests</strong>: <code>npm run test</code> runs Vitest against the export/signature utilities.</li>
  <li><strong>Single Quality Gate</strong>: <code>npm run check</code> runs lint, typecheck, and tests in one command.</li>
  <li><strong>Continuous Integration</strong>: <code>.github/workflows/ci.yml</code> executes the quality gate on pushes and pull requests.</li>
  <li><strong>GitHub Pages Deployment</strong>: <code>.github/workflows/deploy-pages.yml</code> builds the app and deploys <code>dist/</code> using the official Pages actions.</li>
</ul>

<h2 align="center" id="related-documents">Related Documents</h2>

<ul>
  <li><a href="./LICENSE">License</a></li>
  <li><a href="./CODE_OF_CONDUCT.md">Code of Conduct</a></li>
  <li><a href="./CONTRIBUTING.md">Contributions</a></li>
</ul>


<p><strong>Generated Wallpapers:</strong> <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a><br>
The artworks and wallpapers generated using Xwall are licensed under Creative Commons Attribution 4.0 International. If you share, distribute, or use them publicly, you must give appropriate credit to this project.</p>

<div align="center">
<h2 align="center" id="x">X</h2>

<a href="https://github.com/xscriptor">XGitHub</a> &middot;
<a href="https://dev.xscriptor.com">XWeb</a>
</div>
