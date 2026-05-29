import { AuthProvider } from '@/components/providers/auth-provider';
import { ConfirmationProvider } from '@/components/providers/confirmation-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { UiProviders } from '@/components/providers/ui-providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const font = Inter({
	subsets: ['cyrillic', 'latin'],
	weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
	title: 'Журнал работ',
	description: 'Журнал учёта выполненных работ',
};

const setThemeByRender = `try {
  var theme = localStorage.getItem('job-journal-theme');
  if (theme) theme = theme.replace(/"/g, '');
  var root = document.documentElement;
  root.setAttribute('class', theme === 'dark' ? 'dark' : '');
  root.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
} catch (e) {}`;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>): React.ReactElement {
	return (
		<html lang="ru" suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: setThemeByRender,
					}}
				/>
			</head>
			<body className={`antialiased ${font.className}`}>
				<ThemeProvider>
					<ConfirmationProvider>
						<AuthProvider>
							<UiProviders>{children}</UiProviders>
						</AuthProvider>
					</ConfirmationProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
