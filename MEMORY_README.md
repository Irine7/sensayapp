# Система памяти реплики

## Обзор

Добавлена глобальная система состояния для хранения и управления памятью реплики из Sensay API. Память автоматически загружается при выборе реплики и доступна во всем приложении.

## Компоненты

### 1. MemoryProvider (`components/memory-provider.tsx`)

Глобальный провайдер состояния для управления памятью реплики:

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

**Методы:**

- `loadMemories(replicaUUID: string)` - загрузить память реплики
- `refreshMemories()` - обновить текущую память
- `clearMemories()` - очистить память
- `addMemory(memory: ReplicaMemory)` - добавить запись в память

### 2. API Endpoint (`app/api/sensay/replicas/[id]/memory/route.ts`)

GET endpoint для получения памяти реплики:

```
GET /api/sensay/replicas/{replicaUUID}/memory
```

Возвращает:

```json
{
  "success": true,
  "memories": [...],
  "total": 10,
  "replicaUUID": "uuid"
}
```

### 3. Хук useReplicaMemory (`hooks/use-replica-memory.ts`)

Автоматически загружает память при выборе реплики:

```typescript
const { memoryState, loadMemories } = useReplicaMemory();
```

### 4. Тестовая страница (`app/test/page.tsx`)

Страница `/test` для просмотра и тестирования памяти реплики:

- Ввод UUID реплики
- Загрузка памяти
- Поиск по содержимому
- Отображение статистики
- Просмотр источников RAG

## Использование

### Автоматическая загрузка

Память автоматически загружается при выборе реплики:

```typescript
import { useReplicaMemory } from '@/hooks/use-replica-memory';

function MyComponent() {
	const { memoryState } = useReplicaMemory();

	// memoryState.memories содержит загруженную память
	// memoryState.isLoading показывает статус загрузки
	// memoryState.error содержит ошибки
}
```

### Ручная загрузка

```typescript
import { useMemory } from '@/components/memory-provider';

function MyComponent() {
	const { loadMemories, memoryState } = useMemory();

	const handleLoad = async () => {
		await loadMemories('replica-uuid');
	};
}
```

### Отображение памяти

```typescript
{
	memoryState.memories.map((memory) => (
		<div key={memory.id}>
			<h3>{memory.role === 'user' ? 'Пользователь' : 'Реплика'}</h3>
			<p>{memory.content}</p>
			<small>{new Date(memory.createdAt).toLocaleString()}</small>
		</div>
	));
}
```

## Интеграция

Провайдер интегрирован в `app/layout.tsx`:

```typescript
<MemoryProvider>
	<ChatProvider>{/* остальные компоненты */}</ChatProvider>
</MemoryProvider>
```

## Тестирование

1. Перейдите на `/test`
2. Введите UUID реплики
3. Нажмите "Загрузить память"
4. Просмотрите загруженные данные
5. Используйте поиск для фильтрации

## Особенности

- **Автоматическая загрузка**: Память загружается при выборе реплики
- **Глобальное состояние**: Доступно во всем приложении
- **RAG источники**: Отображение источников информации
- **Поиск**: Фильтрация по содержимому
- **Статистика**: Подсчет сообщений и источников
- **Обработка ошибок**: Показ ошибок загрузки

## API Endpoints

- `GET /api/sensay/replicas/{id}/memory` - получить память реплики
- Использует существующие настройки Sensay API
- Поддерживает все типы источников (web, discord, telegram, etc.)
