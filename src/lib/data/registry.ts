import type { Country, Election, Party } from './types';

import { countries } from './countries';

import { gbParties } from './parties/gb';
import { jpParties } from './parties/jp';
import { fiParties } from './parties/fi';
import { usParties } from './parties/us';
import { nlParties } from './parties/nl';
import { caParties } from './parties/ca';

import { gbElections } from './elections/gb';
import { jpElections } from './elections/jp';
import { fiElections } from './elections/fi';
import { usElections } from './elections/us';
import { nlElections } from './elections/nl';
import { caElections } from './elections/ca';

export type CountryDataset = {
	country: Country;
	parties: Party[];
	elections: Election[];
};

type CountryModule = {
	countryId: string;
	parties: Party[];
	elections: Election[];
};

const countryModules: CountryModule[] = [
	{
		countryId: 'gb',
		parties: gbParties,
		elections: gbElections
	},
	{
		countryId: 'jp',
		parties: jpParties,
		elections: jpElections
	},
	{
		countryId: 'fi',
		parties: fiParties,
		elections: fiElections
	},
	{
		countryId: 'us',
		parties: usParties,
		elections: usElections
	},
	{
		countryId: 'nl',
		parties: nlParties,
		elections: nlElections
	},
	{
		countryId: 'ca',
		parties: caParties,
		elections: caElections
	},

];

function getCountry(countryId: string): Country {
	const country = countries.find((item) => item.id === countryId);

	if (!country) {
		throw new Error(`Country ${countryId} is imported in registry.ts but missing from countries.ts.`);
	}

	return country;
}

function makeCountryDataset(module: CountryModule): CountryDataset {
	return {
		country: getCountry(module.countryId),
		parties: module.parties,
		elections: module.elections
	};
}

export const countryDatasets: CountryDataset[] = countries
	.map((country) => {
		const module = countryModules.find((item) => item.countryId === country.id);

		if (!module) return undefined;

		return makeCountryDataset(module);
	})
	.filter((dataset): dataset is CountryDataset => dataset !== undefined);

export function getCountryDataset(countryId: string): CountryDataset {
	const dataset = countryDatasets.find((item) => item.country.id === countryId);

	if (!dataset) {
		throw new Error(`Unknown country: ${countryId}`);
	}

	return dataset;
}