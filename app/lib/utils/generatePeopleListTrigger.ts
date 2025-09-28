/**
 * Utility for generating people list navigation triggers
 * Used by AI agent to create navigation triggers
 */

export interface PeopleListTriggerPayload {
	category: 'investors' | 'mentors' | 'founders';
	query: string;
}

/**
 * Generates trigger for navigating to people list
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
 * Generates message with trigger for AI agent
 */
export function generatePeopleListMessage(
	category: 'investors' | 'mentors' | 'founders',
	query: string,
	additionalMessage?: string
): string {
	const trigger = generatePeopleListTrigger(category, query);

	const categoryNames = {
		investors: 'investors',
		mentors: 'mentors',
		founders: 'founders',
	};

	const baseMessage =
		additionalMessage ||
		`Here's the list of ${categoryNames[category]} matching your query "${query}":`;

	return `${baseMessage}\n\n${trigger}\n\nClick the link above to view the detailed list.`;
}

/**
 * Determines people category based on user query
 */
export function detectPeopleCategory(
	userQuery: string
): 'investors' | 'mentors' | 'founders' | null {
	const query = userQuery.toLowerCase();

	if (
		query.includes('investor') ||
		query.includes('investment') ||
		query.includes('fund') ||
		query.includes('capital')
	) {
		return 'investors';
	}

	if (
		query.includes('mentor') ||
		query.includes('advisor') ||
		query.includes('expert')
	) {
		return 'mentors';
	}

	if (
		query.includes('founder') ||
		query.includes('startup') ||
		query.includes('entrepreneur')
	) {
		return 'founders';
	}

	return null;
}

/**
 * Extracts search keywords from user query
 */
export function extractSearchKeywords(userQuery: string): string {
	// Remove stop words and keep key terms
	const stopWords = [
		'find',
		'looking',
		'need',
		'want',
		'show',
		'list',
		'people',
	];

	let keywords = userQuery.toLowerCase();

	stopWords.forEach((word) => {
		keywords = keywords.replace(new RegExp(`\\b${word}\\b`, 'g'), '');
	});

	return keywords.trim();
}
