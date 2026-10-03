import type { Election } from '../../types';

export const jp1980: Election = {
	id: 'jp1980',
	countryId: 'jp',
	briefName: '1980',
	fullName: '1980 Japanese general election',
	actualSeatAllocation: 'SNTV',
	totalVotes: 59028836,
	totalSeats: 511,
	results: [
		{
			partyId: 'jp-ldp',
			votes: 28262442,
			seatsWon: 284
		},
		{
			partyId: 'jp-sdp',
			votes: 11400748,
			seatsWon: 107
		},
		{
			partyId: 'jp-jcp',
			votes: 5803613,
			seatsWon: 29
		},
		{
			partyId: 'jp-komeito',
			votes: 5329942,
			seatsWon: 33
		},
		{
			partyId: 'jp-democratic-socialist',
			votes: 3896728,
			seatsWon: 32
		},
		{
			partyId: 'jp-independent',
			votes: 2056967,
			seatsWon: 11
		},
		{
			partyId: 'jp-new-liberal-club',
			votes: 1766396,
			seatsWon: 12
		},
		{
			partyId: 'jp-socialist-democratic-federation',
			votes: 402832,
			seatsWon: 3
		},
		{
			partyId: 'jp-other',
			votes: 109168,
			seatsWon: 0
		}
	]
};
