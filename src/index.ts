import * as util from 'util';
import clc, { color } from 'console-log-colors';


type Logger<T extends string> = {
	active: boolean;
	callback: (...args: unknown[]) => LogthingInterface<T>;
}

type LogthingInterface<T extends string> = {
	[K in T]: Logger<T>['callback'];
} & {
	mute_levels: (name: T | T[]) => void;
	unmute_levels: (name: T | T[]) => void;
	mute_all: () => void;
	unmute_all: () => void;
}

export class Logthing<TLevel extends string> {
	public loggers: Record<TLevel, Logger<TLevel>>;

	constructor (private name: string, levels: TLevel[]) {
		this.loggers = {} as Record<TLevel, Logger<TLevel>>;
		for (const level of levels) {
			this.loggers[level] = {
				active: true,
				callback: this.create_named_logger(level, this.name),
			};
		}
	}

	public get_interface = () => {
		return {
			...Object.keys(this.loggers).reduce((acc, key) => {
				const logger = this.loggers[key as TLevel];
				acc[key as TLevel] = logger.callback;
				return acc;
			}, {} as Record<TLevel, Logger<TLevel>['callback']>),
			mute_levels: this.mute_levels,
			unmute_levels: this.unmute_levels,
			mute_all: this.mute_all,
			unmute_all: this.unmute_all,
		}
	}

	private create_named_logger(level: string, name: string) {
		const prefix = color.dim(`${name}(${color.bold(level)}):`);
		// Remove color codes from the prefix
		const plain_prefix = prefix.replace(/\x1b\[\d+m/gm, '');
		const padding = ' '.repeat(plain_prefix.length + 1);

		return (...args: unknown[]): LogthingInterface<TLevel> => {
			const iface = this.get_interface()
			if (args.length === 0) {
				return iface;
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

			console.log(`\n${prefix}`, prettified.join(''))
			return iface;
		}
	}

	private mute_levels(name: TLevel | TLevel[]) {

		const levels = Array.isArray(name) ? name : [name];
		for (const level of levels) {
			if (this.loggers[level]) {
				this.loggers[level]!.active = false;
			}
		}
	}

	private unmute_levels(name: TLevel | TLevel[]) {
		const levels = Array.isArray(name) ? name : [name];
		for (const level of levels) {
			if (this.loggers[level]) {
				this.loggers[level]!.active = true;
			}
		}
	}

	private mute_all() {
		this.mute_levels(Object.keys(this.loggers) as TLevel[]);
	}

	private unmute_all() {
		this.unmute_levels(Object.keys(this.loggers) as TLevel[]);
	}
}


(async () => {
	const test = new Logthing('Logthing', ['info', 'debug']);
	const x = test.get_interface()

	x.debug('hello', 'world')
		.debug({ howdy: 'test' })
		.debug({ howdy: 'test' }, { double: 'test' })
		.debug({
			howdy: 'test',
			test:
				[{ test: 'test' },
				{ test: 'test' },
				{ test: 'test' },
				{ test: 'test' },
				{ test: 'test' },
				{ test: 'test' },]
		})

		.info('hello', 'world')
		.debug(new Error('test'))
		.debug('yo')
		.info(`one
day this happened and
it was really cool`)
		.info(`one
day this happened and
it was really cool`, "hello")

})()