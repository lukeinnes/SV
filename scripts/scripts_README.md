# Election CSV Import Scripts

This folder contains helper scripts for converting election and party data from CSV files into the TypeScript data files used by the Strengthened Voting project.

The basic workflow is:

1. Put party and election CSV files inside the relevant country folder under `scripts/`.
2. Run the party importer first.
3. Run the election importer second.
4. Open the data-check page in the browser and fix any reported errors.

---

## Folder structure

Your project should contain a `scripts` folder like this:

```text
scripts/
  README.md
  import-parties.mjs
  import-elections.mjs
  import-elections.config.mjs

  gb/
    parties.csv
    index.csv
    1997.csv
    2001.csv
    1974-feb.csv

  nl/
    parties.csv
    index.csv
    2023.csv
    2021.csv
```

Each country gets its own folder, using the project's country ID.

Examples:

```text
gb = United Kingdom
nl = Netherlands
```

---

## Party CSV files

Each country folder should contain a party file named:

```text
scripts/<countryId>/parties.csv
```

Example:

```text
scripts/gb/parties.csv
```

The required columns are:

```csv
id,usualName,shortName,codeName,colour,kind
```

Example:

```csv
id,usualName,shortName,codeName,colour,kind
gb-labour,Labour Party,Labour,LAB,#E4003B,party
gb-conservative,Conservative Party,Conservative,CON,#0087DC,party
gb-liberal-democrats,Liberal Democrats,Liberal Democrats,LD,#FAA61A,party
gb-speaker,Speaker,Speaker,SPK,#000000,special
gb-other,Other,Other,OTH,#D1D5DB,other
```

Allowed `kind` values are:

```text
party
independent
special
other
```

Important rules:

- Every party ID must start with the country ID, such as `gb-` or `nl-`.
- Each country must have exactly one `other` row.
- For GB, the Other row should be `gb-other`.
- For NL, the Other row should be `nl-other`.
- Seat-winning independents should have their own party IDs, for example `gb-independent-martin-bell`.

---

## Election result CSV files

Each individual election result file should live in the relevant country folder.

Example:

```text
scripts/gb/1997.csv
```

The required columns are:

```csv
partyId,votes,seatsWon
```

Example:

```csv
partyId,votes,seatsWon
gb-labour,13518167,418
gb-conservative,9663245,165
gb-liberal-democrats,5242618,46
gb-snp,621550,6
gb-plaid-cymru,161030,4
gb-other,360873,0
```

Important rules:

- `partyId` must already exist in `scripts/<countryId>/parties.csv` and, after importing parties, in `src/lib/data/parties/<countryId>.ts`.
- Do not put seat-winning parties or independents into `Other`.
- `Other` should represent the below-threshold, zero-seat remainder.
- `Other` must have `seatsWon` equal to `0`.
- The total of all `seatsWon` values must match the election's `totalSeats` in `index.csv`.

---

## Country election index CSV

Each country folder should contain:

```text
scripts/<countryId>/index.csv
```

This file tells the election importer what each election CSV represents.

Required columns:

```csv
csv,year,briefName,fullName,totalSeats,actualSeatAllocation,totalVotes
```

Example for GB:

```csv
csv,year,briefName,fullName,totalSeats,actualSeatAllocation,totalVotes
1997.csv,1997,1997,1997 United Kingdom general election,659,FPTP,
2001.csv,2001,2001,2001 United Kingdom general election,659,FPTP,
1974-feb.csv,1974-feb,Feb 1974,February 1974 United Kingdom general election,635,FPTP,
```

Example for the Netherlands:

```csv
csv,year,briefName,fullName,totalSeats,actualSeatAllocation,totalVotes
2023.csv,2023,2023,2023 Dutch general election,150,"PR, no formal threshold beyond Hare quota, D'Hondt",
```

Column notes:

- `csv`: the election result CSV file inside the country folder.
- `year`: used to generate the output filename and export name. Values like `1997` and `1974-feb` are both fine.
- `briefName`: short display name, such as `1997` or `Feb 1974`.
- `fullName`: full display name.
- `totalSeats`: required. The script stops if result seats do not sum to this number.
- `actualSeatAllocation`: short descriptor of the real-world seat allocation system, such as `FPTP` or `PR, 5% threshold, D'Hondt`.
- `totalVotes`: optional. If blank, the script calculates it by summing the result CSV.

---

## Election import config

The election importer is controlled by:

```text
scripts/import-elections.config.mjs
```

Example:

