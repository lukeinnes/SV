import type { Election } from '../../types';

export const jp1986: Election = {
	id: 'jp1986',
	countryId: 'jp',
	briefName: '1986',
	fullName: '1986 Japanese general election',
	actualSeatAllocation: 'SNTV',
	totalVotes: 60448606,
	totalSeats: 512,
	kEquivalent: {
		value: 1.142186,
		status: 'found',
		partyId: 'jp-ldp',
		note: 'Representative k within interval [1.112031, 1.172341]'
	},
	results: [
		{
			partyId: 'jp-ldp',
			votes: 29875501,
			seatsWon: 300
		},
		{
			partyId: 'jp-sdp',
			votes: 10412584,
			seatsWon: 85
		},
		{
			partyId: 'jp-komeito',
			votes: 5701277,
			seatsWon: 56
		},
		{
			partyId: 'jp-jcp',
			votes: 5313246,
			seatsWon: 26
		},
		{
			partyId: 'jp-democratic-socialist',
			votes: 3895858,
			seatsWon: 26
		},
		{
			partyId: 'jp-independent',
			votes: 3515043,
			seatsWon: 9
		},
		{
			partyId: 'jp-new-liberal-club',
			votes: 1114800,
			seatsWon: 6
		},
		{
			partyId: 'jp-socialist-democratic-federation',
			votes: 499670,
			seatsWon: 4
		},
		{
			partyId: 'jp-other',
			votes: 120627,
			seatsWon: 0
		}
	]
};
