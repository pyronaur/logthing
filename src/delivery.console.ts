// import { color } from 'console-log-colors';
import { logger } from './logger';
import { DeliveryInterface, LogConfig } from './types';

export class Console implements DeliveryInterface {

	private buffer: { config: LogConfig, args: unknown[] }[] = [];
	private is_buffering = false;

	public deliver(config: LogConfig, ...args: unknown[]): void {
		if (this.is_buffering) {
			this.buffer.push({
				config,
				args,
			});
			return;
		}

		console.log(logger(config, ...args));
	}

	section_start() {
		// Clear the previous buffer
		if (this.is_buffering) {
			this.section_end()
		}

		this.is_buffering = true;
		// this.buffer.push(color.dim(`[${name}]`));
	}

	section_end() {
		// this.buffer.push(color.dim(`[end]`));
		this.is_buffering = false;
		for (const { config, args } of this.buffer) {
			this.deliver(config, ...args);
		}
		this.buffer = [];
	}

}
