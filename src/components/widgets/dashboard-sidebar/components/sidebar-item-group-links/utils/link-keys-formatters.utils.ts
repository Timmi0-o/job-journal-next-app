import micromatch from 'micromatch';
import { ISidebarLink } from '../../../data/links/types/i-sidebar-link';

export function pathMatchesLink(pathname: string, item: ISidebarLink): boolean {
	if (item.href && micromatch.isMatch(pathname, `**${item.href}`)) return true;
	if (item.items) return item.items.some((sub) => pathMatchesLink(pathname, sub));
	return false;
}

export function getInitialOpenKeys(
	links: ISidebarLink[],
	pathname: string
): Set<string> {
	const keys = new Set<string>();
	for (const link of links) {
		if (!link.items?.length) continue;
		const groupKey = link.label;
		const hasActive = link.items.some((item) => {
			if (item.items)
				return item.items.some((sub) => pathMatchesLink(pathname, sub));
			return pathMatchesLink(pathname, item);
		});
		if (hasActive) keys.add(groupKey);
		for (const sub of link.items) {
			if (!sub.items?.length) continue;
			const nestedKey = `${groupKey}::${sub.label}`;
			const hasNestedActive = sub.items.some((s) => pathMatchesLink(pathname, s));
			if (hasNestedActive) keys.add(nestedKey);
		}
	}
	return keys;
}

export function buildHref(
	prefix: string | undefined,
	href: string | undefined
): string {
	if (!href) return '#';
	const clean = href.replace(/^\//, '');
	return prefix ? `/${prefix}/${clean}` : `/${clean}`;
}
