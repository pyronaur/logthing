import * as util from 'util';
import { LogConfig } from './types';

export type Logger = (config: LogConfig, ...args: unknown[]) => string;

export const logger: Logger = (config: LogConfig, ...args: unknown[]): string => {

	const { padding, prefix } = config;

	if (args.length === 0) {
		return '';
	}

	const prettified = args.flatMap((arg, i) => {
		let output = "";

		const iteration_padding = i === 0 ? '' : padding;

		/**
		 * === Preparation ===
		 * If possible, stringify the argument into a pretty looking object
		 */
		try {
			// Attempt to parse the arg as JSON
			if (typeof arg === "string") {
				arg = JSON.parse(arg);
			}
			output = util.inspect(arg, { depth: null, colors: true });

		} catch (error) {
			// The output isn't object-like
			// We still want to format it nicely if it's a string
			if (typeof arg === "string") {
				output = arg;
			}
			else {
				// This should probably never happen,
				// but just in case, display the arg as-is
				return [arg];
			}
		}


		/**
		 * === Formatting ===
		 * Format the output to be consistent in multi-line situations
		 */
		const lines = output.split('\n');
		if (i === 0 && lines.length === 1) {
			return [`${iteration_padding}${output}`, '\n'];
		}
		// If there are multiple lines, indent them.
		return [
			iteration_padding,
			lines.map(
				(line, j) => {
					if (j === 0 || typeof line !== "string") {
						return line;
					}
					if (line.includes('\n')) {
						return line.split('\n').map((line) => `${padding}${line}`).join('\n');
					}
					return `${padding}${line}`
				})
				.join('\n'),
			'\n'
		]
	})

	return `\n${prefix} ${prettified.join('')}`
}