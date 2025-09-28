import { NextResponse } from 'next/server';
import { ReplicaAutoTrainer } from '@/app/lib/replica-auto-trainer';
import { fetchReplicas } from '@/app/lib/api/sensay-replicas-client';

// Получаем API ключи из переменных окружения
const SENSAY_API_KEY = process.env.SENSAY_API_KEY || '';
const SENSAY_ORG_ID = process.env.SENSAY_ORG_ID || '';

export async function POST(request: Request) {
	try {
		// Проверяем API ключи
		if (!SENSAY_API_KEY || !SENSAY_ORG_ID) {
			return NextResponse.json(
				{ error: 'Missing API keys. Please check environment variables.' },
				{ status: 500 }
			);
		}

		const body = await request.json();
		const { replicaUuid, replicaName, trainAll = false } = body;

		const trainer = new ReplicaAutoTrainer(SENSAY_API_KEY, SENSAY_ORG_ID);

		if (trainAll) {
			// Обучаем все реплики
			const replicas = await fetchReplicas();
			const replicaList = replicas.map((r) => ({ uuid: r.uuid, name: r.name }));

			const results = await trainer.trainAllReplicas(replicaList);

			const summary = {
				totalReplicas: replicas.length,
				successful: Object.values(results).filter((r) => r.success).length,
				failed: Object.values(results).filter((r) => !r.success).length,
				results,
			};

			return NextResponse.json({
				success: true,
				message: `Auto-training completed for ${replicaList.length} replicas`,
				summary,
			});
		} else {
			// Обучаем конкретную реплику
			if (!replicaUuid || !replicaName) {
				return NextResponse.json(
					{ error: 'replicaUuid and replicaName are required' },
					{ status: 400 }
				);
			}

			const result = await trainer.autoTrainReplica(replicaUuid, replicaName);

			return NextResponse.json({
				success: result.success,
				message: result.success
					? `Replica "${replicaName}" trained successfully`
					: `Failed to train replica "${replicaName}"`,
				result,
			});
		}
	} catch (error) {
		console.error('Error in auto-training:', error);
		return NextResponse.json(
			{
				error: 'Failed to perform auto-training',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}

export async function GET() {
	return NextResponse.json({
		message: 'Auto-training endpoint is available',
		usage: {
			'POST /api/sensay/auto-train': {
				description: 'Train a specific replica or all replicas',
				parameters: {
					replicaUuid: 'string (required for single replica training)',
					replicaName: 'string (required for single replica training)',
					trainAll: 'boolean (optional, defaults to false)',
				},
				examples: {
					'Train single replica': {
						replicaUuid: 'uuid-here',
						replicaName: 'Matchmaker',
					},
					'Train all replicas': {
						trainAll: true,
					},
				},
			},
		},
	});
}
