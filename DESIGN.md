# Design Document

## 1. How did you ensure idempotency?

Using `findOneAndUpdate` with `upsert: true`:

- **Session Creation**: Uses `sessionId` as unique key with `$set` operator. Duplicate requests update the existing session with new values.
- **Event Creation**: Uses `sessionId` + `eventId` as compound lookup with `$setOnInsert` operator. Same event ID won't create duplicates and existing events remain unchanged.

## 2. How does your design behave under concurrent requests?

- `findOneAndUpdate` is atomic at document level in MongoDB.
- Unique index on `sessionId` in ConversationSession prevents duplicate sessions.
- Compound lookup on `sessionId` + `eventId` in ConversationEvent prevents duplicate events.
- For sessions: Last write wins for concurrent updates (using `$set`).
- For events: First write wins for concurrent inserts (using `$setOnInsert`).

## 3. What MongoDB indexes did you choose and why?

| Collection | Index | Reason |
|------------|-------|--------|
| `ConversationSession` | `{ sessionId: 1 }` unique | Primary lookup key, ensures session uniqueness |
| `ConversationEvent` | `{ sessionId: 1, eventId: 1 }` | Compound lookup for event deduplication and session-based queries |
| `ConversationEvent` | `{ sessionId: 1, timestamp: 1 }` | Efficient retrieval of events sorted by timestamp |

## 4. Schema Design

### ConversationSession
| Field | Type | Description |
|-------|------|-------------|
| `sessionId` | String (unique) | Primary identifier for the session |
| `status` | Enum | Session state: `initiated`, `active`, `completed`, `failed` |
| `language` | String | Language of the conversation |
| `startedAt` | Date | When the session started |
| `endedAt` | Date (nullable) | When the session ended |
| `metadata` | Object | Additional session metadata |

### ConversationEvent
| Field | Type | Description |
|-------|------|-------------|
| `eventId` | String | Unique event identifier |
| `sessionId` | String (ref) | Reference to parent session |
| `type` | Enum | Event type: `user_speech`, `bot_speech`, `system` |
| `payload` | Object | Event-specific data |
| `timestamp` | Date | When the event occurred |

## 5. How would you scale this system for millions of sessions per day?

1. **Sharding**: Distribute data across multiple MongoDB nodes using `sessionId` as shard key
2. **Read Replicas**: Route read queries to secondary nodes to reduce load on primary
3. **Caching**: Use Redis to cache frequently accessed sessions
4. **Message Queue**: Use Kafka or SQS to buffer high-volume event writes
5. **TTL Index**: Automatically delete old sessions using MongoDB TTL indexes
6. **Pagination**: Events are fetched with `limit` and `offset` to handle large event sets efficiently

## 6. What did you intentionally keep out of scope, and why?

| Excluded | Reasoning |
|----------|-----------|
| Authentication | Assumed to be handled by API gateway or upstream service |
| Rate Limiting | Better handled at infrastructure level (load balancer, API gateway) |
| WebSocket | REST API is sufficient for the current requirements |
| Distributed Tracing | Depends on the deployment environment and observability stack |
| Event Deletion | Not required per current requirements; can be added if needed |
