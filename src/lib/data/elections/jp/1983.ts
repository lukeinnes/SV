import type { Election } from '../../types';

export const jp1983: Election = {
	id: 'jp1983',
	countryId: 'jp',
	briefName: '1983',
	fullName: '1983 Japanese general election',
	actualSeatAllocation: 'SNTV',
	totalVotes: 56779701,
	totalSeats: 511,
	results: [
		{
			partyId: 'jp-ldp',
			votes: 25982785,
			seatsWon: 250
		},
		{
			partyId: 'jp-sdp',
			votes: 11065083,
			seatsWon: 112
		},
		{
			partyId: 'jp-komeito',
			votes: 5745751,
			seatsWon: 58
		},
		{
			partyId: 'jp-jcp',
			votes: 5302485,
			seatsWon: 26
		},
		{
			partyId: 'jp-democratic-socialist',
			votes: 4129908,
			seatsWon: 38
		},
		{
			partyId: 'jp-independent',
			votes: 2768736,
			seatsWon: 16
		},
		{
			partyId: 'jp-new-liberal-club',
			votes: 1341584,
			seatsWon: 8
		},
		{
			partyId: 'jp-socialist-democratic-federation',
			votes: 381045,
			seatsWon: 3
		},
		{
			partyId: 'jp-other',
			votes: 62324,
			seatsWon: 0
		}
	]
};
