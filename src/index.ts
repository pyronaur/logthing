
import { color } from 'console-log-colors';
import { Logger, logger } from './logger';




type LogthingInterface<T extends string> = {
	[K in T]: (...args: unknown[]) => LogthingInterface<T>;
} & {
	mute_levels: (name: T | T[]) => void;
	unmute_levels: (name: T | T[]) => void;
	mute_all: () => void;
	unmute_all: () => void;
}

export type LogConfig = {
	name: string;
	prefix: string;
	plain_prefix: string;
	flag: string;
	padding: string;
}

export type Template<T extends string> = {
	name: T;
	prefix: string;
	flag: string;
	config: LogConfig;
}

const default_flag = (name: string) => {
	return color.dim(`${name} ❯ `);
}

export const Templates = {
	"info": (name: string, level: string) => {
		return {
			name,
			prefix: `${color.whiteBright("✪")} ${level}:`,
			flag: default_flag(name),
		}
	},
	"warn": (name: string, level: string) => {
		return {
			name,
			prefix: `${color.bold.c214("▲")} ${color.bold.underline.c214(level)}:`,
			flag: default_flag(name),
		}
	},
	"error": (name: string, level: string) => {
		return {
			name,
			prefix: `${color.redBright("✖")} ${color.underline.redBright(level)}:`,
			flag: default_flag(name),
		}
	},
	"debug": (name: string, level: string) => {
		return {
			name,
			prefix: `${color.yellowBright("◌")} ${color.underline.yellowBright(level)}:`,
			flag: default_flag(name),
		}
	},
	"plain": (name: string, level: string) => {
		return {
			name,
			prefix: `${level}:`,
			flag: default_flag(name),
		}
	}
} as const;
type AvailableTemplateNames = keyof typeof Templates;

type LevelConfig<T = string> = T | {
	name: T;
	prefix?: string;
	flag?: string;
	template?: AvailableTemplateNames;
};

type Channel = {
	active: boolean;
	config: LogConfig;
	callback: Logger;
}


export class Logthing<Name extends string> {
	public channels: Record<Name, Channel> = {} as any;

	constructor (name: string, levels: LevelConfig<Name>[]) {

		for (const level of levels) {
			let level_name: Name;
			let prefix: string = '';
			let flag: string = '';

			if (typeof level === "string") {
				level_name = level;
				const template = (level_name in Templates) ? Templates[level_name as AvailableTemplateNames] : Templates['plain'];
				({ flag, prefix } = template(name, level_name));
			} else {
				level_name = level.name;
				if (level.template && (level.template in Templates)) {
					const template = Templates[level.template as AvailableTemplateNames];
					({ flag, prefix } = template(name, level_name));
				} else {
					prefix = level.prefix || '';
					flag = level.flag ? level.flag : default_flag(name);
				}
			}

			const plain_prefix = prefix.replace(/\x1b\[\d+m/gm, '');
			const padding = ' '.repeat(plain_prefix.length + 1);

			const config: LogConfig = {
				name: level_name,
				prefix,
				plain_prefix,
				flag,
				padding,
			}

			this.channels[level_name] = {
				active: true,
				config,
				callback: logger,
			};
		}

	}

	public get_interface() {
		const methods = {
			mute_levels: this.mute.bind(this),
			unmute_levels: this.unmute.bind(this),
			mute_all: this.mute_all.bind(this),
			unmute_all: this.unmute_all.bind(this),
		} as any;

		for (const [name, channel] of Object.entries<Channel>(this.channels)) {

			if (name in methods) {
				throw new Error(`Channel name "${name}" is reserved`);
			}

			methods[name] = (...args: unknown[]) => {
				if (channel.active) {
					channel.callback(channel.config, ...args);
				}
				return methods;
			}

		}

		return methods as LogthingInterface<Name>;
	}

	private mute(name: Name | Name[]) {

		const levels = Array.isArray(name) ? name : [name];
		for (const level of levels) {
			if (this.channels[level]) {
				this.channels[level]!.active = false;
			}
		}
	}

	private unmute(name: Name | Name[]) {
		const levels = Array.isArray(name) ? name : [name];
		for (const level of levels) {
			if (this.channels[level]) {
				this.channels[level]!.active = true;
			}
		}
	}

	private mute_all() {
		this.mute(Object.keys(this.channels) as Name[]);
	}

	private unmute_all() {
		this.unmute(Object.keys(this.channels) as Name[]);
	}
}