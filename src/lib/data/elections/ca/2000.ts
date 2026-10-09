import type { Election } from '../../types';

export const ca2000: Election = {
	id: 'ca2000',
	countryId: 'ca',
	briefName: '2000',
	fullName: '2000 Canadian federal election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 12857773,
	totalSeats: 301,
	kEquivalent: {
		value: 4.567632,
		status: 'found',
		partyId: 'ca-liberal',
		note: 'Representative k within interval [4.502174, 4.633090]'
	},
	results: [
		{
			partyId: 'ca-liberal',
			votes: 5252031,
			seatsWon: 172
		},
		{
			partyId: 'ca-canadian-alliance',
			votes: 3276929,
			seatsWon: 66
		},
		{
			partyId: 'ca-progressive-conservative',
			votes: 1566998,
			seatsWon: 12
		},
		{
			partyId: 'ca-bloc-quebecois',
			votes: 1377727,
			seatsWon: 38
		},
		{
			partyId: 'ca-ndp',
			votes: 1093868,
			seatsWon: 13
		},
		{
			partyId: 'ca-green',
			votes: 104402,
			seatsWon: 0
		},
		{
			partyId: 'ca-marijuana',
			votes: 66258,
			seatsWon: 0
		},
		{
			partyId: 'ca-no-affiliation',
			votes: 37591,
			seatsWon: 0
		},
		{
			partyId: 'ca-independent',
			votes: 17445,
			seatsWon: 0
		},
		{
			partyId: 'ca-natural-law',
			votes: 16577,
			seatsWon: 0
		},
		{
			partyId: 'ca-communist',
			votes: 8776,
			seatsWon: 0
		},
		{
			partyId: 'ca-other',
			votes: 39171,
			seatsWon: 0
		}
	]
};
