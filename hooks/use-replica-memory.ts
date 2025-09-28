import { useEffect, useCallback } from 'react';
import { useReplica } from '@/components/replica-context';
import { useMemory } from '@/components/memory-provider';

/**
 * Хук для автоматической загрузки памяти реплики при выборе реплики
 */
export function useReplicaMemory() {
	const { selectedReplicaUuid } = useReplica();
	const { loadMemories, memoryState } = useMemory();

	// Мемоизируем функцию загрузки памяти
	const loadMemoriesCallback = useCallback(
		(replicaUUID: string) => {
			loadMemories(replicaUUID);
		},
		[loadMemories]
	);

	// Автоматически загружаем память при выборе реплики
	useEffect(() => {
		if (selectedReplicaUuid && selectedReplicaUuid.trim() !== '') {
			console.log(`Loading memory for replica: ${selectedReplicaUuid}`);
			loadMemoriesCallback(selectedReplicaUuid);
		}
	}, [selectedReplicaUuid, loadMemoriesCallback]);

	return {
		memoryState,
		loadMemories: loadMemoriesCallback,
	};
}
