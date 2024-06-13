/**
 * This work may only be used according to the license below.
 *
 * @license Broadcasting © 2024 by William Heiman CC-BY-SA-4.0
 * @author Temp8D
 */

import {
	APP_FLAG_DEBUG,
	APP_FLAG_DEBUG_VERBOSE
} from '../../shared/Constants.js'

import {
	Broadcast,
	BroadcastChannel,
	BroadcastMessage,
	BroadcastSubscriber
} from './Broadcasting.js'
 
/**
 * Observer pattern used to facilitate communication betwixt React components
 * at any level of the DOM hierarchy.
 */
export default class BroadcastChannels{
	constructor(){
		this.channels = [];
	}

	/**
	 * Delete a broadcast channel
	 * 
	 * @var string channel_id The channel's Id
	 * @var boolean flag_skip_cleanup Toggle whether or not the cleanup process (delete callback)
	 * should be invoked.
	 */
	deleteBroadcastChannel( channel_id, flag_skip_cleanup ){
		let index,
		broadcast_channel,
		length = this.getBroadcastChannels().length;

		index = this.getBroadcastChannels().findIndex( ( find_data ) => {
			return( channel_id == find_data.header.id );
		} );

		broadcast_channel = this.getBroadcastChannels().find( ( find_data ) => {
			return( channel_id == find_data.header.id );
		} );

		if( !( broadcast_channel instanceof BroadcastChannel ) ){
			return;
		}

		if( !flag_skip_cleanup ){
			broadcast_channel.deleteSelf();
		}

		if( index == 0 ){
			this.channels = this.channels.slice( 1 );
		} else if( index == ( length - 1 ) ){
			this.channels = this.channels.slice( 0, index );
		} else {
			this.channels = [ ...this.chanels.slice( 0, index ), ...this.channels.slice( index + 1, length ) ];
		}
	}

	/**
	 * Removes a subscriber from the channel.
	 *
	 * @var string channel_id
	 * @var string subscriber_id 
	 */
	deleteBroadcastChannelSubscriber( channel_id, subscriber_id ){
		let index,
		broadcast_channel,
		length;

		broadcast_channel = this.getBroadcastChannels().find( ( find_data ) => {
			return( channel_id == find_data.header.id );
		} );

		if( !( broadcast_channel instanceof BroadcastChannel ) ){
			return;
		}

		broadcast_channel.deleteSubscriber( subscriber_id );
	}

	/**
	 * Get an instance of BroadcastChannel from the collection of channels.
	 *
	 * @var string channel_id
	 * @return undefined|EvenChannel 
	 */
	getBroadcastChannel( channel_id ){
		let broadcast_channel;

		broadcast_channel = this.getBroadcastChannels().find( ( foreach_data ) => {
			return( channel_id == foreach_data.header.id );
		} );

		return( broadcast_channel );
	}

	/**
	 * Get an array of subscribers
	 *
	 * @var string channel_id
	 * @return array
	 */
	getBroadcastChannelSubscribers( channel_id ){
		const subscribers = [];

		const broadcast_channel = this.getBroadcastChannel( channel_id );

		if( broadcast_channel ){
			subscribers.push( ...broadcast_channel.getSubscribers() );
		}

		return( subscribers );
	}

	/**
	 * Get the broadcast channels
	 *
	 * @var array ids (optional) An array of broadcast channel Ids that may be used to get a subset
	 * of broadcast channels.
	 */
	getBroadcastChannels( channel_ids ){
		let broadcast_channels = this.channels;

		if( Array.isArray( channel_ids ) ){
			broadcast_channels = broadcast_channels.filter( ( filter_data ) => {
				return( channel_ids.indexOf( filter_data.header.id ) != -1 );
			} );
		}

		return( broadcast_channels );
	}

	/**
	 * Send the Broadcast to each of its configured BroadcastChannels.
	 * @var Broadcast broadcast An instance of Broadcast
	 */
	putBroadcast( broadcast ){
		if( ( broadcast instanceof Broadcast ) ){
			broadcast.header.config.channels.forEach( ( foreach_data ) => {
				let channel = this.getBroadcastChannels().find( ( find_data ) => {
					return( foreach_data == find_data.header.id );
				} );

				if( APP_FLAG_DEBUG && APP_FLAG_DEBUG_VERBOSE ){
					let log_data = [
						'BroadcastChannels.putBroadcast channel:', 
						channel, 
						'broadcast:', 
						broadcast
					];

					console.log( ...log_data );
				}

				if( ( channel instanceof BroadcastChannel ) ){
					channel.putBroadcast( broadcast );
				}
			} );
		}
	}

	/**
	 * Send multiple broadcast 
	 * @var array broadcast An array of Broadcast objects
	 */
	putBroadcasts( broadcasts ){
		if( Array.isArray( broadcasts ) ){
			broadcasts.forEach( ( foreach_data ) => {
				this.putBroadcast( foreach_data );
			} );
		}
	}

	/**
	 * Add the broadcast channel to the array of open communication channels.
	 * Note: This will ignore duplicates.
	 * 
	 * @var BroadcastChannel broadcast_channel
	 * @todo Replace duplicates
	 */
	putBroadcastChannel( broadcast_channel ){
		if( !( broadcast_channel instanceof BroadcastChannel ) ){
			const error_data = [
				'putBroadcastChannel received (broadcast_channel: ',
				( typeof broadcast_channel ),
				') was expecting BroadcastChannel.'
			];

			throw new TypeError( ...error_data );
		}

		let flag_collision = !!( this.getBroadcastChannel( broadcast_channel.header.id ) );

		if( !flag_collision ){
			this.channels.push( broadcast_channel );
		}
	}
}
