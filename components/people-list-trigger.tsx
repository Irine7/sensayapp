'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, ExternalLink } from 'lucide-react';

interface PeopleListTriggerProps {
	category: 'investors' | 'mentors' | 'founders';
	query: string;
	className?: string;
}

export default function PeopleListTrigger({
	category,
	query,
	className = '',
}: PeopleListTriggerProps) {
	const [isHovered, setIsHovered] = useState(false);

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

	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'investors':
				return 'from-yellow-500 to-amber-600';
			case 'mentors':
				return 'from-purple-500 to-violet-600';
			case 'founders':
				return 'from-orange-500 to-red-600';
			default:
				return 'from-blue-500 to-cyan-600';
		}
	};

	const handleClick = () => {
		// Для демонстрации, сразу переходим к списку людей
		window.location.href = `/people/${category}?q=${encodeURIComponent(query)}`;
	};

	return (
		<Card
			className={`border border-gray-700 bg-gray-900/50 hover:bg-gray-900/70 transition-all duration-300 cursor-pointer ${className}`}
			onClick={handleClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<CardContent className="p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div
							className={`w-10 h-10 rounded-full bg-gradient-to-r ${getCategoryColor(
								category
							)} flex items-center justify-center text-white text-lg`}
						>
							{getCategoryIcon(category)}
						</div>
						<div>
							<h3 className="text-white font-semibold">
								{getCategoryTitle(category)}
							</h3>
							<p className="text-gray-400 text-sm">
								Результаты поиска: "{query}"
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<Badge
							className={`bg-gradient-to-r ${getCategoryColor(
								category
							)} text-white`}
						>
							Просмотреть список
						</Badge>
						<ExternalLink
							className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
								isHovered ? 'translate-x-1' : ''
							}`}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
