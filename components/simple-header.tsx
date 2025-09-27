'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ModeToggle } from './mode-toggle';
import { Button } from '@/components/ui/button';
import { MessageSquare, ChevronDown, Bot } from 'lucide-react';
import { useSidebar } from './sidebar-context';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SimpleHeaderProps {
	locale: string;
}

export default function SimpleHeader({ locale }: SimpleHeaderProps) {
	const pathname = usePathname();
	const { toggleAIChat } = useSidebar();

	const getLocalizedText = (key: string) => {
		const translations = {
			en: {
				home: 'Home',
				administration: 'Administration',
				aiTraining: 'AI Training',
				experimental: 'Experimental',
				apiSettings: 'API Settings',
				apiKeys: 'API Keys',
				replicas: 'Replicas',
				chatHistory: 'Chat History',
				experimentalApi: 'Experimental API',
				aiAssistant: 'AI Assistant',
				activeReplica: 'Active Replica',
				selectReplica: 'Select Replica',
				noReplicasAvailable: 'No replicas available',
			},
			ru: {
				home: 'Главная',
				administration: 'Администрирование',
				aiTraining: 'Обучение ИИ',
				experimental: 'Экспериментальный',
				apiSettings: 'Настройки API',
				apiKeys: 'Ключи API',
				replicas: 'Реплики',
				chatHistory: 'История чатов',
				experimentalApi: 'Экспериментальный API',
				aiAssistant: 'ИИ-Ассистент',
				activeReplica: 'Активная реплика',
				selectReplica: 'Выбрать реплику',
				noReplicasAvailable: 'Реплики недоступны',
			},
			es: {
				home: 'Inicio',
				administration: 'Administración',
				aiTraining: 'Entrenamiento IA',
				experimental: 'Experimental',
				apiSettings: 'Configuración API',
				apiKeys: 'Claves API',
				replicas: 'Réplicas',
				chatHistory: 'Historial de Chat',
				experimentalApi: 'API Experimental',
				aiAssistant: 'Asistente IA',
				activeReplica: 'Réplica Activa',
				selectReplica: 'Seleccionar Réplica',
				noReplicasAvailable: 'No hay réplicas disponibles',
			},
		};
		return (
			translations[locale as keyof typeof translations]?.[
				key as keyof typeof translations.en
			] || key
		);
	};

	const adminItems = [
		{
			name: getLocalizedText('apiSettings'),
			path: `/${locale}/admin/settings`,
		},
		{ name: getLocalizedText('apiKeys'), path: `/${locale}/api-keys` },
	];

	const sensayTrainingItems = [
		{ name: getLocalizedText('aiTraining'), path: `/${locale}/training` },
		{ name: getLocalizedText('replicas'), path: `/${locale}/replicas` },
		{ name: getLocalizedText('chatHistory'), path: `/${locale}/chat-history` },
	];

	const experimentalItems = [
		{
			name: getLocalizedText('experimentalApi'),
			path: `/${locale}/experimental`,
		},
	];

	const getLanguageFlag = (lang: string) => {
		switch (lang) {
			case 'en':
				return '🇺🇸';
			case 'es':
				return '🇪🇸';
			case 'ru':
				return '🇷🇺';
			default:
				return '🌍';
		}
	};

	const getLanguageName = (lang: string) => {
		switch (lang) {
			case 'en':
				return 'English';
			case 'es':
				return 'Español';
			case 'ru':
				return 'Русский';
			default:
				return 'Language';
		}
	};

	return (
		<header className="border-b bg-background/95 backdrop-blur-md text-foreground sticky top-0 z-50">
			<div className="container mx-auto px-4 py-3 flex items-center justify-between">
				<div className="flex items-center gap-4">
				<Link
							href="/"
							className={`text-sm font-medium transition-colors hover:text-primary ${
								pathname === '/' ? 'text-primary' : 'text-foreground'
							}`}
						>
					<h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent-500 bg-clip-text text-transparent">
						Evoo
					</h1>
					</Link>

					<nav className="hidden md:flex items-center gap-6">
						{/* Dropdown menu for administration */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="flex items-center gap-1 text-foreground hover:bg-surface-200 hover:text-foreground px-3 py-2 h-auto rounded-lg transition-all duration-200 hover:shadow-soft"
								>
									<span className="text-sm font-medium">
										{getLocalizedText('administration')}
									</span>
									<ChevronDown size={14} />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{adminItems.map((item) => (
									<DropdownMenuItem key={item.path} asChild>
										<Link
											href={item.path}
											className={
												pathname === item.path
													? 'bg-accent text-accent-foreground'
													: ''
											}
										>
											{item.name}
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Dropdown menu for AI training */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="flex items-center gap-1 text-foreground hover:bg-surface-200 hover:text-foreground px-3 py-2 h-auto rounded-lg transition-all duration-200 hover:shadow-soft"
								>
									<span className="text-sm font-medium">
										{getLocalizedText('aiTraining')}
									</span>
									<ChevronDown size={14} />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{sensayTrainingItems.map((item) => (
									<DropdownMenuItem key={item.path} asChild>
										<Link
											href={item.path}
											className={
												pathname === item.path
													? 'bg-accent text-accent-foreground'
													: ''
											}
										>
											{item.name}
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Dropdown menu for experimental API */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="flex items-center gap-1 text-foreground hover:bg-surface-200 hover:text-foreground px-3 py-2 h-auto rounded-lg transition-all duration-200 hover:shadow-soft"
								>
									<span className="text-sm font-medium">
										{getLocalizedText('experimental')}
									</span>
									<ChevronDown size={14} />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{experimentalItems.map((item) => (
									<DropdownMenuItem key={item.path} asChild>
										<Link
											href={item.path}
											className={
												pathname === item.path
													? 'bg-accent text-accent-foreground'
													: ''
											}
										>
											{item.name}
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</nav>
				</div>

				<div className="flex items-center gap-3">
					<Button
						variant="ghost"
						size="icon"
						className="text-foreground hover:bg-surface-200 hover:text-foreground rounded-lg transition-all duration-200 hover:shadow-soft"
						title={getLocalizedText('aiAssistant')}
						onClick={toggleAIChat}
					>
						<MessageSquare className="text-foreground" />
					</Button>

					<ModeToggle />

					{/* Language Switcher */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="text-foreground hover:bg-surface-200 hover:text-foreground rounded-lg transition-all duration-200 hover:shadow-soft"
								title="Switch Language"
							>
								<span className="text-lg">{getLanguageFlag(locale)}</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{['en', 'es', 'ru'].map((language) => (
								<DropdownMenuItem
									key={language}
									asChild
									className={
										locale === language
											? 'bg-accent text-accent-foreground'
											: ''
									}
								>
									<Link
										href={`/${language}`}
										className="flex items-center gap-2"
									>
										<span className="text-lg">{getLanguageFlag(language)}</span>
										<span>{getLanguageName(language)}</span>
									</Link>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Replica Selection */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="flex items-center gap-1 text-foreground hover:bg-surface-200 hover:text-foreground px-3 py-2 h-auto rounded-lg transition-all duration-200 hover:shadow-soft"
							>
								<Bot size={14} className="mr-1" />
								<span className="text-sm font-medium">
									{getLocalizedText('selectReplica')}
								</span>
								<ChevronDown size={14} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>
								{getLocalizedText('activeReplica')}
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem disabled>
								{getLocalizedText('noReplicasAvailable')}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
