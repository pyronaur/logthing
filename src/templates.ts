import { color } from 'console-log-colors';

export const default_flag = (name: string) => {
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