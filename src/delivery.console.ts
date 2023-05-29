// import { color } from 'console-log-colors';
import { logger } from './logger';
import { DeliveryInterface, Channel } from './types';

export class Console implements DeliveryInterface {

	private buffer: { config: Channel, args: unknown[] }[] = [];
	private is_buffering = false;

	public deliver(config: Channel, ...args: unknown[]): void {
		if (this.is_buffering) {
			this.buffer.push({
				config,
				args,
			});
			return;
		}

		console.log(logger(config, ...args));
	}

	buffer_start() {
		// Clear the previous buffer
		if (this.is_buffering) {
			this.buffer_end()
		}

		this.is_buffering = true;
		// this.buffer.push(color.dim(`[${name}]`));
	}

	buffer_end() {
		// this.buffer.push(color.dim(`[end]`));
		this.is_buffering = false;
		for (const { config, args } of this.buffer) {
			this.deliver(config, ...args);
		}
		this.buffer = [];
	}

}
