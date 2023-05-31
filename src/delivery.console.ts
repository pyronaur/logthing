import { color } from 'console-log-colors';
import { Templates } from './templates';
import { DeliveryInterface, AvailableTemplateNames } from './types';
import { inspect } from 'node-inspect-extracted';

type ConsoleConfig = {
	template?: AvailableTemplateNames;
	flag?: string;
	prefix?: string;
	symbol?: string;
	color?: 'black'
	| 'red'
	| 'green'
	| 'yellow'
	| 'blue'
	| 'magenta'
	| 'cyan'
	| 'white'
	| 'gray'
	| 'grey'
}

export class Console<Channel_Name extends string> implements DeliveryInterface {
	public static templates = Templates;
	public name: Channel_Name;

	private prefix = '';
	private padding = '';

	constructor (app_name: string, channel: Channel_Name, config: ConsoleConfig = {}) {
		this.name = channel;
		let template_name: AvailableTemplateNames = 'default';

		if (!config.template && channel in Templates) {
			template_name = channel as AvailableTemplateNames;
		}

		if (config.template) {
			template_name = config.template;
		}

		const template = Templates[template_name];
		let { symbol, prefix } = template(channel);

		const flag = config.flag || color.dim(`${app_name} ❯ `);

		if (config.prefix) {
			prefix = config.prefix;
		}

		if (config.symbol) {
			symbol = config.symbol;
		}

		// Colorize the symbol and prefix if color is specified
		let symbol_prefix = `${symbol} ${prefix}`;
		if (config.color && config.color in color) {
			symbol_prefix = color[config.color](symbol_prefix);
		}

		this.prefix = `${flag} ${symbol_prefix}:`;
		this.padding = ' '.repeat(this.prefix.replace(/\x1b\[[^m]+m|\u001b\[[^m]+m/gmi, '').length + 1);

	}

	public deliver(...args: unknown[]): void {
		console.log(this.format(...args));
	}

	private format(...args: unknown[]): string {

		const padding = this.padding;
		const prefix = this.prefix;

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
				output = inspect(arg, { depth: null, colors: true });

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
				// Add whitespace after multiline outputs
				'\n'
			]
		})

		// Remove last newline
		if (prettified[prettified.length - 1] === '\n') {
			prettified.pop();
		}

		return `${prefix} ${prettified.join('')}`
	}

}
