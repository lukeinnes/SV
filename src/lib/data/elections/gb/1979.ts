import type { Election } from '../../types';

export const gb1979: Election = {
	id: 'gb1979',
	countryId: 'gb',
	briefName: '1979',
	fullName: '1979 United Kingdom general election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 31221928,
	totalSeats: 635,
	kEquivalent: {
		value: 4.260882,
		status: 'found',
		partyId: 'gb-conservative',
		note: 'Representative k within interval [4.212701, 4.309062]'
	},
	results: [
		{
			partyId: 'gb-conservative',
			votes: 13697516,
			seatsWon: 339
		},
		{
			partyId: 'gb-labour',
			votes: 11505313,
			seatsWon: 268
		},
		{
			partyId: 'gb-liberal',
			votes: 4313821,
			seatsWon: 11
		},
		{
			partyId: 'gb-snp',
			votes: 504259,
			seatsWon: 2
		},
		{
			partyId: 'gb-uup',
			votes: 254578,
			seatsWon: 5
		},
		{
			partyId: 'gb-national-front',
			votes: 191719,
			seatsWon: 0
		},
		{
			partyId: 'gb-plaid-cymru',
			votes: 132544,
			seatsWon: 2
		},
		{
			partyId: 'gb-sdlp',
			votes: 126325,
			seatsWon: 1
		},
		{
			partyId: 'gb-alliance-ni',
			votes: 82892,
			seatsWon: 0
		},
		{
			partyId: 'gb-dup',
			votes: 70975,
			seatsWon: 3
		},
		{
			partyId: 'gb-green',
			votes: 39918,
			seatsWon: 0
		},
		{
			partyId: 'gb-uuup',
			votes: 39856,
			seatsWon: 1
		},
		{
			partyId: 'gb-communist',
			votes: 16858,
			seatsWon: 0
		},
		{
			partyId: 'gb-slp',
			votes: 13737,
			seatsWon: 0
		},
		{
			partyId: 'gb-wrp',
			votes: 12631,
			seatsWon: 0
		},
		{
			partyId: 'gb-mk',
			votes: 4164,
			seatsWon: 0
		},
		{
			partyId: 'gb-speaker',
			votes: 27035,
			seatsWon: 1
		},
		{
			partyId: 'gb-independent',
			votes: 59387,
			seatsWon: 2
		},
		{
			partyId: 'gb-other',
			votes: 128400,
			seatsWon: 0
		}
	]
};
