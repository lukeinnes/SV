import type { Country } from './types';

export const gb: Country = {
	id: 'gb',
	name: 'United Kingdom',
	alpha2: 'GB',
	alpha3: 'GBR'
};

export const jp: Country = {
	id: 'jp',
	name: 'Japan',
	alpha2: 'JP',
	alpha3: 'JPN'
};

export const fi: Country = {
	id: 'fi',
	name: 'Finland',
	alpha2: 'FI',
	alpha3: 'FIN'
};

export const us: Country = {
	id: 'us',
	name: 'United States',
	alpha2: 'US',
	alpha3: 'USA'
};

export const nl: Country = {
	id: 'nl',
	name: 'Netherlands',
	alpha2: 'NL',
	alpha3: 'NLD'
};

export const ca: Country = {
	id: 'ca',
	name: 'Canada',
	alpha2: 'CA',
	alpha3: 'CAN'
};



export const countries: Country[] = [gb, jp, fi, us, nl, ca];
