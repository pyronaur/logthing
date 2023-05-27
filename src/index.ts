import * as util from 'util';
import { color } from 'console-log-colors';


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


export type Template<T extends string> = {
	name: T;
	prefix: string;
	flag: string;
}

const default_flag = (name: string) => {
	return color.dim(`${name} ❯ `);
}

export const Templates: Record<string, <T extends string>(name: T, level: string) => Template<T>> = {
	info: (name, level) => {
		return {
			name,
			prefix: `${color.whiteBright("✪")} ${level}:`,
			flag: default_flag(name),
		}
	},
	warn: (name, level) => {
		return {
			name,
			prefix: `${color.bold.c214("▲")} ${color.bold.underline.c214(level)}:`,
			flag: default_flag(name),
		}
	},
	error: (name, level) => {
		return {
			name,
			prefix: `${color.redBright("✖")} ${color.underline.redBright(level)}:`,
			flag: default_flag(name),
		}
	},
	debug: (name, level) => {
		return {
			name,
			prefix: `${color.yellowBright("◌")} ${color.underline.yellowBright(level)}:`,
			flag: default_flag(name),
		}
	},
	plain: (name, level) => {
		return {
			name,
			prefix: `${level}:`,
			flag: default_flag(name),
		}
	}
} as const;

type LevelConfig<T = string> = T | {
	name: T;
	prefix: string;
	flag?: string;
};


export class Logthing<TLevel extends string> {
	public loggers: Record<TLevel, Logger<TLevel>>;

	constructor (name: string, levels: LevelConfig<TLevel>[]) {
		this.loggers = {} as Record<TLevel, Logger<TLevel>>;
		for (const level of levels) {


			let level_name: TLevel;
			let prefix: string = '';
			let flag: string = '';

			if (typeof level === "string") {
				level_name = level;
				const template = (Templates[level_name] ? Templates[level_name] : Templates['plain']) as typeof Templates[number];
				({ flag, prefix } = template(name, level_name));
			} else {
				level_name = level.name;
				prefix = level.prefix;
				flag = level.flag ? level.flag : default_flag(name);
			}




			this.loggers[level_name] = {
				active: true,
				callback: this.create_named_logger(`${flag}${prefix}`),
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

	private create_named_logger(prefix: string) {
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