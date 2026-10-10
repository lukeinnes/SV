export const muscleGraphConfig = {
	svg: {
		width: 720,
		height: 720,
		padding: 56
	},

	performance: {
		pathSteps: 320,
		boundSteps: 180,
		candidateCount: 40,
		spacingSampleSteps: 120,
		boundarySearchSteps: 24
	},

	spacing: {
		defaultLineGap: 8,
		minLineGap: 8,
		maxLineGap: 28,
		fMargin: 0.018,
		minSamples: 5
	},

	colours: {
		background: '#ffffff',
		grid: '#e2e8f0',
		area: '#dbeafe',
		axis: '#0f172a',
		label: '#64748b',
		axisTitle: '#334155',
		redLine: '#ef4444',
		greenLine: '#16a34a',
		bound: '#2563eb',
		highlight: '#0f172a'
	},

	strokes: {
		ciLine: 1.5,
		centreLine: 2,
		bound: 3,
		highlight: 4
	},

	opacity: {
		area: 0.28,
		ciLine: 0.32,
		centreLine: 0.55
	}
} as const;

export const mandateCurveConfig = {
	svg: {
		width: 720,
		height: 420,
		paddingLeft: 64,
		paddingRight: 28,
		paddingTop: 28,
		paddingBottom: 58
	},

	performance: {
		pathSteps: 180
	},

	axis: {
		maxVoteShare: 0.5,
		maxMandate: 1000,
		pointStep: 0.05
	},

	colours: {
		background: '#ffffff',
		grid: '#e2e8f0',
		axis: '#0f172a',
		label: '#64748b',
		axisTitle: '#334155',
		curve: '#2563eb',
		point: '#0f172a',
		anchor: '#ef4444'
	},

	strokes: {
		curve: 4,
		point: 2,
		anchor: 3
	}
} as const;

export const mandatePerVoteConfig = {
	svg: {
		width: 720,
		height: 420,
		paddingLeft: 64,
		paddingRight: 28,
		paddingTop: 28,
		paddingBottom: 58
	},

	axis: {
		maxVoteShare: 0.5,
		maxMandatePerPercent: 20,
		pointStep: 0.05
	},

	colours: {
		background: '#ffffff',
		grid: '#e2e8f0',
		axis: '#0f172a',
		label: '#64748b',
		axisTitle: '#334155',
		bar: '#2563eb',
		anchor: '#ef4444'
	}
} as const;

export const consolidationMultiplierConfig = {
	svg: {
		width: 720,
		height: 420,
		paddingLeft: 64,
		paddingRight: 28,
		paddingTop: 28,
		paddingBottom: 58
	},

	axis: {
		maxVoteShare: 0.5,
		pointStep: 0.05,
		minYAxisMax: 2.5,
		yAxisHeadroom: 1.14
	},

	colours: {
		background: '#ffffff',
		grid: '#e2e8f0',
		axis: '#0f172a',
		label: '#64748b',
		axisTitle: '#334155',
		bar: '#2563eb',
		anchor: '#ef4444'
	}
} as const;

export const seatBlocksConfig = {
	svg: {
		plotTop: 46,
		plotHeight: 320,
		plotBottom: 62
	},

	layout: {
		seatBlockToVoteWidthRatio: 1.41,
		columnGap: 32,
		minVoteWidth: 72,
		minSeatBlockWidth: 120
	},

	grid: {
		minCircleRadius: 1.4,
		circleRadiusRatio: 0.36
	},

	colours: {
		background: '#ffffff',
		frame: '#cbd5e1',
		label: '#64748b',
		title: '#0f172a'
	}
} as const;