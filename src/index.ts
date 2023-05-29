import { logger } from './logger';
import { Console } from './delivery.console';
import { AvailableTemplateNames, Channel, LevelConfig, LogConfig, LogthingInterface } from './types';
import { Templates, default_flag } from './templates';





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
		const delivery = new Console();

		const methods = {
			mute_levels: this.mute.bind(this),
			unmute_levels: this.unmute.bind(this),
			mute_all: this.mute_all.bind(this),
			unmute_all: this.unmute_all.bind(this),
			section: (name: string) => {
				delivery.section_start(name);
				return methods;
			},
			write: () => {
				delivery.section_end();
				return methods;
			}
		} as any;

		for (const [name, channel] of Object.entries<Channel>(this.channels)) {

			if (name in methods) {
				throw new Error(`Channel name "${name}" is reserved`);
			}

			methods[name] = (...args: unknown[]) => {
				if (channel.active) {
					const result = channel.callback(channel.config, ...args);
					delivery.deliver(result);
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