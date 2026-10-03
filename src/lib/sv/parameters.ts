export function calculateA(k: number): number {
	if (!Number.isFinite(k) || k <= 0) {
		throw new Error('k must be a positive finite number.');
	}

	// A is set so that x = 0.5 gives 1000 points of mandate:
	//
	// M(x) = A(exp(kx) - 1)
	// 1000 = A(exp(0.5k) - 1)
	// A = 1000 / (exp(0.5k) - 1)
	return 1000 / Math.expm1(0.5 * k);
}