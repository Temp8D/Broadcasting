/**
 * Send an HTTP(S) Request.
 * Note: We wrap the http(s).request in a Promise.
 *
 * @var parameters The parameters for the http(s).request method
 * @var post_data
 * @var boolean flag_encapsulate
 * @url https://nodejs.org/api/https.html#httpsrequestoptions-callback
 */
export const getHttpsResponse = async ( 
	parameters, 
	post_data, 
	flag_encapsulate 
) => {
	const request_data = {
		data : null,
		header : {
			events : {
				abort : null
			}
		}
	};

        const promise = new Promise( ( resolve, reject ) => {
		/**
		 * Step 0: Parse the input
		 */
		let headers = ( parameters?.headers || {} ),
		hostname = ( parameters?.hostname || 'localhost' ),
		method = ( parameters?.method || 'GET' ),
		password = ( parameters?.password || null ),
		path = ( parameters?.path || '/' ),
		port = ( parameters?.port || 443 ),
		protocol = ( parameters?.protocol || null ),
		url = '',
		username = ( parameters?.username || null );

		if( protocol === null ){
			switch( parseInt( port ) ){
				case 80:
					protocol = 'http://';
					break;

				case 443:
					protocol = 'https://';
					break;

				default:
					protocol = '//';
					break;
			}
		}

		/**
		 * Step 1: Construct the URL
		 */
		url += protocol;
		url += ( ( username && password ) ? ( username + ':' + password + '@' ) : '' );
		url += hostname; 
		url += ( port ? ( ':' + port ) : '' );
		url += path;

		/**
		 * Step 2: Send the request
		 */
		const client = new XMLHttpRequest();
		client.open( method, url );

		Object.keys( headers ).forEach( ( foreach_data ) => {
			client.setRequestHeader( foreach_data, headers[ foreach_data ] ); 
		} );

		client.onload = () => {
			let promise_data = {
				data : null,
				header : {
					headers : {},
					status : client.status,
					status_text : client.statusText
				}
			};

			let header_data = client.getAllResponseHeaders().trim().split( /[\r\n]+/ );

			header_data.forEach( ( foreach_data ) => {
				let parts = foreach_data.split(': ');
				let header = parts.shift();
				let value = parts.join(': ');

				promise_data.header.headers[ header.toLowerCase() ] = value;
			} );

			if( client.status < 200 || client.status > 299 ){
				reject( promise_data );
			} 

			promise_data.data = client.responseText;

			resolve( promise_data );
		};

		request_data.header.events.abort = client.abort;

                client.send( post_data );
        } );

	request_data.data = promise;

        return( ( flag_encapsulate ? request_data : request_data.data ) );
};
