import { REPLICA_TEMPLATES, getReplicaTemplate } from './replica-templates';
// @ts-ignore
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

interface TrainingResult {
	success: boolean;
	knowledgeBaseIDs: number[];
	errors: string[];
}

export class ReplicaAutoTrainer {
	private apiKey: string;
	private orgId: string;

	constructor(apiKey: string, orgId: string) {
		this.apiKey = apiKey;
		this.orgId = orgId;
	}

	/**
	 * Автоматически обучает реплику на основе её типа
	 */
	async autoTrainReplica(
		replicaUuid: string,
		replicaName: string
	): Promise<TrainingResult> {
		const template = getReplicaTemplate(replicaName);

		if (!template) {
			return {
				success: false,
				knowledgeBaseIDs: [],
				errors: [`Template not found for replica: ${replicaName}`],
			};
		}

		const results: TrainingResult = {
			success: true,
			knowledgeBaseIDs: [],
			errors: [],
		};

		try {
			// 1. Обучаем системным сообщениям и поведению
			await this.trainSystemBehavior(replicaUuid, template, results);

			// 2. Обучаем специализированными материалами
			await this.trainSpecializedMaterials(replicaUuid, template, results);

			// 3. Обучаем примерами диалогов
			await this.trainExampleDialogues(replicaUuid, template, results);

			// 4. Обучаем метриками и оценками
			await this.trainMetrics(replicaUuid, template, results);

			results.success = results.errors.length === 0;
		} catch (error) {
			results.success = false;
			results.errors.push(
				`Training failed: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}

		return results;
	}

	/**
	 * Обучает реплику системному поведению
	 */
	private async trainSystemBehavior(
		replicaUuid: string,
		template: any,
		results: TrainingResult
	) {
		const systemTrainingContent = `
СИСТЕМНОЕ ПОВЕДЕНИЕ РЕПЛИКИ

Ты - ${template.name}, ${template.purpose}

ОСНОВНЫЕ ПРИНЦИПЫ:
${template.systemMessage}

СТИЛЬ ОБЩЕНИЯ:
- Используй дружелюбный, но профессиональный тон
- Задавай уточняющие вопросы для лучшего понимания
- Давай конкретные, actionable советы
- Используй примеры и аналогии для объяснения сложных концепций
- Будь терпеливым с новичками и поддерживающим с опытными

ПРИВЕТСТВИЕ:
${template.greeting}

ПРИМЕРНЫЕ ВОПРОСЫ ДЛЯ НАЧАЛА ДИАЛОГА:
${template.suggestedQuestions.map((q: string) => `- ${q}`).join('\n')}

ПОМНИ: Твоя главная цель - ${template.purpose}
`;

		try {
			const knowledgeBaseID = await this.createTrainingEntry(
				replicaUuid,
				systemTrainingContent,
				'Системное поведение'
			);
			results.knowledgeBaseIDs.push(knowledgeBaseID);
		} catch (error) {
			results.errors.push(
				`Failed to train system behavior: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	}

	/**
	 * Обучает реплику специализированными материалами
	 */
	private async trainSpecializedMaterials(
		replicaUuid: string,
		template: any,
		results: TrainingResult
	) {
		const materialPath = path.join(
			process.cwd(),
			'app/lib/training-materials',
			`${template.name.toLowerCase()}.md`
		);

		try {
			if (fs.existsSync(materialPath)) {
				const content = fs.readFileSync(materialPath, 'utf-8');
				const knowledgeBaseID = await this.createTrainingEntry(
					replicaUuid,
					content,
					`Специализированные материалы для ${template.name}`
				);
				results.knowledgeBaseIDs.push(knowledgeBaseID);
			}
		} catch (error) {
			results.errors.push(
				`Failed to train specialized materials: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	}

	/**
	 * Обучает реплику примерами диалогов
	 */
	private async trainExampleDialogues(
		replicaUuid: string,
		template: any,
		results: TrainingResult
	) {
		const dialogues = this.generateExampleDialogues(template);

		try {
			const knowledgeBaseID = await this.createTrainingEntry(
				replicaUuid,
				dialogues,
				`Примеры диалогов для ${template.name}`
			);
			results.knowledgeBaseIDs.push(knowledgeBaseID);
		} catch (error) {
			results.errors.push(
				`Failed to train example dialogues: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	}

	/**
	 * Обучает реплику метриками и оценками
	 */
	private async trainMetrics(
		replicaUuid: string,
		template: any,
		results: TrainingResult
	) {
		const metrics = this.generateMetricsForTemplate(template);

		try {
			const knowledgeBaseID = await this.createTrainingEntry(
				replicaUuid,
				metrics,
				`Метрики и оценки для ${template.name}`
			);
			results.knowledgeBaseIDs.push(knowledgeBaseID);
		} catch (error) {
			results.errors.push(
				`Failed to train metrics: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	}

	/**
	 * Создает обучающую запись в Sensay API
	 */
	private async createTrainingEntry(
		replicaUuid: string,
		content: string,
		title: string
	): Promise<number> {
		// Step 1: Create knowledge base entry
		const createResponse = await fetch(
			`https://api.sensay.io/v1/replicas/${replicaUuid}/training`,
			{
				method: 'POST',
				headers: {
					'X-ORGANIZATION-SECRET': this.apiKey,
					'Content-Type': 'application/json',
				},
			}
		);

		if (!createResponse.ok) {
			const error = await createResponse.json();
			throw new Error(`Failed to create knowledge base entry: ${error.error}`);
		}

		const createData = await createResponse.json();
		const knowledgeBaseID = createData.knowledgeBaseID;

		// Step 2: Update with content
		const updateResponse = await fetch(
			`https://api.sensay.io/v1/replicas/${replicaUuid}/training/${knowledgeBaseID}`,
			{
				method: 'PUT',
				headers: {
					'X-ORGANIZATION-SECRET': this.apiKey,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					rawText: content,
				}),
			}
		);

		if (!updateResponse.ok) {
			const error = await updateResponse.json();
			throw new Error(`Failed to update knowledge base entry: ${error.error}`);
		}

		return knowledgeBaseID;
	}

	/**
	 * Генерирует примеры диалогов для конкретного типа реплики
	 */
	private generateExampleDialogues(template: any): string {
		const baseDialogues = `
ПРИМЕРЫ УСПЕШНЫХ ДИАЛОГОВ

Диалог 1: Первый контакт
Пользователь: "Привет, это мое первое бизнес-событие"
${template.name}: "${this.getGreetingResponse(template)}"

Диалог 2: Углубленный разговор
Пользователь: "Расскажи больше о том, как ты можешь помочь"
${template.name}: "${this.getHelpResponse(template)}"

Диалог 3: Конкретная помощь
Пользователь: "У меня есть проблема с [конкретная проблема]"
${template.name}: "${this.getProblemSolvingResponse(template)}"

Диалог 4: Follow-up
${template.name}: "Как дела с тем, что мы обсуждали? Есть ли прогресс?"

ПОМНИ: Всегда адаптируй стиль общения под конкретного пользователя и его уровень опыта.
`;

		return baseDialogues;
	}

	/**
	 * Генерирует метрики для конкретного типа реплики
	 */
	private generateMetricsForTemplate(template: any): string {
		const metrics = {
			matchmaker: `
МЕТРИКИ УСПЕШНОСТИ MATCHMAKER

Количественные показатели:
- Количество проанализированных профилей
- Процент совместимости матчей
- Количество успешных знакомств
- Количество follow-up встреч
- Количество заключенных партнерств

Качественные показатели:
- Удовлетворенность пользователей матчами
- Глубина установленных связей
- Долгосрочность партнерств
- Развитие бизнеса участников

Целевые показатели:
- 80%+ пользователей получают релевантные матчи
- 60%+ матчей приводят к follow-up встречам
- 30%+ матчей развиваются в партнерства
`,

			mentor: `
МЕТРИКИ УСПЕШНОСТИ MENTOR

Количественные показатели:
- Количество проведенных консультаций
- Средняя продолжительность сессий
- Количество выполненных рекомендаций
- Рост метрик у клиентов
- Количество успешных pitch'ей

Качественные показатели:
- Уровень понимания клиентом рекомендаций
- Применимость советов на практике
- Достижение поставленных целей
- Развитие предпринимательских навыков

Целевые показатели:
- 90%+ клиентов понимают рекомендации
- 70%+ выполняют основные рекомендации
- 50%+ показывают улучшение метрик
- 40%+ успешно привлекают инвестиции
`,

			buddy: `
МЕТРИКИ УСПЕШНОСТИ BUDDY

Количественные показатели:
- Количество новых знакомств
- Уровень участия в событиях
- Количество заданных вопросов
- Количество полученных советов
- Количество follow-up встреч

Качественные показатели:
- Снижение тревожности
- Рост уверенности в себе
- Понимание бизнес-терминологии
- Активность в networking
- Удовлетворенность событием

Целевые показатели:
- 80%+ снижение уровня тревожности
- 90%+ понимание основных терминов
- 70%+ активное участие в networking
- 60%+ планируют участие в следующих событиях
`,
		};

		return metrics[template.name.toLowerCase() as keyof typeof metrics] || '';
	}

	/**
	 * Получает ответ на приветствие для конкретного типа реплики
	 */
	private getGreetingResponse(template: any): string {
		const responses = {
			matchmaker:
				'Отлично! Я помогу тебе найти идеальные деловые связи. Расскажи мне о своих бизнес-интересах и целях на это событие.',
			mentor:
				'Прекрасно! Я здесь, чтобы помочь тебе развить проект. Расскажи о своем стартапе и с какими вызовами сталкиваешься.',
			buddy:
				'Не волнуйся! Все когда-то были новичками. Я помогу тебе сориентироваться. Расскажи, что тебя больше всего интересует в бизнесе?',
		};

		return (
			responses[template.name.toLowerCase() as keyof typeof responses] ||
			template.greeting
		);
	}

	/**
	 * Получает ответ с предложением помощи
	 */
	private getHelpResponse(template: any): string {
		const responses = {
			matchmaker:
				'Я анализирую профили участников и нахожу идеальные совпадения для делового сотрудничества. Расскажи о своих интересах, и я найду для тебя релевантные контакты.',
			mentor:
				'Я даю экспертные консультации по развитию бизнеса, помогаю с pitch deck, стратегией и поиском инвесторов. Что тебя больше всего интересует?',
			buddy:
				'Я помогаю новичкам ориентироваться на бизнес-событиях, объясняю термины и предлагаю простые способы начать networking. С чего хочешь начать?',
		};

		return (
			responses[template.name.toLowerCase() as keyof typeof responses] ||
			'Я готов помочь тебе с твоими задачами.'
		);
	}

	/**
	 * Получает ответ на решение проблем
	 */
	private getProblemSolvingResponse(template: any): string {
		const responses = {
			matchmaker:
				'Давай разберем твою ситуацию. Сначала расскажи больше деталей, а я найду людей, которые могут помочь или с кем у тебя есть общие интересы.',
			mentor:
				'Понимаю твою проблему. Давай разработаем пошаговый план решения. Сначала расскажи больше о контексте и ресурсах, которые у тебя есть.',
			buddy:
				'Не переживай, это нормально сталкиваться с такими проблемами. Давай разберем это по шагам. Сначала объясни ситуацию простыми словами, и я помогу найти решение.',
		};

		return (
			responses[template.name.toLowerCase() as keyof typeof responses] ||
			'Давай разберем твою проблему и найдем решение.'
		);
	}

	/**
	 * Массовое обучение всех реплик
	 */
	async trainAllReplicas(
		replicas: Array<{ uuid: string; name: string }>
	): Promise<Record<string, TrainingResult>> {
		const results: Record<string, TrainingResult> = {};

		for (const replica of replicas) {
			console.log(`Training replica: ${replica.name}`);
			results[replica.uuid] = await this.autoTrainReplica(
				replica.uuid,
				replica.name
			);

			// Небольшая пауза между запросами
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}

		return results;
	}
}
