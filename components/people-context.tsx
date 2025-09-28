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

	// Очистка списка людей
	const clearPeopleFromChat = () => {
		setPeopleFromChat(null);
	};

	// Отслеживание сообщений для извлечения списков людей
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
				setPeopleFromChat({
					category: trigger.payload.category,
					query: trigger.payload.query,
					people,
					timestamp: lastAssistantMessage.timestamp,
				});
			}
		} else {
			// Если нет триггера, пытаемся извлечь людей из обычного сообщения
			const people = extractPeopleFromMessage(lastAssistantMessage.content);
			console.log('🔍 Extracted people from message:', people);

			if (people.length > 0) {
				setPeopleFromChat({
					category: 'general',
					query: 'Из сообщения реплики',
					people,
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
					role: 'Специалист',
					company: 'Не указано',
					description: 'Информация о специалисте',
				};

				// Пытаемся извлечь дополнительную информацию из контекста
				const nameIndex = messageContent.indexOf(fullName);
				const contextStart = Math.max(0, nameIndex - 300);
				const contextEnd = Math.min(messageContent.length, nameIndex + 300);
				const context = messageContent.substring(contextStart, contextEnd);

				// Ищем роль/должность в различных форматах
				const rolePatterns = [
					// Формат: "**Имя Фамилия** - роль" - поддерживает различные типы апострофов и дефисов
					/\*\*[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\*\*\s*[–-]\s*([^,\n]+)/,
					// Формат: "**Имя Фамилия**: роль" - поддерживает различные типы апострофов и дефисов
					/\*\*[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\*\*\s*:\s*([^,\n]+)/,
					// Формат: "Имя Фамилия - роль" - поддерживает различные типы апострофов и дефисов
					/(?:^|\n)[\s]*[-•*]?\s*[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s*[–-]\s*([^,\n]+)/,
					// Формат: "Имя Фамилия: роль" - поддерживает различные типы апострофов и дефисов
					/(?:^|\n)[\s]*[-•*]?\s*[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s*:\s*([^,\n]+)/,
					// Формат: "Имя Фамилия (роль)" - поддерживает различные типы апострофов и дефисов
					/(?:^|\n)[\s]*[-•*]?\s*[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s*\(\s*([^)]+)\s*\)/,
					// Формат: "Имя Фамилия, роль" - поддерживает различные типы апострофов и дефисов
					/(?:^|\n)[\s]*[-•*]?\s*[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s+[А-ЯЁA-Z][а-яёa-z]+(?:[''''-][а-яёa-z]+)*\s*,\s*([^,\n]+)/,
				];

				for (const rolePattern of rolePatterns) {
					const roleMatch = context.match(rolePattern);
					if (roleMatch) {
						person.role = roleMatch[1].trim();
						break;
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
					if (companyMatch) {
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
					if (expMatch) {
						person.expertise = expMatch[1].split(/[,;]/).map((s) => s.trim());
						break;
					}
				}

				// Ищем локацию
				const locationPatterns = [
					/(?:расположение|location|город|city|из|from):\s*([^,\n]+)/i,
					/(?:из|from)\s+([^,\n]+)/i,
					/(?:Москва|Санкт-Петербург|Казань|Новосибирск|Екатеринбург|Москва|СПб|МСК|СПб)/i,
				];

				for (const locPattern of locationPatterns) {
					const locMatch = context.match(locPattern);
					if (locMatch) {
						person.location = locMatch[1].trim();
						break;
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
