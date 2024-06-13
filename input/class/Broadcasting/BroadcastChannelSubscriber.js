/**
 * This work may only be used according to the license below.
 *
 * @license Broadcasting © 2024 by William Heiman CC-BY-SA-4.0
 * @author Temp8D
 */

import { BroadcastMessage } from './BroadcastChannels.js';

import { 
	APP_FLAG_DEBUG,
	APP_FLAG_DEBUG_VERBOSE
} from '../../shared/Constants';

/**
 * The data structure for an EventChannel subscriber.
 *
 * Note: If set, the this.header.config.events.post method will be invoked when a message is posted.
 * Note: The this.header.id and this.data properties should be used to identify the subscriber.
 */
export default class BroadcastChannelSubscriber{
	constructor( constructor_data ){
		this.header = {
			config : {
				events : {
					delete : null, //Set afterwards
					post : null,
					put : null
				}
			},
			id : constructor_data?.header?.id
		};

		[ 'delete', 'post', 'put' ].forEach( ( foreach_data ) => {
			let event_callback = constructor_data?.header?.config.events?.[ foreach_data ];

			if( typeof event_callback == 'function' ){
				this.header.config.events[ foreach_data ] = event_callback;
			}
		} );

		this.data = constructor_data?.data;
	}

	getId(){
		return( this.header.id );
	}

	getData(){
		return( this.data );
	}

	/**
	 * Supply the broadcast message to the subscriber's "post" event method.
	 * @var BroadcastMessage
	 */
	postBroadcastMessage( broadcast_message ){
		if( APP_FLAG_DEBUG && APP_FLAG_DEBUG_VERBOSE ){
			let log_data = [
				'BroadcastChannelSubscriber ', 
				this.getId(), 
				this.getData(), 
				' received message', 
				broadcast_message,
				'this.header',
				this.header
			];

			console.log( ...log_data );
		}

		if( ( typeof this.header.config.events.post == 'function' ) ){
			this.header.config.events.post( broadcast_message );
		}
	}
}
