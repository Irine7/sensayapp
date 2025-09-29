'use client';

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { useChat } from './chat-provider';
import { extractChatTrigger } from '@/app/lib/utils/parseTrigger';

interface Person {
	id: string;
	name: string;
	role: string;
	company: string;
	description: string;
	location?: string;
	expertise?: string[];
	matchPercentage?: number;
	isBestMatch?: boolean;
}

interface PeopleFromChat {
	category: string;
	query: string;
	people: Person[];
	timestamp: number;
}

interface PeopleContextType {
	peopleFromChat: PeopleFromChat | null;
	setPeopleFromChat: (people: PeopleFromChat | null) => void;
	clearPeopleFromChat: () => void;
}

const PeopleContext = createContext<PeopleContextType | undefined>(undefined);

export function PeopleProvider({ children }: { children: ReactNode }) {
	const [peopleFromChat, setPeopleFromChat] = useState<PeopleFromChat | null>(
		null
	);
	const { messages } = useChat();

	// Clear people list
	const clearPeopleFromChat = () => {
		setPeopleFromChat(null);
	};

	// Track messages to extract people lists
	useEffect(() => {
		if (!messages.length) return;

		// Ищем последнее сообщение ассистента
		const lastAssistantMessage = [...messages]
			.reverse()
			.find((msg) => msg.role === 'assistant');

		if (!lastAssistantMessage) return;

		const trigger = extractChatTrigger(lastAssistantMessage.content);

		// Если есть триггер showPeopleList, используем его
		if (trigger && trigger.action === 'showPeopleList') {
			const people = extractPeopleFromMessage(lastAssistantMessage.content);
			console.log('🔍 Extracted people from trigger:', people);

			if (people.length > 0) {
				// Ранжируем людей по запросу пользователя
				const rankedPeople = rankPeopleByMatch(people, trigger.payload.query);
				console.log('🔍 Ranked people:', rankedPeople);

				setPeopleFromChat({
					category: trigger.payload.category,
					query: trigger.payload.query,
					people: rankedPeople,
					timestamp: lastAssistantMessage.timestamp,
				});
			}
		} else {
			// Если нет триггера, пытаемся извлечь людей из обычного сообщения
			const people = extractPeopleFromMessage(lastAssistantMessage.content);
			console.log('🔍 Extracted people from message:', people);

			if (people.length > 0) {
				// Ранжируем людей по общему запросу
				const rankedPeople = rankPeopleByMatch(people, 'From replica message');
				console.log('🔍 Ranked people:', rankedPeople);

				setPeopleFromChat({
					category: 'general',
					query: 'From replica message',
					people: rankedPeople,
					timestamp: lastAssistantMessage.timestamp,
				});
			}
		}
	}, [messages]);

	return (
		<PeopleContext.Provider
			value={{
				peopleFromChat,
				setPeopleFromChat,
				clearPeopleFromChat,
			}}
		>
			{children}
		</PeopleContext.Provider>
	);
}

export function usePeopleFromChat() {
	const context = useContext(PeopleContext);
	if (context === undefined) {
		throw new Error('usePeopleFromChat must be used within a PeopleProvider');
	}
	return context;
}

/**
 * Вычисляет процент совпадения между запросом пользователя и профилем человека
 */
