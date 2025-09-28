'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
	Users,
	Clock,
	Search,
	Star,
	TrendingUp,
	MessageCircle,
	Sparkles,
	Target,
	Zap,
} from 'lucide-react';
import { usePeopleFromChat } from './people-context';

export default function TestAnswerSection() {
	const { peopleFromChat, clearPeopleFromChat } = usePeopleFromChat();

	console.log('🧪 TestAnswerSection - peopleFromChat:', peopleFromChat);

	// Функции для определения цвета совпадения
	const getMatchColor = (percentage: number) => {
		if (percentage >= 80) return 'text-green-500';
		if (percentage >= 60) return 'text-blue-500';
		if (percentage >= 40) return 'text-yellow-500';
		return 'text-gray-500';
	};

	const getMatchBadgeColor = (percentage: number) => {
		if (percentage >= 80) return 'bg-green-500 hover:bg-green-600';
		if (percentage >= 60) return 'bg-blue-500 hover:bg-blue-600';
		if (percentage >= 40) return 'bg-yellow-500 hover:bg-yellow-600';
		return 'bg-gray-500 hover:bg-gray-600';
	};

	// Получаем лучший матч
	const bestMatch = peopleFromChat?.people.find((person) => person.isBestMatch);
	const otherMatches =
		peopleFromChat?.people.filter((person) => !person.isBestMatch) || [];

	if (!peopleFromChat || peopleFromChat.people.length === 0) {
		return (
			<section className="min-h-screen py-20 bg-gradient-to-br from-black/50 via-gray-900/30 to-black/50 relative overflow-hidden">
				{/* Animated background elements */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
					<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
				</div>

				<div className="container mx-auto px-6 relative z-10">
					<div className="text-center mb-16">
						<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 shadow-2xl">
							<Sparkles className="h-10 w-10 text-white" />
						</div>
						<h2 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
							🧪 Smart Matches
						</h2>
						<p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
							Discover the perfect connections powered by AI intelligence
						</p>
					</div>

					<Card className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 backdrop-blur-sm shadow-2xl">
						<CardContent className="p-12 text-center">
							<div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full mb-6">
								<Users className="h-12 w-12 text-blue-400" />
							</div>
							<h3 className="text-2xl font-semibold text-white mb-4">
								Ready to Connect?
							</h3>
							<p className="text-gray-300 text-lg leading-relaxed mb-8">
								Start a conversation with the AI agent and ask to show a list of
								specialists
							</p>
							<div className="flex items-center justify-center gap-2 text-purple-400">
								<Zap className="h-5 w-5" />
								<span className="text-sm font-medium">AI-Powered Matching</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>
		);
	}

	return (
		<section className="min-h-screen py-20 bg-gradient-to-br from-black/50 via-gray-900/30 to-black/50 relative overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
				<div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>
			</div>

			<div className="container mx-auto px-6 relative z-10">
				<div className="text-center mb-16">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 shadow-2xl">
						<Target className="h-10 w-10 text-white" />
					</div>
					<h2 className="text-5xl font-bold bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text text-transparent mb-6">
						Your Perfect Matches
					</h2>
					<p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
						AI-powered recommendations tailored to your needs
					</p>
				</div>

				{/* Все матчи в единой сетке */}
				<div className="mb-16">
					{/* Создаем массив всех людей, где лучший матч идет первым */}
					{(() => {
						const allPeople = bestMatch
							? [bestMatch, ...otherMatches]
							: otherMatches;
						const totalPeople = allPeople.length;

						// Определяем количество колонок в зависимости от количества людей
						let gridCols = 'grid-cols-1';
						if (totalPeople === 1) {
							gridCols = 'grid-cols-1 max-w-md mx-auto';
						} else if (totalPeople === 2) {
							gridCols = 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto';
						} else if (totalPeople === 3) {
							gridCols =
								'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto';
						} else {
							gridCols =
								'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
						}

						return (
							<div className={`grid ${gridCols} gap-8`}>
								{allPeople.map((person, index) => {
									const isBestMatch = person.isBestMatch;
									const isSecondBest = index === 1 && !isBestMatch;

									return (
										<Card
											key={person.id}
											className={`group border-2 bg-gradient-to-br from-gray-800/60 to-gray-900/60 hover:from-gray-700/70 hover:to-gray-800/70 transition-all duration-500 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:scale-105 relative overflow-hidden h-full flex flex-col ${
												isBestMatch
													? 'border-yellow-400/60 shadow-yellow-400/20 shadow-2xl'
													: isSecondBest
													? 'border-gray-300/60 shadow-gray-300/20 shadow-2xl'
													: 'border-gray-700/50'
											}`}
										>
											{/* Неоновое свечение для Best Match */}
											{isBestMatch && (
												<>
													<div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-lg"></div>
													<div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-orange-500/5 rounded-lg animate-pulse"></div>
													<div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-lg blur-sm -z-10"></div>
												</>
											)}

											{/* Серебряное свечение для второго места */}
											{isSecondBest && (
												<>
													<div className="absolute inset-0 bg-gradient-to-r from-gray-300/10 to-gray-400/10 rounded-lg"></div>
													<div className="absolute inset-0 bg-gradient-to-r from-gray-300/5 to-gray-400/5 rounded-lg animate-pulse"></div>
													<div className="absolute -inset-1 bg-gradient-to-r from-gray-300/20 to-gray-400/20 rounded-lg blur-sm -z-10"></div>
												</>
											)}

											{/* Glow effect on hover для обычных карточек */}
											{!isBestMatch && !isSecondBest && (
												<div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
											)}

											<CardHeader className="text-center relative z-10 flex-shrink-0">
												<div className="flex justify-center mb-4">
													<div className="relative">
														<Avatar
															className={`h-20 w-20 border-2 shadow-lg group-hover:shadow-xl transition-shadow duration-300 ${
																isBestMatch
																	? 'border-yellow-400'
																	: isSecondBest
																	? 'border-gray-300'
																	: 'border-gradient-to-r from-blue-400 to-purple-500'
															}`}
														>
															<AvatarFallback
																className={`text-xl font-bold text-white ${
																	isBestMatch
																		? 'bg-gradient-to-r from-yellow-400 to-orange-500'
																		: isSecondBest
																		? 'bg-gradient-to-r from-gray-300 to-gray-400'
																		: 'bg-gradient-to-r from-blue-500 to-purple-600'
																}`}
															>
																{person.name
																	.split(' ')
																	.map((n) => n[0])
																	.join('')}
															</AvatarFallback>
														</Avatar>

														{/* Процент совпадения в кружочке */}
														{/* <div
															className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
																isBestMatch
																	? 'bg-gradient-to-r from-yellow-400 to-orange-500'
																	: isSecondBest
																	? 'bg-gradient-to-r from-gray-300 to-gray-400'
																	: 'bg-gradient-to-r from-blue-400 to-purple-500'
															}`}
														>
															<span className="text-xs font-bold text-white">
																{person.matchPercentage || 0}%
															</span>
														</div> */}

														{/* Звездочка для Best Match */}
														{isBestMatch && (
															<div className="absolute -top-1 -left-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
																<Star className="h-3 w-3 text-white" />
															</div>
														)}

														{/* Серебряная медаль для второго места */}
														{/* {isSecondBest && (
															<div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg">
																<span className="text-xs font-bold text-white">
																	2
																</span>
															</div>
														)} */}
													</div>
												</div>

												<CardTitle
													className={`text-xl mb-2 transition-colors duration-300 ${
														isBestMatch
															? 'text-white group-hover:text-yellow-200'
															: isSecondBest
															? 'text-white group-hover:text-gray-200'
															: 'text-white group-hover:text-blue-200'
													}`}
												>
													{person.name}
													{isBestMatch && (
														<Badge className="ml-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 text-xs font-bold">
															BEST
														</Badge>
													)}
													{/* {isSecondBest && (
														<Badge className="ml-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-2 py-1 text-xs font-bold">
															2ND
														</Badge>
													)} */}
												</CardTitle>

												<div className="flex items-center justify-center gap-2 text-gray-300">
													<div
														className={`w-1.5 h-1.5 rounded-full ${
															isBestMatch
																? 'bg-gradient-to-r from-yellow-400 to-orange-500'
																: isSecondBest
																? 'bg-gradient-to-r from-gray-300 to-gray-400'
																: 'bg-gradient-to-r from-blue-400 to-purple-500'
														}`}
													></div>
													<span className="text-sm">{person.role}</span>
												</div>
											</CardHeader>

											<CardContent className="relative z-10 space-y-4 flex-1 flex flex-col">
												<p className="text-gray-300 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-200 transition-colors duration-300 flex-1">
													{person.description}
												</p>

												{/* Прогресс-бар совпадения */}
												<div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg p-4 border border-gray-600/30">
													<div className="flex justify-between items-center mb-2">
														<span className="text-xs text-gray-400 font-medium">
															Match Score
														</span>
														<span
															className={`text-lg font-bold ${getMatchColor(
																person.matchPercentage || 0
															)}`}
														>
															{person.matchPercentage || 0}%
														</span>
													</div>
													<Progress
														value={person.matchPercentage || 0}
														className="h-2 bg-gray-700"
													/>
												</div>

												{/* Экспертиза */}
												{person.expertise && person.expertise.length > 0 && (
													<div className="space-y-2">
														<h4 className="text-xs text-gray-400 font-medium">
															Skills
														</h4>
														<div className="flex flex-wrap gap-1">
															{person.expertise
																.slice(0, 2)
																.map((skill, skillIndex) => (
																	<Badge
																		key={skillIndex}
																		variant="outline"
																		className={`text-xs px-2 py-1 ${
																			isBestMatch
																				? 'border-yellow-500/30 text-yellow-300 bg-yellow-500/10'
																				: isSecondBest
																				? 'border-gray-400/30 text-gray-300 bg-gray-400/10'
																				: 'border-blue-500/30 text-blue-300 bg-blue-500/10'
																		}`}
																	>
																		{skill}
																	</Badge>
																))}
															{person.expertise.length > 2 && (
																<Badge
																	variant="outline"
																	className="text-xs border-gray-600 text-gray-400 px-2 py-1"
																>
																	+{person.expertise.length - 2}
																</Badge>
															)}
														</div>
													</div>
												)}

												{/* Action button */}
												<Button
													size="sm"
													className={`w-full font-medium shadow-lg group-hover:shadow-xl transition-all duration-300 ${
														isBestMatch
															? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
															: isSecondBest
															? 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white'
															: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
													}`}
												>
													<MessageCircle className="mr-2 h-4 w-4" />
													Connect
												</Button>
											</CardContent>
										</Card>
									);
								})}
							</div>
						);
					})()}
				</div>

				{/* Кнопка очистки */}
				<div className="text-center">
					<Button
						onClick={clearPeopleFromChat}
						variant="outline"
						className="border-gray-600/50 text-gray-300 hover:bg-gray-800/50 hover:border-gray-500 px-8 py-3 text-lg font-medium backdrop-blur-sm transition-all duration-300"
					>
						Clear Results
					</Button>
				</div>
			</div>
		</section>
	);
}
