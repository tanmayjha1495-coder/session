# Conversation Sessions API

A NestJS REST API for managing conversation sessions and events.

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm

### Installation

1. Clone the repository

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
PORT=3001
MONGO_HOST=mongodb://127.0.0.1:27017/sessions_db
```

4. Start MongoDB:
```bash
brew services start mongodb-community
```

## How to Run

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

The server runs at `http://localhost:3001`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions/sessions` | Create a new session |
| POST | `/api/sessions/sessions/:sessionId/events` | Add event to session |
| GET | `/api/sessions/sessions/:sessionId` | Get session with events |
| POST | `/api/sessions/sessions/:sessionId/complete` | Mark session as completed |

## Assumptions

- MongoDB is running locally on default port 27017
- Authentication is handled by an upstream API gateway
- Client provides unique `sessionId` and `eventId` values
- Timestamps are managed by the server
- Events are sorted by timestamp when retrieved
