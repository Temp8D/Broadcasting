/**
 * This work may only be used according to the license below.
 *
 * @license Broadcasting © 2024 by William Heiman CC-BY-SA-4.0
 * @author Temp8D
 */

import {
	Broadcast,
	BroadcastChannel,
	BroadcastChannelSubscriber,
	BroadcastMessage
} from './Broadcasting.js'

/**
 * Utility for constructing module objects.
 */
export default class BroadcastingFactory {}

/**
 * Instantiate a Broadcast
 */
BroadcastingFactory.getBroadcast = ( broadcast_data ) => {
	return( new Broadcast( broadcast_data ) );
}

/**
 * Get an instance of BroadcastChannel
 * 
 * @var string id
 * @return null|BroadcastChannel
 * @todo rewrite in factory pattern
 */
BroadcastingFactory.getBroadcastChannel = ( channel_id, broadcast_subscribers ) => {
	let broadcast_channel = null;

	const channel_data = BroadcastingFactory.getBroadcastChannelData( channel_id, broadcast_subscribers );

	if( channel_data ){
		broadcast_channel = new BroadcastChannel( channel_data );
	}

	return( broadcast_channel );
}

/**
 * Get the broadcast channel data for a specific broadcast channel.
 *
 * @var string id The value of the BroadcastChannel.id property.
 * @var array broadcast_subscribers (optional) An array of BroadcastChannelSubscriber instances or
 * broadcast_channel_subscriber data that will be used to instantiate new BroadcastChannelSubscriber
 * instances.
 * @return object
 */
BroadcastingFactory.getBroadcastChannelData = ( id, broadcast_channel_subscribers ) => {
	const channel_data = {
		data : null,
		header : {
			config : {
				subscribers : null
			},
			id : id
		}
	};

	if( Array.isArray( broadcast_channel_subscribers ) ){
		broadcast_channel_subscribers.forEach( ( foreach_data ) => {
			let broadcast_channel_subscriber = foreach_data;

			if( !( foreach_data instanceof BroadcastChannelSubscriber ) ){
				broadcast_channel_subscriber = BroadcastingFactory.getBroadcastChannelSubscriber( foreach_data );
			}

			if( channel_data.header.config.subscribers == null ){
				channel_data.header.config.subscribers = [];
			}

			channel_data.header.config.subscribers.push( foreach_data );
		} );
	}

	return( channel_data );
};

/**
 * Get a new instance of BroadcastChannelSubscriber
 */
BroadcastingFactory.getBroadcastChannelSubscriber = ( subscriber_data ) => {
	return( new BroadcastChannelSubscriber( subscriber_data ) );
}

/**
 * Instantiate a BroadcastMessage
 */
BroadcastingFactory.getBroadcastMessage = ( message_data ) => {
	return( new BroadcastMessage( message_data ) );
}

