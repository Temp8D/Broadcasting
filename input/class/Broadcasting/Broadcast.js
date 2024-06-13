/**
 * This work may only be used according to the license below.
 *
 * @license Broadcasting © 2024 by William Heiman CC-BY-SA-4.0
 * @author Temp8D
 */

import Broadcasting from './Broadcasting.js'

/**
 * The data structure for a broadcast: a list of channels and the message.
 */
export default class Broadcast{
	constructor( constructor_data ){
		this.header = {
			config : {
				channels : ( constructor_data?.header?.config?.channels || [] )
			}
		};

		this.data = null;

		let broadcast_message = constructor_data?.data;

		if( broadcast_message ){
			if( !( broadcast_message instanceof Broadcasting.BroadcastMessage ) ){
				let message_data = broadcast_message;
				broadcast_message = Broadcasting.Factory.getBroadcastMessage( message_data );
			} 

			this.data = broadcast_message;
		}
	}
}
