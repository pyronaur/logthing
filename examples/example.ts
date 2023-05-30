import { Console } from '../src/delivery.console';
import { logthing } from '../src/index';

const log = logthing('Inception', [
	'info',
	'debug',
	'error',
	'warn',
	'no_template',
	new Console("Inception", "custom", { template: "warn", prefix: 'CUSTOM >> ' }),
	new Console("Inception", "boom", { prefix: 'Boom 👉', symbol: '💥' }),
	[
		new Console("Inception", "banana", { template: "warn" }),
		new Console("Inception", "banana", { template: "info" }),
	],
]);

log
	.mute("banana")
	.banana("Banana Template TWICE")
	.boom("Boom Template")
	.no_template("No Template")
	.warn('Warning', 'You are in a dream', 'Dreaming')  // Test logging strings
	.debug('Welcome', 'You have entered the world of dreams')  // Test logging strings
	.debug({ character: 'C◍obb' }) // Test logging simple object
	.debug(['Dream Level 1', 'Dream Level 2'])  // Test logging array
	.error(new Error('Unexpected dream collapse'))  // Test logging Error objects
	.info([1, 2, 3, 4, 5, 6])  // Test logging numbers in array
	.info(3, 2)  // Test logging numbers
	.debug(() => 'This is a dream function') // Test logging functions
	.section('BUFFER START INCEPTION')  // Test logging section
	.info("I'm in inception")
	.info("I'm in inception")
	.info("I'm in inception")
	.info("I'm in inception")
	.info(true)  // Test logging boolean
	.debug(undefined) // Test logging undefined
	.info(null)  // Test logging null
	.debug(Symbol('Dream'))  // Test logging Symbol
	.section('DOUBLE INCEPTION')  // Test logging section
	.debug({   // Test logging multi-line complex object
		dreamLevel: 'Level 1',
		events:
			[{ event: 'Kidnapping Saito' },
			{ event: 'Hotel zero-gravity fight' },
			{ event: 'Snow fortress' },
			{ event: 'Limbo' }],
		characters: {
			'Cobb': 'Extractor',
			'Arthur': 'Point Man',
			'Mal': 'Shade'
		},
		dreamLayers: 4,
		dreamCollapsed: false
	})
	.write()
	.custom("Custom Template")
	.boom("Custom Template 2")
	.banana("🍌 Banana Template")