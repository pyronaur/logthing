import { color } from 'console-log-colors';

export const Templates = {
	"info": (channel: string) => {
		return {
			symbol: color.cyan("✪"),
			prefix: color.cyan(channel),
		}
	},
	"warn": (channel: string) => {
		return {
			symbol: color.bold.c214("▲"),
			prefix: color.bold.underline.c214(channel),
		}
	},
	"error": (channel: string) => {
		return {
			symbol: color.redBright("✖"),
			prefix: color.underline.redBright(channel),
		}
	},
	"debug": (channel: string) => {
		return {
			symbol: color.yellowBright("◌"),
			prefix: color.underline.yellowBright(channel),
		}
	},
	"default": (channel: string) => {
		return {
			symbol: ' ',
			prefix: channel,
		}
	}
} as const;