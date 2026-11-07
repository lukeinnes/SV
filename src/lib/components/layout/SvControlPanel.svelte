
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { svControlPanelConfig } from '$lib/graphs/graphConfig';
	import { LAMBDA } from '$lib/sv/constants';
	import { calculateMandate } from '$lib/sv/mandate';
	import { calculateA } from '$lib/sv/parameters';

	type MusclePoint = {
		id: string;
		x: number;
		fractionOfPower: number;
		colour: string;
	};

	type Props = {
		k?: number;
		seatCount?: number;
		showSeatSlider?: boolean;
		defaultSeatCount?: number;
		useEnglishNames?: boolean;
		showEnglishToggle?: boolean;
		currentTotalMandate?: number;
		musclePoints?: MusclePoint[];
		electionVotes?: number;
		electionSeats?: number;
		selectors: Snippet;
	};

	type Point = {
		x: number;
		y: number;
	};

	type StrengthBar = {
		id: string;
		label: string;
		value: number;
		x: number;
		y: number;
		width: number;
		height: number;
		labelX: number;
	};

	type MandateMarker = {
		id: string;
		x: number;
		y: number;
		mandate: number;
		showLabel: boolean;
	};

	type MuscleDiamond = {
		id: string;
		x: number;
		y: number;
		colour: string;
	};

	let {
		k = $bindable(LAMBDA),
		seatCount = $bindable(650),
		showSeatSlider = false,
		defaultSeatCount = 650,
		useEnglishNames = $bindable(false),
		showEnglishToggle = false,
		currentTotalMandate,
		musclePoints = [],
		electionVotes,
		electionSeats,
		selectors
	}: Props = $props();

	// -----------------------------------------------
	// CONTROL LIMITS AND INCREMENTS
	// -----------------------------------------------

	const minK = 0.01;
	const maxK = 12;
	const kStep = 0.01;
	const kWheelStep = 0.05;

	const kSmallIncrement = 0.01;
	const kLargeIncrement = 0.10;

	const minSeatCount = 20;
	const maxSeatCount = 1000;
	const seatStep = 1;

	const seatSmallIncrement = 1;
	const seatLargeIncrement = 10;

	function clamp(
		value: number,
		minimum: number,
		maximum: number
	): number {
		return Math.min(maximum, Math.max(minimum, value));
	}

	function roundToSliderStep(value: number): number {
		return Number(clamp(value, minK, maxK).toFixed(2));
	}

	function formatKInput(value: number): string {
		return Object.is(value, LAMBDA)
			? LAMBDA.toFixed(4)
			: Number(value.toFixed(4)).toString();
	}

	let sliderK = $state(roundToSliderStep(k));
	let kDraft = $state(formatKInput(k));
	let seatDraft = $state(String(Math.round(seatCount)));

	let editingK = $state(false);
	let editingSeats = $state(false);

	function handleKSliderInput(event: Event): void {
		const input = event.currentTarget as HTMLInputElement;
		const value = Number(input.value);

		k = value;
		sliderK = value;
	}

	function handleKNumberInput(event: Event): void {
		const input = event.currentTarget as HTMLInputElement;
		kDraft = input.value;

		if (input.value.trim() === '') return;

		const value = Number(input.value);

		if (
			Number.isFinite(value) &&
			value >= minK &&
			value <= maxK
		) {
			k = value;
		}
	}

	function commitKNumber(): void {
		editingK = false;

		const value = Number(kDraft);

		if (
			kDraft.trim() !== '' &&
			Number.isFinite(value)
		) {
			k = clamp(value, minK, maxK);
		}

		kDraft = formatKInput(k);
	}

	/*
	 * All k adjustment buttons first round the current
	 * value to two decimal places.
	 *
	 * For example:
	 * LAMBDA = 5.336845...
	 * Rounded = 5.34
	 * Press +  = 5.35
	 * Press ++ = 5.44
	 */

	function adjustK(delta: number): void {
		const roundedBase = Math.round(k * 100) / 100;
		const nextValue = clamp(
			roundedBase + delta,
			minK,
			maxK
		);

		k = Number(nextValue.toFixed(2));
	}

	function resetK(): void {
		k = LAMBDA;
	}

	function handleKWheel(event: WheelEvent): void {
		event.preventDefault();

		const direction = event.deltaY > 0 ? -1 : 1;
		adjustK(direction * kWheelStep);
	}

	function handleSeatNumberInput(event: Event): void {
		const input = event.currentTarget as HTMLInputElement;
		seatDraft = input.value;

		if (input.value.trim() === '') return;

		const value = Number(input.value);

		if (
			Number.isInteger(value) &&
			value >= minSeatCount &&
			value <= maxSeatCount
		) {
			seatCount = value;
		}
	}

	function commitSeatNumber(): void {
		editingSeats = false;

		const value = Number(seatDraft);

		if (
			seatDraft.trim() !== '' &&
			Number.isFinite(value)
		) {
			seatCount = Math.round(
				clamp(value, minSeatCount, maxSeatCount)
			);
		}

		seatDraft = String(Math.round(seatCount));
	}

	function adjustSeats(delta: number): void {
		seatCount = Math.round(
			clamp(
				seatCount + delta,
				minSeatCount,
				maxSeatCount
			)
		);
	}

	function resetSeatCount(): void {
		seatCount = Math.round(
			clamp(
				defaultSeatCount,
				minSeatCount,
				maxSeatCount
			)
		);
	}

	function handleSeatWheel(event: WheelEvent): void {
		if (!showSeatSlider) return;

		event.preventDefault();

		const direction = event.deltaY > 0 ? -1 : 1;
		adjustSeats(direction);
	}

	$effect(() => {
		sliderK = roundToSliderStep(k);

		if (!editingK) {
			kDraft = formatKInput(k);
		}
	});

	$effect(() => {
		if (!editingSeats) {
			seatDraft = String(Math.round(seatCount));
		}
	});

	// -----------------------------------------------
	// PRESS-AND-HOLD BUTTON ACTION
	// -----------------------------------------------
	//
	// One increment happens immediately.
	//
	// After 400 ms, further increments happen every
	// 65 ms until the button is released.
	//
	// Also supports holding Enter or Space when the
	// button has keyboard focus.
	//
	// Timers are cleared when the button is released,
	// loses focus, or the component is destroyed.
	// -----------------------------------------------

	const repeatDelay = 400;
	const repeatInterval = 65;

	function repeatPress(
		node: HTMLButtonElement,
		initialAction: () => void
	) {
		let action = initialAction;

		let delayTimer: ReturnType<typeof setTimeout> | null = null;
		let intervalTimer: ReturnType<typeof setInterval> | null = null;

		let keyboardPressed = false;
		let pointerPressed = false;

		function stopRepeat(): void {
			if (delayTimer !== null) {
				clearTimeout(delayTimer);
				delayTimer = null;
			}

			if (intervalTimer !== null) {
				clearInterval(intervalTimer);
				intervalTimer = null;
			}
		}

		function beginRepeat(): void {
			stopRepeat();

			if (node.disabled) return;

			// Initial click.
			action();

			// After the initial delay, repeat rapidly.
			delayTimer = setTimeout(() => {
				delayTimer = null;

				intervalTimer = setInterval(() => {
					if (node.disabled) {
						stopRepeat();
						return;
					}

					action();
				}, repeatInterval);
			}, repeatDelay);
		}

		function onPointerDown(event: PointerEvent): void {
			if (event.button !== 0 || node.disabled) return;

			pointerPressed = true;
			beginRepeat();

			// Keep receiving pointerup even when the
			// pointer moves slightly outside the button.
			node.setPointerCapture(event.pointerId);
		}

		function onPointerUp(event: PointerEvent): void {
			pointerPressed = false;
			stopRepeat();

			if (node.hasPointerCapture(event.pointerId)) {
				node.releasePointerCapture(event.pointerId);
			}
		}

		function onPointerCancel(): void {
			pointerPressed = false;
			stopRepeat();
		}

		function onPointerMove(event: PointerEvent): void {
			if (!pointerPressed) return;

			const rect = node.getBoundingClientRect();

			const outside =
				event.clientX < rect.left ||
				event.clientX > rect.right ||
				event.clientY < rect.top ||
				event.clientY > rect.bottom;

			if (outside) {
				pointerPressed = false;
				stopRepeat();
			}
		}

		function onKeyDown(event: KeyboardEvent): void {
			if (event.key !== 'Enter' && event.key !== ' ') {
				return;
			}

			event.preventDefault();

			// Ignore the browser's own key-repeat events.
			if (keyboardPressed) return;

			keyboardPressed = true;
			beginRepeat();
		}

		function onKeyUp(event: KeyboardEvent): void {
			if (event.key !== 'Enter' && event.key !== ' ') {
				return;
			}

			event.preventDefault();
			keyboardPressed = false;
			stopRepeat();
		}

		function onBlur(): void {
			keyboardPressed = false;
			pointerPressed = false;
			stopRepeat();
		}

		function onClick(event: MouseEvent): void {
			// Pointer clicks are already handled on
			// pointerdown. Do not increment twice.
			//
			// Synthetic clicks from assistive technology
			// usually have detail = 0.
			if (event.detail === 0 && !keyboardPressed) {
				if (!node.disabled) action();
			}
		}

		node.addEventListener('pointerdown', onPointerDown);
		node.addEventListener('pointerup', onPointerUp);
		node.addEventListener('pointercancel', onPointerCancel);
		node.addEventListener('pointermove', onPointerMove);
		node.addEventListener('keydown', onKeyDown);
		node.addEventListener('keyup', onKeyUp);
		node.addEventListener('blur', onBlur);
		node.addEventListener('click', onClick);

		return {
			update(nextAction: () => void) {
				action = nextAction;
			},

			destroy() {
				stopRepeat();

				node.removeEventListener('pointerdown', onPointerDown);
				node.removeEventListener('pointerup', onPointerUp);
				node.removeEventListener('pointercancel', onPointerCancel);
				node.removeEventListener('pointermove', onPointerMove);
				node.removeEventListener('keydown', onKeyDown);
				node.removeEventListener('keyup', onKeyUp);
				node.removeEventListener('blur', onBlur);
				node.removeEventListener('click', onClick);
			}
		};
	}

	// -----------------------------------------------
	// SHARED GRAPH GEOMETRY
	// -----------------------------------------------

	const configuredGraphSize =
		svControlPanelConfig.muscleGraph.size;

	const plotSize =
		configuredGraphSize *
		(1 -
			svControlPanelConfig.muscleGraph.leftPaddingRatio -
			svControlPanelConfig.muscleGraph.rightPaddingRatio);

	const graphLeftMargin = 84;
	const graphRightMargin = 18;
	const graphTopMargin = 10;
	const graphBottomMargin = 52;

	const plotLeft = graphLeftMargin;
	const plotTop = graphTopMargin;
	const plotRight = plotLeft + plotSize;
	const plotBottom = plotTop + plotSize;

	const graphSvgWidth =
		graphLeftMargin + plotSize + graphRightMargin;

	const graphSvgHeight =
		graphTopMargin + plotSize + graphBottomMargin;

	const graphViewBox =
		`0 0 ${graphSvgWidth} ${graphSvgHeight}`;

	const externalTickLength = 4;
	const xTickLabelOffset = 16;
	const xAxisTitleOffset = 31;
	const yTickLabelGap = 8;

	const yAxisTitleOffset = 48;

	const graphLabelFontSize =
		svControlPanelConfig.muscleGraph.labelFontSize;

	const graphTitleFontSize =
		svControlPanelConfig.muscleGraph.axisTitleFontSize;

	const muscleDiamondSize =
		svControlPanelConfig.muscleGraph.diamondSize;

	const muscleDiamondStrokeWidth =
		svControlPanelConfig.muscleGraph.diamondStrokeWidth;

	const middlePlotLeft = plotLeft;
	const middlePlotWidth = plotSize;

	const strengthPlotTop = plotTop;
	const mandateAxisY = plotBottom;

	const mandatePlotHeight = Math.min(
		108,
		plotSize * 0.32
	);

	const mandatePlotTop =
		mandateAxisY - mandatePlotHeight;

	const middleGraphGap = 52;

	const strengthAxisY =
		mandatePlotTop - middleGraphGap;

	const strengthPlotHeight =
		strengthAxisY - strengthPlotTop;

	const musclePlotLeft = plotLeft;
	const musclePlotTop = plotTop;
	const musclePlotSize = plotSize;

	const strengthXs = Array.from(
		{ length: 11 },
		(_, index) => index * 0.05
	);

	const strengthBoundaries = Array.from(
		{ length: 12 },
		(_, index) => index
	);

	const mandateXTicks = Array.from(
		{ length: 11 },
		(_, index) => index * 0.05
	);

	const mandateYTicks = [0, 200, 400, 600, 800, 1000];

	const mandateMarkerXs = Array.from(
		{ length: 11 },
		(_, index) => index * 0.05
	);

	const muscleTicks = Array.from(
		{ length: 11 },
		(_, index) => index / 10
	);

	// -----------------------------------------------
	// BORDERLESS INFORMATION TABLE
	// -----------------------------------------------

	const factsTableStyle = [
		'display: table',
		'width: 100%',
		'max-width: 360px',
		'table-layout: fixed',
		'border-collapse: separate',
		'border-spacing: 0 8px',
		'border: 0',
		'background: transparent',
		'box-shadow: none',
		'margin: 0'
	].join('; ');

	const factsBodyStyle =
		'display: table-row-group; border: 0; background: transparent';

	const factsRowStyle =
		'display: table-row; border: 0; background: transparent';

	const factsLabelStyle = [
		'display: table-cell',
		'vertical-align: top',
		'text-align: right',
		'padding: 0 14px 0 0',
		'border: 0',
		'background: transparent',
		'box-shadow: none',
		'color: #334155',
		'font-size: 0.94rem',
		'font-weight: 850',
		'text-transform: none',
		'line-height: 1.35',
		'white-space: nowrap'
	].join('; ');

	const factsValueStyle = [
		'display: table-cell',
		'vertical-align: top',
		'text-align: left',
		'padding: 0',
		'border: 0',
		'background: transparent',
		'box-shadow: none',
		'color: #0f172a',
		'font-size: 1rem',
		'font-weight: 850',
		'font-variant-numeric: tabular-nums',
		'line-height: 1.35',
		'white-space: nowrap'
	].join('; ');

	const thresholdValueStyle = [
		'display: block',
		'color: #002A7A',
		'font-size: 1rem',
		'font-weight: 900',
		'line-height: 1.35',
		'font-variant-numeric: tabular-nums'
	].join('; ');

	// -----------------------------------------------
	// FORMATTERS
	// -----------------------------------------------

	function formatWhole(value: number): string {
		return Math.round(value).toLocaleString('en-GB');
	}

	function formatPercent(value: number): string {
		return `${Math.round(value * 100)}%`;
	}

	function formatThresholdPercentage(
		seats: number
	): string {
		if (!Number.isFinite(seats) || seats <= 0) {
			return '—';
		}

		return `${(100 / seats).toFixed(3)}%`;
	}

	function formatThresholdVotes(
		votes: number,
		seats: number
	): string {
		if (
			!Number.isFinite(votes) ||
			!Number.isFinite(seats) ||
			seats <= 0
		) {
			return '—';
		}

		return (
			Math.ceil(votes / seats).toLocaleString('en-GB') +
			' votes'
		);
	}

	function formatStrengthTick(value: number): string {
		if (value === 0) return '0';

		if (Number.isInteger(value)) {
			return `${value}x`;
		}

		return `${value.toFixed(1)}x`;
	}

	// -----------------------------------------------
	// SVG PATH HELPERS
	// -----------------------------------------------

	function makePath(points: Point[]): string {
		return points
			.map(
				(point, index) =>
					`${index === 0 ? 'M' : 'L'} ` +
					`${point.x.toFixed(2)} ` +
					`${point.y.toFixed(2)}`
			)
			.join(' ');
	}

	function makeAreaPath(
		topPoints: Point[],
		bottomPoints: Point[]
	): string {
		if (
			topPoints.length === 0 ||
			bottomPoints.length === 0
		) {
			return '';
		}

		const topPath = makePath(topPoints);

		const bottomPath = [...bottomPoints]
			.reverse()
			.map(
				(point) =>
					`L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
			)
			.join(' ');

		return `${topPath} ${bottomPath} Z`;
	}

	// -----------------------------------------------
	// STRENGTH FACTOR GRAPH
	// -----------------------------------------------

	function multiplierAt(
		x: number,
		kValue: number
	): number {
		if (x <= 0 || kValue <= 0) return 1;

		return Math.expm1(kValue * x) / (kValue * x);
	}

	function strengthX(index: number): number {
		const slotWidth = middlePlotWidth / strengthXs.length;

		return middlePlotLeft + slotWidth * (index + 0.5);
	}

	function strengthBoundaryX(index: number): number {
		const slotWidth = middlePlotWidth / strengthXs.length;

		return middlePlotLeft + slotWidth * index;
	}

	function strengthY(
		value: number,
		maximum: number
	): number {
		return (
			strengthPlotTop +
			(1 - value / maximum) * strengthPlotHeight
		);
	}

	function gridStepForMaximum(
		maxBarValue: number
	): number {
		if (maxBarValue <= 4) return 0.5;
		if (maxBarValue <= 8) return 1;
		if (maxBarValue <= 16) return 2;
		if (maxBarValue <= 32) return 4;
		if (maxBarValue <= 64) return 8;

		return 16;
	}

	function makeStrengthScale(): {
		maximum: number;
		gridValues: number[];
	} {
		const values = strengthXs.map(
			(x) => multiplierAt(x, safeK)
		);

		const maximumValue = Math.max(...values);
		const gridStep = gridStepForMaximum(maximumValue);

		// The top of the plot follows the bars smoothly.
		const maximum = Math.max(
			gridStep,
			maximumValue * 1.08
		);

		const gridValues: number[] = [];

		for (
			let value = 0;
			value <= maximum + 0.0001;
			value += gridStep
		) {
			gridValues.push(Number(value.toFixed(4)));
		}

		return { maximum, gridValues };
	}

	function makeStrengthBars(): StrengthBar[] {
		const values = strengthXs.map(
			(x) => multiplierAt(x, safeK)
		);

		const maximumValue = Math.max(...values);
		const gridStep = gridStepForMaximum(maximumValue);

		const yMaximum = Math.max(
			gridStep,
			maximumValue * 1.08
		);

		const slotWidth = middlePlotWidth / strengthXs.length;
		const barWidth = slotWidth * 0.72;

		return values.map((value, index) => {
			const height =
				(value / yMaximum) * strengthPlotHeight;

			const labelX = strengthX(index);

			return {
				id: `strength-${index}`,
				label: formatPercent(strengthXs[index]),
				value,
				x: labelX - barWidth / 2,
				y: strengthAxisY - height,
				width: barWidth,
				height,
				labelX
			};
		});
	}

	// -----------------------------------------------
	// MANDATE GRAPH
	// -----------------------------------------------

	function mandateX(value: number): number {
		return (
			middlePlotLeft +
			(value / 0.5) * middlePlotWidth
		);
	}

	function mandateY(value: number): number {
		return (
			mandatePlotTop +
			(1 - value / 1000) * mandatePlotHeight
		);
	}

	function makeMandateCurvePath(): string {
		const points: Point[] = [];

		for (let step = 0; step <= 100; step += 1) {
			const x = (step / 100) * 0.5;

			points.push({
				x: mandateX(x),
				y: mandateY(calculateMandate(x, safeK))
			});
		}

		return makePath(points);
	}

	function makeMandateMarkers(): MandateMarker[] {
		return mandateMarkerXs.map((xShare) => {
			const mandate = calculateMandate(xShare, safeK);

			return {
				id: `mandate-marker-${xShare.toFixed(2)}`,
				x: mandateX(xShare),
				y: mandateY(mandate),
				mandate,
				showLabel: xShare > 0
			};
		});
	}

	// -----------------------------------------------
	// MUSCLE GRAPH
	// -----------------------------------------------

	function sx(value: number): number {
		return musclePlotLeft + value * musclePlotSize;
	}

	function sy(value: number): number {
		return (
			musclePlotTop +
			(1 - value) * musclePlotSize
		);
	}

	function fMin(x: number): number {
		if (x <= 0) return 0;
		if (x >= 1) return 1;

		const ownMandate = calculateMandate(x, safeK);
		const opposingMandate = calculateMandate(1 - x, safeK);

		return ownMandate / (ownMandate + opposingMandate);
	}

	function fMax(x: number): number {
		if (x <= 0) return 0;
		if (x >= 1) return 1;

		const ownMandate = calculateMandate(x, safeK);

		const maximallyDividedOpposition =
			A * safeK * (1 - x);

		return (
			ownMandate /
			(ownMandate + maximallyDividedOpposition)
		);
	}

	function fForTotalMandate(
		x: number,
		totalMandate: number
	): number {
		return calculateMandate(x, safeK) / totalMandate;
	}

	function isInsideMuscleEnvelope(
		x: number,
		y: number
	): boolean {
		const tolerance = 0.0008;

		return (
			x >= 0 &&
			x <= 1 &&
			y >= 0 &&
			y <= 1 &&
			y >= fMin(x) - tolerance &&
			y <= fMax(x) + tolerance
		);
	}

	function makeElectionLineSegments(): string[] {
		if (
			!currentTotalMandate ||
			currentTotalMandate <= 0
		) {
			return [];
		}

		const segments: Point[][] = [];
		let currentSegment: Point[] = [];

		for (let step = 0; step <= 1000; step += 1) {
			const x = step / 1000;

			const y = fForTotalMandate(
				x,
				currentTotalMandate
			);

			if (isInsideMuscleEnvelope(x, y)) {
				currentSegment.push({
					x: sx(x),
					y: sy(y)
				});
			} else if (currentSegment.length > 1) {
				segments.push(currentSegment);
				currentSegment = [];
			} else {
				currentSegment = [];
			}
		}

		if (currentSegment.length > 1) {
			segments.push(currentSegment);
		}

		return segments.map(makePath);
	}

	function makeMusclePaths(): {
		lower: string;
		upper: string;
		ciArea: string;
		electionLines: string[];
	} {
		const lower: Point[] = [];
		const upper: Point[] = [];
		const ciUpper: Point[] = [];
		const ciLower: Point[] = [];

		for (let step = 0; step <= 700; step += 1) {
			const x = step / 700;

			const lowerValue = fMin(x);
			const upperValue = fMax(x);

			const ci100Value =
				calculateMandate(x, safeK) / 2000;

			const ciLowerValue = Math.max(
				lowerValue,
				ci100Value
			);

			lower.push({
				x: sx(x),
				y: sy(lowerValue)
			});

			upper.push({
				x: sx(x),
				y: sy(upperValue)
			});

			if (ciLowerValue <= upperValue) {
				ciUpper.push({
					x: sx(x),
					y: sy(upperValue)
				});

				ciLower.push({
					x: sx(x),
					y: sy(ciLowerValue)
				});
			}
		}

		return {
			lower: makePath(lower),
			upper: makePath(upper),
			ciArea: makeAreaPath(ciUpper, ciLower),
			electionLines: makeElectionLineSegments()
		};
	}

	function makePartyDiamonds(): MuscleDiamond[] {
		return [...musclePoints]
			.filter((point) =>
				isInsideMuscleEnvelope(
					point.x,
					point.fractionOfPower
				)
			)
			.sort((left, right) => left.x - right.x)
			.map((point) => ({
				id: point.id,
				x: sx(point.x),
				y: sy(point.fractionOfPower),
				colour: point.colour
			}));
	}

	// -----------------------------------------------
	// REACTIVE GRAPH DATA
	// -----------------------------------------------

	let safeK = $derived(clamp(k, minK, maxK));
	let A = $derived(calculateA(safeK));
	let kIsExactlyLambda = $derived(Object.is(k, LAMBDA));

	let strengthScale = $derived(makeStrengthScale());
	let strengthBars = $derived(makeStrengthBars());
	let mandateCurvePath = $derived(makeMandateCurvePath());
	let mandateMarkers = $derived(makeMandateMarkers());
	let musclePaths = $derived(makeMusclePaths());
	let partyDiamonds = $derived(makePartyDiamonds());

	const controlPanelStyle = [
		`--graph-svg-width: ${graphSvgWidth}px`,
		`--graph-svg-height: ${graphSvgHeight}px`,
		`--graph-label-font-size: ${graphLabelFontSize}px`,
		`--graph-title-font-size: ${graphTitleFontSize}px`,
		`--muscle-diamond-stroke-width: ${muscleDiamondStrokeWidth}px`
	].join('; ');
</script>

<div class="sv-control-panel" style={controlPanelStyle}>
	<div class="control-column">
		<div class="k-control">
			<div class="control-heading">
				<label for="sv-k-number">
					Mandate parameter:
				</label>

				<div class="number-editor">
					{#if kIsExactlyLambda}
						<span class="lambda-indicator">Λ</span>
					{/if}

					<input
						id="sv-k-number"
						class="number-field"
						type="number"
						min={minK}
						max={maxK}
						step="any"
						inputmode="decimal"
						value={kDraft}
						onfocus={() => (editingK = true)}
						oninput={handleKNumberInput}
						onblur={commitKNumber}
						onkeydown={(event) => {
							if (event.key === 'Enter') {
								event.currentTarget.blur();
							}
						}}
						aria-label="Mandate parameter k"
						title={`Enter k between ${minK} and ${maxK}`}
					/>
				</div>
			</div>

			<div class="slider-stack">
				<input
					id="sv-k-slider"
					type="range"
					min={minK}
					max={maxK}
					step={kStep}
					value={sliderK}
					oninput={handleKSliderInput}
					onwheel={handleKWheel}
					aria-label="Mandate parameter k slider"
				/>

				<div class="stepper-row" aria-label="Adjust mandate parameter">
					<button
						class="step-button decrease-step large-adjust"
						type="button"
						use:repeatPress={() => adjustK(-kLargeIncrement)}
						disabled={safeK <= minK}
						title="Decrease k by 0.10 (hold to repeat)"
						aria-label="Decrease k by 0.10"
					>
						−−
					</button>

					<button
						class="step-button decrease-step"
						type="button"
						use:repeatPress={() => adjustK(-kSmallIncrement)}
						disabled={safeK <= minK}
						title="Decrease k by 0.01 (hold to repeat)"
						aria-label="Decrease k by 0.01"
					>
						−
					</button>

					<button
						class="reset-button"
						type="button"
						onclick={resetK}
						title="Reset mandate parameter to Lambda"
					>
						Reset to Λ
					</button>

					<button
						class="step-button increase-step"
						type="button"
						use:repeatPress={() => adjustK(kSmallIncrement)}
						disabled={safeK >= maxK}
						title="Increase k by 0.01 (hold to repeat)"
						aria-label="Increase k by 0.01"
					>
						+
					</button>

					<button
						class="step-button increase-step large-adjust"
						type="button"
						use:repeatPress={() => adjustK(kLargeIncrement)}
						disabled={safeK >= maxK}
						title="Increase k by 0.10 (hold to repeat)"
						aria-label="Increase k by 0.10"
					>
						++
					</button>
				</div>
			</div>
		</div>

		<div class="selectors-slot">
			{@render selectors()}
		</div>

		{#if showEnglishToggle}
			<label
				class="english-switch"
				title="Use English party names where available"
			>
				<input
					type="checkbox"
					bind:checked={useEnglishNames}
				/>

				<span class="switch-track" aria-hidden="true">
					<span class="switch-thumb"></span>
				</span>

				<span class="switch-label">ENG</span>
			</label>
		{/if}

		{#if showSeatSlider}
			<div class="seat-control">
				<div class="control-heading">
					<label for="sv-seat-number">Seats:</label>

					<div class="number-editor">
						<input
							id="sv-seat-number"
							class="number-field"
							type="number"
							min={minSeatCount}
							max={maxSeatCount}
							step="1"
							inputmode="numeric"
							value={seatDraft}
							onfocus={() => (editingSeats = true)}
							oninput={handleSeatNumberInput}
							onblur={commitSeatNumber}
							onkeydown={(event) => {
								if (event.key === 'Enter') {
									event.currentTarget.blur();
								}
							}}
							aria-label="Total seats"
							title={`Enter seats between ${minSeatCount} and ${maxSeatCount}`}
						/>
					</div>
				</div>

				<div class="slider-stack">
					<input
						id="sv-seat-slider"
						type="range"
						min={minSeatCount}
						max={maxSeatCount}
						step={seatStep}
						bind:value={seatCount}
						onwheel={handleSeatWheel}
						aria-label="Total seats slider"
					/>

					<div class="stepper-row" aria-label="Adjust total seats">
						<button
							class="step-button decrease-step large-adjust"
							type="button"
							use:repeatPress={() => adjustSeats(-seatLargeIncrement)}
							disabled={seatCount <= minSeatCount}
							title="Decrease seats by 10 (hold to repeat)"
							aria-label="Decrease seats by 10"
						>
							−−
						</button>

						<button
							class="step-button decrease-step"
							type="button"
							use:repeatPress={() => adjustSeats(-seatSmallIncrement)}
							disabled={seatCount <= minSeatCount}
							title="Decrease seats by 1 (hold to repeat)"
							aria-label="Decrease seats by 1"
						>
							−
						</button>

						<button
							class="reset-button"
							type="button"
							onclick={resetSeatCount}
							title="Reset seats"
						>
							Reset seats
						</button>

						<button
							class="step-button increase-step"
							type="button"
							use:repeatPress={() => adjustSeats(seatSmallIncrement)}
							disabled={seatCount >= maxSeatCount}
							title="Increase seats by 1 (hold to repeat)"
							aria-label="Increase seats by 1"
						>
							+
						</button>

						<button
							class="step-button increase-step large-adjust"
							type="button"
							use:repeatPress={() => adjustSeats(seatLargeIncrement)}
							disabled={seatCount >= maxSeatCount}
							title="Increase seats by 10 (hold to repeat)"
							aria-label="Increase seats by 10"
						>
							++
						</button>
					</div>
				</div>
			</div>

			<table
				class="facts-table calculator-threshold"
				style={factsTableStyle}
			>
				<colgroup>
					<col style="width: 132px;" />
					<col />
				</colgroup>

				<tbody style={factsBodyStyle}>
					<tr style={factsRowStyle}>
						<th scope="row" style={factsLabelStyle}>
							Threshold:
						</th>

						<td style={factsValueStyle}>
							<span style={thresholdValueStyle}>
								{formatThresholdPercentage(seatCount)}
							</span>
						</td>
					</tr>
				</tbody>
			</table>

		{:else if electionVotes !== undefined && electionSeats !== undefined}
			<table
				class="facts-table election-context"
				style={factsTableStyle}
			>
				<colgroup>
					<col style="width: 132px;" />
					<col />
				</colgroup>

				<tbody style={factsBodyStyle}>
					<tr style={factsRowStyle}>
						<th scope="row" style={factsLabelStyle}>
							Votes:
						</th>

						<td style={factsValueStyle}>
							{formatWhole(electionVotes)}
						</td>
					</tr>

					<tr style={factsRowStyle}>
						<th scope="row" style={factsLabelStyle}>
							Seats:
						</th>

						<td style={factsValueStyle}>
							{formatWhole(electionSeats)}
						</td>
					</tr>

					<tr style={factsRowStyle}>
						<th scope="row" style={factsLabelStyle}>
							Threshold:
						</th>

						<td style={factsValueStyle}>
							<span style={thresholdValueStyle}>
								{formatThresholdVotes(
									electionVotes,
									electionSeats
								)}
							</span>

							<span style={thresholdValueStyle}>
								{formatThresholdPercentage(electionSeats)}
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		{/if}
	</div>

	<!-- SHARED GRAPH PAIR -->

	<div
		class="graph-column"
		aria-label="Mandate parameter preview graphs"
	>
		<!-- STRENGTH FACTOR AND MANDATE -->

		<div class="middle-graphs">
			<svg
				viewBox={graphViewBox}
				role="img"
				aria-label="Strength Factor and Mandate graphs"
			>
				{#each strengthScale.gridValues as value (value)}
					<line
						class="middle-grid"
						x1={middlePlotLeft}
						x2={plotRight}
						y1={strengthY(value, strengthScale.maximum)}
						y2={strengthY(value, strengthScale.maximum)}
					/>

					<line
						class="middle-tick"
						x1={middlePlotLeft}
						x2={middlePlotLeft - externalTickLength}
						y1={strengthY(value, strengthScale.maximum)}
						y2={strengthY(value, strengthScale.maximum)}
					/>

					<text
						class="middle-label"
						x={middlePlotLeft - yTickLabelGap}
						y={strengthY(value, strengthScale.maximum) + 3}
						text-anchor="end"
					>
						{formatStrengthTick(value)}
					</text>
				{/each}

				{#each strengthBoundaries as boundary (boundary)}
					<line
						class="middle-tick"
						x1={strengthBoundaryX(boundary)}
						x2={strengthBoundaryX(boundary)}
						y1={strengthAxisY}
						y2={strengthAxisY + externalTickLength}
					/>
				{/each}

				{#each strengthBars as bar (bar.id)}
					<rect
						x={bar.x}
						y={bar.y}
						width={bar.width}
						height={bar.height}
						rx="2"
						fill={bar.label === '0%'
							? 'var(--brand-red)'
							: 'var(--brand-blue)'}
						opacity={bar.label === '0%' ? '0.82' : '0.66'}
					>
						<title>
							{bar.label}: {bar.value.toFixed(1)}×
						</title>
					</rect>

					<text
						class="bar-value-label"
						x={bar.labelX}
						y={bar.y - 4}
						text-anchor="middle"
					>
						{bar.value.toFixed(1)}x
					</text>

					<text
						class="middle-label"
						x={bar.labelX}
						y={strengthAxisY + xTickLabelOffset}
						text-anchor="middle"
					>
						{bar.label}
					</text>
				{/each}

				<line
					class="middle-axis"
					x1={middlePlotLeft}
					x2={plotRight}
					y1={strengthAxisY}
					y2={strengthAxisY}
				/>

				<line
					class="middle-axis"
					x1={middlePlotLeft}
					x2={middlePlotLeft}
					y1={strengthPlotTop}
					y2={strengthAxisY}
				/>

				<text
					class="middle-axis-title"
					x={middlePlotLeft + middlePlotWidth / 2}
					y={strengthAxisY + xAxisTitleOffset}
					text-anchor="middle"
				>
					Vote Share
				</text>

				<text
					class="middle-axis-title"
					x={-((strengthPlotTop + strengthAxisY) / 2)}
					y={yAxisTitleOffset}
					text-anchor="middle"
					transform="rotate(-90)"
				>
					Marginal Strength
				</text>

				<!-- MANDATE GRID -->

				{#each mandateYTicks as tick (tick)}
					<line
						class="middle-grid"
						x1={middlePlotLeft}
						x2={plotRight}
						y1={mandateY(tick)}
						y2={mandateY(tick)}
					/>

					<line
						class="middle-tick"
						x1={middlePlotLeft}
						x2={middlePlotLeft - externalTickLength}
						y1={mandateY(tick)}
						y2={mandateY(tick)}
					/>

					<text
						class="middle-label"
						x={middlePlotLeft - yTickLabelGap}
						y={mandateY(tick) + 3}
						text-anchor="end"
					>
						{formatWhole(tick)}
					</text>
				{/each}

				{#each mandateXTicks as tick (tick)}
					<line
						class="middle-grid"
						x1={mandateX(tick)}
						x2={mandateX(tick)}
						y1={mandatePlotTop}
						y2={mandateAxisY}
					/>

					<line
						class="middle-tick"
						x1={mandateX(tick)}
						x2={mandateX(tick)}
						y1={mandateAxisY}
						y2={mandateAxisY + externalTickLength}
					/>

					{#if Math.round(tick * 100) % 10 === 0}
						<text
							class="middle-label"
							x={mandateX(tick)}
							y={mandateAxisY + xTickLabelOffset}
							text-anchor="middle"
						>
							{formatPercent(tick)}
						</text>
					{/if}
				{/each}

				<path class="mini-curve" d={mandateCurvePath} />

				{#each mandateMarkers as marker (marker.id)}
					<line
						class="mandate-marker"
						x1={marker.x - 3}
						x2={marker.x + 3}
						y1={marker.y - 3}
						y2={marker.y + 3}
					/>

					<line
						class="mandate-marker"
						x1={marker.x - 3}
						x2={marker.x + 3}
						y1={marker.y + 3}
						y2={marker.y - 3}
					/>

					{#if marker.showLabel}
						<text
							class="mandate-value-label"
							x={marker.x}
							y={marker.y - 6}
							text-anchor="middle"
						>
							{formatWhole(marker.mandate)}
						</text>
					{/if}
				{/each}

				<line
					class="middle-axis"
					x1={middlePlotLeft}
					x2={plotRight}
					y1={mandateAxisY}
					y2={mandateAxisY}
				/>

				<line
					class="middle-axis"
					x1={middlePlotLeft}
					x2={middlePlotLeft}
					y1={mandatePlotTop}
					y2={mandateAxisY}
				/>

				<text
					class="middle-axis-title"
					x={middlePlotLeft + middlePlotWidth / 2}
					y={mandateAxisY + xAxisTitleOffset}
					text-anchor="middle"
				>
					Vote Share
				</text>

				<text
					class="middle-axis-title"
					x={-((mandatePlotTop + mandateAxisY) / 2)}
					y={yAxisTitleOffset}
					text-anchor="middle"
					transform="rotate(-90)"
				>
					Mandate
				</text>
			</svg>
		</div>

		<!-- MUSCLE GRAPH -->

		<div class="muscle-graph">
			<svg
				viewBox={graphViewBox}
				role="img"
				aria-label="Muscle graph"
			>
				{#each muscleTicks as tick (tick)}
					<line
						class={tick === 0.5 || tick === 1
							? 'muscle-grid major'
							: 'muscle-grid'}
						x1={sx(tick)}
						x2={sx(tick)}
						y1={sy(0)}
						y2={sy(1)}
					/>

					<line
						class={tick === 0.5 || tick === 1
							? 'muscle-grid major'
							: 'muscle-grid'}
						x1={sx(0)}
						x2={sx(1)}
						y1={sy(tick)}
						y2={sy(tick)}
					/>

					<line
						class="muscle-tick"
						x1={sx(tick)}
						x2={sx(tick)}
						y1={sy(0)}
						y2={sy(0) + externalTickLength}
					/>

					<line
						class="muscle-tick"
						x1={sx(0)}
						x2={sx(0) - externalTickLength}
						y1={sy(tick)}
						y2={sy(tick)}
					/>
				{/each}

				<path class="ci-area" d={musclePaths.ciArea} />
				<path class="muscle-line" d={musclePaths.lower} />
				<path class="muscle-line strong" d={musclePaths.upper} />

				{#each musclePaths.electionLines as linePath (linePath)}
					<path class="election-line" d={linePath} />
				{/each}

				{#each partyDiamonds as diamond (diamond.id)}
					<rect
						class="party-diamond"
						x={diamond.x - muscleDiamondSize / 2}
						y={diamond.y - muscleDiamondSize / 2}
						width={muscleDiamondSize}
						height={muscleDiamondSize}
						fill={diamond.colour}
						transform={`rotate(45 ${diamond.x} ${diamond.y})`}
					/>
				{/each}

				<line
					class="muscle-axis"
					x1={sx(0)}
					y1={sy(0)}
					x2={sx(1)}
					y2={sy(0)}
				/>

				<line
					class="muscle-axis"
					x1={sx(0)}
					y1={sy(0)}
					x2={sx(0)}
					y2={sy(1)}
				/>

				<text
					class="muscle-label"
					x={sx(0)}
					y={sy(0) + xTickLabelOffset}
					text-anchor="middle"
				>
					0%
				</text>

				<text
					class="muscle-label"
					x={sx(0.5)}
					y={sy(0) + xTickLabelOffset}
					text-anchor="middle"
				>
					50%
				</text>

				<text
					class="muscle-label"
					x={sx(1)}
					y={sy(0) + xTickLabelOffset}
					text-anchor="middle"
				>
					100%
				</text>

				<text
					class="muscle-label"
					x={sx(0) - yTickLabelGap}
					y={sy(0) + 3}
					text-anchor="end"
				>
					0%
				</text>

				<text
					class="muscle-label"
					x={sx(0) - yTickLabelGap}
					y={sy(0.5) + 3}
					text-anchor="end"
				>
					50%
				</text>

				<text
					class="muscle-label"
					x={sx(0) - yTickLabelGap}
					y={sy(1) + 3}
					text-anchor="end"
				>
					100%
				</text>

				<text
					class="axis-title"
					x={musclePlotLeft + musclePlotSize / 2}
					y={sy(0) + xAxisTitleOffset}
					text-anchor="middle"
				>
					Vote Share
				</text>

				<text
					class="axis-title"
					x={-((sy(0) + sy(1)) / 2)}
					y={yAxisTitleOffset}
					text-anchor="middle"
					transform="rotate(-90)"
				>
					Seat Share
				</text>
			</svg>
		</div>
	</div>
</div>

<style>
	/*
	 * TWO MAIN COLUMNS
	 *
	 * The left side contains the controls.
	 * The right side contains both graphs as one
	 * tightly arranged pair.
	 *
	 * The two graphs retain their original plotting
	 * coordinates and equal square plot areas.
	 */

	.sv-control-panel {
		--graph-overlap: 42px;

		display: grid;
		grid-template-columns:
			minmax(0, 1fr)
			max-content;
		column-gap: clamp(14px, 1.4vw, 30px);
		align-items: start;
		width: 100%;
		min-width: 0;
	}

	/*
	 * This reduces the gap BETWEEN the graphs.
	 *
	 * Each SVG has unused white space around its
	 * actual plot. Overlapping 42px of that space
	 * moves the Muscle graph closer without changing
	 * either plot's shape or scale.
	 *
	 * The graph pair is still vertically aligned.
	 */

	.graph-column {
		display: grid;
		grid-template-columns:
			var(--graph-svg-width)
			calc(var(--graph-svg-width) - var(--graph-overlap));
		column-gap: 0;
		align-items: start;
		justify-self: end;
		width: max-content;
		min-width: 0;
	}

	.muscle-graph {
		margin-left: calc(0px - var(--graph-overlap));
	}

	.control-column {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 14px;
		align-content: start;
		justify-self: center;
		width: min(100%, 400px);
		min-width: 0;
		padding-top: 2px;
	}

	.k-control {
		width: 100%;
		min-width: 0;
		margin-bottom: 10px;
	}

	/* EDITABLE NUMBER FIELDS */

	.control-heading {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 8px 12px;
		margin-bottom: 10px;
	}

	.control-heading label {
		color: #334155;
		font-size: 0.94rem;
		font-weight: 950;
		letter-spacing: 0.055em;
		text-transform: uppercase;
	}

	.number-editor {
		display: inline-flex;
		align-items: center;
		justify-content: flex-end;
		gap: 7px;
		margin-left: auto;
	}

	.lambda-indicator {
		color: var(--brand-blue, #002a7a);
		font-size: 1.13rem;
		font-weight: 950;
	}

	.number-field {
		box-sizing: border-box;
		width: 108px;
		height: 37px;
		border: 1px solid #94a3b8;
		border-radius: 8px;
		background: #ffffff;
		color: #0f172a;
		padding: 5px 8px;
		font-family: inherit;
		font-size: 1.06rem;
		font-weight: 850;
		font-variant-numeric: tabular-nums;
		text-align: right;

		/* Firefox: remove number-field arrows. */
		-moz-appearance: textfield;
		appearance: textfield;
	}

	/* Chromium and Safari: remove number-field arrows. */
	.number-field::-webkit-outer-spin-button,
	.number-field::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.number-field:hover {
		border-color: var(--brand-blue, #002a7a);
	}

	.number-field:focus {
		outline: 2px solid rgba(0, 42, 122, 0.22);
		outline-offset: 1px;
		border-color: var(--brand-blue, #002a7a);
	}

	/* SLIDERS */

	.slider-stack {
		display: grid;
		gap: 11px;
	}

	input[type='range'] {
		display: block;
		box-sizing: border-box;
		width: 100%;
		max-width: 400px;
		min-height: 28px;
		accent-color: var(--brand-blue, #002a7a);
		cursor: ew-resize;
	}

	/* INCREMENT BUTTONS */

	.stepper-row {
		display: grid;
		grid-template-columns:
			32px 32px minmax(84px, 1fr) 32px 32px;
		gap: 6px;
		align-items: center;
		width: 100%;
	}

	.step-button,
	.reset-button {
		box-sizing: border-box;
		height: 33px;
		border-radius: 8px;
		font-family: inherit;
		font-weight: 850;
		cursor: pointer;
		transition:
			background 0.15s ease,
			border-color 0.15s ease;
	}

	.step-button {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		padding: 0 2px;
		font-size: 1rem;
		touch-action: manipulation;
		user-select: none;
		-webkit-user-select: none;
	}

	.step-button.decrease-step {
		border: 1px solid #e5b0bb;
		background: #fff1f3;
		color: var(--brand-red, #c7011d);
	}

	.step-button.decrease-step.large-adjust {
		background: #fbe8ec;
		font-weight: 950;
	}

	.step-button.decrease-step:hover:not(:disabled) {
		border-color: var(--brand-red, #c7011d);
		background: #f8dce2;
	}

	.step-button.increase-step {
		border: 1px solid #b4c5e6;
		background: #edf2fb;
		color: var(--brand-blue, #002a7a);
	}

	.step-button.increase-step.large-adjust {
		background: #dfe8f8;
		font-weight: 950;
	}

	.step-button.increase-step:hover:not(:disabled) {
		border-color: var(--brand-blue, #002a7a);
		background: #d2dff5;
	}

	.reset-button {
		width: 100%;
		min-width: 0;
		border: 1px solid var(--brand-blue, #002a7a);
		background: #ffffff;
		color: var(--brand-blue, #002a7a);
		padding: 5px 7px;
		font-size: 0.76rem;
		white-space: nowrap;
	}

	.reset-button:hover {
		background: #edf2fb;
	}

	.step-button:disabled {
		opacity: 0.32;
		cursor: not-allowed;
	}

	/*
	 * SELECTORS
	 */

	.selectors-slot {
		display: grid;
		gap: 8px;
		justify-self: center;
		width: min(100%, 348px);
		margin-top: 6px;
	}

	.selectors-slot :global(.sv-selector-row) {
		display: grid;
		grid-template-columns: 72px minmax(0, 1fr);
		gap: 8px;
		align-items: center;
	}

	.selectors-slot :global(label) {
		color: #334155;
		font-size: 0.92rem;
		font-weight: 900;
		text-align: right;
	}

	.selectors-slot :global(select) {
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		border: 1px solid #94a3b8;
		border-radius: 6px;
		background: #ffffff;
		color: #0f172a;
		padding: 7px 9px;
		font-size: 0.96rem;
		font-weight: 820;
	}

	/*
	 * ENG SWITCH
	 */

	.english-switch {
		display: inline-flex;
		box-sizing: border-box;
		gap: 8px;
		align-items: center;
		justify-self: center;
		width: min(100%, 348px);
		padding-left: 80px;
		color: #334155;
		cursor: pointer;
		user-select: none;
	}

	.english-switch input {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.switch-track {
		position: relative;
		display: inline-block;
		flex-shrink: 0;
		width: 38px;
		height: 21px;
		border: 1px solid #94a3b8;
		border-radius: 999px;
		background: #e2e8f0;
		transition:
			background 0.16s ease,
			border-color 0.16s ease;
	}

	.switch-thumb {
		position: absolute;
		left: 2px;
		top: 2px;
		width: 15px;
		height: 15px;
		border-radius: 999px;
		background: #ffffff;
		box-shadow: 0 1px 3px rgba(15, 23, 42, 0.28);
		transition: transform 0.16s ease;
	}

	.english-switch input:checked + .switch-track {
		border-color: var(--brand-blue);
		background: var(--brand-blue);
	}

	.english-switch input:checked + .switch-track .switch-thumb {
		transform: translateX(17px);
	}

	.switch-label {
		color: #334155;
		font-size: 0.8rem;
		font-weight: 950;
		letter-spacing: 0.06em;
	}

	/* SEATS CONTROL AND TABLES */

	.seat-control {
		justify-self: center;
		width: min(100%, 360px);
		margin-top: 6px;
	}

	.facts-table {
		justify-self: center;
	}

	.election-context {
		margin-top: 16px !important;
	}

	.calculator-threshold {
		margin-top: 4px !important;
	}

	.facts-table,
	.facts-table th,
	.facts-table td {
		border: none;
		box-shadow: none;
	}

	/*
	 * FIXED GRAPH GEOMETRY
	 */

	.middle-graphs,
	.muscle-graph {
		display: block;
		box-sizing: border-box;
		width: var(--graph-svg-width);
		min-width: var(--graph-svg-width);
		height: var(--graph-svg-height);
		min-height: var(--graph-svg-height);
		overflow: visible;
	}

	svg {
		display: block;
		width: var(--graph-svg-width);
		min-width: var(--graph-svg-width);
		max-width: var(--graph-svg-width);
		height: var(--graph-svg-height);
		min-height: var(--graph-svg-height);
		max-height: var(--graph-svg-height);
		overflow: visible;
		flex-shrink: 0;
	}

	/*
	 * GRAPH GRIDLINES
	 */

	.middle-grid,
	.muscle-grid {
		stroke: #e2e8f0;
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}

	.muscle-grid.major {
		stroke: #cdd6e1;
		stroke-width: 1.1;
	}

	/*
	 * AXES, TICKS AND TEXT
	 */

	.middle-axis,
	.middle-tick,
	.muscle-axis,
	.muscle-tick {
		stroke: #475569;
		stroke-width: 1.2;
		vector-effect: non-scaling-stroke;
	}

	.middle-label,
	.bar-value-label,
	.mandate-value-label,
	.middle-axis-title,
	.muscle-label,
	.axis-title {
		fill: #475569;
		font-size: var(--graph-label-font-size);
		font-weight: 800;
	}

	.bar-value-label,
	.mandate-value-label {
		fill: #334155;
		font-weight: 950;
	}

	.middle-axis-title,
	.axis-title {
		fill: #334155;
		font-size: var(--graph-title-font-size);
		font-weight: 950;
	}

	/*
	 * MANDATE CURVE
	 */

	.mini-curve {
		fill: none;
		stroke: #002a7a;
		stroke-width: 2.25;
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}

	.mandate-marker {
		stroke: var(--brand-red);
		stroke-width: 1.4;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
	}

	/*
	 * MUSCLE GRAPH
	 */

	.ci-area {
		fill: var(--brand-red);
		opacity: 0.3;
	}

	.muscle-line {
		fill: none;
		stroke: #002a7a;
		stroke-width: 1.75;
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}

	.muscle-line.strong {
		stroke-width: 2.15;
	}

	.election-line {
		fill: none;
		stroke: #0f172a;
		stroke-width: 1.05;
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}

	.party-diamond {
		stroke: #ffffff;
		stroke-width: var(--muscle-diamond-stroke-width);
		vector-effect: non-scaling-stroke;
	}

	/*
	 * NARROW SCREENS
	 *
	 * Preserve the current stacked arrangement.
	 * The two plots remain full-size, with horizontal
	 * scrolling when necessary.
	 */

	@media (max-width: 1220px) {
		.sv-control-panel {
			grid-template-columns: minmax(0, 1fr);
			justify-items: center;
			row-gap: 20px;
		}

		.control-column {
			width: min(100%, 400px);
		}

		.graph-column {
			justify-self: stretch;
			justify-content: center;
			width: 100%;
			max-width: 100%;
			min-width: 0;
			overflow-x: auto;
			overflow-y: hidden;
			padding-bottom: 8px;
			scrollbar-width: thin;
		}
	}

	@media (max-width: 1000px) {
		.graph-column {
			justify-content: start;
		}
	}

	@media (max-width: 760px) {
		.selectors-slot :global(.sv-selector-row) {
			grid-template-columns: 1fr;
			gap: 5px;
		}

		.selectors-slot :global(label) {
			text-align: left;
		}

		.english-switch {
			padding-left: 0;
		}
	}
</style>
