import fs from 'node:fs';
import path from 'node:path';

const CONFIG_PATH = 'scripts/import-elections.config.mjs';

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

function readCsv(filePath) {
	return parseCsv(fs.readFileSync(filePath, 'utf8'), filePath);
}

function toInteger(value, label) {
	const cleaned = String(value ?? '').replaceAll(',', '').trim();

	if (cleaned.length === 0) {
		throw new Error(`${label} is required.`);
	}

	const number = Number(cleaned);

	if (!Number.isInteger(number) || number < 0) {
		throw new Error(`${label} must be a non-negative integer. Got: ${value}`);
	}

	return number;
}

function optionalInteger(value, label) {
	const cleaned = String(value ?? '').replaceAll(',', '').trim();

	if (cleaned.length === 0) return undefined;

	const number = Number(cleaned);

	if (!Number.isInteger(number) || number < 0) {
		throw new Error(`${label} must be a non-negative integer. Got: ${value}`);
	}

	return number;
}

function makeTsString(value) {
	return `'${String(value).replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
}

function makeExportName(countryId, year) {
	const parts = String(year).split(/[^a-zA-Z0-9]+/).filter(Boolean);

	const suffix = parts
		.map((part, index) => {
			if (index === 0) return part;
			return part.charAt(0).toUpperCase() + part.slice(1);
		})
		.join('');

	return `${countryId}${suffix}`;
}

function makeElectionId(countryId, year) {
	return makeExportName(countryId, year);
}

function makeResultBlock(result) {
	return `\t\t{
\t\t\tpartyId: ${makeTsString(result.partyId)},
\t\t\tvotes: ${result.votes},
\t\t\tseatsWon: ${result.seatsWon}
\t\t}`;
}

function readKnownPartyIds(partiesFilePath) {
	if (!fs.existsSync(partiesFilePath)) {
		throw new Error(`Could not find party file: ${partiesFilePath}`);
	}

	const text = fs.readFileSync(partiesFilePath, 'utf8');
	const ids = new Set();

	const regex = /\bid\s*:\s*['"`]([^'"`]+)['"`]/g;
	let match;

	while ((match = regex.exec(text)) !== null) {
		ids.add(match[1]);
	}

	if (ids.size === 0) {
		throw new Error(`No party ids found in ${partiesFilePath}`);
	}

	return ids;
}

function makeElectionFileText({
	exportName,
	electionId,
	countryId,
	briefName,
	fullName,
	actualSeatAllocation,
	totalVotes,
	totalSeats,
	results
}) {
	const actualSeatAllocationLine = actualSeatAllocation
		? `\tactualSeatAllocation: ${makeTsString(actualSeatAllocation)},\n`
		: '';

	return `import type { Election } from '../../types';

export const ${exportName}: Election = {
\tid: ${makeTsString(electionId)},
\tcountryId: ${makeTsString(countryId)},
\tbriefName: ${makeTsString(briefName)},
\tfullName: ${makeTsString(fullName)},
${actualSeatAllocationLine}\ttotalVotes: ${totalVotes},
\ttotalSeats: ${totalSeats},
\tresults: [
${results.map(makeResultBlock).join(',\n')}
\t]
};
`;
}

function makeIndexFileText(indexExportName, generatedFiles) {
	const imports = generatedFiles
		.map((file) => `import { ${file.exportName} } from './${file.importPath}';`)
		.join('\n');

	const electionList = generatedFiles.map((file) => `\t${file.exportName}`).join(',\n');

	return `import type { Election } from '../../types';

${imports}

export const ${indexExportName}: Election[] = [
${electionList}
];
`;
}

function readCountryIndex(countryFolder) {
	const indexPath = path.join(countryFolder, 'index.csv');

	if (!fs.existsSync(indexPath)) {
		throw new Error(`Missing country index file: ${indexPath}`);
	}

	return readCsv(indexPath);
}

function selectIndexRows(indexRows, task) {
	if (task.mode === 'folder') {
		return indexRows;
	}

	if (Array.isArray(task.files)) {
		const requested = new Set(task.files);
		const selected = indexRows.filter((row) => requested.has(row.csv));

		const found = new Set(selected.map((row) => row.csv));
		const missing = [...requested].filter((file) => !found.has(file));

		if (missing.length > 0) {
			throw new Error(
				`Task for ${task.countryId} requested file(s) not found in index.csv: ${missing.join(', ')}`
			);
		}

		return selected;
	}

	throw new Error(`Task for ${task.countryId} must use mode: 'folder' or provide files: [...]`);
}

function importOneElection({ config, task, row, knownPartyIds }) {
	const countryId = task.countryId;

	const csvFileName = row.csv;
	const year = row.year;

	if (!csvFileName) throw new Error(`${countryId} index row is missing csv.`);
	if (!year) throw new Error(`${countryId} index row for ${csvFileName} is missing year.`);
	if (!row.briefName) throw new Error(`${countryId} ${csvFileName} is missing briefName.`);
	if (!row.fullName) throw new Error(`${countryId} ${csvFileName} is missing fullName.`);

	const countryFolder = path.join(config.sourceRoot, countryId);
	const csvPath = path.join(countryFolder, csvFileName);

	if (!fs.existsSync(csvPath)) {
		throw new Error(`Missing election CSV: ${csvPath}`);
	}

	const exportName = row.exportName || makeExportName(countryId, year);
	const electionId = row.id || makeElectionId(countryId, year);
	const outputFileName = row.out || `${year}.ts`;

	const outputFolder = path.join(config.electionsRoot, countryId);
	const outputPath = path.join(outputFolder, outputFileName);

	const totalSeats = toInteger(row.totalSeats, `${countryId} ${year} totalSeats`);
	const explicitTotalVotes = optionalInteger(row.totalVotes, `${countryId} ${year} totalVotes`);

	const resultRows = readCsv(csvPath);

	const seenPartyIds = new Set();

	const results = resultRows.map((resultRow, index) => {
		const partyId = resultRow.partyId;

		if (!partyId) {
			throw new Error(`${csvPath} row ${index + 2} is missing partyId.`);
		}

		if (!knownPartyIds.has(partyId)) {
			throw new Error(
				`${csvPath} row ${index + 2} refers to unknown partyId: ${partyId}. Add it to src/lib/data/parties/${countryId}.ts first.`
			);
		}

		if (seenPartyIds.has(partyId)) {
			throw new Error(`${csvPath} contains duplicate result rows for partyId: ${partyId}`);
		}

		seenPartyIds.add(partyId);

		return {
			partyId,
			votes: toInteger(resultRow.votes, `${csvPath} row ${index + 2} votes`),
			seatsWon: toInteger(resultRow.seatsWon, `${csvPath} row ${index + 2} seatsWon`)
		};
	});

	const calculatedTotalVotes = results.reduce((total, result) => total + result.votes, 0);
	const totalVotes = explicitTotalVotes ?? calculatedTotalVotes;

	if (explicitTotalVotes !== undefined && explicitTotalVotes !== calculatedTotalVotes) {
		console.warn(
			`${countryId} ${year}: warning — result votes sum to ${calculatedTotalVotes.toLocaleString()}, but index totalVotes is ${explicitTotalVotes.toLocaleString()}.`
		);
	}

	const seatSum = results.reduce((total, result) => total + result.seatsWon, 0);

	if (seatSum !== totalSeats) {
		throw new Error(
			`${countryId} ${year}: seat total mismatch. Results sum to ${seatSum}, but index totalSeats is ${totalSeats}.`
		);
	}

	const otherId = `${countryId}-other`;
	const otherRow = results.find((result) => result.partyId === otherId);

	if (otherRow && otherRow.seatsWon > 0) {
		throw new Error(
			`${countryId} ${year}: ${otherId} has ${otherRow.seatsWon} seat(s). Seat-winning parties/candidates must be separate rows.`
		);
	}

	const fileText = makeElectionFileText({
		exportName,
		electionId,
		countryId,
		briefName: row.briefName,
		fullName: row.fullName,
		actualSeatAllocation: row.actualSeatAllocation,
		totalVotes,
		totalSeats,
		results
	});

	fs.mkdirSync(outputFolder, { recursive: true });
	fs.writeFileSync(outputPath, fileText, 'utf8');

	console.log(`Wrote ${outputPath}`);

	return {
		exportName,
		importPath: outputFileName.replace(/\.ts$/, '')
	};
}

function importCountryTask(config, task) {
	const countryId = task.countryId;

	if (!countryId) {
		throw new Error('Every task needs a countryId.');
	}

	const countryFolder = path.join(config.sourceRoot, countryId);
	const partiesFilePath = path.join(config.partiesRoot, `${countryId}.ts`);

	const knownPartyIds = readKnownPartyIds(partiesFilePath);
	const indexRows = readCountryIndex(countryFolder);
	const selectedRows = selectIndexRows(indexRows, task);

	console.log('');
	console.log(`Importing ${countryId}: ${selectedRows.length} election(s)`);

	const generatedFiles = selectedRows.map((row) =>
		importOneElection({
			config,
			task,
			row,
			knownPartyIds
		})
	);

	const outputFolder = path.join(config.electionsRoot, countryId);
	const indexExportName = task.indexExportName || `${countryId}Elections`;
	const indexPath = path.join(outputFolder, 'index.ts');

	const indexText = makeIndexFileText(indexExportName, generatedFiles);

	fs.writeFileSync(indexPath, indexText, 'utf8');
	console.log(`Wrote ${indexPath}`);
}

async function main() {
	const configUrl = new URL(`../${CONFIG_PATH}`, import.meta.url);
	const imported = await import(configUrl.href);
	const config = imported.default;

	if (!config) throw new Error(`No default export found in ${CONFIG_PATH}.`);
	if (!config.sourceRoot) throw new Error('Config is missing sourceRoot.');
	if (!config.partiesRoot) throw new Error('Config is missing partiesRoot.');
	if (!config.electionsRoot) throw new Error('Config is missing electionsRoot.');
	if (!Array.isArray(config.tasks)) throw new Error('Config is missing tasks array.');

	for (const task of config.tasks) {
		importCountryTask(config, task);
	}

	console.log('');
	console.log('Election import complete.');
}

main().catch((error) => {
	console.error('');
	console.error('Election import failed:');
	console.error(error.message);
	process.exit(1);
});