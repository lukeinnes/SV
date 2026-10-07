import type { Election } from '../../types';

export const gb1983: Election = {
	id: 'gb1983',
	countryId: 'gb',
	briefName: '1983',
	fullName: '1983 United Kingdom general election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 30671429,
	totalSeats: 650,
	kEquivalent: {
		value: 6.516788,
		status: 'found',
		partyId: 'gb-conservative',
		note: 'Representative k within interval [6.503675, 6.529900]'
	},
	results: [
		{
			partyId: 'gb-conservative',
			votes: 13012265,
			seatsWon: 397
		},
		{
			partyId: 'gb-labour',
			votes: 8457010,
			seatsWon: 209
		},
		{
			partyId: 'gb-sdp-liberal',
			votes: 7772870,
			seatsWon: 23
		},
		{
			partyId: 'gb-snp',
			votes: 331975,
			seatsWon: 2
		},
		{
			partyId: 'gb-uup',
			votes: 259952,
			seatsWon: 11
		},
		{
			partyId: 'gb-dup',
			votes: 152749,
			seatsWon: 3
		},
		{
			partyId: 'gb-sdlp',
			votes: 137012,
			seatsWon: 1
		},
		{
			partyId: 'gb-plaid-cymru',
			votes: 125309,
			seatsWon: 2
		},
		{
			partyId: 'gb-sinn-fein',
			votes: 102701,
			seatsWon: 1
		},
		{
			partyId: 'gb-alliance-ni',
			votes: 61275,
			seatsWon: 0
		},
		{
			partyId: 'gb-green',
			votes: 52767,
			seatsWon: 0
		},
		{
			partyId: 'gb-national-front',
			votes: 27065,
			seatsWon: 0
		},
		{
			partyId: 'gb-upup',
			votes: 22861,
			seatsWon: 1
		},
		{
			partyId: 'gb-bnp',
			votes: 14621,
			seatsWon: 0
		},
		{
			partyId: 'gb-communist',
			votes: 11606,
			seatsWon: 0
		},
		{
			partyId: 'gb-wrp',
			votes: 3798,
			seatsWon: 0
		},
		{
			partyId: 'gb-mrlp',
			votes: 3015,
			seatsWon: 0
		},
		{
			partyId: 'gb-mk',
			votes: 1151,
			seatsWon: 0
		},
		{
			partyId: 'gb-other',
			votes: 121427,
			seatsWon: 0
		}
	]
};
