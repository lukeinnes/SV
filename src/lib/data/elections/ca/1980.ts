import type { Election } from '../../types';

export const ca1980: Election = {
	id: 'ca1980',
	countryId: 'ca',
	briefName: '1980',
	fullName: '1980 Canadian federal election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 10949536,
	totalSeats: 282,
	kEquivalent: {
		value: 2.954865,
		status: 'found',
		partyId: 'ca-liberal',
		note: 'Representative k within interval [2.869639, 3.040091]'
	},
	results: [
		{
			partyId: 'ca-liberal',
			votes: 4855425,
			seatsWon: 147
		},
		{
			partyId: 'ca-progressive-conservative',
			votes: 3552994,
			seatsWon: 103
		},
		{
			partyId: 'ca-ndp',
			votes: 2165087,
			seatsWon: 32
		},
		{
			partyId: 'ca-social-credit',
			votes: 185486,
			seatsWon: 0
		},
		{
			partyId: 'ca-rhinoceros',
			votes: 110597,
			seatsWon: 0
		},
		{
			partyId: 'ca-libertarian',
			votes: 14656,
			seatsWon: 0
		},
		{
			partyId: 'ca-independent',
			votes: 14472,
			seatsWon: 0
		},
		{
			partyId: 'ca-communist',
			votes: 6022,
			seatsWon: 0
		},
		{
			partyId: 'ca-no-affiliation',
			votes: 3063,
			seatsWon: 0
		},
		{
			partyId: 'ca-other',
			votes: 41734,
			seatsWon: 0
		}
	]
};
