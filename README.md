## Summary

This is an example of how to use class components and/or object-oriented programming in React. This approach depends on the Observer pattern and a Node.js package called Immer. We accomplish communications between components using our own implementation of the Observer pattern; it's called Broadcasting. And we accomplish re-rendering through state updates using the Immer package; it makes sure the state isn't spuriously updated.

This example is that of a small app with two or three screens. The initial screen is a loading screen that makes a network request. When the network request is done the application proper starts. The application displays the response data and broadcasts messages in randomized intervals.

## Discussion

Question: [Using OOP in React](https://www.reddit.com/r/reactjs/comments/1aye046/using_oop_in_react/)

Answer: [Unpopular opinion](https://www.reddit.com/r/reactjs/comments/1aye046/comment/l636poo/)

## Requirements

- React

- Webpack

- Babel 

- [Immer](https://immerjs.github.io/immer/)

- The Other package.json dependencies

- The classes in ./input/class/Broadcasting/

## How It Works

### App

#### ./input/class/Components/App.js

When the App component mounts, we create a new broadcast channel and subscriber. This creates a channel for communications as well as a subscriber to receive  the messages.

When the App component begins rendering, it checks if the boot sequence is done and/or if the app is in error.  

If the boot sequence has not been completed and there is no error, then the app renders the boot screen component. The boot sequence displays a loading screen and in the background it makes an async network request to checkip.amazonaws.com.

When the network request is done, the boot screen component posts the response as a message to the app's broadcast channel. 

Since the beginning, the app has been subscribed to its own broadcast channel. It's been waiting for a message. It now receives one, checks the header, and performs the appropriate action. In this case, it patches the app's config, which is stored in the state, and this causes the component to be rerendered.

During this render, the app checks if the boot sequence is done (it is) and whether or not the app is in error (it isn't?). Depending on the course of action, the app screen will change to either the application screen or an error screen.

### Boot Screen

#### ./input/class/Components/Screen/Boot.js

This component is responsible for doing everything that's necessary to render the application screen. That is to say, by the time this component is done, what the user would consider "the app" should be ready to run.

Note: We differntiate between "the app" and "the application". The former is the entire system (root component) and the latter is just what the user would consider the application. ( ./input/class/Components/App.js vs. ./input/class/Components/Screen/Application.js )

In this example, the only requirement that the application has to run is that we have an IP address. In this example, we're using an external service to get the IP address (checkip.amazonaws.com). We do this to illustrate how this type of thing would be done asynchronously.

Note: This component doesn't necessarily need to know what to do with the data or even whether or not its efforts to get the data were successful. All of that back-and-forth could happen as interplay between the appropriate components.

In this example, we're making a network request for the necessary config data, checking to see if the network request was successful, and broadcasting the config data, an error, or both.

### Application Screen

#### ./input/class/Components/Screen/Application.js

This screen is the main application screen. This would be what the user would consider "the app."

In this very simple example, all that we're doing is showing that we're able to display data in the application that was relayed through the app's root component ./input/class/Components/App.js, and sourced from a different component, ./input/class/Components/Screen/Boot.js.

Afterwards we broadcast messages in randomized intervals.

### Broadcasting Classes

#### ./input/class/Broadcasting/*

This is a set of classes that's used for facilitating communications within the app. It's just a JavaScript/Node.js implementation of the [Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern).

##### BroadcastChannel

If your component wants other components to send it messages, then it should open a BroadcastChannel.

```

Broadcasting.Adaptor.putBroadcastChannel( BROADCAST_CHANNEL_APP );

```

Note: We're using an adapter/adaptor so that users of the Broadcasting system don't need to worry about a few of its details. (See also: ([Adapter pattern](https://en.wikipedia.org/wiki/Adapter_pattern))

##### BroadcastChannelSubscriber

If your component wants to receive messages that other components send it, then it should add a BroadcastChannelSubscriber to a BroadcastChannel.

Note: subscriber_data.header.config.events.post is the method that will receive the messages. In this case, we're binding one of the class's methods.

```

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

```

Note: We're using an adapter/adaptor so that users of the Broadcasting system don't need to worry about a few of its details. (See also: ([Adapter pattern](https://en.wikipedia.org/wiki/Adapter_pattern))

##### BroadcastMessage

If your component wants to send a message to another component, then it should send a BroadcastMessage.

```

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

```

### Immer

With a few more lines of code we can call this.setState() and not need to worry about spurious rerenders.

```

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

```

### Datagrams

Some methods (get, put, patch, post, delete methods) accept datagrams (data and header) as input or they provide datagrams as output.

We do this because we tend to view most software development in terms of: 

- Input and output 

- Data and data describing data (data and header)

- And the following actions: Get, put, patch, post, and delete

The datagrams may also be thought of as serialized objects, so this leaves open the possibility of replacing them with more narrowly defined object types at a later time.

## Why use OOP components in React?

Here are a few reasons:

1. JavaScript is an object-oriented programming language. It's debateable to what extent, but it's not debateable that it is one. Using it as an object-oriented programming language is not weird.

2. Data Encapsulation: If you develop software with a mindset which intractably differentiates between this thing's data and that thing's data and this thing's capabilities and that thing's capabilities and data-data and meta-data, then you'll still be able to do that and develop software using React.

3. If you tend to avoid using globals, then you might not be excited about making extensive use of hooks in the systems that you build.

4. If you tend to avoid introducing side-effects into your work, then you might not be excited about making extensive use of useEffect(...) in the systems that you build.

5. Unit Testing: There's no news here, but it's worth restating that smaller focused methods with limited purposes are easier to test than those that are not. Object-oriented programming lends itself nicely to this problem.

6. Lastly, we're all bent towards making our work easier. People strike different balances in their work. The choice should be available for those who wish to use OOP instead of functions. 

## Todo 

- Add tests

- Package Broadcasting

## License

This work may only be used according to the license below.

License: Broadcasting © 2024 by William Heiman CC-BY-SA-4.0

Author: Temp8D
