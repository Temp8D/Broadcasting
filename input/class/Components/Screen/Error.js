/**
 * This work may only be used according to the license below.
 *
 * @license Broadcasting © 2024 by William Heiman CC-BY-SA-4.0
 * @author Temp8D
 */

import React from 'react';

import {
	URL_SCREEN_ERROR_IMG
} from '../../../shared/Constants.js'

/**
 * This screen is the default error screen.
 */
export default class Application extends React.Component{
	/**
	 * Do the heavy-lifting for the render method.
	 * @return jsx
	 */
	getRenderData(){
		let render_data;

		 render_data = (

<section class="screen">
	<figure>
		<img src={URL_SCREEN_ERROR_IMG} />
		<h2>Screen Name: Error</h2>
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
