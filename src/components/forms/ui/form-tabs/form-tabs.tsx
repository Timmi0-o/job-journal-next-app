'use client';

import { Tabs } from '@heroui/react';

interface IFormTab {
	name: string;
	key: string;
	component: React.ReactNode;
	isDisabled?: boolean;
	isHidden?: boolean;
}

interface IFormTabsProps {
	tabs: IFormTab[];
	activeTab?: string | null;
	setActiveTab?: (tabKey: string) => void;
}

export const FormTabs = ({ tabs, activeTab, setActiveTab }: IFormTabsProps) => {
	const firstKey = tabs[0]?.key ?? '';
	const isControlled = setActiveTab != null;

	return (
		<div className="flex min-h-0 w-full flex-1 flex-col gap-2">
			<Tabs
				className="flex min-h-0 w-full flex-1 flex-col gap-2"
				selectedKey={isControlled ? (activeTab ?? firstKey) : undefined}
				defaultSelectedKey={isControlled ? undefined : firstKey}
				onSelectionChange={
					isControlled
						? (key) => {
								if (key != null) {
									setActiveTab(String(key));
								}
							}
						: undefined
				}
			>
				<Tabs.ListContainer className="w-fit shrink-0">
					<Tabs.List aria-label="Разделы формы">
						{tabs
							.filter((tab) => !tab.isHidden)
							.map((tab) => (
								<Tabs.Tab
									key={tab.key}
									id={tab.key}
									className="w-fit"
									isDisabled={tab.isDisabled}
								>
									{tab.name}
									<Tabs.Indicator />
								</Tabs.Tab>
							))}
					</Tabs.List>
				</Tabs.ListContainer>
				{tabs.map((tab) => (
					<Tabs.Panel
						key={tab.key}
						id={tab.key}
						className="flex min-h-0 min-w-0 flex-1 flex-col"
					>
						{tab.component}
					</Tabs.Panel>
				))}
			</Tabs>
		</div>
	);
};
