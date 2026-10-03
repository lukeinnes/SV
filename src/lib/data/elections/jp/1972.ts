import type { Election } from '../../types';

export const jp1972: Election = {
	id: 'jp1972',
	countryId: 'jp',
	briefName: '1972',
	fullName: '1972 Japanese general election',
	actualSeatAllocation: 'SNTV',
	totalVotes: 52425077,
	totalSeats: 491,
	results: [
		{
			partyId: 'jp-ldp',
			votes: 24563199,
			seatsWon: 271
		},
		{
			partyId: 'jp-sdp',
			votes: 11478742,
			seatsWon: 118
		},
		{
			partyId: 'jp-jcp',
			votes: 5496827,
			seatsWon: 38
		},
		{
			partyId: 'jp-komeito',
			votes: 4436755,
			seatsWon: 29
		},
		{
			partyId: 'jp-democratic-socialist',
			votes: 3660953,
			seatsWon: 19
		},
		{
			partyId: 'jp-independent',
			votes: 2645582,
			seatsWon: 14
		},
		{
			partyId: 'jp-okinawa-peoples',
			votes: 64433,
			seatsWon: 1
		},
		{
			partyId: 'jp-okinawa-social-mass',
			votes: 57203,
			seatsWon: 1
		},
		{
			partyId: 'jp-other',
			votes: 21383,
			seatsWon: 0
		}
	]
};
