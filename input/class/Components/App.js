/**
 * This work may only be used according to the license below.
 *
 * @license Broadcasting © 2024 by William Heiman CC-BY-SA-4.0
 * @author Temp8D
 */

import React from 'react';

import { 
	produce 
} from 'immer';

import {
	APP_TITLE,
	LOG_MAX_MESSAGES,
	SCREEN
} from '../../shared/Constants.js';

import Application from './Screen/Application.js';
import Boot from './Screen/Boot.js';
import Error from './Screen/Error.js';

/**
 * BROADCAST_CHANNEL_APP General app communications
 */
export const BROADCAST_CHANNEL_APP = '#app';

/**
 * BROADCAST_CHANNEL_APP_SUBSCRIBER Observes general app communications
 */
export const BROADCAST_CHANNEL_APP_SUBSCRIBER = 'subscriber:#app';

import Broadcasting from '../Broadcasting/Broadcasting.js';

/**
 * When the component mounts, we create a new broadcast channel and subscriber.
 * This creates a channel for communications as well as an observer for the messages.
 *
 * Once the App component begins rendering, it checks if the boot sequence is done and
 * if the app is in error. 
 *
 * If the boot sequence has not been completed, then the app loads the boot screen. The boot sequence 
 * displays a loading screen and in the background it makes an async network request to checkip.amazonaws.com.
 *
 * When the network request is done, the boot screen component posts the response as a message to the app's 
 * broadcast channel.
 *
 * The app's subscriber method has been waiting for a message, it now receives one, checks the header,
 * and performs the appropriate action. In this case, it patches the app state and this causes the component re-render.
 *
 * During this render, the app checks if the boot sequence is done (it is) and whether or not the app is in error.
 * Depending on the course of action, the app screen will change to the application or an error screen.
 *
 * Note: If you're looking for what would effectively constitute "the app" as a user would think of it,
 * then you're looking for the ./Screen/Application.js component.
 */
export default class App extends React.Component{
	componentDidMount(){
		this.putBroadcasting();
	}

	constructor( constructor_data ){
		super( constructor_data );
		this.state = this.getStateDefault();
	}

	/**
	 * Determine whether or not the boot process is done.
	 * Note: Anything that's necessary for the app to start would be checked here.
	 * In this case, it's just a value for the IP address, but it could be something like an API key
	 * or app configuration from backend data storage.
	 *
	 * @return boolean
	 */
	getFlagBootDone(){
		return( ( this.state.header.app.config.ip_address !== null ) );
	}

	/**
	 * Determine whether or not the application in error.
	 * Note: We don't distinguish between error types in this example. 
	 * All errors are equally bad.
	 *
	 * @return boolean
	 */
	getFlagError(){
		let flag_error = false;

		const errors = this.state.header.app.errors;

		if( errors.length ){
			flag_error = true;
		}

		return( flag_error );
	}

	/**
	 * Do the heavy-lifting for the render method.
	 * @return jsx
	 */
	getRenderData(){
		/**
		 * @var jsx render_data
		 * @var jsx render_data_fragment
		 */
		let render_data,
		render_data_log,
		render_data_screen;

		/**
		 * @var string screen The name of the screen to load.
		 */
		let screen = SCREEN.ERROR;

		/**
		 * @var boolean flag_boot_done
		 * @var boolean flag_error
		 */
		const flag_boot_done = this.getFlagBootDone(),
		flag_error = this.getFlagError();

		/**
		 * Determine which screen to load.
		 * Note: Defaults to SCREEN.ERROR;
		 */
		if( !flag_boot_done && !flag_error ){
			screen = SCREEN.BOOT;
		} else if( flag_boot_done && !flag_error ){
			screen = SCREEN.APPLICATION;
		}

		render_data_screen = this.getRenderDataScreen( screen );
		render_data_log = this.getRenderDataLog();
		
		render_data = (

<main>
	<header>
		<h1>{APP_TITLE}</h1>
		<h2>Channel: {BROADCAST_CHANNEL_APP}, Subscribers: {this.state.data.total_subscribers}</h2>
	</header>
	{render_data_screen}
	
	<footer>
		{render_data_log}
	</footer>
</main>

		);

		return( render_data );
	}

	getRenderDataLog(){
		/**
		 * @var jsx render_data
		 */
		let render_data;

		/**
		 * @var array log_data
		 */
		const log_data = this.state.data.log;

		/**
		 * @var array log_entries
		 */
		const log_entries = [];

		/**
		 * @var int index
		 * @var int length
		 */
		let index = ( log_data.length - 1 ),
		length = log_data.length;

		for( ; index >= 0; index-- ){
			/**
			 * @var string log_entry_data
			 */
			let log_entry_data = log_data[ index ];

			log_entries.push( 
<>
	Message #{index+1} {JSON.stringify( log_entry_data )} <br/>
</>
			);

			if( LOG_MAX_MESSAGES && ( index <= ( length - LOG_MAX_MESSAGES ) ) ){
				break;
			}
		}

		if( !log_entries.length ){
			log_entries.push( <>No messages.</> );
		}

		render_data = ( 

<code>
{log_entries}
</code>

		);

		return( render_data );
	}

