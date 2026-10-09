import type { Election } from '../../types';

export const jp1976: Election = {
	id: 'jp1976',
	countryId: 'jp',
	briefName: '1976',
	fullName: '1976 Japanese general election',
	actualSeatAllocation: 'SNTV',
	totalVotes: 56612765,
	totalSeats: 511,
	kEquivalent: {
		value: 1.144275,
		status: 'found',
		partyId: 'jp-ldp',
		note: 'Representative k within interval [1.120509, 1.168041]'
	},
	results: [
		{
			partyId: 'jp-ldp',
			votes: 23653626,
			seatsWon: 249
		},
		{
			partyId: 'jp-sdp',
			votes: 11713009,
			seatsWon: 123
		},
		{
			partyId: 'jp-komeito',
			votes: 6177300,
			seatsWon: 55
		},
		{
			partyId: 'jp-jcp',
			votes: 5878192,
			seatsWon: 17
		},
		{
			partyId: 'jp-democratic-socialist',
			votes: 3554076,
			seatsWon: 29
		},
		{
			partyId: 'jp-independent',
			votes: 3227463,
			seatsWon: 21
		},
		{
			partyId: 'jp-new-liberal-club',
			votes: 2363985,
			seatsWon: 17
		},
		{
			partyId: 'jp-other',
			votes: 45114,
			seatsWon: 0
		}
	]
};
