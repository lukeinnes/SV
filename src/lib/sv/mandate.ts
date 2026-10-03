import { calculateA } from './parameters';

export function calculateMandate(x: number, k: number): number {
	if (!Number.isFinite(x) || x < 0 || x > 1) {
		throw new Error('x must be between 0 and 1.');
	}

	const A = calculateA(k);

	return A * Math.expm1(k * x);
}