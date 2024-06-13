/**
 * This work may only be used according to the license below.
 *
 * @license Broadcasting © 2024 by William Heiman CC-BY-SA-4.0
 * @author Temp8D
 */

import Broadcast from './Broadcast.js';
import BroadcastChannel from './BroadcastChannel.js';
import BroadcastChannels from './BroadcastChannels.js';
import BroadcastChannelSubscriber from './BroadcastChannelSubscriber.js';
import BroadcastingAdaptorDefault from './BroadcastingAdaptorDefault.js';
import BroadcastingFactory from './BroadcastingFactory.js';
import BroadcastMessage from './BroadcastMessage.js';

const AdaptorDefault = BroadcastingAdaptorDefault;

/**
 * Public API for working with broadcasting.
 */
export default class Broadcasting{}

Broadcasting.getBroadcastChannel = ( channel_id ) => {
	return( Broadcasting.Channels.getBroadcastChannel( channel_id ) );
}

Broadcasting.getBroadcastChannels = () => {
	return( Broadcasting.Channels.getBroadcastChannels() );
}

Broadcasting.getBroadcastChannelSubscribers = ( channel_id ) => {
	return( Broadcasting.Channels.getBroadcastChannel( channel_id ).getSubscribers() );
}

/**
 * Delete a broadcast channel
 * 
 * @var string id The channel's Id
 * @var boolean flag_skip_cleanup Toggle whether or not the cleanup process (delete callback)
 * should be invoked.
 */
Broadcasting.deleteBroadcastChannel = ( broadcast_channel, flag_skip_cleanup ) => {
	Broadcasting.Channels.deleteBroadcastChannel( broadcast_channel, flag_skip_cleanup );
}

Broadcasting.deleteBroadcastChannelSubscriber = ( channel_id, subscriber_id ) => {
	Broadcasting.Channels.deleteBroadcastChannelSubscriber( channel_id, subscriber_id );
}

/**
 * Send the Broadcast to each of its configured BroadcastChannels.
 * @var Broadcast broadcast An instance of Broadcast
 */
Broadcasting.putBroadcast = ( broadcast ) => {
	if( !( broadcast instanceof Broadcast ) ){
		let broadcast_data = broadcast;
		broadcast = Broadcasting.Factory.getBroadcast( broadcast_data );
	}

	Broadcasting.Channels.putBroadcast( broadcast );
}

/**
 * Open a new broadcast channel
 *
 * @var BroadcastChannel broadcast_channel
 * @tbd This will not replace an existing event channel of the same name.
 */
Broadcasting.putBroadcastChannel = ( broadcast_channel ) => {
	Broadcasting.Channels.putBroadcastChannel( broadcast_channel );
}

/**
 * Send multiple broadcast 
 * @var array broadcast An array of Broadcast objects
 */
Broadcasting.putBroadcasts = ( broadcasts ) => {
	if( !Array.isArray( broadcasts ) ){
		return;
	}

	broadcasts.foreach( ( foreach_data ) => {
		if( foreach_data instanceof Broadcast ){
			let broadcast = foreach_data;
			Broadcasting.putBroadcast( broadcast );
		}
	} );
}

Broadcasting.AdaptorDefault = AdaptorDefault;
Broadcasting.Adaptor = AdaptorDefault;
Broadcasting.Broadcast = Broadcast;
Broadcasting.BroadcastChannel = BroadcastChannel;
Broadcasting.BroadcastChannels = BroadcastChannels;
Broadcasting.BroadcastChannelSubscriber = BroadcastChannelSubscriber;
Broadcasting.BroadcastingFactory = BroadcastingFactory;
Broadcasting.BroadcastMessage = BroadcastMessage;

const Channels = new BroadcastChannels(); /** Instance */
Broadcasting.Channels = Channels;

const Factory = BroadcastingFactory;
Broadcasting.Factory = Factory; /** Alias */

export { 
	AdaptorDefault,
	Broadcast,
	BroadcastChannel,
	BroadcastChannels,
	BroadcastChannelSubscriber,
	BroadcastingFactory,
	BroadcastMessage,
	Channels,
	Factory
};
