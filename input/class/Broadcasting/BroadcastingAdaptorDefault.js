/**
 * This work may only be used according to the license below.
 *
 * @license Broadcasting © 2024 by William Heiman CC-BY-SA-4.0
 * @author Temp8D
 */

import Broadcasting from './Broadcasting.js';

/**
 * Allows components to work with the Broadcasting module without implementing logic which would
 * become redundant across multiple classes.
 */
export default class BroadcastingAdaptorDefault{} 

BroadcastingAdaptorDefault.putBroadcastChannel = ( channel_id ) => {
	const broadcast_channel = Broadcasting.Factory.getBroadcastChannel( channel_id );
	Broadcasting.putBroadcastChannel( broadcast_channel );
}

/**
 * Creates a BroadcastChannelSubscriber and adds it to the BroadcastChannel(s)
 *
 * @var array|string channel_id
 * @var object subscriber_data Used to construct subscriber
 * @var boolean flag_replace (optional)
 */
BroadcastingAdaptorDefault.putBroadcastChannelSubscriber = ( channel_id, subscriber_data, flag_replace ) => {
	const channel_ids = [];

	if( Array.isArray( channel_id ) ){
		channel_ids.push( ...channel_id );
	} else {
		channel_ids.push( channel_id );
	}

	channel_ids.forEach( ( foreach_data ) => {
		const broadcast_channel = Broadcasting.getBroadcastChannel( foreach_data );

		if( broadcast_channel ){
			let broadcast_channel_subscriber = (
				Broadcasting.Factory.getBroadcastChannelSubscriber( subscriber_data )
			);

			broadcast_channel.putBroadcastChannelSubscriber( broadcast_channel_subscriber, flag_replace );
		}
	} );
}
