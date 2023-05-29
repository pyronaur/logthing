import { color } from 'console-log-colors';

export const default_flag = (name: string) => {
	return color.dim(`${name} ❯ `);
}

export const Templates = {
	"info": (name: string, channel: string) => {
		return {
			name,
			prefix: `${color.whiteBright("✪")} ${channel}:`,
			flag: default_flag(name),
		}
	},
	"warn": (name: string, channel: string) => {
		return {
			name,
			prefix: `${color.bold.c214("▲")} ${color.bold.underline.c214(channel)}:`,
			flag: default_flag(name),
		}
	},
	"error": (name: string, channel: string) => {
		return {
			name,
			prefix: `${color.redBright("✖")} ${color.underline.redBright(channel)}:`,
			flag: default_flag(name),
		}
	},
	"debug": (name: string, channel: string) => {
		return {
			name,
			prefix: `${color.yellowBright("◌")} ${color.underline.yellowBright(channel)}:`,
			flag: default_flag(name),
		}
	},
	"plain": (name: string, channel: string) => {
		return {
			name,
			prefix: `${channel}:`,
			flag: default_flag(name),
		}
	}
} as const;