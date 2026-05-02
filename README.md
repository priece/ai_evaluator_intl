# AI Evaluator

AI evaluation system built with Next.js, supporting local camera video capture, AI automatic evaluation, and expert evaluation.

## Features

- **Camera Management**: Get local camera information, automatically select the first available camera
- **Real-time Video Display**: Display video in real-time through HLS streaming technology (2-second segments)
- **AI Automatic Evaluation**: AI automatic scoring for captured videos (0-100 points)
- **Expert Evaluation**: Support expert input reference scores for evaluation
- **Session Management**: Support creating new sessions, loading historical sessions, dynamically calculating rounds
- **Performance Management**: Support creating performances, starting/ending performances, starting/ending evaluations, publishing results
- **Publishing**: Results can be published directly after evaluation, status changes to "Published"
- **Highlight Display**: Currently operated round is highlighted, clicking round button automatically updates highlight
- **Evaluation Records**: Record each evaluation's session, round, evaluation value and time
- **Data Storage**: Use JSON file to store evaluation data (`data/database.json`)
- **Custom Logging System**: Support file and memory logs, keep 30 latest logs, support incremental retrieval
- **Large Screen Display**: Support independent large screen page, display AI scores and PNG sequence animations, show different animation effects based on score ranges
- **Large Screen Preview**: Display large screen preview in video monitoring area, automatically refresh preview content after clicking publish button
- **Production Deployment**: Support one-click packaging and deployment

## Tech Stack

- **Framework**: Next.js 14.2.10
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Video Processing**: FFmpeg + fluent-ffmpeg
- **Streaming**: HLS (HTTP Live Streaming)
- **Database**: JSON file storage
- **Process Management**: PM2 (optional)

## Project Structure

```
ai_evaluator/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── cameras/        # Camera endpoints
│   │   │   ├── capture/        # Video capture endpoints
│   │   │   ├── expert-evaluation/  # Expert evaluation endpoints
│   │   │   ├── logs/           # Log endpoints
│   │   │   ├── regular-evaluation/ # Regular evaluation endpoints
│   │   │   ├── rounds/         # Round endpoints
│   │   │   └── sessions/       # Session management endpoints
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main page
│   │   ├── screen/             # Large screen page
│   │   │   └── page.tsx        # Large screen display component
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── BusinessPanel.tsx   # Business panel component
│   │   ├── EvaluationRecords.tsx   # Evaluation records component
│   │   ├── ExpertEvaluation.tsx    # Expert evaluation component
│   │   ├── MainContent.tsx     # Main content component
│   │   ├── RegularEvaluation.tsx   # Regular evaluation component
│   │   ├── ScreenPreview.tsx   # Large screen preview component
│   │   └── VideoMonitor.tsx    # Video monitor component
│   ├── lib/                    # Utility library
│   │   ├── capture.js          # Video capture state management
│   │   ├── db.ts               # Database operations
│   │   └── logger.ts           # Logging system
│   └── types/                  # TypeScript type definitions
│       └── index.ts
├── data/                       # Data storage directory (generated at runtime)
├── hls/                        # HLS video stream files (generated at runtime)
├── logs/                       # Log files (generated at runtime)
├── .next/                      # Build output
├── server.js                   # Custom server
├── next.config.js              # Next.js configuration
├── package.json                # Project dependencies
├── start-production.bat        # Production environment startup script
├── package-production.bat      # Production deployment package script
├── ecosystem.config.js         # PM2 configuration file
└── deploy.md                   # Detailed deployment documentation
```

## Data Model

### Session Table
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| session_id | UUID | Session number |
| name | string | Session name |
| created_at | string | Creation time |

### Round Table
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| session_id | UUID | Session number |
| round_number | number | Round number (starting from 1) |
| status | number | Round status (0-5) |
| created_at | string | Creation time |
| performance_start_time | string | Performance start time |
| performance_end_time | string | Performance end time |
| evaluation_start_time | string | Evaluation start time |
| evaluation_end_time | string | Evaluation end time |
| round_end_time | string | Round end time |
| score | number | AI evaluation score |

> Note: The `submit` field is deprecated, publish status is represented by `status=5`

### Regular Evaluation List
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| session_id | UUID | Session number |
| round | number | Round number (starting from 1) |
| score | number | AI evaluation result (0-100) |
| evaluated_at | string | Evaluation time |

### Expert Evaluation List
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| session_id | UUID | Session number |
| round | number | Round number (starting from 1) |
| expert_score | number | Expert evaluation result (0-100) |
| evaluated_at | string | Evaluation time |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/check` - Check login status

### Camera
- `GET /api/cameras` - Get local camera list

### Video Capture
- `POST /api/capture/start` - Start capture (parameters: cameraId, audioId)
- `POST /api/capture/stop` - Stop capture
- `POST /api/capture/rotate` - Rotate video (parameters: direction: 'left' | 'right')

### HLS Video Stream
- `/hls/stream.m3u8` - HLS video stream playback URL
- `/hls/stream_*.ts` - Video segment files (2 seconds/segment)

### Evaluation
- `POST /api/regular-evaluation` - Submit regular evaluation
- `POST /api/expert-evaluation` - Submit expert evaluation

### Sessions
- `GET /api/sessions` - Get all sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions/[sessionId]` - Get specific session details and evaluation records
- `PUT /api/sessions/[sessionId]` - Update session name

