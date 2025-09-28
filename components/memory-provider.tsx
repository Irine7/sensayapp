'use client';

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	ReactNode,
} from 'react';

// Типы для памяти реплики
export interface ReplicaMemory {
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

export interface MemoryState {
	memories: ReplicaMemory[];
	isLoading: boolean;
	error: string | null;
	lastUpdated: string | null;
}

interface MemoryContextType {
	memoryState: MemoryState;
	loadMemories: (replicaUUID: string) => Promise<void>;
	refreshMemories: () => Promise<void>;
	clearMemories: () => void;
	addMemory: (memory: ReplicaMemory) => void;
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export function MemoryProvider({ children }: { children: ReactNode }) {
	const [memoryState, setMemoryState] = useState<MemoryState>({
		memories: [],
		isLoading: false,
		error: null,
		lastUpdated: null,
	});

	const loadMemories = useCallback(async (replicaUUID: string) => {
		// Проверяем, что UUID не пустой
		if (!replicaUUID || replicaUUID.trim() === '') {
			console.warn('Empty replica UUID provided to loadMemories');
			return;
		}

		setMemoryState((prev) => ({ ...prev, isLoading: true, error: null }));

		try {
			const response = await fetch(
				`/api/sensay/replicas/${replicaUUID}/memory`
			);

			if (!response.ok) {
				if (response.status === 404) {
					// Если реплика не найдена, это не критическая ошибка
					console.warn(`Replica ${replicaUUID} not found or has no memory`);
					setMemoryState((prev) => ({
						...prev,
						memories: [],
						isLoading: false,
						error: null,
						lastUpdated: new Date().toISOString(),
					}));
					return;
				}
				throw new Error(`Failed to load memories: ${response.statusText}`);
			}

			const data = await response.json();

			setMemoryState((prev) => ({
				...prev,
				memories: data.memories || [],
				isLoading: false,
				lastUpdated: new Date().toISOString(),
			}));
		} catch (error) {
			console.error('Error loading memories:', error);
			setMemoryState((prev) => ({
				...prev,
				isLoading: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}));
		}
	}, []);

	const refreshMemories = useCallback(async () => {
		if (memoryState.memories.length > 0) {
			const replicaUUID = memoryState.memories[0].replicaUUID;
			await loadMemories(replicaUUID);
		}
	}, [memoryState.memories, loadMemories]);

	const clearMemories = useCallback(() => {
		setMemoryState({
			memories: [],
			isLoading: false,
			error: null,
			lastUpdated: null,
		});
	}, []);

	const addMemory = useCallback((memory: ReplicaMemory) => {
		setMemoryState((prev) => ({
			...prev,
			memories: [memory, ...prev.memories],
		}));
	}, []);

	return (
		<MemoryContext.Provider
			value={{
				memoryState,
				loadMemories,
				refreshMemories,
				clearMemories,
				addMemory,
			}}
		>
			{children}
		</MemoryContext.Provider>
	);
}

export function useMemory() {
	const context = useContext(MemoryContext);
	if (context === undefined) {
		throw new Error('useMemory must be used within a MemoryProvider');
	}
	return context;
}
