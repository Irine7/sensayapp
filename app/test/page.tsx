'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMemory, ReplicaMemory } from '@/components/memory-provider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
	Loader2,
	RefreshCw,
	Search,
	MessageSquare,
	User,
	Bot,
} from 'lucide-react';

export default function TestPage() {
	const { memoryState, loadMemories, refreshMemories, clearMemories } =
		useMemory();
	const [replicaUUID, setReplicaUUID] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'assistant'>(
		'all'
	);
	const [sourceFilter, setSourceFilter] = useState<string>('all');
	const [filteredMemories, setFilteredMemories] = useState<ReplicaMemory[]>([]);

	// Фильтрация памяти по поисковому запросу и фильтрам
	useEffect(() => {
		let filtered = memoryState.memories;

		// Фильтр по поисковому запросу
		if (searchTerm) {
			filtered = filtered.filter(
				(memory) =>
					memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
					memory.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
					memory.source.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Фильтр по роли
		if (roleFilter !== 'all') {
			filtered = filtered.filter((memory) => memory.role === roleFilter);
		}

		// Фильтр по источнику
		if (sourceFilter !== 'all') {
			filtered = filtered.filter((memory) => memory.source === sourceFilter);
		}

		setFilteredMemories(filtered);
	}, [memoryState.memories, searchTerm, roleFilter, sourceFilter]);

	const handleLoadMemories = async () => {
		if (!replicaUUID.trim()) {
			alert('Пожалуйста, введите UUID реплики');
			return;
		}
		await loadMemories(replicaUUID.trim());
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString('ru-RU', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
	};

	const formatRelativeTime = (dateString: string) => {
		const now = new Date();
		const date = new Date(dateString);
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diffInSeconds < 60) return 'только что';
		if (diffInSeconds < 3600)
			return `${Math.floor(diffInSeconds / 60)} мин назад`;
		if (diffInSeconds < 86400)
			return `${Math.floor(diffInSeconds / 3600)} ч назад`;
		if (diffInSeconds < 604800)
			return `${Math.floor(diffInSeconds / 86400)} дн назад`;
		return formatDate(dateString);
	};

	const formatContent = (content: string) => {
		// Ограничиваем длину контента для лучшей читаемости
		const maxLength = 500;
		if (content.length <= maxLength) return content;
		return content.substring(0, maxLength) + '...';
	};

	const getContentPreview = (content: string) => {
		const words = content.split(' ');
		if (words.length <= 20) return content;
		return words.slice(0, 20).join(' ') + '...';
	};

	const getRoleIcon = (role: string) => {
		return role === 'user' ? (
			<User className="w-4 h-4" />
		) : (
			<Bot className="w-4 h-4" />
		);
	};

	const getRoleColor = (role: string) => {
		return role === 'user' ? 'bg-blue-500' : 'bg-green-500';
	};

	const getSourceColor = (source: string) => {
		const colors = {
			web: 'bg-purple-500',
			discord: 'bg-indigo-500',
			telegram: 'bg-blue-500',
			embed: 'bg-orange-500',
			telegram_autopilot: 'bg-cyan-500',
		};
		return colors[source as keyof typeof colors] || 'bg-gray-500';
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121316] to-[#0a0a0a] p-6">
			<div className="max-w-6xl mx-auto space-y-6">
				{/* Заголовок */}
				<div className="text-center space-y-4">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
						Тест памяти реплики
					</h1>
					<p className="text-gray-400 text-lg">
						Просмотр и управление памятью реплики из Sensay API
					</p>
				</div>

				{/* Панель управления */}
				<Card className="bg-gray-900/50 border-gray-800">
					<CardHeader>
						<CardTitle className="text-white flex items-center gap-2">
							<MessageSquare className="w-5 h-5" />
							Управление памятью
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex gap-4 items-end">
							<div className="flex-1">
								<Label htmlFor="replica-uuid" className="text-gray-300">
									UUID реплики
								</Label>
								<Input
									id="replica-uuid"
									value={replicaUUID}
									onChange={(e) => setReplicaUUID(e.target.value)}
									placeholder="Введите UUID реплики..."
									className="bg-gray-800 border-gray-700 text-white"
								/>
							</div>
							<Button
								onClick={handleLoadMemories}
								disabled={memoryState.isLoading}
								className="bg-blue-600 hover:bg-blue-700"
							>
								{memoryState.isLoading ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									'Загрузить память'
								)}
							</Button>
						</div>

						<div className="flex gap-2">
							<Button
								onClick={refreshMemories}
								disabled={
									memoryState.isLoading || memoryState.memories.length === 0
								}
								variant="outline"
								className="border-gray-700 text-gray-300 hover:bg-gray-800"
							>
								<RefreshCw className="w-4 h-4 mr-2" />
								Обновить
							</Button>
							<Button
								onClick={clearMemories}
								disabled={memoryState.isLoading}
								variant="outline"
								className="border-red-700 text-red-300 hover:bg-red-900/20"
							>
								Очистить
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Поиск и фильтры */}
				{memoryState.memories.length > 0 && (
					<Card className="bg-gray-900/50 border-gray-800">
						<CardContent className="pt-6">
							<div className="space-y-4">
								{/* Поиск */}
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
									<Input
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										placeholder="Поиск по содержимому памяти..."
										className="pl-10 bg-gray-800 border-gray-700 text-white"
									/>
								</div>

								{/* Фильтры */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{/* Фильтр по роли */}
									<div>
										<Label className="text-gray-300 text-sm mb-2 block">
											👤 Фильтр по роли
										</Label>
										<select
											value={roleFilter}
											onChange={(e) =>
												setRoleFilter(
													e.target.value as 'all' | 'user' | 'assistant'
												)
											}
											className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
										>
											<option value="all">Все роли</option>
											<option value="user">👤 Пользователь</option>
											<option value="assistant">🤖 Реплика</option>
										</select>
									</div>

									{/* Фильтр по источнику */}
									<div>
										<Label className="text-gray-300 text-sm mb-2 block">
											📱 Фильтр по источнику
										</Label>
										<select
											value={sourceFilter}
											onChange={(e) => setSourceFilter(e.target.value)}
											className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
										>
											<option value="all">Все источники</option>
											<option value="web">🌐 Web</option>
											<option value="discord">💬 Discord</option>
											<option value="telegram">📱 Telegram</option>
											<option value="embed">🔗 Embed</option>
											<option value="telegram_autopilot">🤖 Auto</option>
										</select>
									</div>
								</div>

								{/* Сброс фильтров */}
								{(searchTerm ||
									roleFilter !== 'all' ||
									sourceFilter !== 'all') && (
									<div className="flex justify-end">
										<Button
											onClick={() => {
												setSearchTerm('');
												setRoleFilter('all');
												setSourceFilter('all');
											}}
											variant="outline"
											size="sm"
											className="border-gray-700 text-gray-300 hover:bg-gray-800"
										>
											🔄 Сбросить фильтры
										</Button>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Статус загрузки */}
				{memoryState.isLoading && (
					<Alert className="border-blue-500/50 bg-blue-500/10">
						<Loader2 className="w-4 h-4 animate-spin" />
						<AlertDescription className="text-blue-300">
							Загружаем память реплики...
						</AlertDescription>
					</Alert>
				)}

				{/* Ошибка */}
				{memoryState.error && (
					<Alert className="border-red-500/50 bg-red-500/10">
						<AlertDescription className="text-red-300">
							Ошибка: {memoryState.error}
						</AlertDescription>
					</Alert>
				)}

				{/* Статистика */}
				{memoryState.memories.length > 0 && (
					<Card className="bg-gray-900/50 border-gray-800">
						<CardContent className="pt-6">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								<div className="text-center p-4 bg-gray-800/30 rounded-lg">
									<div className="text-3xl font-bold text-white mb-1">
										{memoryState.memories.length}
									</div>
									<div className="text-gray-400 text-sm">📝 Всего записей</div>
								</div>
								<div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
									<div className="text-3xl font-bold text-blue-400 mb-1">
										{
											memoryState.memories.filter((m) => m.role === 'user')
												.length
										}
									</div>
									<div className="text-gray-400 text-sm">
										👤 Сообщения пользователя
									</div>
								</div>
								<div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
									<div className="text-3xl font-bold text-green-400 mb-1">
										{
											memoryState.memories.filter((m) => m.role === 'assistant')
												.length
										}
									</div>
									<div className="text-gray-400 text-sm">🤖 Ответы реплики</div>
								</div>
								<div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
									<div className="text-3xl font-bold text-purple-400 mb-1">
										{filteredMemories.length}
									</div>
									<div className="text-gray-400 text-sm">🔍 Отфильтровано</div>
								</div>
							</div>

							{/* Дополнительная статистика */}
							<div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="text-center p-3 bg-gray-800/20 rounded">
									<div className="text-lg font-semibold text-gray-300">
										{memoryState.memories
											.reduce((acc, m) => acc + m.content.length, 0)
											.toLocaleString()}
									</div>
									<div className="text-gray-400 text-xs">
										Общее количество символов
									</div>
								</div>
								<div className="text-center p-3 bg-gray-800/20 rounded">
									<div className="text-lg font-semibold text-gray-300">
										{
											memoryState.memories.filter(
												(m) => m.sources && m.sources.length > 0
											).length
										}
									</div>
									<div className="text-gray-400 text-xs">
										Записей с RAG источниками
									</div>
								</div>
								<div className="text-center p-3 bg-gray-800/20 rounded">
									<div className="text-lg font-semibold text-gray-300">
										{new Set(memoryState.memories.map((m) => m.source)).size}
									</div>
									<div className="text-gray-400 text-xs">
										Уникальных источников
									</div>
								</div>
							</div>

							{memoryState.lastUpdated && (
								<div className="text-center mt-4 p-3 bg-gray-800/20 rounded-lg">
									<div className="text-gray-400 text-sm">
										🕒 Последнее обновление:{' '}
										{formatDate(memoryState.lastUpdated)}
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				)}

				{/* Список памяти */}
				<div className="space-y-6">
					{filteredMemories.length === 0 && memoryState.memories.length > 0 ? (
						<Card className="bg-gray-900/50 border-gray-800">
							<CardContent className="pt-6 text-center">
								<Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-400">
									Ничего не найдено по запросу "{searchTerm}"
								</p>
							</CardContent>
						</Card>
					) : (
						filteredMemories.map((memory, index) => (
							<Card
								key={memory.id}
								className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors"
							>
								<CardContent className="p-6">
									{/* Заголовок сообщения */}
									<div className="flex items-start justify-between mb-4">
										<div className="flex items-start gap-4 flex-1">
											<div
												className={`p-3 rounded-full ${getRoleColor(
													memory.role
												)} flex-shrink-0`}
											>
												{getRoleIcon(memory.role)}
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-3 mb-2">
													<Badge className={getRoleColor(memory.role)}>
														{memory.role === 'user'
															? '👤 Пользователь'
															: '🤖 Реплика'}
													</Badge>
													<Badge className={getSourceColor(memory.source)}>
														{memory.source === 'web'
															? '🌐 Web'
															: memory.source === 'discord'
															? '💬 Discord'
															: memory.source === 'telegram'
															? '📱 Telegram'
															: memory.source === 'embed'
															? '🔗 Embed'
															: memory.source === 'telegram_autopilot'
															? '🤖 Auto'
															: memory.source}
													</Badge>
													<span className="text-gray-500 text-sm">
														#{index + 1}
													</span>
												</div>
												<div className="flex items-center gap-2 text-sm text-gray-400">
													<span>🕒 {formatRelativeTime(memory.createdAt)}</span>
													<span>•</span>
													<span>ID: {memory.id}</span>
													<span>•</span>
													<span>{memory.content.length} символов</span>
												</div>
											</div>
										</div>
									</div>

									{/* Содержимое сообщения */}
									<div className="bg-gray-800/50 rounded-lg p-4 mb-4">
										<div className="prose prose-invert max-w-none">
											<div className="text-gray-300 leading-relaxed">
												{memory.content.split('\n').map((line, lineIndex) => (
													<p key={lineIndex} className="mb-2 last:mb-0">
														{line || '\u00A0'}
													</p>
												))}
											</div>
										</div>
									</div>

									{/* Источники RAG */}
									{memory.sources && memory.sources.length > 0 && (
										<div className="space-y-3">
											<div className="flex items-center gap-2">
												<h4 className="text-sm font-semibold text-gray-300">
													📚 Источники RAG ({memory.sources.length})
												</h4>
												<div className="h-px bg-gray-700 flex-1"></div>
											</div>
											<div className="grid gap-3">
												{memory.sources.map((source, sourceIndex) => (
													<div
														key={sourceIndex}
														className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
													>
														<div className="flex items-start justify-between mb-3">
															<div className="flex-1 min-w-0">
																<h5 className="text-sm font-medium text-gray-200 mb-1 truncate">
																	{source.name}
																</h5>
																<div className="flex items-center gap-2 text-xs text-gray-400">
																	<span>
																		Создан:{' '}
																		{formatRelativeTime(source.created_at)}
																	</span>
																	<span>•</span>
																	<span>ID: {source.id}</span>
																</div>
															</div>
															<div className="flex items-center gap-2 ml-4">
																<Badge
																	variant="outline"
																	className="text-xs bg-blue-500/10 border-blue-500/30 text-blue-300"
																>
																	Score: {source.score}
																</Badge>
																<Badge
																	variant="outline"
																	className={`text-xs ${
																		source.status === 'scored'
																			? 'border-green-500/30 text-green-300 bg-green-500/10'
																			: 'border-yellow-500/30 text-yellow-300 bg-yellow-500/10'
																	}`}
																>
																	{source.status === 'scored'
																		? '✅ Оценен'
																		: '⏳ Не оценен'}
																</Badge>
															</div>
														</div>
														<div className="bg-gray-900/50 rounded p-3">
															<p className="text-sm text-gray-300 leading-relaxed">
																{source.content.length > 200
																	? source.content.substring(0, 200) + '...'
																	: source.content}
															</p>
														</div>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Дополнительная информация */}
									<div className="mt-4 pt-4 border-t border-gray-700/50">
										<div className="flex items-center justify-between text-xs text-gray-500">
											<div className="flex items-center gap-4">
												<span>UUID: {memory.user_uuid}</span>
												{memory.sources && memory.sources.length > 0 && (
													<span>Источников: {memory.sources.length}</span>
												)}
											</div>
											<div className="text-gray-600">
												{formatDate(memory.createdAt)}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</div>

				{/* Пустое состояние */}
				{memoryState.memories.length === 0 &&
					!memoryState.isLoading &&
					!memoryState.error && (
						<Card className="bg-gray-900/50 border-gray-800">
							<CardContent className="pt-6 text-center">
								<MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
								<h3 className="text-xl font-semibold text-white mb-2">
									Память реплики пуста
								</h3>
								<p className="text-gray-400 mb-4">
									Введите UUID реплики и нажмите "Загрузить память" для
									просмотра истории чатов
								</p>
							</CardContent>
						</Card>
					)}
			</div>
		</div>
	);
}
