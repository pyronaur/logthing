import { color } from 'console-log-colors';
import { DeliveryInterface } from './types';

export class Console implements DeliveryInterface {

	private buffer: string[] = [];
	private is_buffering = false;

	public deliver(data: string): void {
		if (this.is_buffering) {
			this.buffer.push(data);
			return;
		}

		console.log(data);
	}

	section_start(name: string) {
		// Clear the previous buffer
		if (this.is_buffering) {
			this.section_end()
		}

		this.is_buffering = true;
		this.buffer.push(color.dim(`[${name}]`));
	}

	section_end() {
		this.buffer.push(color.dim(`[end]`));
		this.is_buffering = false;
		this.deliver(this.buffer.join('\n'));
		this.buffer = [];
	}

}
