/**
 * Утилита для генерации триггеров перехода к списку людей
 * Используется ИИ-агентом для создания навигационных триггеров
 */

export interface PeopleListTriggerPayload {
	category: 'investors' | 'mentors' | 'founders';
	query: string;
}

/**
 * Генерирует триггер для перехода к списку людей
 */
export function generatePeopleListTrigger(
	category: 'investors' | 'mentors' | 'founders',
	query: string
): string {
	const trigger = {
		action: 'showPeopleList',
		payload: {
			category,
			query,
		},
	};

	return `[TRIGGER]${JSON.stringify(trigger)}[/TRIGGER]`;
}

/**
 * Генерирует сообщение с триггером для ИИ-агента
 */
export function generatePeopleListMessage(
	category: 'investors' | 'mentors' | 'founders',
	query: string,
	additionalMessage?: string
): string {
	const trigger = generatePeopleListTrigger(category, query);

	const categoryNames = {
		investors: 'инвесторы',
		mentors: 'менторы',
		founders: 'основатели',
	};

	const baseMessage =
		additionalMessage ||
		`Вот список ${categoryNames[category]}, соответствующих вашему запросу "${query}":`;

	return `${baseMessage}\n\n${trigger}\n\nПерейдите по ссылке выше для просмотра подробного списка.`;
}

/**
 * Определяет категорию людей на основе запроса пользователя
 */
export function detectPeopleCategory(
	userQuery: string
): 'investors' | 'mentors' | 'founders' | null {
	const query = userQuery.toLowerCase();

	if (
		query.includes('инвестор') ||
		query.includes('investment') ||
		query.includes('фонд') ||
		query.includes('capital')
	) {
		return 'investors';
	}

	if (
		query.includes('ментор') ||
		query.includes('mentor') ||
		query.includes('советник') ||
		query.includes('эксперт')
	) {
		return 'mentors';
	}

	if (
		query.includes('основатель') ||
		query.includes('founder') ||
		query.includes('стартап') ||
		query.includes('предприниматель')
	) {
		return 'founders';
	}

	return null;
}

/**
 * Извлекает ключевые слова для поиска из запроса пользователя
 */
export function extractSearchKeywords(userQuery: string): string {
	// Убираем стоп-слова и оставляем ключевые термины
	const stopWords = [
		'найти',
		'ищу',
		'нужны',
		'хочу',
		'показать',
		'список',
		'люди',
	];

	let keywords = userQuery.toLowerCase();

	stopWords.forEach((word) => {
		keywords = keywords.replace(new RegExp(`\\b${word}\\b`, 'g'), '');
	});

	return keywords.trim();
}
