/**
 * This work may only be used according to the license below.
 *
 * @license Broadcasting © 2024 by William Heiman CC-BY-SA-4.0
 * @author Temp8D
 */

/**
 * Data structure for a broadcast message transmitted over a broadcast channel
 */
export default class BroadcastMessage{
	constructor( constructor_data ){
		this.header = {
			config : {
				events : { //Set afterwards
					resolve : null,
					reject : null 
				}
			},
			id : ( constructor_data?.header?.id || null ),
		};

		[ 'resolve', 'reject' ].forEach( ( foreach_data ) => {
			let event_callback = constructor_data?.header?.config?.events?.[ foreach_data ];

			if( typeof event_callback == 'function' ){
				this.header.config.events[ foreach_data ] = event_callback;
			}
		} );

		this.data = ( constructor_data?.data || null );
	}
}
