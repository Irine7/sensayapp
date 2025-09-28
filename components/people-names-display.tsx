'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
	Star,
	Users,
	TrendingUp,
	MapPin,
	Briefcase,
	Sparkles,
	MessageCircle,
} from 'lucide-react';
import { usePeopleFromChat } from './people-context';

interface MatchPerson {
	name: string;
	role: string;
	company: string;
	description: string;
	matchPercentage: number;
	isBestMatch?: boolean;
	location?: string;
	expertise?: string[];
}

interface PeopleNamesDisplayProps {
	userInterest: string;
	matches: MatchPerson[];
	bestMatch: MatchPerson;
}

export default function PeopleNamesDisplay({
	userInterest,
	matches,
	bestMatch,
}: PeopleNamesDisplayProps) {
	// Используем данные из контекста, если они доступны
	const { peopleFromChat } = usePeopleFromChat();

	// Определяем, какие данные использовать
	const contextData = peopleFromChat?.people || [];
	const contextQuery = peopleFromChat?.query || userInterest;
	const contextBestMatch = contextData.find((person) => person.isBestMatch);
	const contextOtherMatches = contextData.filter(
		(person) => !person.isBestMatch
	);

	// Используем данные из контекста, если они есть, иначе используем пропсы
	const displayMatches = contextData.length > 0 ? contextOtherMatches : matches;
	const displayBestMatch =
		contextData.length > 0 ? contextBestMatch : bestMatch;
	const displayUserInterest =
		contextData.length > 0 ? contextQuery : userInterest;

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

	return (
		<section className="py-20 bg-gradient-to-b from-gray-900/20 to-transparent">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-white mb-4">
						🤖 Search Results
					</h2>
					<p className="text-xl text-gray-400 max-w-2xl mx-auto">
						Names of people recommended by the Matchmaker replica based on your
						interest in{' '}
						<span className="text-pink-400 font-semibold">
							{displayUserInterest}
						</span>
					</p>
				</div>

				{/* Best Match Highlight */}
				{displayBestMatch && (
					<div className="mb-16">
						<div className="text-center mb-8">
							<h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
								<Star className="h-6 w-6 text-yellow-500" />
								Best Match
							</h3>
							<p className="text-gray-400">Highest compatibility percentage</p>
						</div>

						<Card className="max-w-4xl mx-auto border-2 border-yellow-500/50 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
							<CardHeader className="text-center">
								<div className="flex justify-center mb-4">
									<Avatar className="h-20 w-20 border-4 border-yellow-500">
										<AvatarFallback className="text-2xl font-bold bg-yellow-500 text-white">
											{displayBestMatch.name
												.split(' ')
												.map((n) => n[0])
												.join('')}
										</AvatarFallback>
									</Avatar>
								</div>
								<CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
									{displayBestMatch.name}
									<Badge
										className={`${getMatchBadgeColor(
											displayBestMatch.matchPercentage || 0
										)} text-white`}
									>
										{displayBestMatch.matchPercentage || 0}% Match
									</Badge>
								</CardTitle>
								<div className="flex items-center justify-center gap-4 text-gray-300">
									<span className="flex items-center gap-1">
										<Briefcase className="h-4 w-4" />
										{displayBestMatch.role}
									</span>
								</div>
							</CardHeader>
							<CardContent className="text-center">
								<p className="text-gray-300 mb-6">
									{displayBestMatch.description}
								</p>

								{/* Прогресс-бар совпадения */}
								<div className="mb-6">
									<div className="flex justify-between items-center mb-2">
										<span className="text-sm text-gray-400">Совпадение</span>
										<span
											className={`text-sm font-semibold ${getMatchColor(
												displayBestMatch.matchPercentage || 0
											)}`}
										>
											{displayBestMatch.matchPercentage || 0}%
										</span>
									</div>
									<Progress
										value={displayBestMatch.matchPercentage || 0}
										className="h-2"
									/>
								</div>

								<div className="flex flex-wrap justify-center gap-2 mb-6">
									{displayBestMatch.expertise?.map((skill, index) => (
										<Badge
											key={index}
											variant="outline"
											className="border-pink-500 text-pink-400"
										>
											{skill}
										</Badge>
									))}
								</div>

								<div className="flex justify-center gap-4">
									<Button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:opacity-90 text-white">
										<MessageCircle className="mr-2 h-4 w-4" />
										Start Conversation
									</Button>
									<Button
										variant="outline"
										className="border-gray-600 text-gray-300 hover:bg-gray-800"
									>
										<Users className="mr-2 h-4 w-4" />
										View Profile
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* All Matches */}
				{displayMatches.length > 0 && (
					<div className="mb-8">
						<h3 className="text-2xl font-bold text-white mb-8 text-center">
							Все рекомендации
						</h3>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{displayMatches.map((person, index) => (
								<Card
									key={index}
									className={`border border-gray-700 bg-gray-900/50 hover:bg-gray-900/70 transition-all duration-300 ${
										person.isBestMatch ? 'ring-2 ring-yellow-500/50' : ''
									}`}
								>
									<CardHeader className="text-center">
										<div className="flex justify-center mb-4">
											<Avatar className="h-16 w-16">
												<AvatarFallback className="text-lg font-bold bg-gradient-to-r from-pink-500 to-rose-600 text-white">
													{person.name
														.split(' ')
														.map((n) => n[0])
														.join('')}
												</AvatarFallback>
											</Avatar>
										</div>

										<CardTitle className="text-lg text-white flex items-center justify-center gap-2">
											{person.name}
											{person.isBestMatch && (
												<Star className="h-4 w-4 text-yellow-500" />
											)}
										</CardTitle>

										<div className="flex items-center justify-center gap-2 text-sm text-gray-400">
											<span>{person.role}</span>
										</div>
									</CardHeader>

									<CardContent>
										<p className="text-gray-300 text-sm mb-4 line-clamp-3">
											{person.description}
										</p>

										<div className="mb-4">
											<div className="flex justify-between items-center mb-2">
												<span className="text-sm text-gray-400">
													Совместимость
												</span>
												<span
													className={`text-sm font-semibold ${getMatchColor(
														person.matchPercentage
													)}`}
												>
													{person.matchPercentage}%
												</span>
											</div>
											<Progress
												value={person.matchPercentage}
												className="h-2"
											/>
										</div>

										<div className="flex flex-wrap gap-1 mb-4">
											{person.expertise
												?.slice(0, 2)
												.map((skill, skillIndex) => (
													<Badge
														key={skillIndex}
														variant="outline"
														className="text-xs border-gray-600 text-gray-400"
													>
														{skill}
													</Badge>
												))}
											{person.expertise && person.expertise.length > 2 && (
												<Badge
													variant="outline"
													className="text-xs border-gray-600 text-gray-400"
												>
													+{person.expertise.length - 2}
												</Badge>
											)}
										</div>

										<Button
											size="sm"
											className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:opacity-90 text-white"
										>
											<MessageCircle className="mr-2 h-3 w-3" />
											Связаться
										</Button>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				)}

				{/* Summary Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
					<Card className="border border-gray-700 bg-gray-900/50 text-center">
						<CardContent className="pt-6">
							<TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
							<div className="text-2xl font-bold text-white">
								{contextData.length > 0 ? contextData.length : matches.length}
							</div>
							<div className="text-sm text-gray-400">Всего матчей</div>
						</CardContent>
					</Card>

					<Card className="border border-gray-700 bg-gray-900/50 text-center">
						<CardContent className="pt-6">
							<Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
							<div className="text-2xl font-bold text-white">
								{displayBestMatch?.matchPercentage || 0}%
							</div>
							<div className="text-sm text-gray-400">Лучший матч</div>
						</CardContent>
					</Card>

					<Card className="border border-gray-700 bg-gray-900/50 text-center">
						<CardContent className="pt-6">
							<Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
							<div className="text-2xl font-bold text-white">
								{Math.round(
									(contextData.length > 0 ? contextData : matches).reduce(
										(acc, match) => acc + (match.matchPercentage || 0),
										0
									) /
										(contextData.length > 0
											? contextData.length
											: matches.length)
								)}
								%
							</div>
							<div className="text-sm text-gray-400">Средний матч</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
