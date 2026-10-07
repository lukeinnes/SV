import type { Election } from '../../types';

export const gb1974Oct: Election = {
	id: 'gb1974Oct',
	countryId: 'gb',
	briefName: 'Oct 1974',
	fullName: 'October 1974 United Kingdom general election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 29189218,
	totalSeats: 635,
	kEquivalent: {
		value: 6.677078,
		status: 'found',
		partyId: 'gb-labour',
		note: 'Representative k within interval [6.632712, 6.721445]'
	},
	results: [
		{
			partyId: 'gb-labour',
			votes: 11457079,
			seatsWon: 319
		},
		{
			partyId: 'gb-conservative',
			votes: 10429112,
			seatsWon: 276
		},
		{
			partyId: 'gb-liberal',
			votes: 5346764,
			seatsWon: 13
		},
		{
			partyId: 'gb-snp',
			votes: 839617,
			seatsWon: 11
		},
		{
			partyId: 'gb-uup',
			votes: 256105,
			seatsWon: 6
		},
		{
			partyId: 'gb-plaid-cymru',
			votes: 166311,
			seatsWon: 3
		},
		{
			partyId: 'gb-sdlp',
			votes: 154193,
			seatsWon: 1
		},
		{
			partyId: 'gb-national-front',
			votes: 113843,
			seatsWon: 0
		},
		{
			partyId: 'gb-vupp',
			votes: 92262,
			seatsWon: 3
		},
		{
			partyId: 'gb-dup',
			votes: 59451,
			seatsWon: 1
		},
		{
			partyId: 'gb-alliance-ni',
			votes: 44644,
			seatsWon: 0
		},
		{
			partyId: 'gb-upni',
			votes: 20454,
			seatsWon: 0
		},
		{
			partyId: 'gb-communist',
			votes: 17426,
			seatsWon: 0
		},
		{
			partyId: 'gb-wrp',
			votes: 3404,
			seatsWon: 0
		},
		{
			partyId: 'gb-mk',
			votes: 384,
			seatsWon: 0
		},
		{
			partyId: 'gb-speaker',
			votes: 35705,
			seatsWon: 1
		},
		{
			partyId: 'gb-independent',
			votes: 80868,
			seatsWon: 1
		},
		{
			partyId: 'gb-other',
			votes: 71596,
			seatsWon: 0
		}
	]
};
