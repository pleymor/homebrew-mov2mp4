import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

// Read version from package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const version = packageJson.version;

/**
 * CLI options parsed from command line arguments.
 */
export interface CliOptions {
  /** Input file path (positional argument) */
  input: string;

  /** Output file path (optional) */
  output?: string;

  /** Quality preset */
  quality: string;
}

/**
 * Creates and configures the CLI program.
 * @returns Configured Commander program
 */
export function createProgram(): Command {
  const program = new Command();

  program
    .name('mov2mp4')
    .description('Convert .mov files to lightweight .mp4 format')
    .version(version)
    .argument('<input>', 'Input .mov file path')
    .option('-o, --output <path>', 'Output .mp4 file path')
    .option('-q, --quality <preset>', 'Quality preset: low, medium, high', 'medium');

  return program;
}

/**
 * Parses command line arguments and returns CLI options.
 * @param argv - Command line arguments (defaults to process.argv)
 * @returns Parsed CLI options
 */
export function parseArgs(argv: string[] = process.argv): CliOptions {
  const program = createProgram();
  program.parse(argv);

  const opts = program.opts();
  const args = program.args;

  return {
    input: args[0],
    output: opts.output,
    quality: opts.quality
  };
}
