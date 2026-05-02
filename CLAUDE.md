# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Evaluator (AI评委数据采集分析系统) - A Next.js application for capturing camera/audio data and managing performance evaluations with AI scoring and expert review capabilities.

**Key Technologies:**
- Next.js 14.2.10 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- FFmpeg (video capture via fluent-ffmpeg)
- WebSocket (video streaming via ws)
- JSON file-based storage (data/database.json)

## Common Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server (Windows)
npm start

# Start production server (Unix)
npm run start:unix

# Build and start production (shortcut)
npm run prod

# Linting
npm run lint
```

## Architecture

### Custom Server (server.js)
- Custom Node.js HTTP server wrapping Next.js
- Handles HLS video streaming from `/hls/` directory
- Handles audio file streaming from `/audio/` directory
- Graceful shutdown with FFmpeg process cleanup

### Database (src/lib/db.ts)
- JSON file-based persistence at `data/database.json`
- In-memory cache with auto-save on modifications
- Data models:
  - **Users**: Authentication (admin/guest roles)
  - **Sessions**: Evaluation sessions (contain multiple rounds)
  - **Rounds**: Individual performance rounds with state machine
  - **RegularEvaluations**: AI-generated scores
  - **ExpertEvaluations**: Expert-provided scores
  - **CameraConfigs**: Camera rotation settings

**Default Users:**
- Username: `Tidenews`, Password: `Tidenews@video.ai` (admin)
- Username: `guest`, Password: `guest` (guest)

**Round Status Flow:**
```
NOT_STARTED (0) → PERFORMING (1) → PERFORMANCE_ENDED (2) → EVALUATING (3) → EVALUATED (4) → ROUND_ENDED (5)
```

### Core Libraries

| File | Purpose |
|------|---------|
| `src/lib/cameraManager.ts` | Camera enumeration and FFmpeg capture control |
| `src/lib/audioManager.ts` | Audio recording and wave analysis |
| `src/lib/snapshotManager.ts` | Snapshot capture |
| `src/lib/recorder.ts` | Recording orchestration |
| `src/lib/logger.ts` | Structured logging to `logs/` directory |
| `src/lib/timeUtils.ts` | Local time formatting |

### API Routes (src/app/api/)

**Auth:**
- `POST /api/auth/login` - User login
- `GET /api/auth/check` - Check authentication status
- `POST /api/auth/logout` - User logout

**Session/Round Management:**
- `GET /api/sessions` - List sessions, create session
- `GET/POST /api/sessions/[sessionId]` - Session operations
- `GET/POST /api/rounds` - Round management

**Evaluation:**
- `POST /api/regular-evaluation` - Submit AI evaluation
- `POST /api/expert-evaluation` - Submit expert evaluation

**Capture:**
- `GET /api/cameras` - List available cameras
- `POST /api/capture/start` - Start camera capture
- `POST /api/capture/stop` - Stop capture
- `POST /api/capture/rotate` - Rotate camera

**Audio:**
- `GET /api/audio/file` - Get audio file
- `GET /api/audio/last_info` - Get latest audio info

**Screen:**
- `GET/POST /api/screen` - Screen config
- `POST /api/screen/upload-background` - Upload background
- `GET/POST /api/screen/config` - Screen configuration

**Other:**
- `GET /api/logs` - Poll system logs
- `POST /api/snapshot` - Capture snapshot

### Frontend Components

| Component | Purpose |
|-----------|---------|
| `Login.tsx` | Login screen |
| `MainContent.tsx` | Main 3-column layout: Video Monitor + Business Panel + Logs |
| `VideoMonitor.tsx` | Camera preview with HLS streaming |
| `BusinessPanel.tsx` | Session/round management and evaluation controls |
| `RegularEvaluation.tsx` | AI evaluation interface |
| `ExpertEvaluation.tsx` | Expert evaluation interface |
| `EvaluationRecords.tsx` | Historical evaluation records |
| `ScreenPreview.tsx` - `/screen` route | Public score display screen |

### Key Directories

```
source/
├── src/
│   ├── app/              # Next.js App Router pages + API routes
│   ├── components/       # React components
│   ├── lib/              # Core business logic
│   └── types/            # TypeScript definitions
├── data/                 # JSON database storage
├── logs/                 # Application logs
├── hls/                  # HLS video chunks
├── audio/                # Recorded audio files
└── server.js             # Custom Next.js server
```

## Important Patterns

- **Database Operations**: Always use `ensureDb()` before accessing data; modifications auto-save via `saveToFile()`
- **Logging**: Use `logger.logInfo()`, `logger.logError()`, etc. - logs are written to both console and files
- **Time Format**: Use `getLocalTimeString()` for consistent timestamps
- **Cleanup**: Server handles SIGINT/SIGTERM to stop FFmpeg processes gracefully