```js
export default {
  sourceRoot: 'scripts',
  partiesRoot: 'src/lib/data/parties',
  electionsRoot: 'src/lib/data/elections',

  tasks: [
    {
      countryId: 'gb',
      mode: 'folder'
    }
  ]
};
```

To import all elections listed in `scripts/gb/index.csv`:

```js
{
  countryId: 'gb',
  mode: 'folder'
}
```

To import all elections listed in `scripts/nl/index.csv` as well:

```js
tasks: [
  {
    countryId: 'gb',
    mode: 'folder'
  },
  {
    countryId: 'nl',
    mode: 'folder'
  }
]
```

To import only selected files from a country index:

```js
{
  countryId: 'gb',
  files: ['1997.csv', '2001.csv']
}
```

---

## Commands to run

Run these commands from the project root folder.

For example, first go to the project folder:

```cmd
cd %USERPROFILE%\Documents\strengthened-voting
```

Then import parties for each country:

```cmd
node scripts/import-parties.mjs gb
```

If you are also working on Netherlands data:

```cmd
node scripts/import-parties.mjs nl
```

Then import elections:

```cmd
node scripts/import-elections.mjs
```

Recommended order:

```cmd
node scripts/import-parties.mjs gb
node scripts/import-elections.mjs
```

For multiple countries:

```cmd
node scripts/import-parties.mjs gb
node scripts/import-parties.mjs nl
node scripts/import-elections.mjs
```

---

## What the scripts write

The party importer overwrites:

```text
src/lib/data/parties/<countryId>.ts
```

For example:

```text
src/lib/data/parties/gb.ts
```

The election importer overwrites election files under:

```text
src/lib/data/elections/<countryId>/
```

For example:

```text
src/lib/data/elections/gb/1997.ts
src/lib/data/elections/gb/index.ts
```

This overwrite behaviour is intentional. It means the scripts can be used both to create data and to correct existing data.

---

## Validation and error checking

The scripts are designed to stop immediately if they detect bad data.

The party importer stops if:

- a party ID is duplicated;
- a required field is missing;
- `kind` is not one of `party`, `independent`, `special`, or `other`;
- there is not exactly one `other` party;
- the `other` party does not have the expected ID, such as `gb-other`;
- a party ID does not start with the country ID.

The election importer stops if:

- an election CSV listed in `index.csv` is missing;
- a result row refers to an unknown `partyId`;
- a result CSV contains duplicate rows for the same `partyId`;
- the result seat total does not match `totalSeats`;
- the `Other` row has seats;
- required election metadata is missing from `index.csv`.

This is deliberate. It prevents bad data from silently entering the project.

---

## After running the scripts

Start or refresh the dev server:

```cmd
npm run dev
```

Then open:

```text
http://localhost:5173/data-check
```

The target is:

```text
Errors: 0
```

Warnings may be acceptable if they are known vote-total differences, but errors should be fixed before moving on.

Then check:

```text
http://localhost:5173/elections
```

Make sure:

- country switching works;
- election switching works;
- parties display correctly;
- `Other` is at the bottom;
- `Other` has zero seats;
- independents are displayed as intended;
- the actual seat allocation descriptor appears if the page has been updated to show it.

---

## Common problems

### Nothing happens when I run the command

Make sure you ran:

```cmd
node scripts/import-elections.mjs
```

not:

```cmd
node scripts/import-elections.config.mjs
```

The config file is not meant to be run directly.

If the terminal behaves oddly, close and reopen it, then run the command again.

### Unknown party ID

Example:

```text
refers to unknown partyId: gb-independent-example
```

Fix:

1. Add that party to `scripts/gb/parties.csv`.
2. Run `node scripts/import-parties.mjs gb`.
3. Run `node scripts/import-elections.mjs` again.

### Seat total mismatch

Example:

```text
gb 1997: seat total mismatch. Results sum to 629, but index totalSeats is 659.
```

Fix:

- Add the missing seat-winning parties or independents to the election result CSV.
- Do not put seat-winning results into `Other`.
- Re-run the importer.

### Other has seats

Example:

```text
gb-other has 2 seat(s)
```

Fix:

- Identify which party or independent won those seats.
- Add them to `parties.csv` if necessary.
- Add them as separate rows in the election CSV.
- Set `gb-other` seats to `0`.

---

## Recommended routine

When adding or correcting data:

```text
1. Edit scripts/<countryId>/parties.csv if new parties are needed.
2. Edit scripts/<countryId>/index.csv if adding or changing election metadata.
3. Edit the relevant election result CSVs.
4. Run the party importer.
5. Run the election importer.
6. Open /data-check.
7. Fix any errors.
8. Open /elections and inspect the result visually.
```

