import fs from 'node:fs';
import path from 'node:path';

const VALID_KINDS = new Set(['party', 'independent', 'special', 'other']);

function parseCsvLine(line) {
	const values = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < line.length; i += 1) {
		const char = line[i];
		const next = line[i + 1];

		if (char === '"' && next === '"') {
			current += '"';
			i += 1;
			continue;
		}

		if (char === '"') {
			inQuotes = !inQuotes;
			continue;
		}

		if (char === ',' && !inQuotes) {
			values.push(current.trim());
			current = '';
			continue;
		}

		current += char;
	}

	values.push(current.trim());
	return values;
}

function parseCsv(text, filePath) {
	const lines = text
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter((line) => line.length > 0 && !line.startsWith('#'));

	if (lines.length === 0) {
		throw new Error(`${filePath} is empty.`);
	}

	const headers = parseCsvLine(lines[0]);

	return lines.slice(1).map((line, index) => {
		const values = parseCsvLine(line);

		if (values.length !== headers.length) {
			throw new Error(
				`${filePath} row ${index + 2} has ${values.length} values, but the header has ${headers.length}.`
			);
		}

		return Object.fromEntries(headers.map((header, columnIndex) => [header, values[columnIndex]]));
	});
}

function required(row, key, rowNumber, filePath) {
	const value = String(row[key] ?? '').trim();

	if (!value) {
		throw new Error(`${filePath} row ${rowNumber} is missing ${key}.`);
	}

	return value;
}

function makeTsString(value) {
	return `'${String(value).replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
}

function makeExportName(countryId) {
	return `${countryId}Parties`;
}

function makePartyBlock(party) {
	return `\t{
\t\tid: ${makeTsString(party.id)},
\t\tcountryId: ${makeTsString(party.countryId)},
\t\tusualName: ${makeTsString(party.usualName)},
\t\tshortName: ${makeTsString(party.shortName)},
\t\tcodeName: ${makeTsString(party.codeName)},
\t\tcolour: ${makeTsString(party.colour)},
\t\tkind: ${makeTsString(party.kind)}
\t}`;
}

function makePartyFileText(countryId, parties) {
	const exportName = makeExportName(countryId);

	return `import type { Party } from '../types';

export const ${exportName}: Party[] = [
${parties.map(makePartyBlock).join(',\n')}
];
`;
}

function validatePartyId(countryId, id, rowNumber, filePath) {
	if (!id.startsWith(`${countryId}-`)) {
		throw new Error(
			`${filePath} row ${rowNumber}: party id ${id} should start with ${countryId}-.`
		);
	}
}

function importParties(countryId) {
	const inputPath = path.join('scripts', countryId, 'parties.csv');
	const outputPath = path.join('src', 'lib', 'data', 'parties', `${countryId}.ts`);

	if (!fs.existsSync(inputPath)) {
		throw new Error(`Could not find ${inputPath}`);
	}

	const rows = parseCsv(fs.readFileSync(inputPath, 'utf8'), inputPath);
	const seenIds = new Set();

	const parties = rows.map((row, index) => {
		const rowNumber = index + 2;

		const id = required(row, 'id', rowNumber, inputPath);
		const usualName = required(row, 'usualName', rowNumber, inputPath);
		const shortName = required(row, 'shortName', rowNumber, inputPath);
		const codeName = required(row, 'codeName', rowNumber, inputPath);
		const colour = required(row, 'colour', rowNumber, inputPath);
		const kind = required(row, 'kind', rowNumber, inputPath);

		if (seenIds.has(id)) {
			throw new Error(`${inputPath} row ${rowNumber}: duplicate party id ${id}.`);
		}

		seenIds.add(id);

		validatePartyId(countryId, id, rowNumber, inputPath);

		if (!VALID_KINDS.has(kind)) {
			throw new Error(
				`${inputPath} row ${rowNumber}: invalid kind ${kind}. Use party, independent, special, or other.`
			);
		}

		if (!colour.startsWith('#')) {
			throw new Error(`${inputPath} row ${rowNumber}: colour should be a hex value like #E4003B.`);
		}

		return {
			id,
			countryId,
			usualName,
			shortName,
			codeName,
			colour,
			kind
		};
	});

	const otherParties = parties.filter((party) => party.kind === 'other');

	if (otherParties.length !== 1) {
		throw new Error(
			`${inputPath}: expected exactly one party with kind "other", found ${otherParties.length}.`
		);
	}

	const expectedOtherId = `${countryId}-other`;

	if (otherParties[0].id !== expectedOtherId) {
		throw new Error(
			`${inputPath}: the party with kind "other" should have id ${expectedOtherId}.`
		);
	}

	const fileText = makePartyFileText(countryId, parties);

	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, fileText, 'utf8');

	console.log(`Wrote ${outputPath}`);
	console.log(`Imported ${parties.length} parties for ${countryId}.`);
}

const countryId = process.argv[2];

if (!countryId) {
	console.error('Usage: node scripts/import-parties.mjs <countryId>');
	console.error('Example: node scripts/import-parties.mjs gb');
	process.exit(1);
}

try {
	importParties(countryId);
} catch (error) {
	console.error('');
	console.error('Party import failed:');
	console.error(error.message);
	process.exit(1);
}