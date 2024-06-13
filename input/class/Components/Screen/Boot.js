/**
 * This work may only be used according to the license below.
 *
 * @license Broadcasting © 2024 by William Heiman CC-BY-SA-4.0
 * @author Temp8D
 */

import React from 'react';

import Promise from 'promise-polyfill';

import {
	getHttpsResponse
} from '../../../shared/Network.js'

import {
	URL_HOSTNAME_CONFIG,
	URL_PATH_CONFIG,
	URL_SCREEN_BOOT_IMG
} from '../../../shared/Constants.js'

import Broadcasting from '../../Broadcasting/Broadcasting.js';

import {
	BROADCAST_CHANNEL_APP
} from '../App.js';

/**
 * This component is responsible for doing anything that's necessary to start the app.
 *
 * In this example, the only requirement that the app has is that we have the users IP address.
 * We're using an external service for this (checkip.amazonaws.com) to illustrate how this 
 * would be done asynchronously.
 * 
 * Note: This component doesn't necessarily need to know what to do with the data or even whether 
 * or not its efforts to get the data were successful. All of that back-and-forth could happen as 
 * interplay between the appropriate components.
 *
 * In this case, we're making a network request for the config data and then checking to see 
 * if the network request was successful before broadcasting the config data, an error, or both.
 */
export default class Boot extends React.Component{
	componentDidMount(){
		//Forcing latency to simulate network latency
		setTimeout( this.getConfig.bind( this ), 3500 );
	}

	/**
	 * Send app errors.
	 *
	 * Note: These errors are sent via the primary communication channel #app,
	 * because in this example there's just one communication channel.
	 *
	 * In different scenarios, a dedicated error channel may be useful. 
	 *
	 * Also Note: Any component can open a communication channel, so specific 
	 * errors could be intelligently routed to different components.
	 */
	putError( error_data ){
		if( !Array.isArray( error_data ) ){
			error_data = [ error_data ];
		}

		error_data.forEach( ( foreach_data ) => {
			let broadcast_data = {
				data : {
					header : {
						id : 'put:error'
					},
					data : foreach_data
				},
				header : {
					config : {
						channels : [ BROADCAST_CHANNEL_APP ]
					}
				}
			}

			Broadcasting.putBroadcast( broadcast_data );
		} );
	}

	/**
	 * Send the config to the application.
	 *
	 * Note: This component doesn't need to know what to do with the config,
	 * it just needs to pass it to someone who does. Any component subscribed
	 * to the app's main channel, and listening to the events can act upon it.
	 */
	putConfig( config_data ){
		const broadcast_data = {
			data : {
				header : {
					id : 'patch:config'
				},
				data : config_data
			},
			header : {
				config : {
					channels : [ BROADCAST_CHANNEL_APP ]
				}
			}
		}

		Broadcasting.putBroadcast( broadcast_data );
	}

	/**
	 * Get the config and relay the data to the application.
	 *
	 * Note: If multiple sources of config data are needed,
	 * all of the sourcing is coordinated here.
	 */
	async getConfig(){
		/**
		 * @var Promise promise
		 */
		let promise;

		/**
		 * @var mixed application_data The data from the backend application
		 * @var object network_data The data from by the network request
		 */
		let application_data,
		network_data;

		/**
		 * @var array errors
		 */
		const errors = [];

		/**
		 * @var string content_type
		 * @var int status_code
		 */
		let content_type,
		status_code;

		promise = this.getConfigData();

		await promise.then( ( then_data ) => {
			network_data = then_data; 
		} );


		application_data = ( network_data?.data || null );

		console.log( 'application_data', application_data );
		console.log( 'network_data', network_data );

		content_type = ( network_data?.header?.headers?.[ 'content-type' ] || null );
		status_code = ( network_data?.header?.status || null );

		if( !status_code || status_code < 200 || status_code >= 300 ){
			let error_data = 'Could not use network to get the config data.';
			console.log( error_data, status_code );
			errors.push( error_data );
		}

		/**
		 * In some cases, the config may be useful,  even with errors,
		 * so the following two actions are both optional.
		 */

		if( errors.length ){
			this.putError( errors ); 
		}

		if( application_data ){
			this.putConfig( application_data );
		}
	}

	/**
	 * Get the config data over the network
	 * @return Promise
	 */
	async getConfigData(){
		const parameters = {
			headers : {
				'Content-Type' : 'application/json'
			},
			hostname : URL_HOSTNAME_CONFIG,
			method : 'get',
			path : URL_PATH_CONFIG
		};

		return( getHttpsResponse( parameters ) );
	}

	/**
	 * Do the heavy-lifting for the render method.
	 * @return jsx
	 */
	getRenderData(){
		const render_data = (

<section class="screen">
	<figure>
		<img src={URL_SCREEN_BOOT_IMG} />
		<h2>Screen Name: Boot</h2>
		<p>Loading data from checkip.amazonaws.com...</p>
	</figure>
</section>

		);

		return( render_data );
	}

	/**
	 * ... ...As is tradition.
	 * Note: Override render method from React.Component
	 */
	render(){
		const render_data = this.getRenderData();
		return( render_data );
	}
}
