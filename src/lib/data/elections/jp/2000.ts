import type { Election } from '../../types';

export const jp2000: Election = {
	id: 'jp2000',
	countryId: 'jp',
	briefName: '2000',
	fullName: '2000 Japanese general election',
	actualSeatAllocation: 'Parallel',
	totalVotes: 120727072,
	totalSeats: 480,
	results: [
		{
			partyId: 'jp-ldp',
			votes: 41889231,
			seatsWon: 233
		},
		{
			partyId: 'jp-dpj',
			votes: 31879722,
			seatsWon: 127
		},
		{
			partyId: 'jp-jcp',
			votes: 14071860,
			seatsWon: 20
		},
		{
			partyId: 'jp-komeito',
			votes: 8993785,
			seatsWon: 31
		},
		{
			partyId: 'jp-liberal-party',
			votes: 8643226,
			seatsWon: 22
		},
		{
			partyId: 'jp-sdp',
			votes: 7918915,
			seatsWon: 19
		},
		{
			partyId: 'jp-independent',
			votes: 2967069,
			seatsWon: 15
		},
		{
			partyId: 'jp-liberal-league',
			votes: 1731736,
			seatsWon: 1
		},
		{
			partyId: 'jp-new-conservative-party',
			votes: 1477798,
			seatsWon: 7
		},
		{
			partyId: 'jp-assembly-independents',
			votes: 803483,
			seatsWon: 5
		},
		{
			partyId: 'jp-other',
			votes: 350247,
			seatsWon: 0
		}
	]
};