function calculateMatchPercentage(userQuery: string, person: Person): number {
	if (!userQuery) return 0; // Если запрос пустой, возвращаем 0%
	const query = userQuery.toLowerCase();
	const queryWords = query.split(/\s+/).filter((word) => word.length > 2);

	let score = 0;
	let maxScore = 100;

	// Ключевые слова для разных типов инвесторов и советников
	const investorKeywords = [
		'инвестор',
		'investor',
		'angel',
		'ангел',
		'vc',
		'venture',
		'capital',
		'фонд',
		'fund',
		'partner',
		'партнер',
	];
	const advisorKeywords = [
		'советник',
		'advisor',
		'mentor',
		'ментор',
		'коуч',
		'coach',
		'консультант',
		'consultant',
		'expert',
		'эксперт',
	];
	const aiKeywords = [
		'ai',
		'artificial intelligence',
		'искусственный интеллект',
		'машинное обучение',
		'machine learning',
		'startup',
		'стартап',
		'tech',
		'технологии',
		'technology',
		'innovation',
		'инновации',
		'software',
		'софт',
	];
	const stageKeywords = [
		'pre-seed',
		'seed',
		'series a',
		'series b',
		'early stage',
		'ранняя стадия',
		'начальная стадия',
		'early',
		'начальная',
	];

	// Базовая оценка за наличие информации (повышаем с 10 до 25)
	if (person.role && person.role !== 'Specialist') {
		score += 25;
	}

	// Проверяем соответствие роли
	if (person.role) {
		const role = person.role.toLowerCase();

		// Если ищем инвесторов - повышаем баллы
		if (investorKeywords.some((keyword) => query.includes(keyword))) {
			if (investorKeywords.some((keyword) => role.includes(keyword))) {
				score += 40; // было 30
			} else {
				// Даже если роль не точно совпадает, но есть связь с инвестициями
				if (
					role.includes('investment') ||
					role.includes('invest') ||
					role.includes('fund') ||
					role.includes('capital')
				) {
					score += 25;
				}
			}
		}

		// Если ищем советников - повышаем баллы
		if (advisorKeywords.some((keyword) => query.includes(keyword))) {
			if (advisorKeywords.some((keyword) => role.includes(keyword))) {
				score += 40; // было 30
			} else {
				// Даже если роль не точно совпадает, но есть связь с консультированием
				if (
					role.includes('consult') ||
					role.includes('advise') ||
					role.includes('expert') ||
					role.includes('director')
				) {
					score += 25;
				}
			}
		}

		// Проверяем соответствие области (AI, tech, etc.) - повышаем баллы
		if (aiKeywords.some((keyword) => query.includes(keyword))) {
			if (
				aiKeywords.some((keyword) => role.includes(keyword)) ||
				aiKeywords.some((keyword) =>
					person.description?.toLowerCase().includes(keyword)
				)
			) {
				score += 35; // было 25
			} else {
				// Дополнительные баллы за tech-роли
				if (
					role.includes('tech') ||
					role.includes('software') ||
					role.includes('digital') ||
					role.includes('innovation')
				) {
					score += 20;
				}
			}
		}

		// Проверяем стадию инвестирования
		if (stageKeywords.some((keyword) => query.includes(keyword))) {
			if (
				stageKeywords.some((keyword) => role.includes(keyword)) ||
				stageKeywords.some((keyword) =>
					person.description?.toLowerCase().includes(keyword)
				)
			) {
				score += 25; // было 20
			}
		}
	}

	// Проверяем соответствие описания - делаем более щедрым
	if (person.description) {
		const description = person.description.toLowerCase();

		// Ищем ключевые слова из запроса в описании - повышаем баллы
		let descriptionMatches = 0;
		queryWords.forEach((word) => {
			if (description.includes(word)) {
				descriptionMatches++;
				score += 8; // было 5
			}
		});

		// Бонус за множественные совпадения
		if (descriptionMatches >= 2) {
			score += 10;
		}

		// Дополнительные баллы за соответствие тематике - повышаем
		if (aiKeywords.some((keyword) => query.includes(keyword))) {
			if (aiKeywords.some((keyword) => description.includes(keyword))) {
				score += 25; // было 15
			}
		}

		// Бонус за длинное и информативное описание
		if (description.length > 50) {
			score += 5;
		}
	}

	// Проверяем экспертизу - делаем более щедрым
	if (person.expertise && person.expertise.length > 0) {
		let expertiseMatches = 0;
		person.expertise.forEach((skill) => {
			const skillLower = skill.toLowerCase();

			// Проверяем соответствие AI/tech ключевым словам
			if (aiKeywords.some((keyword) => query.includes(keyword))) {
				if (aiKeywords.some((keyword) => skillLower.includes(keyword))) {
					expertiseMatches++;
					score += 15; // было 10
				}
			}

			// Проверяем соответствие любым словам из запроса
			queryWords.forEach((word) => {
				if (skillLower.includes(word)) {
					expertiseMatches++;
					score += 8;
				}
			});
		});

		// Бонус за множественные совпадения в экспертизе
		if (expertiseMatches >= 2) {
			score += 10;
		}
	}

	// Дополнительные бонусы за качество данных
	if (
		person.company &&
		person.company !== '' &&
		person.company !== 'Not specified'
	) {
		score += 5;
	}

	if (person.location) {
		score += 3;
	}

	// Если нет специальных совпадений, но есть базовая информация - даем минимум 20%
	if (score < 20 && (person.role || person.description)) {
		score = 20;
	}

	// Ограничиваем максимальный балл
	return Math.min(score, maxScore);
}

