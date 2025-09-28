'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send } from 'lucide-react';
import {
	generatePeopleListMessage,
	detectPeopleCategory,
	extractSearchKeywords,
} from '@/app/lib/utils/generatePeopleListTrigger';

export default function AITriggerDemo() {
	const [userQuery, setUserQuery] = useState('');
	const [aiResponse, setAiResponse] = useState('');

	const handleQuery = () => {
		if (!userQuery.trim()) return;

		// Имитируем работу ИИ-агента
		const category = detectPeopleCategory(userQuery);
		const keywords = extractSearchKeywords(userQuery);

		if (category) {
			const response = generatePeopleListMessage(
				category,
				keywords,
				`Я нашел подходящих людей для вашего запроса. Вот список ${
					category === 'investors'
						? 'инвесторов'
						: category === 'mentors'
						? 'менторов'
						: 'основателей'
				}:`
			);
			setAiResponse(response);
		} else {
			setAiResponse(
				`Я не смог определить конкретную категорию людей из вашего запроса "${userQuery}". Попробуйте быть более конкретным, например: "найти инвесторов для pre-seed" или "показать менторов по маркетингу".`
			);
		}
	};

	return (
		<Card className="bg-gray-900/50 border-gray-800 max-w-4xl mx-auto">
			<CardHeader>
				<CardTitle className="text-white flex items-center gap-2">
					<Bot className="h-5 w-5" />
					Демонстрация работы ИИ-триггеров
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<label className="text-sm text-gray-400">
						Введите запрос к ИИ-агенту:
					</label>
					<div className="flex gap-2">
						<Input
							value={userQuery}
							onChange={(e) => setUserQuery(e.target.value)}
							placeholder="Например: 'найти инвесторов для pre-seed стартапа'"
							className="bg-gray-800 border-gray-700 text-white"
						/>
						<Button
							onClick={handleQuery}
							className="bg-pink-500 hover:bg-pink-600"
						>
							<Send className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{userQuery && (
					<div className="space-y-2">
						<label className="text-sm text-gray-400">
							Определенная категория:
						</label>
						<Badge
							className={
								detectPeopleCategory(userQuery) === 'investors'
									? 'bg-yellow-500'
									: detectPeopleCategory(userQuery) === 'mentors'
									? 'bg-purple-500'
									: detectPeopleCategory(userQuery) === 'founders'
									? 'bg-orange-500'
									: 'bg-gray-500'
							}
						>
							{detectPeopleCategory(userQuery) || 'Не определена'}
						</Badge>
					</div>
				)}

				{userQuery && (
					<div className="space-y-2">
						<label className="text-sm text-gray-400">
							Извлеченные ключевые слова:
						</label>
						<code className="block bg-gray-800 p-2 rounded text-sm text-gray-300">
							{extractSearchKeywords(userQuery)}
						</code>
					</div>
				)}

				{aiResponse && (
					<div className="space-y-2">
						<label className="text-sm text-gray-400">
							Ответ ИИ-агента с триггером:
						</label>
						<div className="bg-gray-800 p-4 rounded-lg">
							<pre className="text-sm text-gray-300 whitespace-pre-wrap">
								{aiResponse}
							</pre>
						</div>
					</div>
				)}

				<div className="text-xs text-gray-500 space-y-1">
					<p>Примеры запросов:</p>
					<ul className="list-disc list-inside ml-4 space-y-1">
						<li>"найти инвесторов для pre-seed стартапа"</li>
						<li>"показать менторов по маркетингу"</li>
						<li>"ищу основателей в области финтех"</li>
						<li>"инвесторы early stage для SaaS"</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
