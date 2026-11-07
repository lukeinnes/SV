const countryFlagsById: Record<string, string> = {
	ca: '🇨🇦',
	fi: '🇫🇮',
	gb: '🇬🇧',
	jp: '🇯🇵',
	lt: '🇱🇹',
	nl: '🇳🇱',
	pl: '🇵🇱',
	us: '🇺🇸'
};

export function flagForCountryId(countryId: string): string {
	return countryFlagsById[countryId] ?? '🏳️';
}

export function countryLabelWithFlag(countryId: string, countryName: string): string {
	return `${flagForCountryId(countryId)} ${countryName}`;
}
