'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Clock, Search } from 'lucide-react';
import { usePeopleFromChat } from './people-context';

export default function TestAnswerSection() {
	const { peopleFromChat, clearPeopleFromChat } = usePeopleFromChat();

	console.log('🧪 TestAnswerSection - peopleFromChat:', peopleFromChat);

	if (!peopleFromChat || peopleFromChat.people.length === 0) {
		return (
			<section className="py-20 bg-gradient-to-b from-gray-900/20 to-transparent">
				<div className="container mx-auto px-6">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold text-white mb-4">
							🧪 Test Answer
						</h2>
						<p className="text-xl text-gray-400 max-w-2xl mx-auto">
							Здесь будет отображаться список людей, полученный от ИИ-агента в
							чате
						</p>
					</div>

					<Card className="max-w-4xl mx-auto bg-gray-900/50 border-gray-800">
						<CardContent className="p-8 text-center">
							<Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
							<p className="text-gray-400 text-lg">
								Начните диалог с ИИ-агентом и попросите показать список
								специалистов
							</p>
						</CardContent>
					</Card>
				</div>
			</section>
		);
	}

	return (
		<section className="py-20 bg-gradient-to-b from-gray-900/20 to-transparent">
			<div className="container mx-auto px-6">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold text-white mb-4">🧪 Test Answer</h2>
					<p className="text-xl text-gray-400 max-w-2xl mx-auto">
						Список людей, полученный от ИИ-агента в чате
					</p>
				</div>

				{/* Информация о запросе */}
				<Card className="max-w-4xl mx-auto mb-8 bg-gray-900/50 border-gray-800">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-white flex items-center gap-2">
								<Search className="h-5 w-5" />
								Информация о запросе
							</CardTitle>
							<Badge
								variant="outline"
								className="text-blue-400 border-blue-400"
							>
								{peopleFromChat.category}
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<p className="text-gray-300">
								<strong>Запрос:</strong> {peopleFromChat.query}
							</p>
							<p className="text-gray-400 text-sm flex items-center gap-1">
								<Clock className="h-4 w-4" />
								Получено:{' '}
								{new Date(peopleFromChat.timestamp).toLocaleString('ru-RU')}
							</p>
							<p className="text-gray-400 text-sm">
								<strong>Найдено людей:</strong> {peopleFromChat.people.length}
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Список людей */}
				<div className="max-w-4xl mx-auto">
					<h3 className="text-2xl font-bold text-white mb-6 text-center">
						Список специалистов
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{peopleFromChat.people.map((person, index) => (
							<Card
								key={person.id}
								className="border border-gray-700 bg-gray-900/50 hover:bg-gray-900/70 transition-all duration-300"
							>
								<CardHeader className="text-center">
									<div className="flex justify-center mb-4">
										<Avatar className="h-16 w-16">
											<AvatarFallback className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
												{person.name
													.split(' ')
													.map((n) => n[0])
													.join('')}
											</AvatarFallback>
										</Avatar>
									</div>
									<CardTitle className="text-lg text-white">
										{person.name}
									</CardTitle>
									<div className="text-sm text-gray-400">{person.role}</div>
									<div className="text-sm text-gray-500">{person.company}</div>
								</CardHeader>
								<CardContent>
									<p className="text-gray-300 text-sm mb-4 line-clamp-3">
										{person.description}
									</p>

									{person.expertise && person.expertise.length > 0 && (
										<div className="flex flex-wrap gap-1 mb-4">
											{person.expertise.slice(0, 3).map((skill, skillIndex) => (
												<Badge
													key={skillIndex}
													variant="outline"
													className="text-xs border-gray-600 text-gray-400"
												>
													{skill}
												</Badge>
											))}
											{person.expertise.length > 3 && (
												<Badge
													variant="outline"
													className="text-xs border-gray-600 text-gray-400"
												>
													+{person.expertise.length - 3}
												</Badge>
											)}
										</div>
									)}

									{person.location && (
										<p className="text-xs text-gray-500 mb-2">
											📍 {person.location}
										</p>
									)}

									{person.matchPercentage && (
										<div className="flex items-center justify-between text-sm">
											<span className="text-gray-400">Совместимость:</span>
											<span className="text-blue-400 font-semibold">
												{person.matchPercentage}%
											</span>
										</div>
									)}
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				{/* Кнопка очистки */}
				<div className="text-center mt-8">
					<button
						onClick={clearPeopleFromChat}
						className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
					>
						Очистить список
					</button>
				</div>
			</div>
		</section>
	);
}
