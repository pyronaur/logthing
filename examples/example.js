import { Logthing } from 'logthing';

const instance = new Logthing('Inception', ['info', 'debug', 'error']);
const log = instance.get_interface();

log
	.debug('Welcome', 'You have entered the world of dreams')  // Test logging strings
	.debug({ character: 'Cobb' }) // Test logging simple object
	.debug(['Dream Level 1', 'Dream Level 2'])  // Test logging array
	.error(new Error('Unexpected dream collapse'))  // Test logging Error objects
	.info([1, 2, 3, 4, 5, 6])  // Test logging numbers in array
	.info(3, 2)  // Test logging numbers
	.debug(() => 'This is a dream function') // Test logging functions
	.info(true)  // Test logging boolean
	.debug(undefined) // Test logging undefined
	.info(null)  // Test logging null
	.debug(Symbol('Dream'))  // Test logging Symbol
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
