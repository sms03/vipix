<div align="center">
	<img src="public/vipix.png" alt="Vipix Logo" width="140" height="140" />
	<h1>Vipix</h1>
	<p><strong>High‑fidelity Video & Image Metadata Analyzer</strong><br/>Fast. Visual. Precise.</p>
    <div>
	<p>
		<a href="#quick-start">Quick Start</a> ·
		<a href="#features">Features</a> ·
		<a href="#tech-stack">Stack</a> ·
		<a href="#roadmap">Roadmap</a>
	</p>

	<p>
		<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff" />
		<img alt="React" src="https://img.shields.io/badge/React-149ECA?logo=react&logoColor=fff" />
		<img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff" />
		<img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwindcss&logoColor=fff" />
		<img alt="shadcn/ui" src="https://img.shields.io/badge/UI-shadcn--ui-000?logo=radixui&logoColor=fff" />
		<img alt="Three.js" src="https://img.shields.io/badge/Three.js-000000?logo=three.js&logoColor=fff" />
	</p>
</div>

---

## Overview

Vipix extracts rich technical metadata from videos and photos (containers, codecs, resolution, bitrate, color, EXIF & more) and presents it in a clean, responsive interface backed by a realtime procedural WebGL background.

## Features

- Drag & drop or click to analyze media
- Video & image pathway with adaptive metadata sections
- EXIF extraction for photos (camera, lens, GPS if present)
- Clean technical breakdown: codecs, dimensions, duration, frame rate, aspect, bitrates
- Accessible responsive layout (scales down intelligently, compact mode)
- Custom scrollbars + refined typography
- Procedural GPU background (PixelBlast) with interactive ripple effects
- Dark glass aesthetic with performance‑minded layering
- Robust error + toast feedback system

## Tech Stack

| Layer | Tools |
|-------|-------|
| Core | React + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + custom tokens + shadcn/ui components |
| UI Enhancements | Custom hooks (scaling, compact mode, toasts) |
| Graphics | Three.js + postprocessing (shader driven background) |

## Quick Start

```bash
git clone <repo-url>
cd vipix
npm install    # or pnpm i / bun i / yarn
npm run dev
```

Then open the local dev URL printed in the terminal.

## Usage

1. Open the app.
2. Drop a video (MP4, MOV, MKV…) or image (JPEG, PNG, WebP, etc.).
3. Wait for analysis (progress indicator shown).
4. Browse categorized technical + EXIF data.
5. Click "Analyze New File" to reset.

## Accessibility & Performance

- Layout scales using a dynamic transform to fit smaller viewports.
- Interactive background separated from content for clarity.
- (Planned) Reduced motion fallback for GPU effects.

## Roadmap

- [ ] Reduced‑motion / low‑power background fallback
- [ ] Batch / multi‑file queue
- [ ] Export report (JSON / Markdown)
- [ ] Color profile + HDR indicators
- [ ] In‑browser waveform & frame strip preview

## Contributing

Small focused PRs welcome. Keep UI minimal and performance friendly. Open an issue first for larger changes.

## License

Currently unlicensed (all rights reserved). Add a LICENSE file if distribution terms change.

---

Made with care for precision media workflows.