/**
 * Ранжирует список людей по проценту совпадения
 */
function rankPeopleByMatch(people: Person[], userQuery: string): Person[] {
	const peopleWithScores = people
		.map((person) => ({
			...person,
			matchPercentage: calculateMatchPercentage(userQuery, person),
		}))
		.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));

	// Обеспечиваем уникальность процентов, добавляя небольшие различия
	const uniqueScores = new Set<number>();
	return peopleWithScores.map((person, index) => {
		let finalScore = person.matchPercentage || 0;

		// Если такой процент уже существует, уменьшаем его на небольшую величину
		while (uniqueScores.has(finalScore) && finalScore > 0) {
			finalScore -= 0.1; // Уменьшаем на 0.1%
		}

		// Округляем до одного знака после запятой
		finalScore = Math.round(finalScore * 10) / 10;

		uniqueScores.add(finalScore);

		return {
			...person,
			matchPercentage: finalScore,
			isBestMatch: index === 0,
		};
	});
}

/**
 * Извлекает список людей из текста сообщения реплики
 * Ищет имена людей в тексте и создает объекты Person
 */
function extractPeopleFromMessage(messageContent: string): Person[] {
	console.log(
		'🔍 Extracting people from message:',
		messageContent.substring(0, 200) + '...'
	);
	console.log('🔍 Full message length:', messageContent.length);

	// Проверяем, есть ли в тексте имя с апострофом
	const apostropheMatch = messageContent.match(/Джеймс[^а-яё]*О[^а-яё]*Коннор/);
	if (apostropheMatch) {
		console.log('🔍 Found "Джеймс О\'Коннор" variant:', apostropheMatch[0]);
		console.log(
			'🔍 Character codes:',
			Array.from(apostropheMatch[0]).map((c) => c.charCodeAt(0))
		);
	}

	// Тестируем простой паттерн для жирного текста
	const simpleTest = messageContent.match(/\*\*([^*]+)\*\*/g);
	console.log('🔍 Simple bold text test:', simpleTest);
	const people: Person[] = [];

	// Расширенные паттерны для поиска имен людей в различных форматах
	const namePatterns = [
		// Имена в формате **Имя Фамилия** (жирный текст) - поддерживает различные типы апострофов и дефисов
		/\*\*([А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*)\*\*/gm,
		// Имена в формате *Имя Фамилия* (курсив) - поддерживает различные типы апострофов и дефисов
		/\*([А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*)\*/gm,
		// Простые списки с маркерами (русские и английские имена) - поддерживает апострофы и дефисы
		/(?:^|\n)[\s]*[-•*]\s*([А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*)/gm,
		// Нумерованные списки - поддерживает апострофы и дефисы
		/(?:^|\n)[\s]*\d+\.\s*([А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*)/gm,
		// Имена в кавычках - поддерживает апострофы и дефисы
		/"([А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*)"/gm,
		// Имена после двоеточия - поддерживает апострофы и дефисы
		/:\s*([А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*)/gm,
		// Имена в начале строки - поддерживает апострофы и дефисы
		/(?:^|\n)\s*([А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*)/gm,
		// Имена после "Вот" или "Here" - поддерживает апострофы и дефисы
		/(?:Вот|Here|вот|here)[^:]*:\s*([А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*)/gm,
		// Имена в простых списках без маркеров - поддерживает апострофы и дефисы
		/(?:^|\n)\s*([А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*)\s*[–-]/gm,
		// Имена после "Специалисты" или "Experts" - поддерживает апострофы и дефисы
		/(?:Специалисты|Experts|специалисты|experts)[^:]*:\s*([А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*)/gm,
		// Имена в формате "1. Имя Фамилия - описание" - поддерживает различные типы апострофов и дефисов
		/(?:^|\n)\s*\d+\.\s*([А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*)\s*[–-]/gm,
		// Имена в формате "• Имя Фамилия: описание" - поддерживает различные типы апострофов и дефисов
		/(?:^|\n)\s*[•*]\s*([А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*)\s*:/gm,
		// Имена в формате "Имя Фамилия (роль)" - поддерживает различные типы апострофов и дефисов
		/(?:^|\n)\s*([А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*)\s*\(/gm,
		// Имена в формате "Имя Фамилия — описание" - поддерживает различные типы апострофов и дефисов
		/(?:^|\n)\s*([А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*)\s*—/gm,
		// Имена в формате "Имя Фамилия, роль" - поддерживает различные типы апострофов и дефисов
		/(?:^|\n)\s*([А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*)\s*,/gm,
		// Специальный паттерн для "Вот ключевые контакты" - поддерживает различные типы апострофов и дефисов
		/(?:Вот ключевые контакты|Here are key contacts|ключевые контакты|key contacts)[^:]*:\s*(?:^|\n)[\s]*\d+\.\s*\*\*([А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*)\*\*/gm,
		// Простой паттерн для жирного текста - более гибкий
		/\*\*([А-ЯЁA-Z][а-яёa-z]+\s+[А-ЯЁA-Z][а-яёa-z]+(?:\s+[А-ЯЁA-Z][а-яёa-z]+)*)\*\*/gm,
		// Очень простой паттерн - любое содержимое в **
		/\*\*([^*]+)\*\*/gm,
	];

	const foundNames = new Set<string>();

	// Ищем имена по всем паттернам
	namePatterns.forEach((pattern, index) => {
		let match;
		const patternName =
			[
				'**Имя Фамилия** (жирный)',
				'*Имя Фамилия* (курсив)',
				'Списки с маркерами',
				'Нумерованные списки',
				'Имена в кавычках',
				'После двоеточия',
				'В начале строки',
				'После "Вот" или "Here"',
				'Простые списки без маркеров',
				'После "Специалисты" или "Experts"',
				'Формат "1. Имя Фамилия - описание"',
				'Формат "• Имя Фамилия: описание"',
				'Формат "Имя Фамилия (роль)"',
				'Формат "Имя Фамилия — описание"',
				'Формат "Имя Фамилия, роль"',
				'Специальный паттерн "Вот ключевые контакты"',
				'Простой паттерн для жирного текста',
				'Очень простой паттерн - любое содержимое в **',
			][index] || `Pattern ${index + 1}`;

		console.log(`🔍 Testing pattern ${index + 1}: ${patternName}`);

		// Для первого паттерна добавим дополнительную отладку
		if (index === 0) {
			console.log('🔍 First pattern regex:', pattern);
			console.log("🔍 Looking for: **Джеймс О'Коннор**");
			const manualTest =
				/\*\*([А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*)\*\*/gm;
			const manualMatch = manualTest.exec(messageContent);
			console.log('🔍 Manual test result:', manualMatch);
		}

		// Проверяем, есть ли хотя бы одно совпадение
		const testMatch = pattern.exec(messageContent);
		if (testMatch) {
			console.log(`✅ Pattern ${index + 1} found match:`, testMatch[1]);
			// Сбрасываем lastIndex для повторного поиска
			pattern.lastIndex = 0;
		} else {
			console.log(`❌ Pattern ${index + 1} no matches`);
		}

		while ((match = pattern.exec(messageContent)) !== null) {
			if (!match[1]) continue; // Пропускаем если нет захваченной группы
			let fullName = match[1].trim();

			// Для последнего паттерна (любое содержимое в **) проверяем, что это похоже на имя
			if (index === namePatterns.length - 1) {
				// Проверяем, содержит ли строка хотя бы два слова, начинающихся с заглавной буквы
				const nameWords = fullName.split(/\s+/);
				const hasTwoCapitalizedWords =
					nameWords.length >= 2 &&
					nameWords.every((word) => /^[А-ЯЁA-Z]/.test(word));

				if (!hasTwoCapitalizedWords) {
					continue; // Пропускаем, если не похоже на имя
				}
			}

			console.log(`🔍 ${patternName} matched:`, fullName);
			// Фильтруем слишком короткие имена и общие слова
			console.log(`🔍 Checking name: "${fullName}"`);
			console.log(`   - Length: ${fullName.length}`);
			console.log(`   - Already found: ${foundNames.has(fullName)}`);
			console.log(`   - Is common word: ${isCommonWord(fullName)}`);

			if (
				fullName &&
				fullName.length > 3 &&
				!foundNames.has(fullName) &&
				!isCommonWord(fullName)
			) {
				foundNames.add(fullName);
				console.log('✅ Found name:', fullName);

				// Создаем базовый объект Person
				const person: Person = {
					id: `person-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
					name: fullName,
					role: 'Specialist',
					company: '',
					description: 'Specialist information',
				};

				// Пытаемся извлечь дополнительную информацию из контекста
				const nameIndex = messageContent.indexOf(fullName);
				const contextStart = Math.max(0, nameIndex - 300);
				const contextEnd = Math.min(messageContent.length, nameIndex + 300);
				const context = messageContent.substring(contextStart, contextEnd);

				// Ищем роль/должность в различных форматах
				const rolePatterns = [
					// Формат: "**Имя Фамилия** - роль" - более точный паттерн
					new RegExp(
						`\\*\\*${fullName.replace(
							/[.*+?^${}()|[\]\\]/g,
							'\\$&'
						)}\\*\\*\\s*[–-]\\s*([^.,\n]+)`,
						'i'
					),
					// Формат: "**Имя Фамилия**: роль" - более точный паттерн
					new RegExp(
						`\\*\\*${fullName.replace(
							/[.*+?^${}()|[\]\\]/g,
							'\\$&'
						)}\\*\\*\\s*:\\s*([^.,\n]+)`,
						'i'
					),
					// Формат: "Имя Фамилия - роль" - более точный паттерн
					new RegExp(
						`${fullName.replace(
							/[.*+?^${}()|[\]\\]/g,
							'\\$&'
						)}\\s*[–-]\\s*([^.,\n]+)`,
						'i'
					),
					// Формат: "Имя Фамилия: роль" - более точный паттерн
					new RegExp(
						`${fullName.replace(
							/[.*+?^${}()|[\]\\]/g,
							'\\$&'
						)}\\s*:\\s*([^.,\n]+)`,
						'i'
					),
				];

				for (const rolePattern of rolePatterns) {
					const roleMatch = context.match(rolePattern);
					if (roleMatch && roleMatch[1]) {
						let role = roleMatch[1].trim();
						console.log(`🔍 Raw role extracted: "${role}"`);

						// Фильтруем нежелательные части роли
						role = role.replace(/\s*(based in|from|в|из)\s+[^.,\n]*$/i, '');
						role = role.replace(/\s*\.\s*$/, '');
						role = role.replace(/\s*,\s*$/, '');

						console.log(`🔍 Cleaned role: "${role}"`);

						// Проверяем, что роль не слишком длинная и содержит полезную информацию
						if (
							role.length > 0 &&
							role.length < 100 &&
							!role.toLowerCase().includes('based in') &&
							!role.toLowerCase().includes('from') &&
							!role.toLowerCase().includes('в ') &&
							!role.toLowerCase().includes('из ')
						) {
							person.role = role;
							console.log(`✅ Final role: "${role}"`);
							break;
						}
					}
				}

				// Ищем компанию в различных форматах
				const companyPatterns = [
					// Формат: "в компании", "at company", "работает в"
					/(?:в|at|@|работает в|works at|компания|company)\s+([А-ЯЁA-Z][а-яёa-z\s]+(?:Inc|LLC|Corp|Ltd|ООО|АО|ЗАО|Group|Capital|Ventures|Google|Microsoft|Apple|Meta|Amazon|Яндекс|Mail\.ru|VK)?)/i,
					// Формат: "компания: название"
					/(?:компания|company):\s*([А-ЯЁA-Z][а-яёa-z\s]+)/i,
					// Формат: "в Google", "в Microsoft"
					/(?:в|at)\s+([А-ЯЁA-Z][а-яёa-z]+)/i,
				];

				for (const companyPattern of companyPatterns) {
					const companyMatch = context.match(companyPattern);
					if (companyMatch && companyMatch[1]) {
						person.company = companyMatch[1].trim();
						break;
					}
				}

				// Ищем описание в различных форматах
				const descriptionPatterns = [
					// Формат: "— описание"
					/[—–-]\s*([^,\n]+(?:[^,\n]*[^,\n])?)/,
					// Формат: ": описание"
					/:\s*([^,\n]+(?:[^,\n]*[^,\n])?)/,
					// Формат: "(описание)"
					/\(\s*([^)]+)\s*\)/,
					// Формат: ", описание"
					/,\s*([^,\n]+(?:[^,\n]*[^,\n])?)/,
				];

				for (const descPattern of descriptionPatterns) {
					const descriptionMatch = context.match(descPattern);
					if (
						descriptionMatch &&
						descriptionMatch[1] &&
						descriptionMatch[1] !== person.role &&
						descriptionMatch[1].length > 10 &&
						!descriptionMatch[1].includes('в ') &&
						!descriptionMatch[1].includes('at ')
					) {
						person.description = descriptionMatch[1].trim();
						break;
					}
				}

				// Ищем экспертизу/навыки
				const expertisePatterns = [
					/(?:экспертиза|expertise|навыки|skills|специализация|specialization):\s*([^,\n]+)/i,
					/(?:область|area|фокус|focus):\s*([^,\n]+)/i,
				];

				for (const expPattern of expertisePatterns) {
					const expMatch = context.match(expPattern);
					if (expMatch && expMatch[1]) {
						person.expertise = expMatch[1].split(/[,;]/).map((s) => s.trim());
						break;
					}
				}

				// Ищем локацию
				const locationPatterns = [
					// Паттерн для "based in" или "from"
					/(?:based in|from)\s+([А-ЯЁA-Z][а-яёa-z\s]+)/i,
					// Паттерн для "в городе" или "из города"
					/(?:в|из)\s+([А-ЯЁA-Z][а-яёa-z\s]+)/i,
					// Паттерн для упоминания городов
					/(?:Москва|Санкт-Петербург|Казань|Новосибирск|Екатеринбург|London|New York|Dubai|Barcelona|Paris|Berlin|Tokyo|Singapore|Amsterdam|Stockholm|Copenhagen|Vienna|Zurich|Frankfurt|Munich|Madrid|Rome|Milan|Lisbon|Dublin|Edinburgh|Glasgow|Manchester|Birmingham|Liverpool|Leeds|Sheffield|Bristol|Newcastle|Cardiff|Belfast|Aberdeen|Dundee|Inverness|Stirling|Perth|Dunfermline|Kirkwall|Lerwick|Stornoway|Lochgilphead|Campbeltown|Rothesay|Millport|Ardrossan|Saltcoats|Stevenston|Kilwinning|Dreghorn|Springside|Bourtreehill|Whitehirst Park|Blacklands|Longbar|Skelmorlie|Wemyss Bay|Inverkip|Gourock|Greenock|Port Glasgow|Langbank|Bishopton|Erskine|Renfrew|Paisley|Johnstone|Kilbarchan|Lochwinnoch|Howwood|Bridge of Weir|Brookfield|Crosslee|Houston|Crosslee|Linwood|Elderslie|Ralston|Glenburn|Foxbar|Gallagher Park|Hunterhill|Meikleriggs|Newmains|Nethercraigs|Seedhill|St Mirin|St James|Stanely|Thornly Park|West End|West Primary|Woodside|Abercorn|Anchor|Ardgowan|Barrhead|Beith|Caldwell|Cartsburn|Castlehead|Clydebank|Corseford|Craigends|Dargavel|Dunlop|Elderslie|Gleniffer|Gryffe|Hawkhead|Howwood|Johnstone|Kilbarchan|Lochwinnoch|Lynedoch|Maxwellton|Meikleriggs|Nethercraigs|Newmains|Paisley|Ralston|Renfrew|Seedhill|Stanely|Thornly Park|West End|Woodside|Abercorn|Anchor|Ardgowan|Barrhead|Beith|Caldwell|Cartsburn|Castlehead|Clydebank|Corseford|Craigends|Dargavel|Dunlop|Elderslie|Gleniffer|Gryffe|Hawkhead|Howwood|Johnstone|Kilbarchan|Lochwinnoch|Lynedoch|Maxwellton|Meikleriggs|Nethercraigs|Newmains|Paisley|Ralston|Renfrew|Seedhill|Stanely|Thornly Park|West End|Woodside)/i,
				];

				for (const locPattern of locationPatterns) {
					const locMatch = context.match(locPattern);
					if (locMatch && locMatch[1]) {
						let location = locMatch[1].trim();
						// Очищаем локацию от лишних слов
						location = location.replace(/\s*\.\s*$/, '');
						location = location.replace(/\s*,\s*$/, '');
						if (location.length > 0 && location.length < 50) {
							person.location = location;
							break;
						}
					}
				}

				people.push(person);
			}
		}

		// Сбрасываем lastIndex для повторного использования паттерна
		pattern.lastIndex = 0;
	});

	console.log('🎯 Final extracted people:', people);
	return people;
}

/**
 * Проверяет, является ли строка общим словом, которое не является именем
 */
function isCommonWord(str: string): boolean {
	if (!str) return true; // Если строка пустая или undefined, считаем её общим словом
	const commonWords = [
		'Вот',
		'вот',
		'Here',
		'here',
		'Список',
		'список',
		'List',
		'list',
		'Специалисты',
		'специалисты',
		'Experts',
		'experts',
		'Люди',
		'люди',
		'People',
		'people',
		'Рекомендую',
		'рекомендую',
		'Recommend',
		'recommend',
		'Могу',
		'могу',
		'Can',
		'can',
		'Предлагаю',
		'предлагаю',
		'Suggest',
		'suggest',
		'Найденные',
		'найденные',
		'Found',
		'found',
		'Результаты',
		'результаты',
		'Results',
		'results',
		'Поиск',
		'поиск',
		'Search',
		'search',
		'Найдено',
		'найдено',
		'Found',
		'found',
		'Советую',
		'советую',
		'Advise',
		'advise',
		'Рекомендации',
		'рекомендации',
		'Recommendations',
		'recommendations',
		'Можете',
		'можете',
		'You can',
		'you can',
		'Свяжитесь',
		'свяжитесь',
		'Contact',
		'contact',
		'Обратитесь',
		'обратитесь',
		'Reach out',
		'reach out',
	];
	return commonWords.includes(str);
}
