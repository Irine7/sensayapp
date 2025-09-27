'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const languages = [
	{ code: 'en', name: 'English', flag: '🇺🇸' },
	{ code: 'es', name: 'Español', flag: '🇪🇸' },
	{ code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

export function LanguageSwitcher() {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	const handleLanguageChange = (newLocale: string) => {
		// Remove current locale from pathname and add new one
		const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
		const newPath = `/${newLocale}${pathWithoutLocale}`;
		router.push(newPath);
	};

	const currentLanguage =
		languages.find((lang) => lang.code === locale) || languages[0];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="text-foreground hover:bg-surface-200 hover:text-foreground rounded-lg transition-all duration-200 hover:shadow-soft"
					title="Switch Language"
				>
					<Globe className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{languages.map((language) => (
					<DropdownMenuItem
						key={language.code}
						onClick={() => handleLanguageChange(language.code)}
						className={`flex items-center gap-2 ${
							locale === language.code ? 'bg-accent text-accent-foreground' : ''
						}`}
					>
						<span className="text-lg">{language.flag}</span>
						<span>{language.name}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
