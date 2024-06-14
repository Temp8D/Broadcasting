/**
 * This work may only be used according to the license below.
 *
 * @license Broadcasting © 2024 by William Heiman CC-BY-SA-4.0
 * @author Temp8D
 */

import { 
	Broadcast,
	BroadcastChannelSubscriber,
	BroadcastMessage
} from './Broadcasting.js';

import {
	APP_FLAG_DEBUG,
	APP_FLAG_DEBUG_VERBOSE
} from '../../shared/Constants.js'

/**
 * A collection of subscribers and the methods for sending broadcasts to them.
 */
export default class BroadcastChannel{
	constructor( constructor_data ){
		this.header = {
			config : {
				events : {
					delete : null
				},
				subscribers : []
			},
			id : constructor_data?.header?.id
		}

		if( Array.isArray( constructor_data?.header?.config?.subscribers ) ){
			constructor_data.header.config.subscribers.forEach( ( foreach_data ) => {
				this.putBroadcastChannelSubscriber( foreach_data );
			} );
		}

		if( ( typeof constructor_data?.header?.config?.events?.delete == 'function' ) ){
			this.deleteSelf = constructor_data.header.config.events.delete.bind( this );
		}

		/**
		 * @todo buffer of messages
		 */
		this.data = null;
	}

	/**
	 * Close the channel.
	 */
	deleteSelf(){
		this.header.config.subscribers.forEach( ( foreach_data ) => {
			this.deleteSubscriber( foreach_data.header.id );
		} );
	}

	/**
	 * Delete the subscriber from the channel.
	 * 
	 * @var string subscriber_id 
	 * @var boolean flag_skip_callback
	 */
	deleteSubscriber( subscriber_id, flag_skip_callback ){
		let index,
		    length = this.getSubscribers().length,
		    subscriber,
		    subscribers = this.header.config.subscribers;

		index = this.getSubscribers().findIndex( ( find_data ) => {
			return( subscriber_id == find_data.header.id );
		} );

		subscriber = this.header.config.subscribers[ index ];

		if( index == 0 ){
			this.header.config.subscribers = subscribers.slice( 1 );
		} else if( index == ( length - 1 ) ){
			this.header.config.subscribers = subscribers.slice( 0, index );
		} else {
			this.header.config.subscribers = [ ...subscribers.slice( 0, index ), ...subscribers.slice( index + 1, length ) ];
		}
		
		if( !flag_skip_callback && ( typeof subscriber.header.config.events[ 'delete' ] == 'function' ) ){
			subscriber.header.config.events.delete( this );
		}
	}

	/**
	 * Get the collection of subscribers.
	 * @todo abstract further, if necessary.
	 */
	getSubscribers(){
		return( this.header.config.subscribers );
	}

	/**
	 * Get the BroadcastChannelSubscriber by its Id
	 * 
	 * @var string subscriber_id 
	 * @return BroadcastChannelSubscriber|null
	 */
	getSubscriber( subscriber_id ){
		let subscriber = null;

		subscriber = this.getSubscribers().find( ( find_data ) => {
			return( subscriber_id = find_data.header.id );
		} );

		return( subscriber || null );
	}

	/**
	 * Broadcast to this channel.
	 * @var Broadcast broadcast
	 */
	putBroadcast( broadcast ){
		if( !( broadcast instanceof Broadcast ) ){
			const error_data = [
				'putBroadcast received (broadcast: ',
				( typeof broadcast ),
				') was expecting Broadcast.'
			];

			throw new TypeError( ...error_data );
		}

		this.putBroadcastMessage( broadcast.data );
	}

	/**
	 * Send the broadcast's message to the subscribers.
	 * @var BroadcastMessage broadcast_message
	 */
	putBroadcastMessage( broadcast_message ){
		if( !( broadcast_message instanceof BroadcastMessage ) ){
			const error_data = [
				'putBroadcastMessage (channel id: ',
				this.header.id,
				') received (broadcast_message: ',
				( typeof broadcast_message ),
				') was expecting BroadcastMessage'
			];

			if( APP_FLAG_DEBUG ){
				console.log( ...error_data );
			}

			throw new TypeError( ...error_data );
		}

		this.getSubscribers().forEach( ( foreach_data ) => {
			if( APP_FLAG_DEBUG && APP_FLAG_DEBUG_VERBOSE ){
				let log_data = [
					'BroadcastChannel.putBroadcastMessage (channel id:',
					this.header.id,
					')',
					'subscriber',
					foreach_data,
					'broadcast_message',
					broadcast_message 
				];

				console.log( ...log_data );
			}

			foreach_data.postBroadcastMessage( broadcast_message );
		} );
	}

	/**
	 * Subscribe a consumner to this broadcast channel.
	 * Note: Subscribers with duplicate Ids will not be added.
	 *
	 * @var BroadcastChannelSubscriber broadcast_channel_subscriber
	 * @var boolean flag_overwrite
	 */
	putBroadcastChannelSubscriber( broadcast_channel_subscriber, flag_overwrite ){
		if( !( broadcast_channel_subscriber instanceof BroadcastChannelSubscriber ) ){
			const error_data = [
				'putBroadcastChannelSubscriber (id: ',
				this.header.id,
				') received (broadcast_channel_subscriber: ',
				( typeof broadcast_channel_subscriber ),
				') was expecting BroadcastChannelSubscriber.'
			];

			if( APP_FLAG_DEBUG ){
				console.log( ...error_data );
			}

			throw new TypeError();
		}

		let flag_collision = false;

		this.getSubscribers().forEach( ( foreach_data ) => {
			if( broadcast_channel_subscriber.header.id == foreach_data.header.id ){
				flag_collision = true;
			}
		} );

		if( flag_collision && flag_overwrite ){
			let index = this.getSubscribers().findIndex( ( findindex_data ) => {
				return( broadcast_channel_subscriber.header.id == findindex_data.header.id );
				
			} );

			this.header.config.subscribers[ index ] = broadcast_channel_subscriber;
		} else if( !flag_collision ){
			this.header.config.subscribers.push( broadcast_channel_subscriber );
		}

		if( APP_FLAG_DEBUG && APP_FLAG_DEBUG_VERBOSE ){
			console.log( this.header.id, 'BroadcastChannel.getSubscribers()', this.getSubscribers() );
		}
	}

	putBroadcastChannelSubscribers( broadcast_channel_subscribers ){
		if( Array.isArray( broadcast_channel_subscribers ) ){
			broadcast_channel_subscribers.forEach( ( foreach_data ) => {
				this.putBroadcastChannelSubscriber( foreach_data );
			} );
		}
	}
}
