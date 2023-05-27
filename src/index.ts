import * as util from 'util';

type Logger<T extends string> = {
	active: boolean;
	callback: (content: string, ...args: unknown[]) => LogthingInterface<T>;
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
		const iface = this.get_interface();
		return function (content: string, ...args: unknown[]): LogthingInterface<TLevel> {
			const whoami = `${name}(${level}):`;
			if (args.length > 0) {
				const pretty_objects = args.map(arg => {
					try {
						if (typeof arg === "string") {
							arg = JSON.parse(arg);
						}
						return util.inspect(arg, { depth: null, colors: true })
					} catch (error) {
						return arg;
					}
				})
				console.log(`\n${whoami} ${content}\n`, ...pretty_objects);
			} else {
				console.log(`${whoami} ${content}`, ...args);
			}
			return iface as LogthingInterface<TLevel>;
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


