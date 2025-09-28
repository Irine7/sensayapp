'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, MapPin, Briefcase, Star } from 'lucide-react';

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

interface PeopleNamesListProps {
	matches: MatchPerson[];
	bestMatch: MatchPerson;
}

export default function PeopleNamesList({
	matches,
	bestMatch,
}: PeopleNamesListProps) {
	return (
		<section className="py-20 bg-gradient-to-b from-gray-900/20 to-transparent">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-white mb-4">
						👥 Имена людей из ответов реплики Matchmaker
					</h2>
					<p className="text-xl text-gray-400 max-w-2xl mx-auto">
						Все имена, роли и компании, которые генерирует реплика на основе
						своего обучения
					</p>
				</div>

				{/* Лучший матч */}
				<div className="mb-12">
					<h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
						<Star className="h-6 w-6 text-yellow-500" />
						Лучший матч
					</h3>
					<Card className="max-w-2xl mx-auto border-2 border-yellow-500/50 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
						<CardHeader className="text-center">
							<div className="flex justify-center mb-4">
								<Avatar className="h-16 w-16 border-4 border-yellow-500">
									<AvatarFallback className="text-xl font-bold bg-yellow-500 text-white">
										{bestMatch.name
											.split(' ')
											.map((n) => n[0])
											.join('')}
									</AvatarFallback>
								</Avatar>
							</div>
							<CardTitle className="text-xl text-white">
								{bestMatch.name}
							</CardTitle>
							<div className="flex items-center justify-center gap-4 text-gray-300 text-sm">
								<span className="flex items-center gap-1">
									<Briefcase className="h-4 w-4" />
									{bestMatch.role} в {bestMatch.company}
								</span>
								<span className="flex items-center gap-1">
									<MapPin className="h-4 w-4" />
									{bestMatch.location}
								</span>
							</div>
						</CardHeader>
						<CardContent className="text-center">
							<p className="text-gray-300 mb-4">{bestMatch.description}</p>
							<Badge className="bg-yellow-500 text-white">
								{bestMatch.matchPercentage}% Совпадение
							</Badge>
						</CardContent>
					</Card>
				</div>

				{/* Список всех имен */}
				<div className="mb-8">
					<h3 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center gap-2">
						<Users className="h-6 w-6 text-blue-500" />
						Все имена людей
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{matches.map((person, index) => (
							<Card
								key={index}
								className={`border border-gray-700 bg-gray-900/50 hover:bg-gray-900/70 transition-all duration-300 ${
									person.isBestMatch ? 'ring-2 ring-yellow-500/50' : ''
								}`}
							>
								<CardHeader className="text-center pb-2">
									<div className="flex justify-center mb-3">
										<Avatar className="h-12 w-12">
											<AvatarFallback className="text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-600 text-white">
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
								</CardHeader>
								<CardContent className="text-center pt-0">
									<div className="text-sm text-gray-400 mb-2">
										{person.role} в {person.company}
									</div>
									<div className="text-xs text-gray-500 mb-3">
										<MapPin className="h-3 w-3 inline mr-1" />
										{person.location}
									</div>
									<p className="text-gray-300 text-xs mb-3 line-clamp-2">
										{person.description}
									</p>
									<Badge
										variant="outline"
										className={`text-xs ${
											person.matchPercentage >= 90
												? 'border-green-500 text-green-400'
												: person.matchPercentage >= 80
												? 'border-blue-500 text-blue-400'
												: person.matchPercentage >= 70
												? 'border-yellow-500 text-yellow-400'
												: 'border-gray-500 text-gray-400'
										}`}
									>
										{person.matchPercentage}%
									</Badge>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				{/* Статистика имен */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
					<Card className="border border-gray-700 bg-gray-900/50 text-center">
						<CardContent className="pt-6">
							<Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
							<div className="text-2xl font-bold text-white">
								{matches.length}
							</div>
							<div className="text-sm text-gray-400">Всего имен</div>
						</CardContent>
					</Card>

					<Card className="border border-gray-700 bg-gray-900/50 text-center">
						<CardContent className="pt-6">
							<Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
							<div className="text-2xl font-bold text-white">
								{bestMatch.name}
							</div>
							<div className="text-sm text-gray-400">Лучший матч</div>
						</CardContent>
					</Card>

					<Card className="border border-gray-700 bg-gray-900/50 text-center">
						<CardContent className="pt-6">
							<Briefcase className="h-8 w-8 text-blue-500 mx-auto mb-2" />
							<div className="text-2xl font-bold text-white">
								{new Set(matches.map((m) => m.company)).size}
							</div>
							<div className="text-sm text-gray-400">Уникальных компаний</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
