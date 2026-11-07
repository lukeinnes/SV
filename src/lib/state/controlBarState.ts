import { writable } from 'svelte/store';
import { LAMBDA } from '$lib/sv/constants';

export const DEFAULT_COUNTRY_ID = 'gb';
export const DEFAULT_SEATS = 650;

export type ControlBarState = {
	countryId: string;
	electionId: string;
	k: number;
	seats: number;
	useEnglishNames: boolean;
};

export const controlBarState = writable<ControlBarState>({
	countryId: DEFAULT_COUNTRY_ID,
	electionId: '',
	k: LAMBDA,
	seats: DEFAULT_SEATS,
	useEnglishNames: false
});