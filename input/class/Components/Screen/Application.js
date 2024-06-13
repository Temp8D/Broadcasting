/**
 * This work may only be used according to the license below.
 *
 * @license Broadcasting © 2024 by William Heiman CC-BY-SA-4.0
 * @author Temp8D
 */

import React from 'react';

import {
	SCREEN_APPLICATION_INTERVAL_MIN,
	SCREEN_APPLICATION_INTERVAL_MAX,
	URL_SCREEN_APPLICATION_IMG
} from '../../../shared/Constants.js'

import {
	BROADCAST_CHANNEL_APP
} from '../App.js';

import Broadcasting from '../../Broadcasting/Broadcasting.js';

/**
 * This screen is the main app screen.
 *
 * In this simple example, we're showing that we're able to display data in this component 
 * that was relayed to the App component from a different component, ../Screen/Boot.js.
 *
 * And we're sending log messages in random interval.
 */
export default class Application extends React.Component{
	componentDidMount(){
		this.putMessageDelayed();
	}

	constructor( constructor_data ){
		super( constructor_data );
		this.state = this.getStateDefault();
	}

	/**
	 * Get the IP address
	 * @return string 
	 */
	getIpAddress(){
		return( this.props.application_data.header.app.config.ip_address );
	}

	/**
	 * Do the heavy-lifting for the render method.
	 * @return jsx
	 */
	getRenderData(){
		let render_data;

		 render_data = (

<section class="screen">
	<figure>
		<img src={URL_SCREEN_APPLICATION_IMG} />
		<h2>Screen Name: Application</h2>
		<p>Hello, authorized user #{this.getIpAddress()}!</p>
		 <p>Read Me: <a href="https://www.reddit.com/r/reactjs/comments/1aye046/comment/l636poo/" target="_blank">Using OOP in React</a>.</p>
	</figure>
</section>

		);

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
				interval_id : null
			},
			header : {
				screen : {
					config : {
						interval : {
							min : SCREEN_APPLICATION_INTERVAL_MIN,
							max : SCREEN_APPLICATION_INTERVAL_MAX
						}
					}
				}
			}
		};

		return( state_data );
	}

	/**
	 * Send a message.
	 * @var mixed message_data
	 */
	putMessage( message_data ){
		const broadcast_data = {
			data : {
				header : {
					id : 'patch:log'
				},
				data : ( message_data || null )
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
	 * Send a message in some randomized interval
	 */
	putMessageDelayed(){
		const min = this.state.header.screen.config.interval.min,
		max = this.state.header.screen.config.interval.max;

		const timeout = Math.floor( Math.random() * ( max - min + 1 ) + min );

		const f = function(){
			this.putMessage( new Date().getTime() );
			this.putMessageDelayed();
		}.bind( this );

		setTimeout( f, timeout );
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
