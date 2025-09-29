# Replica Memory System

## Overview

Added global state system for storing and managing replica memory from Sensay API. Memory is automatically loaded when selecting a replica and is available throughout the application.

## Components

### 1. MemoryProvider (`components/memory-provider.tsx`)

Global state provider for managing replica memory:

```typescript
interface ReplicaMemory {
	id: string;
	replicaUUID: string;
	content: string;
	createdAt: string;
	sources?: Array<{
		id: number;
		name: string;
		content: string;
		score: number;
		status: 'scored' | 'unscored';
		created_at: string;
	}>;
	role: 'user' | 'assistant';
	source: 'discord' | 'telegram' | 'embed' | 'web' | 'telegram_autopilot';
	user_uuid: string;
}
```

**Methods:**

- `loadMemories(replicaUUID: string)` - load replica memory
- `refreshMemories()` - refresh current memory
- `clearMemories()` - clear memory
- `addMemory(memory: ReplicaMemory)` - add memory entry

### 2. API Endpoint (`app/api/sensay/replicas/[id]/memory/route.ts`)

GET endpoint for retrieving replica memory:

```
GET /api/sensay/replicas/{replicaUUID}/memory
```

Returns:

```json
{
  "memories": [
    {
      "id": "memory_id",
      "replicaUUID": "replica_uuid",
      "content": "Memory content",
      "createdAt": "2024-01-01T00:00:00Z",
      "sources": [...],
      "role": "user",
      "source": "web",
      "user_uuid": "user_uuid"
    }
  ]
}
```

### 3. Hook (`hooks/use-replica-memory.ts`)

Custom hook for using memory in components:

```typescript
const {
	memories,
	loading,
	error,
	loadMemories,
	refreshMemories,
	clearMemories,
	addMemory,
} = useReplicaMemory();
```

## Usage

### 1. Wrap your app with MemoryProvider

```tsx
// app/layout.tsx
import { MemoryProvider } from '@/components/memory-provider';

export default function RootLayout({ children }) {
	return (
		<html>
			<body>
				<MemoryProvider>{children}</MemoryProvider>
			</body>
		</html>
	);
}
```

### 2. Use memory in components

```tsx
import { useReplicaMemory } from '@/hooks/use-replica-memory';

function MyComponent() {
	const { memories, loadMemories } = useReplicaMemory();

	useEffect(() => {
		loadMemories('replica-uuid');
	}, []);

	return (
		<div>
			{memories.map((memory) => (
				<div key={memory.id}>{memory.content}</div>
			))}
		</div>
	);
}
```

## Features

- **Automatic loading**: Memory loads when replica is selected
- **Global state**: Available throughout the application
- **Real-time updates**: Memory refreshes automatically
- **Error handling**: Proper error states and loading indicators
- **Type safety**: Full TypeScript support

## API Integration

The system integrates with Sensay API memory endpoints:

- Memory retrieval
- Memory management
- Source tracking
- User association

## Error Handling

The system includes comprehensive error handling:

- Network errors
- API errors
- Loading states
- Empty states

## Performance

- Memory is cached in global state
- Automatic cleanup on replica change
- Efficient re-renders with React hooks