### Rounds
- `GET /api/rounds?sessionId=xxx` - Get round list for specific session
- `POST /api/rounds` - Create or update round (action: create/startPerformance/endPerformance/startEvaluation/publish)

### Round Status
| Status | Description |
|--------|-------------|
| 0 | Not started |
| 1 | Performance in progress |
| 2 | Performance ended |
| 3 | Evaluation in progress |
| 4 | Evaluated |
| 5 | Published |

### Logs
- `GET /api/logs` - Get logs (optional parameter: from=timestamp, returns logs after that time)

### Large Screen
- `GET /api/screen` - Get large screen data (published round information)
- `GET /api/screen/config` - Get large screen configuration (background image, animation sequences, etc.)

#### Large Screen Animation Configuration
Configure in `config.json`:
```json
{
  "screen": {
    "background": "./public/background/background.png",
    "motions": [
      { "id": "motion_00", "image": "./public/motions/motion_00/" },
      { "id": "motion_01", "image": "./public/motions/motion_01/" },
      { "id": "motion_02", "image": "./public/motions/motion_02/" }
    ]
  }
}
```

Place PNG sequence images in each motion folder (file names are numbers), the system will automatically loop play.

#### Score Range Animation
| Score Range | Animation |
|-------------|-----------|
| 0-39 | motion_00 |
| 40-79 | motion_01 |
| 80-100 | motion_02 |

## Installation & Running

### Requirements
- Node.js 18+
- Windows system
- FFmpeg (needs to be installed separately and added to PATH)

### Install FFmpeg
1. Download: https://ffmpeg.org/download.html
2. Extract to `C:\ffmpeg`
3. Add to system PATH: `C:\ffmpeg\bin`
4. Verify: `ffmpeg -version`

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

The service will start at http://localhost:3000

### Production Mode Build

```bash
# Build
npm run build

# Start production server
npm run start
```

## Production Deployment

### Method 1: Using Packaging Script (Recommended)

```bash
# One-click package production deployment package
package-production.bat
```

The generated `ai-evaluator-production/` directory contains all necessary files.

### Method 2: Manual Deployment

**Required Files:**
- `.next/` - Build output
- `src/lib/` - Backend code
- `server.js`, `package.json`, `package-lock.json`
- `.env.production`, `next.config.js`
- `start-production.bat`, `ecosystem.config.js`

**Deployment Steps:**
1. Copy files to server
2. Install dependencies: `npm ci --only=production`
3. Start service: `start-production.bat` or `pm2 start ecosystem.config.js`

See [deploy.md](deploy.md) for detailed deployment instructions.

## Usage Instructions

### Login
1. Visit http://localhost:3000
2. Enter username and password (default: admin/admin)

### Video Monitoring
1. Select camera and audio source
2. Click "Start Capture" to start video stream
3. Support left/right 90-degree video rotation

### Session and Performance Management
1. Click "New Session" to create evaluation session
2. After selecting session, click "New Performance" to create new round
3. Click round card to highlight current round
4. Performance workflow:
   - Click "Start Performance" to start recording
   - Click "End Performance" to stop recording
   - Click "Start Evaluation" for AI scoring
   - After evaluation completes, click "Publish" to publish results, status changes to "Published"

### AI Evaluation
1. Click "New Session" to create evaluation session
2. Click "Start Evaluation" for AI scoring

### Expert Evaluation
1. Go to "Expert Evaluation" page
2. Enter expert score (0-100)
3. Click "Submit Evaluation" to save score

### Evaluation Records
1. Go to "Evaluation Records" page
2. View all historical evaluation records
3. Includes session number, round, evaluation result and time

### System Logs
- Real-time display of system operation logs
- Auto polling updates (every 2 seconds)
- Support scrolling to view historical logs

## Configuration

### Environment Variables (.env.production)
```
PORT=3000                    # Service port
DATA_DIR=./data              # Data directory
HLS_DIR=./hls                # HLS video directory
LOG_DIR=./logs               # Log directory
LOG_LEVEL=info               # Log level
NODE_ENV=production          # Runtime environment
```

### FFmpeg Configuration
Video segment parameters (`src/app/api/capture/start/route.ts`):
- Segment duration: 2 seconds
- Video codec: H.264
- Audio codec: AAC
- Bitrate: 1000kbps

### Log Configuration
- Log file location: `logs/` directory
- Log file format: `server-yyyyMMdd-hhmmss.log`
- Memory logs: Keep 30 latest logs
- Log levels: INFO, WARN, ERROR, DEBUG

## Security Design

### Frontend-Backend Separated Data Access
- **Frontend components** do not directly access the database, all data operations go through API endpoints
- **Backend API** uniformly handles database operations to ensure data security
- **Database module** is only used in server-side API routes

### Data Flow
```
Frontend Components → API Routes → Database Module → JSON Files
```

## Logs

Server logs are saved in the `logs/` directory, with filename format `server-yyyyMMdd-hhmmss.log`.

## License

Private Project
