import type { Election } from '../../types';

export const fi1983: Election = {
	id: 'fi1983',
	countryId: 'fi',
	briefName: '1983',
	fullName: '1983 Finnish parliamentary election',
	actualSeatAllocation: 'PR',
	totalVotes: 2979694,
	totalSeats: 200,
	kEquivalent: {
		value: 1.258439,
		status: 'found',
		partyId: 'fi-sdp',
		note: 'Representative k within interval [1.142418, 1.374459]'
	},
	results: [
		{
			partyId: 'fi-sdp',
			votes: 795953,
			seatsWon: 57
		},
		{
			partyId: 'fi-national-coalition',
			votes: 659078,
			seatsWon: 44
		},
		{
			partyId: 'fi-centre-liberal-alliance',
			votes: 525207,
			seatsWon: 38
		},
		{
			partyId: 'fi-skdl',
			votes: 400930,
			seatsWon: 26
		},
		{
			partyId: 'fi-rural',
			votes: 288711,
			seatsWon: 17
		},
		{
			partyId: 'fi-swedish-peoples',
			votes: 137423,
			seatsWon: 10
		},
		{
			partyId: 'fi-christian-democrats',
			votes: 90410,
			seatsWon: 3
		},
		{
			partyId: 'fi-green',
			votes: 43754,
			seatsWon: 2
		},
		{
			partyId: 'fi-independent',
			votes: 15331,
			seatsWon: 1
		},
		{
			partyId: 'fi-constitutional-right',
			votes: 11104,
			seatsWon: 1
		},
		{
			partyId: 'fi-liberals-aland',
			votes: 5754,
			seatsWon: 1
		},
		{
			partyId: 'fi-other',
			votes: 6039,
			seatsWon: 0
		}
	]
};
