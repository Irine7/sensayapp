import { NextRequest, NextResponse } from 'next/server';

// Получить память реплики (историю чатов) по ID
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: replicaId } = await params;

		// Получаем API ключи из переменных окружения
		const apiKey = process.env.SENSAY_API_KEY;
		const orgId = process.env.SENSAY_ORG_ID;
		const userId = process.env.SENSAY_USER_ID;

		if (!apiKey || !orgId) {
			return NextResponse.json(
				{
					error:
						'Missing required API settings in environment variables (SENSAY_API_KEY, SENSAY_ORG_ID)',
				},
				{ status: 400 }
			);
		}

		// Выполняем запрос к Sensay API для получения истории чатов (памяти) реплики
		const url = `${
			process.env.SENSAY_REPLICA_API || 'https://api.sensay.io/v1/replicas'
		}/${replicaId}/chat/history`;
		console.log(`Sending GET request to: ${url}`);

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'X-ORGANIZATION-SECRET': apiKey,
				'X-USER-ID': userId || apiKey,
				'X-API-Version': '2025-03-25',
				'x-organization-id': orgId,
			},
		});

		console.log(`Response status: ${response.status} ${response.statusText}`);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Error response: ${errorText}`);
			return NextResponse.json(
				{
					error: `Failed to fetch replica memory: ${response.status} ${response.statusText}`,
					details: errorText,
				},
				{ status: response.status }
			);
		}

		const data = await response.json();
		console.log('Replica memory retrieved successfully');

		// Обрабатываем данные для удобного использования
		const memories =
			data.items?.map((item: any) => ({
				id: item.id.toString(),
				replicaUUID: replicaId,
				content: item.content,
				createdAt: item.created_at,
				sources: item.sources || [],
				role: item.role,
				source: item.source,
				user_uuid: item.user_uuid,
			})) || [];

		// Возвращаем данные памяти
		return NextResponse.json({
			success: true,
			memories,
			total: memories.length,
			replicaUUID: replicaId,
		});
	} catch (error) {
		console.error('Error in replica memory GET route:', error);
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json(
			{ error: `Failed to fetch replica memory: ${errorMessage}` },
			{ status: 500 }
		);
	}
}
