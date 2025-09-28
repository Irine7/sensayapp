'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
	Search,
	Filter,
	MapPin,
	Briefcase,
	DollarSign,
	Star,
	Users,
	MessageCircle,
} from 'lucide-react';

interface Person {
	id: string;
	name: string;
	role: string;
	company: string;
	description: string;
	location: string;
	expertise: string[];
	investmentStage?: string;
	investmentRange?: string;
	portfolioSize?: number;
	matchPercentage?: number;
	profileImage?: string;
	linkedinUrl?: string;
	website?: string;
}

interface PeopleListResponse {
	category: string;
	query: string;
	people: Person[];
	totalCount: number;
}

export default function PeopleListPage() {
	const params = useParams();
	const searchParams = useSearchParams();
	const [people, setPeople] = useState<Person[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
	const [category, setCategory] = useState('');
	const [query, setQuery] = useState('');

	useEffect(() => {
		if (params?.category && searchParams?.get('q')) {
			const categoryParam = params.category as string;
			const queryParam = searchParams.get('q') as string;

			setCategory(categoryParam);
			setQuery(queryParam);
			fetchPeople(categoryParam, queryParam);
		}
	}, [params, searchParams]);

	const fetchPeople = async (category: string, query: string) => {
		setLoading(true);
		try {
			const response = await fetch(
				`/api/people/${category}?q=${encodeURIComponent(query)}`
			);
			const data: PeopleListResponse = await response.json();
			setPeople(data.people);
			setFilteredPeople(data.people);
		} catch (error) {
			console.error('Error fetching people:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = (searchTerm: string) => {
		setSearchQuery(searchTerm);
		if (!searchTerm.trim()) {
			setFilteredPeople(people);
			return;
		}

		const filtered = people.filter(
			(person) =>
				person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				person.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
				person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
				person.expertise.some((skill) =>
					skill.toLowerCase().includes(searchTerm.toLowerCase())
				)
		);
		setFilteredPeople(filtered);
	};

	const getInvestmentStageColor = (stage?: string) => {
		switch (stage?.toLowerCase()) {
			case 'pre-seed':
				return 'bg-blue-500';
			case 'seed':
				return 'bg-green-500';
			case 'series a':
				return 'bg-yellow-500';
			case 'series b':
				return 'bg-orange-500';
			case 'late stage':
				return 'bg-red-500';
			default:
				return 'bg-gray-500';
		}
	};

	const getCategoryTitle = (category: string) => {
		switch (category) {
			case 'investors':
				return 'Инвесторы';
			case 'mentors':
				return 'Менторы';
			case 'founders':
				return 'Основатели';
			default:
				return 'Люди';
		}
	};

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case 'investors':
				return '💰';
			case 'mentors':
				return '🧠';
			case 'founders':
				return '🚀';
			default:
				return '👥';
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121316] to-[#0a0a0a] flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
					<p className="text-white text-lg">Загружаем список людей...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121316] to-[#0a0a0a]">
			{/* Header */}
			<section className="py-12 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
				<div className="container mx-auto px-6">
					<div className="text-center">
						<Badge
							variant="outline"
							className="mb-4 bg-blue-500/10 border-blue-500/20 text-blue-400"
						>
							{getCategoryIcon(category)} {getCategoryTitle(category)}
						</Badge>
						<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
							{getCategoryTitle(category)}
						</h1>
						<p className="text-xl text-gray-400 max-w-2xl mx-auto">
							Результаты поиска по запросу:{' '}
							<span className="text-pink-400 font-semibold">"{query}"</span>
						</p>
					</div>
				</div>
			</section>

			{/* Search and Filters */}
			<section className="py-8">
				<div className="container mx-auto px-6">
					<Card className="bg-gray-900/50 border-gray-800 max-w-2xl mx-auto">
						<CardContent className="p-6">
							<div className="flex gap-4">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
									<Input
										placeholder="Поиск по имени, компании, роли..."
										value={searchQuery}
										onChange={(e) => handleSearch(e.target.value)}
										className="pl-10 bg-gray-800 border-gray-700 text-white"
									/>
								</div>
								<Button variant="outline" className="border-gray-700">
									<Filter className="h-4 w-4 mr-2" />
									Фильтры
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Results Count */}
			<section className="pb-8">
				<div className="container mx-auto px-6">
					<div className="text-center">
						<p className="text-gray-400">
							Найдено{' '}
							<span className="text-pink-400 font-semibold">
								{filteredPeople.length}
							</span>{' '}
							из{' '}
							<span className="text-pink-400 font-semibold">
								{people.length}
							</span>{' '}
							человек
						</p>
					</div>
				</div>
			</section>

			{/* People List */}
			<section className="pb-20">
				<div className="container mx-auto px-6">
					{filteredPeople.length === 0 ? (
						<div className="text-center py-12">
							<Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-white mb-2">
								Никого не найдено
							</h3>
							<p className="text-gray-400">
								Попробуйте изменить поисковый запрос
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredPeople.map((person) => (
								<Card
									key={person.id}
									className="border border-gray-700 bg-gray-900/50 hover:bg-gray-900/70 transition-all duration-300 hover:transform hover:scale-105"
								>
									<CardHeader className="text-center">
										<div className="flex justify-center mb-4">
											<Avatar className="h-16 w-16">
												<AvatarImage
													src={person.profileImage}
													alt={person.name}
												/>
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
											{person.matchPercentage &&
												person.matchPercentage >= 90 && (
													<Star className="h-4 w-4 text-yellow-500" />
												)}
										</CardTitle>

										<div className="flex items-center justify-center gap-2 text-sm text-gray-400">
											<span className="flex items-center gap-1">
												<Briefcase className="h-3 w-3" />
												{person.role}
											</span>
										</div>

										<div className="flex items-center justify-center gap-1 text-sm text-gray-500">
											<MapPin className="h-3 w-3" />
											{person.location}
										</div>
									</CardHeader>

									<CardContent>
										<p className="text-gray-300 text-sm mb-4 line-clamp-3">
											{person.description}
										</p>

										{/* Investment Stage Badge for Investors */}
										{category === 'investors' && person.investmentStage && (
											<div className="mb-4">
												<Badge
													className={`${getInvestmentStageColor(
														person.investmentStage
													)} text-white mb-2`}
												>
													{person.investmentStage}
												</Badge>
												{person.investmentRange && (
													<Badge
														variant="outline"
														className="border-gray-600 text-gray-400 ml-2"
													>
														<DollarSign className="h-3 w-3 mr-1" />
														{person.investmentRange}
													</Badge>
												)}
											</div>
										)}

										{/* Match Percentage */}
										{person.matchPercentage && (
											<div className="mb-4">
												<div className="flex justify-between items-center mb-2">
													<span className="text-sm text-gray-400">
														Совместимость
													</span>
													<span className="text-sm font-semibold text-pink-400">
														{person.matchPercentage}%
													</span>
												</div>
												<Progress
													value={person.matchPercentage}
													className="h-2"
												/>
											</div>
										)}

										{/* Expertise Tags */}
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

										<div className="flex gap-2">
											<Button
												size="sm"
												className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 hover:opacity-90 text-white"
											>
												<MessageCircle className="mr-2 h-3 w-3" />
												Связаться
											</Button>
											{person.linkedinUrl && (
												<Button
													size="sm"
													variant="outline"
													className="border-gray-600 text-gray-300 hover:bg-gray-800"
													onClick={() =>
														window.open(person.linkedinUrl, '_blank')
													}
												>
													LinkedIn
												</Button>
											)}
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			</section>

			{/* Summary Stats */}
			<section className="py-12 bg-gradient-to-b from-gray-900/20 to-transparent">
				<div className="container mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
						<Card className="border border-gray-700 bg-gray-900/50 text-center">
							<CardContent className="pt-6">
								<Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
								<div className="text-2xl font-bold text-white">
									{people.length}
								</div>
								<div className="text-sm text-gray-400">Всего найдено</div>
							</CardContent>
						</Card>

						<Card className="border border-gray-700 bg-gray-900/50 text-center">
							<CardContent className="pt-6">
								<Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
								<div className="text-2xl font-bold text-white">
									{
										people.filter(
											(p) => p.matchPercentage && p.matchPercentage >= 90
										).length
									}
								</div>
								<div className="text-sm text-gray-400">
									Высокая совместимость
								</div>
							</CardContent>
						</Card>

						<Card className="border border-gray-700 bg-gray-900/50 text-center">
							<CardContent className="pt-6">
								<Briefcase className="h-8 w-8 text-green-500 mx-auto mb-2" />
								<div className="text-2xl font-bold text-white">
									{new Set(people.map((p) => p.company)).size}
								</div>
								<div className="text-sm text-gray-400">Уникальных компаний</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
		</div>
	);
}