	/**
	 * Get the render data for the designated screen
	 *
	 * @var string|int screen The name of the screen to load.
	 * @return jsx|null
	 */
	getRenderDataScreen( screen ){
		/**
		 * @var jsx render_data
		 */
		let render_data = null;

		switch( screen ){
			case SCREEN.APPLICATION:
				render_data = ( <Application application_data={this.state} /> );
			break;

			case SCREEN.BOOT:
				render_data = ( <Boot /> );
			break;

			case SCREEN.ERROR:
				render_data = ( <Error /> );
			break;
		}

		return( render_data );
	}

	/**
	 * Get the default state
	 * Note: There's subtle utility in differentiating between the data and
	 * the method responsible for getting the data.
	 *
	 * @return object
	 */
	getStateDefault(){
		return( this.getStateDefaultData() );
	}

	/**
	 * Get the default state data
	 * @return object
	 */
	getStateDefaultData(){
		const state_data = {
			data : {
				log : [],
				total_subscribers : 0
			},
			header : {
				app : {
					config : {
						ip_address : null
					},
					errors : [
					]
				}
			}
		};

		return( state_data );
	}

	/**
	 * Update the app config.
	 * @var mixed config_data
	 */
	patchConfig( config_data ){
		if( !config_data ){
			return;
		}

		this.patchConfigData( config_data );
	}

	/**
	 * Update the app config data that's stored in the state.
	 * Note: In this case, we're just storing the config in the component's state.
	 *
	 * @var mixed config_data
	 */
	patchConfigData( config_data ){
		this.setState( ( input_data ) => {
			let output_data = produce( input_data, ( draft_data ) => {
				draft_data.header.app.config.ip_address = config_data.trim();
			} );

			if( input_data != output_data ){
				return( output_data );
			} else {
				return( null );
			}
		} );
	}

	/**
	 * Post broadcast message to the subscriber.
	 */
	postBroadcastMessage( broadcast_message ){
		this.putLog( broadcast_message );

		switch( broadcast_message.header.id ){
			case 'patch:config':
				this.patchConfig( broadcast_message.data );
			break;

			case 'put:error':
				this.putError( broadcast_message.data );
			break;
		}
	}

	/**
	 * Log the data to one or more sources.
	 * @var mixed log_data
	 */
	putLog( log_data ){
		this.putLogData( log_data );
	}

	/**
	 * Log the data.
	 * Note: In this case, we're just logging to the state.
	 *
	 * @var mixed log_data
	 */
	putLogData( log_data ){
		this.setState( ( input_data ) => {
			let output_data = produce( input_data, ( draft_data ) => {
				draft_data.data.log.push( log_data );
			} );

			if( input_data != output_data ){
				return( output_data );
			} else {
				return( null );
			}
		} );
	}

	/**
	 * Configure the component broadcast channels.
	 */
	putBroadcastChannels(){
		Broadcasting.Adaptor.putBroadcastChannel( BROADCAST_CHANNEL_APP );
	}

	/**
	 * Configure this components broadcast channel subscribers.
	 * Note: When the post event occurs the scope will still be this.
	 */
	putBroadcastChannelsSubscribers(){
		/**
		 * #app subscriber
		 */
		let channel_id = BROADCAST_CHANNEL_APP,
		subscriber_data,
		subscriber_id = BROADCAST_CHANNEL_APP_SUBSCRIBER;

		subscriber_data = {
			data : this,
			header : {
				config : {
					events : {
						post : this.postBroadcastMessage.bind( this )
					}
				},
				id : subscriber_id
			}
		};

		Broadcasting.Adaptor.putBroadcastChannelSubscriber( channel_id, subscriber_data );
	}

	/**
	 * Keep a total of the number of subscribers.
	 * Note: This is a utility method that's only used because we're interested in knowing how
	 * many subscribers the channel has.
	 */
	putBroadcastChannelsSubscribersTotal(){
		/**
		 * @var int total
		 */
		const total = Broadcasting.Channels.getBroadcastChannelSubscribers( BROADCAST_CHANNEL_APP ).length;

		/**
		 * Keep track of the total subscribers, so we can display it.
		 */
		this.setState( ( input_data ) => {
			let output_data = produce( input_data, ( draft_data ) => {
				draft_data.data.total_subscribers = total;
			} );

			if( input_data != output_data ){
				return( output_data );
			} else {
				return( null );
			}
		} );
	}

	/**
	 * Configure the component broadcasting.
	 */
	putBroadcasting(){
		this.putBroadcastChannels();
		this.putBroadcastChannelsSubscribers();
		this.putBroadcastChannelsSubscribersTotal();
	}

	/**
	 * Puts an error.
	 * @var array|string error_data
	 */
	putError( error_data ){
		if( !Array.isArray( error_data ) ){
			error_data = [ error_data ];
		}

		this.setState( ( input_data ) => {
			let output_data = produce( input_data, ( draft_data ) => {
				draft_data.header.app.errors.push( ...error_data );
			} );

			if( input_data != output_data ){
				return( output_data );
			} else {
				return( null );
			}
		} );
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
