#!/usr/bin/env node
// Interactive CLI to review captured fast-check findings and print a
// ready-to-paste regression test template for manual promotion into a
// permanent *.test.ts file. Never edits test files directly (too risky to
// script-edit hand-maintained tests) and never auto-runs in CI or hooks.

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const FINDINGS_DIR = path.resolve(process.cwd(), '.fast-check-findings');

function loadFindings() {
	if (!fs.existsSync(FINDINGS_DIR)) return [];
	return fs
		.readdirSync(FINDINGS_DIR)
		.filter((name) => name.endsWith('.json'))
		.map((name) => {
			const filePath = path.join(FINDINGS_DIR, name);
			const finding = JSON.parse(fs.readFileSync(filePath, 'utf8'));
			return { filePath, finding };
		});
}

function summarize({ finding }, index) {
	const { id, seed, counterexamplePath, counterexample, errorMessage } = finding;
	const lines = [
		`[${index}] ${id}`,
		`    seed=${seed} path=${JSON.stringify(counterexamplePath)}`,
		`    counterexample: ${JSON.stringify(counterexample)}`,
	];
	if (errorMessage) lines.push(`    error: ${errorMessage}`);
	return lines.join('\n');
}

function printTemplate({ finding }) {
	const { id, seed, counterexamplePath, counterexample } = finding;
	const args = Array.isArray(counterexample)
		? counterexample.map((value) => JSON.stringify(value)).join(', ')
		: JSON.stringify(counterexample);
	console.log('\n// --- Promotion template (copy into the matching *.test.ts file) ---\n');
	console.log(`// Promoted from fast-check finding: ${id}`);
	console.log(`// seed=${seed} path=${JSON.stringify(counterexamplePath)}`);
	console.log(`it('regression: ${id} counterexample', () => {`);
	console.log(`\tconst args = [${args}];`);
	console.log(`\t// TODO: call the function under test with args and assert the fix.`);
	console.log('});');
	console.log('\n// --- end template ---\n');
}

function ask(rl, question) {
	return new Promise((resolve) => {
		rl.question(question, (answer) => resolve(answer));
	});
}

async function main() {
	const findings = loadFindings();
	if (findings.length === 0) {
		console.log('No fast-check findings in .fast-check-findings/.');
		return;
	}

	console.log(`Found ${findings.length} finding(s):\n`);
	findings.forEach((entry, index) => {
		console.log(summarize(entry, index));
		console.log('');
	});

	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	try {
		const selection = await ask(
			rl,
			`Select a finding to promote [0-${findings.length - 1}], or Enter to cancel: `,
		);
		const index = Number.parseInt(selection, 10);
		if (Number.isNaN(index) || index < 0 || index >= findings.length) {
			console.log('Cancelled.');
			return;
		}

		const entry = findings[index];
		printTemplate(entry);

		const deleteAnswer = await ask(rl, 'Delete this finding file now? (y/N) ');
		if (deleteAnswer.trim().toLowerCase() === 'y') {
			fs.unlinkSync(entry.filePath);
			console.log(`Deleted ${entry.filePath}`);
		}
	} finally {
		rl.close();
	}
}

main();
