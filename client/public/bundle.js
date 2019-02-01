(function () {
	'use strict';

	/**
	 * @license Event
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * Contains properties and methods shared by all events for use with {@link core.EventDispatcher}.
	 * Note that Event objects are often reused, so you should never
	 * rely on an event object's state outside of the call stack it was received in.
	 *
	 * @memberof core
	 * @example
	 * const evt = new Event("myEvent");
	 * const dispatcher = new EventDispatcher();
	 * dispatcher.on("myEvent", event => console.log(event.type));
	 * dispatcher.dispatchEvent(evt); // logs "myEvent"
	 *
	 * @param {string} type The event type.
	 * @param {boolean} [bubbles=false] Indicates whether the event will bubble through the display list.
	 * @param {boolean} [cancelable=false] Indicates whether the default behaviour of this event can be cancelled.
	 */
	class Event {

		constructor (type, bubbles = false, cancelable = false) {
			/**
			 * The type of event.
			 * @type string
			 */
			this.type = type;

			/**
			 * The object that generated an event.
			 *
			 * @type Object
			 * @default null
			 * @readonly
			 */
			this.target = null;

			/**
			 * The current target that a bubbling event is being dispatched from. For non-bubbling events, this will
			 * always be the same as target. For example, if childObj.parent = parentObj, and a bubbling event
			 * is generated from childObj, then a listener on parentObj would receive the event with
			 * target=childObj (the original target) and currentTarget=parentObj (where the listener was added).
			 *
			 * @type Object
			 * @default null
			 * @readonly
			 */
			this.currentTarget = null;

			/**
			 * For bubbling events, this indicates the current event phase:
			 * <OL>
			 * 	<LI> capture phase: starting from the top parent to the target</LI>
			 * 	<LI> at target phase: currently being dispatched from the target</LI>
			 * 	<LI> bubbling phase: from the target to the top parent</LI>
			 * </OL>
			 *
			 * @type number
			 * @default 0
			 * @readonly
			 */
			this.eventPhase = 0;

			/**
			 * Indicates whether the event will bubble through the display list.
			 *
			 * @type boolean
			 * @readonly
			 */
			this.bubbles = bubbles;

			/**
			 * Indicates whether the default behaviour of this event can be cancelled via {@link core.Event#preventDefault}.
			 *
			 * @type boolean
			 * @readonly
			 */
			this.cancelable = cancelable;

			/**
			 * The epoch time at which this event was created.
			 *
			 * @type number
			 * @readonly
			 */
			this.timeStamp = new Date().getTime();

			/**
			 * Indicates if {@link core.Event#preventDefault} has been called on this event.
			 *
			 * @type boolean
			 * @default false
			 * @readonly
			 */
			this.defaultPrevented = false;

			/**
			 * Indicates if {@link core.Event#stopPropagation} or {@link core.Event#stopImmediatePropagation} has been called on this event.
			 *
			 * @type boolean
			 * @default false
			 * @readonly
			 */
			this.propagationStopped = false;

			/**
			 * Indicates if {@link core.Event#stopImmediatePropagation} has been called on this event.
			 *
			 * @type boolean
			 * @default false
			 * @readonly
			 */
			this.immediatePropagationStopped = false;

			/**
			 * Indicates if {@link core.Event#remove} has been called on this event.
			 *
			 * @type boolean
			 * @default false
			 * @readonly
			 */
			this.removed = false;
		}

		/**
		 * Sets {@link core.Event#defaultPrevented} to true if the event is cancelable.
		 * Mirrors the DOM level 2 event standard. In general, cancelable events that have `preventDefault()` called will
		 * cancel the default behaviour associated with the event.
		 * @return {core.Event} this, chainable
		 */
		preventDefault () {
			this.defaultPrevented = this.cancelable;
			return this;
		}

		/**
		 * Sets {@link core.Event#propagationStopped} to true.
		 * Mirrors the DOM event standard.
		 * @return {core.Event} this, chainable
		 */
		stopPropagation () {
			this.propagationStopped = true;
			return this;
		}

		/**
		 * Sets {@link core.Event#propagationStopped} and {@link core.Event#immediatePropagationStopped} to true.
		 * Mirrors the DOM event standard.
		 * @return {core.Event} this, chainable
		 */
		stopImmediatePropagation () {
			this.immediatePropagationStopped = this.propagationStopped = true;
			return this;
		}

		/**
		 * Causes the active listener to be removed via removeEventListener();
		 *
		 * @example
		 * myBtn.addEventListener("click", event => {
		 *   event.remove(); // removes this listener.
		 * });
		 *
		 * @return {core.Event} this, chainable
		 */
		remove () {
			this.removed = true;
			return this;
		}

		/**
		 * Returns a clone of the Event instance.
		 *
		 * @return {core.Event} a clone of the Event instance.
		 */
		clone () {
			const event = new Event(this.type, this.bubbles, this.cancelable);
			for (let n in this) {
				if (this.hasOwnProperty(n)) {
					event[n] = this[n];
				}
			}
			return event;
		}

		/**
		 * Provides a return {core.Event} this, chainable shortcut method for setting a number of properties on the instance.
		 *
		 * @param {Object} props A generic object containing properties to copy to the instance.
		 * @return {core.Event} this, chainable
		 */
		set (props) {
			for (let n in props) { this[n] = props[n]; }
			return this;
		}

		/**
		 * Returns a string representation of this object.
		 *
		 * @return {string} A string representation of the instance.
		 */
		toString () {
			return `[${this.constructor.name} (type=${this.type})]`;
		}

	}

	/**
	 * @license EventDispatcher
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * EventDispatcher provides methods for managing queues of event listeners and dispatching events.
	 *
	 * You can either extend EventDispatcher or mix its methods into an existing prototype or instance by using the
	 * EventDispatcher {@link core.EventDispatcher.initialize} method.
	 *
	 * Together with the CreateJS Event class, EventDispatcher provides an extended event model that is based on the
	 * DOM Level 2 event model, including addEventListener, removeEventListener, and dispatchEvent. It supports
	 * bubbling / capture, preventDefault, stopPropagation, stopImmediatePropagation, and handleEvent.
	 *
	 * EventDispatcher also exposes a {@link core.EventDispatcher#on} method, which makes it easier
	 * to create scoped listeners, listeners that only run once, and listeners with associated arbitrary data. The
	 * {@link core.EventDispatcher#off} method is merely an alias to {@link core.EventDispatcher#removeEventListener}.
	 *
	 * Another addition to the DOM Level 2 model is the {@link core.EventDispatcher#removeAllEventListeners}
	 * method, which can be used to listeners for all events, or listeners for a specific event. The Event object also
	 * includes a {@link core.Event#remove} method which removes the active listener.
	 *
	 * @memberof core
	 * @example
	 * // add EventDispatcher capabilities to the "MyClass" class.
	 * EventDispatcher.initialize(MyClass.prototype);
	 *
	 * // Add an event.
	 * instance.addEventListener("eventName", event => console.log(event.target + " was clicked."));
	 *
	 * // scope ("this") can be be a challenge with events.
	 * // using the {@link core.EventDispatcher#on} method to subscribe to events simplifies this.
	 * instance.addEventListener("click", event => console.log(instance === this)); // false, scope is ambiguous.
	 * instance.on("click", event => console.log(instance === this)); // true, `on` uses dispatcher scope by default.
	 */
	class EventDispatcher {

		/**
		 * Static initializer to mix EventDispatcher methods into a target object or prototype.
		 *
		 * @static
		 * @example
		 * EventDispatcher.initialize(MyClass.prototype); // add to the prototype of the class
		 * EventDispatcher.initialize(myInstance); // add to a specific instance
		 *
		 * @param {Object} target The target object to inject EventDispatcher methods into.
		 */
		static initialize (target) {
			const p = EventDispatcher.prototype;
			target.addEventListener = p.addEventListener;
			target.on = p.on;
			target.removeEventListener = target.off = p.removeEventListener;
			target.removeAllEventListeners = p.removeAllEventListeners;
			target.hasEventListener = p.hasEventListener;
			target.dispatchEvent = p.dispatchEvent;
			target._dispatchEvent = p._dispatchEvent;
			target.willTrigger = p.willTrigger;
		}

		constructor () {
			/**
			 * @private
			 * @default null
			 * @type Object
			 */
			this._listeners = null;

			/**
			 * @private
			 * @default null
			 * @type Object
			 */
			this._captureListeners = null;
		}

		/**
		 * Adds the specified event listener. Note that adding multiple listeners to the same function will result in
		 * multiple callbacks getting fired.
		 *
		 * @example
		 * displayObject.addEventListener("click", event => console.log('clicked', event));
		 *
		 * @param {string} type The string type of the event.
		 * @param {Function|Object} listener An object with a handleEvent method, or a function that will be called when the event is dispatched.
		 * @param {boolean} [useCapture=false] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
		 * @return {Function|Object} Returns the listener for chaining or assignment.
		 */
		addEventListener (type, listener, useCapture = false) {
			let listeners;
			if (useCapture) {
				listeners = this._captureListeners = this._captureListeners || {};
			} else {
				listeners = this._listeners = this._listeners || {};
			}
			let arr = listeners[type];
			if (arr) {
				this.removeEventListener(type, listener, useCapture);
				arr = listeners[type]; // remove may have deleted the array
			}
			if (arr) { arr.push(listener);  }
			else { listeners[type] = [listener]; }
			return listener;
		}

		/**
		 * A shortcut method for using addEventListener that makes it easier to specify an execution scope, have a listener
		 * only run once, associate arbitrary data with the listener, and remove the listener.
		 *
		 * This method works by creating an anonymous wrapper function and subscribing it with `addEventListener`.
		 * The wrapper function is returned for use with `removeEventListener` (or `off`).
		 *
		 * To remove a listener added with `on`, you must pass in the returned wrapper function as the listener, or use
		 * {@link core.Event#remove}. Likewise, each time you call `on` a NEW wrapper function is subscribed, so multiple calls
		 * to `on` with the same params will create multiple listeners.
		 *
		 * @example
		 * const listener = myBtn.on("click", handleClick, null, false, { count: 3 });
		 * function handleClick (evt, data) {
		 *   data.count -= 1;
		 *   console.log(this == myBtn); // true - scope defaults to the dispatcher
		 *   if (data.count == 0) {
		 *     alert("clicked 3 times!");
		 *     myBtn.off("click", listener);
		 *     // alternately: evt.remove();
		 *   }
		 * }
		 *
		 * @param {string} type The string type of the event.
		 * @param {Function|Object} listener An object with a handleEvent method, or a function that will be called when the event is dispatched.
		 * @param {Object} [scope=null] The scope to execute the listener in. Defaults to the dispatcher/currentTarget for function listeners, and to the listener itself for object listeners (ie. using handleEvent).
		 * @param {boolean} [once=false] If true, the listener will remove itself after the first time it is triggered.
		 * @param {*} [data={}] Arbitrary data that will be included as the second parameter when the listener is called.
		 * @param {boolean} [useCapture=false] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
		 * @return {Function} Returns the anonymous function that was created and assigned as the listener. This is needed to remove the listener later using .removeEventListener.
		 */
		on (type, listener, scope = null, once = false, data = {}, useCapture = false) {
			if (listener.handleEvent) {
				scope = scope || listener;
				listener = listener.handleEvent;
			}
			scope = scope || this;
			return this.addEventListener(type, evt => {
				listener.call(scope, evt, data);
				once && evt.remove();
			}, useCapture);
		}

		/**
		 * Removes the specified event listener.
		 *
		 * You must pass the exact function reference used when the event was added. If a proxy
		 * function, or function closure is used as the callback, the proxy/closure reference must be used - a new proxy or
		 * closure will not work.
		 *
		 * @example
		 * displayObject.removeEventListener("click", handleClick);
		 *
		 * @param {string} type The string type of the event.
		 * @param {Function|Object} listener The listener function or object.
		 * @param {boolean} [useCapture=false] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
		 */
		removeEventListener (type, listener, useCapture = false) {
			const listeners = useCapture ? this._captureListeners : this._listeners;
			if (!listeners) { return; }
			const arr = listeners[type];
			if (!arr) { return; }
			const l = arr.length;
			for (let i = 0; i < l; i++) {
				if (arr[i] === listener) {
					if (l === 1) { delete(listeners[type]); } // allows for faster checks.
					else { arr.splice(i, 1); }
					break;
				}
			}
		}

		/**
		 * A shortcut to the removeEventListener method, with the same parameters and return value. This is a companion to the
		 * `on` method.
		 *
		 * To remove a listener added with `on`, you must pass in the returned wrapper function as the listener. See
		 * {@link core.EventDispatcher#on} for an example.
		 *
		 * @param {string} type The string type of the event.
		 * @param {Function|Object} listener The listener function or object.
		 * @param {boolean} [useCapture=false] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
		 */
		off (type, listener, useCapture = false) {
			this.removeEventListener(type, listener, useCapture);
		}

		/**
		 * Removes all listeners for the specified type, or all listeners of all types.
		 *
		 * @example
		 * // remove all listeners
		 * displayObject.removeAllEventListeners();
		 *
		 * // remove all click listeners
		 * displayObject.removeAllEventListeners("click");
		 *
		 * @param {string} [type=null] The string type of the event. If omitted, all listeners for all types will be removed.
		 */
		removeAllEventListeners (type = null) {
			if (type) {
				if (this._listeners) { delete(this._listeners[type]); }
				if (this._captureListeners) { delete(this._captureListeners[type]); }
			} else {
				this._listeners = this._captureListeners = null;
			}
		}

		/**
		 * Dispatches the specified event to all listeners.
		 *
		 * @example
		 * // use a string event
		 * this.dispatchEvent("complete")
		 *
		 * // use an Event instance
		 * const event = new createjs.Event("progress");
		 * this.dispatchEvent(event);
		 *
		 * @param {Object|Event|string} eventObj An object with a "type" property, or a string type.
		 * While a generic object will work, it is recommended to use a CreateJS Event instance. If a string is used,
		 * dispatchEvent will construct an Event instance if necessary with the specified type. This latter approach can
		 * be used to avoid event object instantiation for non-bubbling events that may not have any listeners.
		 * @param {boolean} [bubbles=false] Specifies the `bubbles` value when a string was passed to eventObj.
		 * @param {boolean} [cancelable=false] Specifies the `cancelable` value when a string was passed to eventObj.
		 * @return {boolean} Returns false if `preventDefault()` was called on a cancelable event, true otherwise.
		 */
		dispatchEvent (eventObj, bubbles = false, cancelable = false) {
			if (typeof eventObj === "string") {
				// skip everything if there's no listeners and it doesn't bubble:
				const listeners = this._listeners;
				if (!bubbles && (!listeners || !listeners[eventObj])) { return true; }
				eventObj = new Event(eventObj, bubbles, cancelable);
			} else if (eventObj.target && eventObj.clone) {
				// redispatching an active event object, so clone it:
				eventObj = eventObj.clone();
			}

			// TODO: it would be nice to eliminate this. Maybe in favour of evtObj instanceof Event? Or !!evtObj.createEvent
			try { eventObj.target = this; } catch (e) {} // try/catch allows redispatching of native events

			if (!eventObj.bubbles || !this.parent) {
				this._dispatchEvent(eventObj, 2);
			} else {
				let top = this;
				const list = [top];
				while (top.parent) { list.push(top = top.parent); }
				const l = list.length;
				let i;

				// capture & atTarget
				for (i = l - 1; i >= 0 && !eventObj.propagationStopped; i--) {
					list[i]._dispatchEvent(eventObj, 1+(i==0));
				}
				// bubbling
				for (i = 1; i < l && !eventObj.propagationStopped; i++) {
					list[i]._dispatchEvent(eventObj, 3);
				}
			}
			return !eventObj.defaultPrevented;
		}

		/**
		 * Indicates whether there is at least one listener for the specified event type.
		 *
		 * @param {string} type The string type of the event.
		 * @return {boolean} Returns true if there is at least one listener for the specified event.
		 */
		hasEventListener (type) {
			const listeners = this._listeners, captureListeners = this._captureListeners;
			return !!((listeners && listeners[type]) || (captureListeners && captureListeners[type]));
		}

		/**
		 * Indicates whether there is at least one listener for the specified event type on this object or any of its
		 * ancestors (parent, parent's parent, etc). A return value of true indicates that if a bubbling event of the
		 * specified type is dispatched from this object, it will trigger at least one listener.
		 *
		 * This is similar to {@link core.EventDispatcher#hasEventListener}, but it searches the entire
		 * event flow for a listener, not just this object.
		 *
		 * @param {string} type The string type of the event.
		 * @return {boolean} Returns `true` if there is at least one listener for the specified event.
		 */
		willTrigger (type) {
			let o = this;
			while (o) {
				if (o.hasEventListener(type)) { return true; }
				o = o.parent;
			}
			return false;
		}

		/**
		 * @return {String} a string representation of the instance.
		 */
		toString () {
			return `[${this.constructor.name + this.name ? ` ${this.name}` : ""}]`;
		}

		/**
		 * @private
		 * @param {Object|Event|string} eventObj
		 * @param {Object} eventPhase
		 */
		_dispatchEvent (eventObj, eventPhase) {
			const listeners = eventPhase === 1 ? this._captureListeners : this._listeners;
			if (eventObj && listeners) {
				let arr = listeners[eventObj.type];
				let l;
				if (!arr || (l = arr.length) === 0) { return; }
				try { eventObj.currentTarget = this; } catch (e) {}
				try { eventObj.eventPhase = eventPhase; } catch (e) {}
				eventObj.removed = false;

				arr = arr.slice(); // to avoid issues with items being removed or added during the dispatch
				for (let i = 0; i < l && !eventObj.immediatePropagationStopped; i++) {
					let o = arr[i];
					if (o.handleEvent) { o.handleEvent(eventObj); }
					else { o(eventObj); }
					if (eventObj.removed) {
						this.off(eventObj.type, o, eventPhase === 1);
						eventObj.removed = false;
					}
				}
			}
		}

	}

	/**
	 * @license Ticker
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * The Ticker provides a centralized tick or heartbeat broadcast at a set interval. Listeners can subscribe to the tick
	 * event to be notified when a set time interval has elapsed.
	 *
	 * Note that the interval that the tick event is called is a target interval, and may be broadcast at a slower interval
	 * when under high CPU load. The Ticker class uses a static interface (ex. `Ticker.framerate = 30;`) and
	 * can not be instantiated.
	 *
	 * @todo Pass timingMode, maxDelta, paused values as instantiation arguments?
	 *
	 * @memberof core
	 * @example
	 * Ticker.addEventListener("tick", event => {
	 *   // Actions carried out each tick (aka frame)
	 *   if (!event.paused) {
	 *     // Actions carried out when the Ticker is not paused.
	 *   }
	 * });
	 * @example
	 * // Ticker export explanation
	 * import Ticker, { Ticker as TickerClass, getTicker } from "@createjs/core";
	 * Ticker.name, Ticker.RAF // -> createjs.global, undefined
	 * TickerClass.RAF // -> raf
	 * Ticker === getTicker("createjs.global") // -> true
	 *
	 * @extends core.EventDispatcher
	 * @param {string} name The name assigned to this instance.
	 */
	class Ticker extends EventDispatcher {

		/**
		 * In this mode, Ticker uses the requestAnimationFrame API, but attempts to synch the ticks to target framerate. It
		 * uses a simple heuristic that compares the time of the RAF return to the target time for the current frame and
		 * dispatches the tick when the time is within a certain threshold.
		 *
		 * This mode has a higher variance for time between frames than {{#crossLink "Ticker/TIMEOUT:property"}}{{/crossLink}},
		 * but does not require that content be time based as with {{#crossLink "Ticker/RAF:property"}}{{/crossLink}} while
		 * gaining the benefits of that API (screen synch, background throttling).
		 *
		 * Variance is usually lowest for framerates that are a divisor of the RAF frequency. This is usually 60, so
		 * framerates of 10, 12, 15, 20, and 30 work well.
		 *
		 * Falls back to {{#crossLink "Ticker/TIMEOUT:property"}}{{/crossLink}} if the requestAnimationFrame API is not
		 * supported.
		 *
		 * @static
		 * @type {string}
		 * @default "synched"
		 * @readonly
		 */
		static get RAF_SYNCHED () { return "synched"; }

		/**
		 * In this mode, Ticker passes through the requestAnimationFrame heartbeat, ignoring the target framerate completely.
		 * Because requestAnimationFrame frequency is not deterministic, any content using this mode should be time based.
		 * You can leverage {@link core.Ticker#getTime} and the {@link core.Ticker#event:tick}
		 * event object's "delta" properties to make this easier.
		 *
		 * Falls back on {@link core.Ticker.TIMEOUT} if the requestAnimationFrame API is not supported.
		 *
		 * @static
		 * @type {string}
		 * @default "raf"
		 * @readonly
		 */
		static get RAF () { return "raf"; }

		/**
		 * In this mode, Ticker uses the setTimeout API. This provides predictable, adaptive frame timing, but does not
		 * provide the benefits of requestAnimationFrame (screen synch, background throttling).
		 *
		 * @static
		 * @type {string}
		 * @default "timeout"
		 * @readonly
		 */
		static get TIMEOUT () { return "timeout"; }

		constructor (name) {
			super();

			/**
			 * The name of this instance.
			 * @type {string}
			 */
			this.name = name;

			/**
			 * Specifies the timing api (setTimeout or requestAnimationFrame) and mode to use.
			 *
			 * @see {@link core.Ticker.TIMEOUT}
			 * @see {@link core.Ticker.RAF}
			 * @see {@link core.Ticker.RAF_SYNCHED}
			 *
			 * @type {string}
			 * @default Ticker.TIMEOUT
			 */
			this.timingMode = Ticker.TIMEOUT;

			/**
			 * Specifies a maximum value for the delta property in the tick event object. This is useful when building time
			 * based animations and systems to prevent issues caused by large time gaps caused by background tabs, system sleep,
			 * alert dialogs, or other blocking routines. Double the expected frame duration is often an effective value
			 * (ex. maxDelta=50 when running at 40fps).
			 *
			 * This does not impact any other values (ex. time, runTime, etc), so you may experience issues if you enable maxDelta
			 * when using both delta and other values.
			 *
			 * If 0, there is no maximum.
			 *
			 * @type {number}
			 * @default 0
			 */
			this.maxDelta = 0;

			/**
			 * When the ticker is paused, all listeners will still receive a tick event, but the `paused` property
			 * of the event will be `true`. Also, while paused the `runTime` will not increase.
			 *
			 * @example
			 * Ticker.addEventListener("tick", event => console.log(event.paused, Ticker.getTime(false), Ticker.getTime(true)));
			 * Ticker.paused = true;
			 *
			 * @see {@link core.Ticker#event:tick}
			 * @see {@link core.Ticker#getTime}
			 * @see {@link core.Ticker#getEventTime}
			 *
			 * @type {boolean}
			 * @default false
			 */
			this.paused = false;

			/**
			 * @private
			 * @type {boolean}
			 * @default false
			 */
			this._inited = false;

			/**
			 * @private
			 * @type {number}
			 * @default 0
			 */
			this._startTime = 0;

			/**
			 * @private
			 * @type {number}
			 * @default 0
			 */
			this._pausedTime = 0;

			/**
			 * The number of ticks that have passed.
			 *
			 * @private
			 * @type {number}
			 * @default 0
			 */
			this._ticks = 0;

			/**
			 * The number of ticks that have passed while Ticker has been paused.
			 *
			 * @private
			 * @type {number}
			 * @default
			 */
			this._pausedTicks = 0;

			/**
			 * @private
			 * @type {number}
			 * @default
			 */
			this._interval = 50;

			/**
			 * @private
			 * @type {number}
			 * @default
			 */
			this._lastTime = 0;

			/**
			 * @private
			 * @type {Array}
			 * @default null
			 */
			this._times = null;

			/**
			 * @private
			 * @type {Array}
			 * @default null
			 */
			this._tickTimes = null;

			/**
			 * Stores the timeout or requestAnimationFrame id.
			 *
			 * @private
			 * @type {number}
			 * @default null
			 */
			this._timerId = null;

			/**
			 * True if currently using requestAnimationFrame, false if using setTimeout. This may be different than timingMode
			 * if that property changed and a tick hasn't fired.
			 *
			 * @private
			 * @type {boolean}
			 * @default true
			 */
			this._raf = true;
		}

		/**
		 * Indicates the target time (in milliseconds) between ticks. Default is 50 (20 FPS).
		 * Note that actual time between ticks may be more than specified depending on CPU load.
		 * This property is ignored if the ticker is using the `RAF` timing mode.
		 *
		 * @type {number}
		 */
		get interval () { return this._interval; }
		set interval (interval) {
			this._interval = interval;
			if (!this._inited) { return; }
			this._setupTick();
		}

		/**
		 * Indicates the target frame rate in frames per second (FPS). Effectively just a shortcut to `interval`, where
		 * `framerate == 1000/interval`.
		 *
		 * @type {number}
		 */
		get framerate () { return 1000 / this._interval; }
		set framerate (framerate) { this.interval = 1000 / framerate; }

		/**
		 * Starts the tick. This is called automatically when the first listener is added.
		 */
		init () {
			if (this._inited) { return; }
			this._inited = true;
			this._times = [];
			this._tickTimes = [];
			this._startTime = this._getTime();
			this._times.push(this._lastTime = 0);
			this._setupTick();
		}

		/**
		 * Stops the Ticker and removes all listeners. Use init() to restart the Ticker.
		 */
		reset () {
			if (this._raf) {
				let f = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
				f && f(this._timerId);
			} else {
				clearTimeout(this._timerId);
			}
			this.removeAllEventListeners("tick");
			this._timerId = this._times = this._tickTimes = null;
			this._startTime = this._lastTime = this._ticks = 0;
			this._inited = false;
		}

		/**
		 * Init the Ticker instance if it hasn't been already.
		 */
		addEventListener (type, listener, useCapture) {
			!this._inited && this.init();
			return super.addEventListener(type, listener, useCapture);
		}

		/**
		 * Returns the average time spent within a tick. This can vary significantly from the value provided by getMeasuredFPS
		 * because it only measures the time spent within the tick execution stack.
		 *
		 * Example 1: With a target FPS of 20, getMeasuredFPS() returns 20fps, which indicates an average of 50ms between
		 * the end of one tick and the end of the next. However, getMeasuredTickTime() returns 15ms. This indicates that
		 * there may be up to 35ms of "idle" time between the end of one tick and the start of the next.
		 *
		 * Example 2: With a target FPS of 30, getFPS() returns 10fps, which indicates an average of 100ms between the end of
		 * one tick and the end of the next. However, getMeasuredTickTime() returns 20ms. This would indicate that something
		 * other than the tick is using ~80ms (another script, DOM rendering, etc).
		 *
		 * @param {number} [ticks=null] The number of previous ticks over which to measure the average time spent in a tick.
		 * Defaults to the number of ticks per second. To get only the last tick's time, pass in 1.
		 * @return {number} The average time spent in a tick in milliseconds.
		 */
		getMeasuredTickTime (ticks = null) {
			const times = this._tickTimes;
			if (!times || times.length < 1) { return -1; }
			// by default, calculate average for the past ~1 second:
			ticks = Math.min(times.length, ticks || (this.framerate | 0));
			return times.reduce((a, b) => a + b, 0) / ticks;
		}

		/**
		 * Returns the actual frames / ticks per second.
		 *
		 * @param {number} [ticks=null] The number of previous ticks over which to measure the actual frames / ticks per second.
		 * Defaults to the number of ticks per second.
		 * @return {number} The actual frames / ticks per second. Depending on performance, this may differ
		 * from the target frames per second.
		 */
		getMeasuredFPS (ticks = null) {
			const times = this._times;
			if (!times || times.length < 2) { return -1; }
			// by default, calculate fps for the past ~1 second:
			ticks = Math.min(times.length - 1, ticks || (this.framerate | 0));
			return 1000 / ((times[0] - times[ticks]) / ticks);
		}

		/**
		 * Returns the number of milliseconds that have elapsed since Ticker was initialized via {@link core.Ticker#init}.
		 * Returns -1 if Ticker has not been initialized. For example, you could use
		 * this in a time synchronized animation to determine the exact amount of time that has elapsed.
		 *
		 * @param {boolean} [runTime=false] If true only time elapsed while Ticker was not paused will be returned.
		 * If false, the value returned will be total time elapsed since the first tick event listener was added.
		 * @return {number} Number of milliseconds that have elapsed since Ticker was initialized or -1.
		 */
		getTime (runTime = false) {
			return this._startTime ? this._getTime() - (runTime ? this._pausedTime : 0) : -1;
		}

		/**
		 * Similar to {@link core.Ticker#getTime}, but returns the time on the most recent {@link core.Ticker#event:tick}
		 * event object.
		 *
		 * @param {boolean} [runTime=false] If true, the runTime property will be returned instead of time.
		 * @returns {number} The time or runTime property from the most recent tick event or -1.
		 */
		getEventTime (runTime = false) {
			return this._startTime ? (this._lastTime || this._startTime) - (runTime ? this._pausedTime : 0) : -1;
		}

		/**
		 * Returns the number of ticks that have been broadcast by Ticker.
		 *
		 * @param {boolean} [pauseable=false] Indicates whether to include ticks that would have been broadcast
		 * while Ticker was paused. If true only tick events broadcast while Ticker is not paused will be returned.
		 * If false, tick events that would have been broadcast while Ticker was paused will be included in the return
		 * value.
		 * @return {number} of ticks that have been broadcast.
		 */
		getTicks (pauseable = false) {
			return this._ticks - (pauseable ? this._pausedTicks : 0);
		}

		/**
		 * @private
		 */
		_handleSynch () {
			this._timerId = null;
			this._setupTick();

			// run if enough time has elapsed, with a little bit of flexibility to be early:
			if (this._getTime() - this._lastTime >= (this._interval - 1) * 0.97) {
				this._tick();
			}
		}

		/**
		 * @private
		 */
		_handleRAF () {
			this._timerId = null;
			this._setupTick();
			this._tick();
		}

		/**
		 * @private
		 */
		_handleTimeout () {
			this._timerId = null;
			this._setupTick();
			this._tick();
		}

		/**
		 * @private
		 */
		_setupTick () {
			if (this._timerId != null) { return; } // avoid duplicates
			const mode = this.timingMode || (this._raf && Ticker.RAF);
			if (mode === Ticker.RAF_SYNCHED || mode === Ticker.RAF) {
				const f = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
				if (f) {
					this._timerId = f(mode === Ticker.RAF ? this._handleRAF.bind(this) : this._handleSynch.bind(this));
					this._raf = true;
					return;
				}
			}
			this._raf = false;
			this._timerId = setTimeout(this._handleTimeout.bind(this), this._interval);
		}

		/**
		 * @private
		 * @emits core.Ticker#event:tick
		 */
		_tick () {
			const paused = this.paused, time = this._getTime(), elapsedTime = time - this._lastTime;
			this._lastTime = time;
			this._ticks++;

			if (paused) {
				this._pausedTicks++;
				this._pausedTime += elapsedTime;
			}

			if (this.hasEventListener("tick")) {
				const event = new Event("tick");
				const maxDelta = this.maxDelta;
				event.delta = (maxDelta && elapsedTime > maxDelta) ? maxDelta : elapsedTime;
				event.paused = paused;
				event.time = time;
				event.runTime = time - this._pausedTime;
				this.dispatchEvent(event);
			}

			this._tickTimes.unshift(this._getTime() - time);
			while (this._tickTimes.length > 100) { this._tickTimes.pop(); }

			this._times.unshift(time);
			while (this._times.length > 100) { this._times.pop(); }
		}

		/**
		 * @private
		 */
		_getTime () {
			const now = window.performance && window.performance.now;
			return ((now && now.call(performance)) || (new Date().getTime())) - this._startTime;
		}

		static on (type, listener, scope, once, data, useCapture) { return _instance.on(type, listener, scope, once, data, useCapture); }
		static removeEventListener (type, listener, useCapture) { _instance.removeEventListener(type, listener, useCapture); }
		static off (type, listener, useCapture) { _instance.off(type, listener, useCapture); }
		static removeAllEventListeners (type) { _instance.removeAllEventListeners(type); }
		static dispatchEvent (eventObj, bubbles, cancelable) { return _instance.dispatchEvent(eventObj, bubbles, cancelable); }
		static hasEventListener (type) { return _instance.hasEventListener(type); }
		static willTrigger (type) { return _instance.willTrigger(type); }
		static toString () { return _instance.toString(); }
		static init () { _instance.init(); }
		static reset () { _instance.reset(); }
		static addEventListener (type, listener, useCapture) { _instance.addEventListener(type, listener, useCapture); }
		static getMeasuredTickTime (ticks) { return _instance.getMeasuredTickTime(ticks); }
		static getMeasuredFPS (ticks) { return _instance.getMeasuredFPS(ticks); }
		static getTime (runTime) { return _instance.getTime(runTime); }
		static getEventTime (runTime) { return _instance.getEventTime(runTime); }
		static getTicks (pauseable) { return _instance.getTicks(pauseable); }

		static get interval () { return _instance.interval; }
		static set interval (interval) { _instance.interval = interval; }
		static get framerate () { return _instance.framerate; }
		static set framerate (framerate) { _instance.framerate = framerate; }
		static get name () { return _instance.name; }
		static set name (name) { _instance.name = name; }
		static get timingMode () { return _instance.timingMode; }
		static set timingMode (timingMode) { _instance.timingMode = timingMode; }
		static get maxDelta () { return _instance.maxDelta; }
		static set maxDelta (maxDelta) { _instance.maxDelta = maxDelta; }
		static get paused () { return _instance.paused; }
		static set paused (paused) { _instance.paused = paused; }

	}

	// the default Ticker instance
	const _instance = new Ticker("createjs.global");

	/**
	 * The core classes of CreateJS.
	 * @namespace core
	 *
	 * @example
	 * import { EventDispatcher, Event } from "@createjs/core";
	 * const dispatcher = new EventDispatcher();
	 * dispatcher.on("myEvent", foo);
	 * dispatcher.dispatchEvent(new Event("myEvent"));
	 * // foo() is called.
	 */

	/**
	 * @license
	 *
	 * StageGL
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	class StageGL {
		constructor () {
			throw new Error(`
			StageGL is not currently supported on the EaselJS 2.0 branch.
			End of Q1 2018 is targetted for StageGL support.
			Follow @CreateJS on Twitter for updates.
		`);
		}
	}

	/**
	 * @license Shadow
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * This class encapsulates the properties required to define a shadow to apply to a {@link easeljs.DisplayObject}
	 * via its `shadow` property.
	 *
	 * @memberof easeljs
	 * @example
	 * img.shadow = new Shadow("#000000", 5, 5, 10);
	 *
	 * @param {String} [color=black] The color of the shadow. This can be any valid CSS color value.
	 * @param {Number} [offsetX=0] The x offset of the shadow in pixels.
	 * @param {Number} [offsetY=0] The y offset of the shadow in pixels.
	 * @param {Number} [blur=0] The size of the blurring effect.
	 */
	class Shadow {

		constructor (color = "black", offsetX = 0, offsetY = 0, blur = 0) {
			/**
			 * The color of the shadow. This can be any valid CSS color value.
			 * @type {String}
			 * @default black
			 */
			this.color = color;

			/**
			 * The x offset of the shadow.
			 * @type {Number}
			 * @default 0
			 */
			this.offsetX = offsetX;

			/**
			 * The y offset of the shadow.
			 * @type {Number}
			 * @default 0
			 */
			this.offsetY = offsetY;

			/**
			 * The blur of the shadow.
			 * @type {Number}
			 * @default 0
			 */
			this.blur = blur;
		}

		/**
		 * Returns a string representation of this object.
		 * @return {String}
		 */
		toString () {
			return `[${this.constructor.name}]`;
		}

		/**
		 * Returns a clone of this Shadow instance.
		 * @return {Shadow} A clone of the current Shadow instance.
		 */
		clone () {
			return new Shadow(this.color, this.offsetX, this.offsetY, this.blur);
		}

	}

	/**
	 * An identity shadow object (all properties are set to 0).
	 * @type {easeljs.Shadow}
	 * @static
	 * @readonly
	 */
	Shadow.identity = new Shadow("transparent");

	/**
	 * @license uid
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/** @ignore */
	let _nextId = 0;

	/**
	 * Global utility for generating sequential unique ID numbers.
	 *
	 * @memberof easeljs
	 * @name easeljs.uid
	 * @example
	 * import { uid } from "@createjs/easeljs";
	 * var ids = [];
	 * while (ids.length <= 3) {
	 *   ids.push(uid());
	 * }
	 * // ids == [0, 1, 2, 3]
	 */
	function uid () {
		return _nextId++;
	}

	/**
	 * @license Point
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * Represents a point on a 2 dimensional x / y coordinate system.
	 *
	 * @memberof easeljs
	 * @example
	 * let point = new Point(0, 100);
	 *
	 * @param {Number} [x] X position.
	 * @param {Number} [y] Y position.
	 */
	class Point {

		constructor (x, y) {
			this.setValues(x, y);

			// assigned in the setValues method.
			/**
			 * X position.
			 * @property x
			 * @type {Number}
			 */

			/**
			 * Y position.
			 * @property y
			 * @type {Number}
			 */
		}

		/**
		 * Sets the specified values on this instance.
		 * @param {Number} [x=0] X position.
		 * @param {Number} [y=0] Y position.
		 * @return {easeljs.Point} This instance. Useful for chaining method calls.
		 * @chainable
		*/
		setValues (x = 0, y = 0) {
			this.x = x;
			this.y = y;
			return this;
		}

		/**
		 * Copies all properties from the specified point to this point.
		 * @param {easeljs.Point} point The point to copy properties from.
		 * @return {easeljs.Point} This point. Useful for chaining method calls.
		 * @chainable
		*/
		copy (point) {
			this.x = point.x;
			this.y = point.y;
			return this;
		}

		/**
		 * Returns a clone of the Point instance.
		 * @return {easeljs.Point} a clone of the Point instance.
		 */
		clone () {
			return new Point(this.x, this.y);
		}

		/**
		 * Returns a string representation of this object.
		 * @return {String} a string representation of the instance.
		 */
		toString () {
			return `[${this.constructor.name} (x=${this.x} y=${this.y})]`;
		}

	}

	/**
	 * @license Matrix2D
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * Represents an affine transformation matrix, and provides tools for constructing and concatenating matrices.
	 *
	 * <pre>
	 * This matrix can be visualized as:
	 *
	 * 	[ a  c  tx
	 * 	  b  d  ty
	 * 	  0  0  1  ]
	 *
	 * Note the locations of b and c.
	 * </pre>
	 *
	 * @param {Number} [a] Specifies the a property for the new matrix.
	 * @param {Number} [b] Specifies the b property for the new matrix.
	 * @param {Number} [c] Specifies the c property for the new matrix.
	 * @param {Number} [d] Specifies the d property for the new matrix.
	 * @param {Number} [tx] Specifies the tx property for the new matrix.
	 * @param {Number} [ty] Specifies the ty property for the new matrix.
	 */
	class Matrix2D {

		constructor (a, b, c, d, tx, ty) {
			this.setValues(a, b, c, d, tx, ty);

			// assigned in the setValues method.
			/**
			 * Position (0, 0) in a 3x3 affine transformation matrix.
			 * @property a
			 * @type {Number}
			 */

			/**
			 * Position (0, 1) in a 3x3 affine transformation matrix.
			 * @property b
			 * @type {Number}
			 */

			/**
			 * Position (1, 0) in a 3x3 affine transformation matrix.
			 * @property c
			 * @type {Number}
			 */

			/**
			 * Position (1, 1) in a 3x3 affine transformation matrix.
			 * @property d
			 * @type {Number}
			 */

			/**
			 * Position (2, 0) in a 3x3 affine transformation matrix.
			 * @property tx
			 * @type {Number}
			 */

			/**
			 * Position (2, 1) in a 3x3 affine transformation matrix.
			 * @property ty
			 * @type {Number}
			 */
		}

		/**
		 * Sets the specified values on this instance.
		 * @param {Number} [a=1] Specifies the a property for the new matrix.
		 * @param {Number} [b=0] Specifies the b property for the new matrix.
		 * @param {Number} [c=0] Specifies the c property for the new matrix.
		 * @param {Number} [d=1] Specifies the d property for the new matrix.
		 * @param {Number} [tx=0] Specifies the tx property for the new matrix.
		 * @param {Number} [ty=0] Specifies the ty property for the new matrix.
		 * @return {Matrix2D} This instance. Useful for chaining method calls.
		 * @chainable
		*/
		setValues (a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
			// don't forget to update docs in the constructor if these change:
			this.a = a;
			this.b = b;
			this.c = c;
			this.d = d;
			this.tx = tx;
			this.ty = ty;
			return this;
		}

		/**
		 * Appends the specified matrix properties to this matrix. All parameters are required.
		 * This is the equivalent of multiplying `(this matrix) * (specified matrix)`.
		 * @param {Number} a
		 * @param {Number} b
		 * @param {Number} c
		 * @param {Number} d
		 * @param {Number} tx
		 * @param {Number} ty
		 * @return {easeljs.Matrix2D} This matrix. Useful for chaining method calls.
		 * @chainable
		 */
		append (a, b, c, d, tx, ty) {
			let a1 = this.a;
			let b1 = this.b;
			let c1 = this.c;
			let d1 = this.d;
			if (a != 1 || b != 0 || c != 0 || d != 1) {
				this.a  = a1*a+c1*b;
				this.b  = b1*a+d1*b;
				this.c  = a1*c+c1*d;
				this.d  = b1*c+d1*d;
			}
			this.tx = a1*tx+c1*ty+this.tx;
			this.ty = b1*tx+d1*ty+this.ty;
			return this;
		};

		/**
		 * Prepends the specified matrix properties to this matrix.
		 * This is the equivalent of multiplying `(specified matrix) * (this matrix)`.
		 * @param {Number} a
		 * @param {Number} b
		 * @param {Number} c
		 * @param {Number} d
		 * @param {Number} tx
		 * @param {Number} ty
		 * @return {easeljs.Matrix2D} This matrix. Useful for chaining method calls.
		 * @chainable
		 */
		prepend (a, b, c, d, tx, ty) {
			let a1 = this.a;
			let c1 = this.c;
			let tx1 = this.tx;

			this.a  = a*a1+c*this.b;
			this.b  = b*a1+d*this.b;
			this.c  = a*c1+c*this.d;
			this.d  = b*c1+d*this.d;
			this.tx = a*tx1+c*this.ty+tx;
			this.ty = b*tx1+d*this.ty+ty;
			return this;
		}

		/**
		 * Appends the specified matrix to this matrix.
		 * This is the equivalent of multiplying `(this matrix) * (specified matrix)`.
		 * @param {easeljs.Matrix2D} matrix
		 * @return {easeljs.Matrix2D} This matrix. Useful for chaining method calls.
		 * @chainable
		 */
		appendMatrix (matrix) {
			return this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
		}

		/**
		 * Prepends the specified matrix to this matrix.
		 * This is the equivalent of multiplying `(specified matrix) * (this matrix)`.
		 *
		 * @example <caption>Calculate the combined transformation for a child object</caption>
		 * let o = displayObject;
		 * let mtx = o.getMatrix();
		 * while (o = o.parent) {
		 * 	 // prepend each parent's transformation in turn:
		 * 	 o.prependMatrix(o.getMatrix());
		 * }
		 *
		 * @param {easeljs.Matrix2D} matrix
		 * @return {easeljs.Matrix2D} This matrix. Useful for chaining method calls.
		 * @chainable
		 */
		prependMatrix (matrix) {
			return this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
		}

		/**
		 * Generates matrix properties from the specified display object transform properties, and appends them to this matrix.
		 *
		 * @example <caption>Generate a matrix representing the transformations of a display object</caption>
		 * let mtx = new Matrix2D();
		 * mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
		 *
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} scaleX
		 * @param {Number} scaleY
		 * @param {Number} rotation
		 * @param {Number} skewX
		 * @param {Number} skewY
		 * @param {Number} [regX]
		 * @param {Number} [regY]
		 * @return {easeljs.Matrix2D} This matrix. Useful for chaining method calls.
		 * @chainable
		 */
		appendTransform (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
			let r, cos, sin;
			if (rotation%360) {
				r = rotation*Matrix2D.DEG_TO_RAD;
				cos = Math.cos(r);
				sin = Math.sin(r);
			} else {
				cos = 1;
				sin = 0;
			}

			if (skewX || skewY) {
				// TODO: can this be combined into a single append operation?
				skewX *= Matrix2D.DEG_TO_RAD;
				skewY *= Matrix2D.DEG_TO_RAD;
				this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
				this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
			} else {
				this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
			}

			if (regX || regY) {
				// append the registration offset:
				this.tx -= regX*this.a+regY*this.c;
				this.ty -= regX*this.b+regY*this.d;
			}
			return this;
		}

		/**
		 * Generates matrix properties from the specified display object transform properties, and prepends them to this matrix.
		 *
		 * Note that the above example would not account for {@link easeljs.DisplayObject#transformMatrix} values.
		 * See {@link easeljs.Matrix2D#prependMatrix} for an example that does.
		 *
		 * @example <caption>Calculate the combined transformation for a child object</caption>
		 * let o = displayObject;
		 * let mtx = new Matrix2D();
		 * do  {
		 * 	 // prepend each parent's transformation in turn:
		 * 	 mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
		 * } while (o = o.parent);
		 *
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} scaleX
		 * @param {Number} scaleY
		 * @param {Number} rotation
		 * @param {Number} skewX
		 * @param {Number} skewY
		 * @param {Number} [regX]
		 * @param {Number} [regY]
		 * @return {easeljs.Matrix2D} This matrix. Useful for chaining method calls.
		 */
		prependTransform (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
			let r, cos, sin;
			if (rotation%360) {
				r = rotation*Matrix2D.DEG_TO_RAD;
				cos = Math.cos(r);
				sin = Math.sin(r);
			} else {
				cos = 1;
				sin = 0;
			}

			if (regX || regY) {
				// prepend the registration offset:
				this.tx -= regX; this.ty -= regY;
			}
			if (skewX || skewY) {
				// TODO: can this be combined into a single prepend operation?
				skewX *= Matrix2D.DEG_TO_RAD;
				skewY *= Matrix2D.DEG_TO_RAD;
				this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
				this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
			} else {
				this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
			}
			return this;
		}

		/**
		 * Applies a clockwise rotation transformation to the matrix.
		 * @param {Number} angle The angle to rotate by, in degrees. To use a value in radians, multiply it by `Math.PI/180`.
		 * @return {easeljs.Matrix2D} This matrix. Useful for chaining method calls.
		 * @chainable
		 */
		rotate (angle) {
			angle *= Matrix2D.DEG_TO_RAD;
			let cos = Math.cos(angle);
			let sin = Math.sin(angle);

			let a1 = this.a;
			let b1 = this.b;

			this.a = a1*cos+this.c*sin;
			this.b = b1*cos+this.d*sin;
			this.c = -a1*sin+this.c*cos;
			this.d = -b1*sin+this.d*cos;
			return this;
		}

		/**
		 * Applies a skew transformation to the matrix.
		 * @param {Number} skewX The amount to skew horizontally in degrees. To use a value in radians, multiply it by `Math.PI/180`.
		 * @param {Number} skewY The amount to skew vertically in degrees.
		 * @return {easeljs.Matrix2D} This matrix. Useful for chaining method calls.
		 * @chainable
		*/
		skew (skewX, skewY) {
			skewX *= Matrix2D.DEG_TO_RAD;
			skewY *= Matrix2D.DEG_TO_RAD;
			this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
			return this;
		}

		/**
		 * Applies a scale transformation to the matrix.
		 * @param {Number} x The amount to scale horizontally. E.G. a value of 2 will double the size in the X direction, and 0.5 will halve it.
		 * @param {Number} y The amount to scale vertically.
		 * @return {easeljs.Matrix2D} This matrix. Useful for chaining method calls.
		 * @chainable
		 */
		scale (x, y) {
			this.a *= x;
			this.b *= x;
			this.c *= y;
			this.d *= y;
			//this.tx *= x;
			//this.ty *= y;
			return this;
		}

		/**
		 * Translates the matrix on the x and y axes.
		 * @param {Number} x
		 * @param {Number} y
		 * @return {easeljs.Matrix2D} This matrix. Useful for chaining method calls.
		 * @chainable
		 */
		translate (x, y) {
			this.tx += this.a*x + this.c*y;
			this.ty += this.b*x + this.d*y;
			return this;
		}

		/**
		 * Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
		 * @return {easeljs.Matrix2D} This matrix. Useful for chaining method calls.
		 * @chainable
		 */
		identity () {
			this.a = this.d = 1;
			this.b = this.c = this.tx = this.ty = 0;
			return this;
		}

		/**
		 * Inverts the matrix, causing it to perform the opposite transformation.
		 * @return {easeljs.Matrix2D} This matrix. Useful for chaining method calls.
		 * @chainable
		 */
		invert () {
			let a1 = this.a;
			let b1 = this.b;
			let c1 = this.c;
			let d1 = this.d;
			let tx1 = this.tx;
			let n = a1*d1-b1*c1;

			this.a = d1/n;
			this.b = -b1/n;
			this.c = -c1/n;
			this.d = a1/n;
			this.tx = (c1*this.ty-d1*tx1)/n;
			this.ty = -(a1*this.ty-b1*tx1)/n;
			return this;
		}

		/**
		 * Returns true if the matrix is an identity matrix.
		 * @return {Boolean}
		 */
		isIdentity () {
			return this.tx === 0 && this.ty === 0 && this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1;
		}

		/**
		 * Returns true if this matrix is equal to the specified matrix (all property values are equal).
		 * @param {easeljs.Matrix2D} matrix The matrix to compare.
		 * @return {Boolean}
		 */
		equals (matrix) {
			return this.tx === matrix.tx && this.ty === matrix.ty && this.a === matrix.a && this.b === matrix.b && this.c === matrix.c && this.d === matrix.d;
		}

		/**
		 * Transforms a point according to this matrix.
		 * @param {Number} x The x component of the point to transform.
		 * @param {Number} y The y component of the point to transform.
		 * @param {easeljs.Point | Object} [pt] An object to copy the result into. If omitted a generic object with x/y properties will be returned.
		 * @return {easeljs.Point} This matrix. Useful for chaining method calls.
		 */
		transformPoint (x, y, pt = new Point()) {
			pt.x = x*this.a+y*this.c+this.tx;
			pt.y = x*this.b+y*this.d+this.ty;
			return pt;
		}

		/**
		 * Decomposes the matrix into transform properties (x, y, scaleX, scaleY, and rotation). Note that these values
		 * may not match the transform properties you used to generate the matrix, though they will produce the same visual
		 * results.
		 * @param {Object} [target] The object to apply the transform properties to. If null, then a new object will be returned.
		 * @return {Object} The target, or a new generic object with the transform properties applied.
		*/
		decompose (target = {}) {
			// TODO: it would be nice to be able to solve for whether the matrix can be decomposed into only scale/rotation even when scale is negative
			target.x = this.tx;
			target.y = this.ty;
			target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
			target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);

			let skewX = Math.atan2(-this.c, this.d);
			let skewY = Math.atan2(this.b, this.a);

			let delta = Math.abs(1-skewX/skewY);
			if (delta < 0.00001) { // effectively identical, can use rotation:
				target.rotation = skewY/Matrix2D.DEG_TO_RAD;
				if (this.a < 0 && this.d >= 0) {
					target.rotation += (target.rotation <= 0) ? 180 : -180;
				}
				target.skewX = target.skewY = 0;
			} else {
				target.skewX = skewX/Matrix2D.DEG_TO_RAD;
				target.skewY = skewY/Matrix2D.DEG_TO_RAD;
			}
			return target;
		}

		/**
		 * Copies all properties from the specified matrix to this matrix.
		 * @param {easeljs.Matrix2D} matrix The matrix to copy properties from.
		 * @return {easeljs.Matrix2D} This matrix. Useful for chaining method calls.
		 * @chainable
		*/
		copy (matrix) {
			return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
		}

		/**
		 * Returns a clone of the Matrix2D instance.
		 * @return {easeljs.Matrix2D} a clone of the Matrix2D instance.
		 */
		clone () {
			return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
		}

		/**
		 * Returns a string representation of this object.
		 * @return {String} a string representation of the instance.
		 */
		toString () {
			return `[${this.constructor.name} (a=${this.a} b=${this.b} c=${this.c} d=${this.d} tx=${this.tx} ty=${this.ty})]`;
		}

	}

	/**
	 * Multiplier for converting degrees to radians. Used internally by Matrix2D.
	 * @static
	 * @type {Number}
	 * @readonly
	 */
	Matrix2D.DEG_TO_RAD = Math.PI/180;
	/**
	 * An identity matrix, representing a null transformation.
	 * @static
	 * @type {easeljs.Matrix2D}
	 * @readonly
	 */
	Matrix2D.identity = new Matrix2D();

	/**
	 * @license DisplayProps
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * Used for calculating and encapsulating display related properties.
	 * @memberof easeljs
	 * @param {Number} [visible] Visible value.
	 * @param {Number} [alpha] Alpha value.
	 * @param {Number} [shadow] A Shadow instance or null.
	 * @param {Number} [compositeOperation] A compositeOperation value or null.
	 * @param {Number} [matrix] A transformation matrix. Defaults to a new identity matrix.
	 */
	class DisplayProps {

		constructor (visible, alpha, shadow, compositeOperation, matrix) {
			this.setValues(visible, alpha, shadow, compositeOperation, matrix);

			// assigned in the setValues method.
			/**
			 * Property representing the alpha that will be applied to a display object.
			 * @property alpha
			 * @type {Number}
			 */

			/**
			 * Property representing the shadow that will be applied to a display object.
			 * @property shadow
			 * @type {easeljs.Shadow}
			 */

			/**
			 * Property representing the compositeOperation that will be applied to a display object.
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing}
			 * @property compositeOperation
			 * @type {String}
			 */

			/**
			 * Property representing the value for visible that will be applied to a display object.
			 * @property visible
			 * @type {Boolean}
			 */

			/**
			 * The transformation matrix that will be applied to a display object.
			 * @property matrix
			 * @type {easeljs.Matrix2D}
			 */
		}

		/**
		 * Reinitializes the instance with the specified values.
		 * @param {Number} [visible=true] Visible value.
		 * @param {Number} [alpha=1] Alpha value.
		 * @param {Number} [shadow] A Shadow instance or null.
		 * @param {Number} [compositeOperation] A compositeOperation value or null.
		 * @param {Number} [matrix] A transformation matrix. Defaults to an identity matrix.
		 * @return {easeljs.DisplayProps} This instance. Useful for chaining method calls.
		 * @chainable
		*/
		setValues (visible = true, alpha = 1, shadow, compositeOperation, matrix) {
			this.visible = visible;
			this.alpha = alpha;
			this.shadow = shadow;
			this.compositeOperation = compositeOperation;
			this.matrix = matrix || (this.matrix&&this.matrix.identity()) || new Matrix2D();
			return this;
		}

		/**
		 * Appends the specified display properties. This is generally used to apply a child's properties its parent's.
		 * @param {Boolean} visible desired visible value
		 * @param {Number} alpha desired alpha value
		 * @param {easeljs.Shadow} shadow desired shadow value
		 * @param {String} compositeOperation desired composite operation value
		 * @param {easeljs.Matrix2D} [matrix] a Matrix2D instance
		 * @return {easeljs.DisplayProps} This instance. Useful for chaining method calls.
		 * @chainable
		*/
		append (visible, alpha, shadow, compositeOperation, matrix) {
			this.alpha *= alpha;
			this.shadow = shadow || this.shadow;
			this.compositeOperation = compositeOperation || this.compositeOperation;
			this.visible = this.visible && visible;
			matrix&&this.matrix.appendMatrix(matrix);
			return this;
		}

		/**
		 * Prepends the specified display properties. This is generally used to apply a parent's properties to a child's.
		 * For example, to get the combined display properties that would be applied to a child, you could use:
		 *
		 * @example
		 * let o = displayObject;
		 * let props = new DisplayProps();
		 * do {
		 * 	 // prepend each parent's props in turn:
		 * 	 props.prepend(o.visible, o.alpha, o.shadow, o.compositeOperation, o.getMatrix());
		 * } while (o = o.parent);
		 *
		 * @param {Boolean} visible desired visible value
		 * @param {Number} alpha desired alpha value
		 * @param {easeljs.Shadow} shadow desired shadow value
		 * @param {String} compositeOperation desired composite operation value
		 * @param {easeljs.Matrix2D} [matrix] a Matrix2D instance
		 * @return {easeljs.DisplayProps} This instance. Useful for chaining method calls.
		 * @chainable
		*/
		prepend (visible, alpha, shadow, compositeOperation, matrix) {
			this.alpha *= alpha;
			this.shadow = this.shadow || shadow;
			this.compositeOperation = this.compositeOperation || compositeOperation;
			this.visible = this.visible && visible;
			matrix&&this.matrix.prependMatrix(matrix);
			return this;
		}

		/**
		 * Resets this instance and its matrix to default values.
		 * @return {easeljs.DisplayProps} This instance. Useful for chaining method calls.
		 * @chainable
		*/
		identity () {
			this.visible = true;
			this.alpha = 1;
			this.shadow = this.compositeOperation = null;
			this.matrix.identity();
			return this;
		}

		/**
		 * Returns a clone of the DisplayProps instance. Clones the associated matrix.
		 * @return {easeljs.DisplayProps} a clone of the DisplayProps instance.
		 */
		clone () {
			return new DisplayProps(this.alpha, this.shadow, this.compositeOperation, this.visible, this.matrix.clone());
		}

	}

	/**
	 * @license Rectangle
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * Represents a rectangle as defined by the points (x, y) and (x+width, y+height).
	 * Used by {@link easeljs.DisplayObjects#getBounds}.
	 *
	 * @memberof easeljs
	 * @example
	 * let rect = new Rectangle(0, 0, 100, 100);
	 *
	 * @param {Number} [x] X position.
	 * @param {Number} [y] Y position.
	 * @param {Number} [width] The width of the Rectangle.
	 * @param {Number} [height] The height of the Rectangle.
	 */
	class Rectangle {

		constructor (x, y, width, height) {
			this.setValues(x, y, width, height);

			// assigned in the setValues method.
			/**
			 * X position.
			 * @property x
			 * @type {Number}
			 */

			/**
			 * Y position.
			 * @property y
			 * @type {Number}
			 */

			/**
			 * Width.
			 * @property width
			 * @type {Number}
			 */

			/**
			 * Height.
			 * @property height
			 * @type {Number}
			 */
		}

		/**
		 * Sets the specified values on this instance.
		 * @param {Number} [x=0] X position.
		 * @param {Number} [y=0] Y position.
		 * @param {Number} [width=0] The width of the Rectangle.
		 * @param {Number} [height=0] The height of the Rectangle.
		 * @return {easeljs.Rectangle} This instance. Useful for chaining method calls.
		 * @chainable
		*/
		setValues (x = 0, y = 0, width = 0, height = 0) {
			// don't forget to update docs in the constructor if these change:
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			return this;
		}

		/**
		 * Extends the rectangle's bounds to include the described point or rectangle.
		 * @param {Number} x X position of the point or rectangle.
		 * @param {Number} y Y position of the point or rectangle.
		 * @param {Number} [width=0] The width of the rectangle.
		 * @param {Number} [height=0] The height of the rectangle.
		 * @return {easeljs.Rectangle} This instance. Useful for chaining method calls.
		 * @chainable
		*/
		extend (x, y, width = 0, height = 0) {
			if (x+width > this.x+this.width) { this.width = x+width-this.x; }
			if (y+height > this.y+this.height) { this.height = y+height-this.y; }
			if (x < this.x) { this.width += this.x-x; this.x = x; }
			if (y < this.y) { this.height += this.y-y; this.y = y; }
			return this;
		}

		/**
		 * Adds the specified padding to the rectangle's bounds.
		 * @param {Number} top
		 * @param {Number} left
		 * @param {Number} bottom
		 * @param {Number} right
		 * @return {easeljs.Rectangle} This instance. Useful for chaining method calls.
		 * @chainable
		*/
		pad (top, left, bottom, right) {
			this.x -= left;
			this.y -= top;
			this.width += left+right;
			this.height += top+bottom;
			return this;
		}

		/**
		 * Copies all properties from the specified rectangle to this rectangle.
		 * @param {easeljs.Rectangle} rectangle The rectangle to copy properties from.
		 * @return {easeljs.Rectangle} This rectangle. Useful for chaining method calls.
		 * @chainable
		*/
		copy (rect) {
			return this.setValues(rect.x, rect.y, rect.width, rect.height);
		}

		/**
		 * Returns true if this rectangle fully encloses the described point or rectangle.
		 * @param {Number} x X position of the point or rectangle.
		 * @param {Number} y Y position of the point or rectangle.
		 * @param {Number} [width=0] The width of the rectangle.
		 * @param {Number} [height=0] The height of the rectangle.
		 * @return {Boolean} True if the described point or rectangle is contained within this rectangle.
		*/
		contains (x, y, width = 0, height = 0) {
			return (x >= this.x && x+width <= this.x+this.width && y >= this.y && y+height <= this.y+this.height);
		}

		/**
		 * Returns a new rectangle which contains this rectangle and the specified rectangle.
		 * @param {easeljs.Rectangle} rect The rectangle to calculate a union with.
		 * @return {easeljs.Rectangle} A new rectangle describing the union.
		*/
		union (rect) {
			return this.clone().extend(rect.x, rect.y, rect.width, rect.height);
		}

		/**
		 * Returns a new rectangle which describes the intersection (overlap) of this rectangle and the specified rectangle,
		 * or null if they do not intersect.
		 * @param {easeljs.Rectangle} rect The rectangle to calculate an intersection with.
		 * @return {easeljs.Rectangle} A new rectangle describing the intersection or null.
		*/
		intersection (rect) {
			let x1 = rect.x, y1 = rect.y, x2 = x1+rect.width, y2 = y1+rect.height;
			if (this.x > x1) { x1 = this.x; }
			if (this.y > y1) { y1 = this.y; }
			if (this.x + this.width < x2) { x2 = this.x + this.width; }
			if (this.y + this.height < y2) { y2 = this.y + this.height; }
			return (x2 <= x1 || y2 <= y1) ? null : new Rectangle(x1, y1, x2-x1, y2-y1);
		}

		/**
		 * Returns true if the specified rectangle intersects (has any overlap) with this rectangle.
		 * @param {easeljs.Rectangle} rect The rectangle to compare.
		 * @return {Boolean} True if the rectangles intersect.
		*/
		intersects (rect) {
			return (rect.x <= this.x+this.width && this.x <= rect.x+rect.width && rect.y <= this.y+this.height && this.y <= rect.y + rect.height);
		}

		/**
		 * Returns true if the width or height are equal or less than 0.
		 * @return {Boolean} True if the rectangle is empty.
		*/
		isEmpty () {
			return this.width <= 0 || this.height <= 0;
		}

		/**
		 * Returns a clone of the Rectangle instance.
		 * @return {easeljs.Rectangle} a clone of the Rectangle instance.
		 */
		clone () {
			return new Rectangle(this.x, this.y, this.width, this.height);
		}

		/**
		 * Returns a string representation of this object.
		 * @return {String} a string representation of the instance.
		 */
		toString () {
			return `[${this.constructor.name} (x=${this.x} y=${this.y} width=${this.width} height=${this.height})]`;
		}

	}

	/**
	 * @license Filter
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * Base class that all filters should inherit from. Filters need to be applied to objects that have been cached using
	 * the {@link easeljs.DisplayObject#cache} method. If an object changes, please cache it again, or use
	 * {@link easeljs.DisplayObject#updateCache}. Note that the filters must be applied before caching.
	 *
	 * Note that each filter can implement a {@link easeljs.Filter#getBounds} method, which returns the
	 * margins that need to be applied in order to fully display the filter. For example, the {@link easeljs.BlurFilter}
	 * will cause an object to feather outwards, resulting in a margin around the shape.
	 *
	 * <h4>EaselJS Filters</h4>
	 * EaselJS comes with a number of pre-built filters:
	 * <ul>
	 *   <li>{@link easeljs.AlphaMapFilter}: Map a greyscale image to the alpha channel of a display object</li>
	 *   <li>{@link easeljs.AlphaMaskFilter}: Map an image's alpha channel to the alpha channel of a display object</li>
	 *   <li>{@link easeljs.BlurFilter}: Apply vertical and horizontal blur to a display object</li>
	 *   <li>{@link easeljs.ColorFilter}: Color transform a display object</li>
	 *   <li>{@link easeljs.ColorMatrixFilter}: Transform an image using a {{#crossLink "ColorMatrix"}}{{/crossLink}}</li>
	 * </ul>
	 *
	 * @memberof easeljs
	 * @example
	 * shape.filters = [
	 *   new createjs.ColorFilter(0, 0, 0, 1, 255, 0, 0),
	 *   new createjs.BlurFilter(5, 5, 10)
	 * ];
	 * shape.cache(0, 0, 100, 100);
	 */
	class Filter {

		constructor () {
			/**
			 * A flag stating that this filter uses a context draw mode and cannot be batched into imageData processing.
			 * @type {Boolean}
			 * @default false
			 */
			this.usesContext = false;

			/**
			 * Another filter that is required to act as part of this filter and created and managed under the hood.
			 * @private
			 * @type {easeljs.Filter}
			 * @default null
			 */
			this._multiPass = null;

			/**
			 * Pre-processing shader code, will be parsed before being fed in.
			 * This should be based upon StageGL.SHADER_VERTEX_BODY_REGULAR
			 * @virtual
			 * @type {String}
			 * @readonly
			 */
			this.VTX_SHADER_BODY = null;

			/**
			 * Pre-processing shader code, will be parsed before being fed in.
			 * This should be based upon StageGL.SHADER_FRAGMENT_BODY_REGULAR
			 * @virtual
			 * @type {String}
			 * @readonly
			 */
			this.FRAG_SHADER_BODY = null;
		}

		/**
		 * Provides padding values for this filter. That is, how much the filter will extend the visual bounds of an object it is applied to.
		 * @abstract
		 * @param {easeljs.Rectangle} [rect] If specified, the provided Rectangle instance will be expanded by the padding amounts and returned.
		 * @return {easeljs.Rectangle} If a `rect` param was provided, it is returned. If not, either a new rectangle with the padding values, or null if no padding is required for this filter.
		 */
		getBounds (rect) { }

		/**
		 * @virtual
		 * @abstract
		 * @param {WebGLContext} gl The context associated with the stage performing the render.
		 * @param {easeljs.StageGL} stage The stage instance that will be rendering.
		 * @param {ShaderProgram} shaderProgram The compiled shader that is going to be sued to perform the render.
		 */
		shaderParamSetup (gl, stage, shaderProgram) { }

		/**
		 * Applies the filter to the specified context.
		 * @param {CanvasRenderingContext2D} ctx The 2D context to use as the source.
		 * @param {Number} x The x position to use for the source rect.
		 * @param {Number} y The y position to use for the source rect.
		 * @param {Number} width The width to use for the source rect.
		 * @param {Number} height The height to use for the source rect.
		 * @param {CanvasRenderingContext2D} [targetCtx] The 2D context to draw the result to. Defaults to the context passed to ctx.
		 * @param {Number} [targetX] The x position to draw the result to. Defaults to the value passed to x.
		 * @param {Number} [targetY] The y position to draw the result to. Defaults to the value passed to y.
		 * @return {Boolean} If the filter was applied successfully.
		 */
		applyFilter (ctx, x, y, width, height, targetCtx, targetX, targetY) {
			// this is the default behaviour because most filters access pixel data. It is overridden when not needed.
			targetCtx = targetCtx || ctx;
			if (targetX == null) { targetX = x; }
			if (targetY == null) { targetY = y; }
			try {
				let imageData = ctx.getImageData(x, y, width, height);
				if (this._applyFilter(imageData)) {
					targetCtx.putImageData(imageData, targetX, targetY);
					return true;
				}
			} catch (e) {}
			return false;
		}

		/**
		 * Returns a string representation of this object.
		 * @return {String} a string representation of the instance.
		 */
		toString () {
			return `[${this.constructor.name}]`;
		}

		/**
		 * Returns a clone of this Filter instance.
		 * @return {easeljs.Filter} A clone of the current Filter instance.
		 */
		clone () {
			return new Filter();
		}

		/**
		 * @abstract
		 * @param {ImageData} imageData Target ImageData instance.
		 * @return {Boolean}
		 */
		_applyFilter (imageData) { }

	}

	/**
	 * @license BitmapCache
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * The BitmapCache is an internal representation of all the cache properties and logic required in order to "cache"
	 * an object. This information and functionality used to be located on a {@link easeljs.DisplayObject#cache}
	 * method in {@link easeljs.DisplayObject}, but was moved to its own class.
	 *
	 * Caching in this context is purely visual, and will render the DisplayObject out into an image to be used instead
	 * of the object. The actual cache itself is still stored on the target with the {@link easeljs.DisplayObject#cacheCanvas}.
	 *
	 * Working with a singular image like a {@link easeljs.Bitmap}, there is little benefit to performing
	 * a cache operation, as it is already a single image. Caching is best done on containers that have multiple complex
	 * parts that do not change often, so that rendering the image will improve overall rendering speed. A cached object
	 * will not visually update until explicitly told to do so with a call to {@link easeljs.Stage#update},
	 * much like a Stage. If a cache is being updated every frame, it is likely not improving rendering performance.
	 * Caches are best used when updates will be sparse.
	 *
	 * Caching is also a co-requisite for applying filters to prevent expensive filters running constantly without need.
	 * The BitmapCache is also responsible for applying filters to objects, and reads each {@link easeljs.Filter}.
	 * Real-time Filters are not recommended when dealing with a Context2D canvas if performance is a concern. For best
	 * performance and to still allow for some visual effects, use a {{#crossLink "DisplayObject/compositeOperation:property"}}{{/crossLink}}
	 * when possible.
	 *
	 * @memberof easeljs
	 * @extends easeljs.Filter
	 */
	class BitmapCache extends Filter {

		constructor () {
			super();

			/**
			 * Width of the cache relative to the target object.
			 * @protected
			 * @type {Number}
			 * @default undefined
			 */
			this.width = undefined;

			/**
			 * Height of the cache relative to the target object.
			 * @protected
			 * @type {Number}
			 * @default undefined
			 */
			this.height = undefined;

			/**
			 * Horizontal position of the cache relative to the target's origin.
			 * @protected
			 * @type {Number}
			 * @default undefined
			 */
			this.x = undefined;

			/**
			 * Vertical position of the cache relative to target's origin.
			 * @protected
			 * @type {Number}
			 * @default undefined
			 */
			this.y = undefined;

			/**
			 * The internal scale of the cache image, does not affects display size. This is useful to both increase and
			 * decrease render quality. Objects with increased scales are more likely to look good when scaled up. Objects
			 * with decreased scales can save on rendering performance.
			 * @protected
			 * @type {Number}
			 * @default 1
			 */
			this.scale = 1;

			/**
			 * The relative offset of the {@link easeljs.BitmapCache#x} position, used for drawing
			 * into the cache with the correct offsets. Re-calculated every update call before drawing.
			 * @protected
			 * @type {Number}
			 * @default 0
			 */
			this.offX = 0;

			/**
			 * The relative offset of the {@link easeljs.BitmapCache#y} position, used for drawing
			 * into the cache with the correct offsets. Re-calculated every update call before drawing.
			 * @protected
			 * @type {Number}
			 * @default 0
			 */
			this.offY = 0;

			/**
			 * Track how many times the cache has been updated, mostly used for preventing duplicate cacheURLs. This can be
			 * useful to see if a cache has been updated.
			 * @type {Number}
			 * @default 0
			 */
			this.cacheID = 0;

			/**
			 * Relative offset of the x position, used for drawing the cache into other scenes.
			 * Re-calculated every update call before drawing.
			 * @protected
			 * @type {Number}
			 * @default 0
			 * @todo Is this description right? Its the same as offX.
			 */
			this._filterOffX = 0;

			/**
			 * Relative offset of the y position, used for drawing into the cache into other scenes.
			 * Re-calculated every update call before drawing.
			 * @protected
			 * @type {Number}
			 * @default 0
			 * @todo Is this description right? Its the same as offY.
			 */
			this._filterOffY = 0;

			/**
			 * The cacheID when a DataURL was requested.
			 * @protected
			 * @type {Number}
			 * @default 0
			 */
			this._cacheDataURLID = 0;

			/**
			 * The cache's DataURL, generated on-demand using the getter.
			 * @protected
			 * @type {String}
			 * @default null
			 */
			this._cacheDataURL = null;

			/**
			 * Internal tracking of final bounding width, approximately `width*scale;` however, filters can complicate the actual value.
			 * @protected
			 * @type {Number}
			 * @default 0
			 */
			this._drawWidth = 0;

			/**
			 * Internal tracking of final bounding height, approximately `height*scale;` however, filters can complicate the actual value.
			 * @protected
			 * @type {Number}
			 * @default 0
			 */
			this._drawHeight = 0;

			/**
			 * Internal tracking of the last requested bounds, may happen repeadtedly so stored to avoid object creation.
			 * @protected
			 * @type {easeljs.Rectangle}
			 * @default easeljs.Rectangle
			 */
			this._boundRect = new Rectangle();

		}

		/**
		 * Returns the bounds that surround all applied filters. This relies on each filter to describe how it changes bounds.
		 * @param {easeljs.DisplayObject} target The object to check the filter bounds for.
		 * @param {easeljs.Rectangle} [output] Calculated bounds will be applied to this rect.
		 * @return {easeljs.Rectangle}
		 * @static
		 */
		static getFilterBounds (target, output = new Rectangle()) {
			let filters = target.filters;
			let filterCount = filters && filters.length;
			if (!!filterCount <= 0) { return output; }

			for (let i=0; i<filterCount; i++) {
				let f = filters[i];
				if (!f || !f.getBounds) { continue; }
				let test = f.getBounds();
				if (!test) { continue; }
				if (i==0) {
					output.setValues(test.x, test.y, test.width, test.height);
				} else {
					output.extend(test.x, test.y, test.width, test.height);
				}
			}

			return output;
		}

		/**
		 * Directly called via {@link easeljs.DisplayObject#cache}. Creates and sets properties needed
		 * for a cache to function, and performs the initial update.
		 * @param {easeljs.DisplayObject} target The DisplayObject this cache is linked to.
		 * @param {Number} [x=0] The x coordinate origin for the cache region.
		 * @param {Number} [y=0] The y coordinate origin for the cache region.
		 * @param {Number} [width=1] The width of the cache region.
		 * @param {Number} [height=1] The height of the cache region.
		 * @param {Number} [scale=1] The scale at which the cache will be created. For example, if you cache a vector shape
		 * using `myShape.cache(0,0,100,100,2)`, then the resulting cacheCanvas will be 200x200 pixels. This lets you scale
		 * and rotate cached elements with greater fidelity.
		 * @param {Object} [options] When using things like {@link easeljs.StageGL} there may be
		 * extra caching opportunities or requirements.
		 */
		define (target, x = 0, y = 0, width = 1, height = 1, scale = 1, options) {
			if (!target) { throw "No symbol to cache"; }
			this._options = options;
			this._useWebGL = options !== undefined;
			this.target = target;

			this.width = width >= 1 ? width : 1;
			this.height = height >= 1 ? height : 1;
			this.x = x;
			this.y = y;
			this.scale = scale;

			this.update();
		}

		/**
		 * Directly called via {@link easeljs.DisplayObject#updateCache}, but also internally. This
		 * has the dual responsibility of making sure the surface is ready to be drawn to, and performing the draw. For
		 * full details of each behaviour, check the protected functions {@link easeljs.BitmapCache#_updateSurface}
		 * and {@link easeljs.BitmapCache#_drawToCache} respectively.
		 * @param {String} [compositeOperation] The DisplayObject this cache is linked to.
		 */
		update (compositeOperation) {
			if (!this.target) { throw "define() must be called before update()"; }

			let filterBounds = BitmapCache.getFilterBounds(this.target);
			let surface = this.target.cacheCanvas;

			this._drawWidth = Math.ceil(this.width*this.scale) + filterBounds.width;
			this._drawHeight = Math.ceil(this.height*this.scale) + filterBounds.height;

			if (!surface || this._drawWidth != surface.width || this._drawHeight != surface.height) {
				this._updateSurface();
			}

			this._filterOffX = filterBounds.x;
			this._filterOffY = filterBounds.y;
			this.offX = this.x*this.scale + this._filterOffX;
			this.offY = this.y*this.scale + this._filterOffY;

			this._drawToCache(compositeOperation);

			this.cacheID = this.cacheID?this.cacheID+1:1;
		}

		/**
		 * Reset and release all the properties and memory associated with this cache.
		 */
		release () {
			let stage = this.target.stage;
			if (this._useWebGL && this._webGLCache) {
				// if it isn't cache controlled clean up after yourself
				if (!this._webGLCache.isCacheControlled) {
					if (this.__lastRT) { this.__lastRT = undefined; }
					if (this.__rtA) { this._webGLCache._killTextureObject(this.__rtA); }
					if (this.__rtB) { this._webGLCache._killTextureObject(this.__rtB); }
					if (this.target && this.target.cacheCanvas) { this._webGLCache._killTextureObject(this.target.cacheCanvas); }
				}
				// set the context to none and let the garbage collector get the rest when the canvas itself gets removed
				this._webGLCache = false;
			} else if (stage instanceof StageGL) {
				stage.releaseTexture(this.target.cacheCanvas);
			}
			this.target = this.target.cacheCanvas = null;
			this.cacheID = this._cacheDataURLID = this._cacheDataURL = undefined;
			this.width = this.height = this.x = this.y = this.offX = this.offY = 0;
			this.scale = 1;
		}

		/**
		 * Returns a data URL for the cache, or `null` if this display object is not cached.
		 * Uses {@link easeljs.BitmapCache#cacheID} to ensure a new data URL is not generated if the
		 * cache has not changed.
		 * @return {String} The image data url for the cache.
		 */
		getCacheDataURL () {
			let cacheCanvas = this.target && this.target.cacheCanvas;
			if (!cacheCanvas) { return null; }
			if (this.cacheID != this._cacheDataURLID) {
				this._cacheDataURLID = this.cacheID;
				this._cacheDataURL = cacheCanvas.toDataURL?cacheCanvas.toDataURL():null;	// incase function is
			}
			return this._cacheDataURL;
		}

		/**
		 * Use context2D drawing commands to display the cache canvas being used.
		 * @param {CanvasRenderingContext2D} ctx The context to draw into.
		 * @return {Boolean} Whether the draw was handled successfully.
		 */
		draw (ctx) {
			if (!this.target) { return false; }
			ctx.drawImage(
				this.target.cacheCanvas,
				this.x + (this._filterOffX/this.scale),
				this.y + (this._filterOffY/this.scale),
				this._drawWidth/this.scale,
				this._drawHeight/this.scale
			);
			return true;
		}

		/**
		 * Determine the bounds of the shape in local space.
		 * @returns {easeljs.Rectangle}
		 */
		getBounds () {
			const scale = this.scale;
			return this._boundRect.setValue(
				this._filterOffX/scale,
				this._filterOffY/scale,
				this.width/scale,
				this.height/scale
			);
		}

		/**
		 * Basic context2D caching works by creating a new canvas element and setting its physical size. This function will
		 * create and or size the canvas as needed.
		 * @protected
		 */
		_updateSurface () {
			let surface;
			if (!this._useWebGL) {
				surface = this.target.cacheCanvas;
				// create it if it's missing
				if (!surface) {
					surface = this.target.cacheCanvas = window.createjs&&createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");
				}
				// now size it
				surface.width = this._drawWidth;
				surface.height = this._drawHeight;
				// skip the webgl-only updates
				return;
			}

			// create it if it's missing
			if (!this._webGLCache) {
				if (this._options.useGL === "stage") {
					if(!(this.target.stage != null && this.target.stage.isWebGL)) {
						throw `Cannot use 'stage' for cache because the object's parent stage is ${this.target.stage != null ? "non WebGL." : "not set, please addChild to the correct stage."}`;
					}
					this.target.cacheCanvas = true; // will be replaced with RenderTexture, temporary positive value for old "isCached" checks
					this._webGLCache = this.target.stage;
				} else if (this._options.useGL === "new") {
					this.target.cacheCanvas = document.createElement("canvas"); // we can turn off autopurge because we wont be making textures here
					this._webGLCache = new StageGL(this.target.cacheCanvas, {antialias: true, transparent: true, autoPurge: -1});
					this._webGLCache.isCacheControlled = true;    // use this flag to control stage sizing and final output
				} else {
					throw "Invalid option provided to useGL, expected ['stage', 'new', StageGL, undefined], got "+ this._options.useGL;
				}
			}

			// now size render surfaces
			let stageGL = this._webGLCache;
			surface = this.target.cacheCanvas;

			// if we have a dedicated stage we've gotta size it
			if (stageGL.isCacheControlled) {
				surface.width = this._drawWidth;
				surface.height = this._drawHeight;
				stageGL.updateViewport(this._drawWidth, this._drawHeight);
			}
			if (this.target.filters) {
				// with filters we can't tell how many we'll need but the most we'll ever need is two, so make them now
				stageGL.getTargetRenderTexture(this.target, this._drawWidth,this._drawHeight);
				stageGL.getTargetRenderTexture(this.target, this._drawWidth,this._drawHeight);
			} else if (!stageGL.isCacheControlled) {
				// without filters then we only need one RenderTexture, and that's only if its not a dedicated stage
				stageGL.getTargetRenderTexture(this.target, this._drawWidth,this._drawHeight);
			}
		}

		/**
		 * Perform the cache draw out for context 2D now that the setup properties have been performed.
		 * @protected
		 */
		_drawToCache (compositeOperation) {
			let target = this.target;
			let surface = target.cacheCanvas;
			let webGL = this._webGLCache;

			if (!this._useWebGL || !webGL) {
				let ctx = surface.getContext("2d");

				if (!compositeOperation) {
					ctx.clearRect(0, 0, this._drawWidth+1, this._drawHeight+1);
				}

				ctx.save();
				ctx.globalCompositeOperation = compositeOperation;
				ctx.setTransform(this.scale,0,0,this.scale, -this._filterOffX,-this._filterOffY);
				ctx.translate(-this.x, -this.y);
				target.draw(ctx, true);
				ctx.restore();

				if (target.filters && target.filters.length) {
					this._applyFilters(target);
				}
				surface._invalid = true;
				return;
			}

			this._webGLCache.cacheDraw(target, target.filters, this);
			// NOTE: we may of swapped around which element the surface is, so we re-fetch it
			surface = this.target.cacheCanvas;
			surface.width = this._drawWidth;
			surface.height = this._drawHeight;
			surface._invalid = true;
		}

		/**
		 * Work through every filter and apply its individual transformation to it.
		 * @protected
		 */
		_applyFilters () {
			let surface = this.target.cacheCanvas;
			let filters = this.target.filters;

			let w = this._drawWidth;
			let h = this._drawHeight;

			// setup
			let data = surface.getContext("2d").getImageData(0,0, w,h);

			// apply
			let l = filters.length;
			for (let i=0; i<l; i++) {
				filters[i]._applyFilter(data);
			}

			//done
			surface.getContext("2d").putImageData(data, 0,0);
		}

	}

	/**
	 * Functionality injected to {@link easeljs.BitmapCache}. Ensure StageGL is loaded after all other
	 * standard EaselJS classes are loaded but before making any DisplayObject instances for injection to take full effect.
	 * Replaces the context2D cache draw with the option for WebGL or context2D drawing.
	 * If options is set to "true" a StageGL is created and contained on the object for use when rendering a cache.
	 * If options is a StageGL instance it will not create an instance but use the one provided.
	 * If possible it is best to provide the StageGL instance that is a parent to this DisplayObject for performance reasons.
	 * A StageGL cache does not infer the ability to draw objects a StageGL cannot currently draw,
	 * i.e. do not use a WebGL context cache when caching a Shape, Text, etc.
	 *
	 * You can make your own StageGL and have it render to a canvas if you set ".isCacheControlled" to true on your stage.
	 * You may wish to create your own StageGL instance to control factors like background color/transparency, AA, and etc.
	 * You must set "options" to its own stage if you wish to use the fast Render Textures available only to StageGLs.
	 * If you use WebGL cache on a container with Shapes you will have to cache each shape individually before the container,
	 * otherwise the WebGL cache will not render the shapes.
	 *
	 * @name easeljs.BitmapCache#cache
	 *
	 * @example <caption>WebGL cache with 2d context</caption>
	 * let stage = new Stage();
	 * let bmp = new Bitmap(src);
	 * bmp.cache(0, 0, bmp.width, bmp.height, 1, true); // no StageGL to use, so make one
	 * let shape = new Shape();
	 * shape.graphics.clear().fill("red").drawRect(0,0,20,20);
	 * shape.cache(0, 0, 20, 20, 1); // cannot use WebGL cache
	 *
	 * @example <caption>WebGL cache with WebGL context</caption>
	 * let stageGL = new StageGL();
	 * let bmp = new Bitmap(src);
	 * bmp.cache(0, 0, bmp.width, bmp.height, 1, stageGL); // use our StageGL to cache
	 * let shape = new Shape();
	 * shape.graphics.clear().fill("red").drawRect(0,0,20,20);
	 * shape.cache(0, 0, 20, 20, 1); // cannot use WebGL cache
	 *
	 * @param {Number} x The x coordinate origin for the cache region.
	 * @param {Number} y The y coordinate origin for the cache region.
	 * @param {Number} width The width of the cache region.
	 * @param {Number} height The height of the cache region.
	 * @param {Number} [scale=1] The scale at which the cache will be created. For example, if you cache a vector shape using
	 * 	myShape.cache(0,0,100,100,2) then the resulting cacheCanvas will be 200x200 px. This lets you scale and rotate
	 * 	cached elements with greater fidelity.
	 * @param {Boolean | easeljs.StageGL} [options] Select whether to use context 2D, or WebGL rendering, and whether to make a new stage instance or use an existing one.
	 */

	/**
	 * @license DisplayObject
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * DisplayObject is an abstract class that should not be constructed directly. Instead construct subclasses such as
	 * {@link easeljs.Container}, {@link easeljs.Bitmap}, and {@link easeljs.Shape}.
	 * DisplayObject is the base class for all display classes in the EaselJS library. It defines the core properties and
	 * methods that are shared between all display objects, such as transformation properties (x, y, scaleX, scaleY, etc),
	 * caching, and mouse handlers.
	 *
	 * @memberof easeljs
	 * @extends EventDispatcher
	 */
	class DisplayObject extends EventDispatcher {

		constructor () {
			super();

			/**
			 * The alpha (transparency) for this display object. 0 is fully transparent, 1 is fully opaque.
			 * @type {Number}
			 * @default 1
			 */
			this.alpha = 1;

			/**
			 * If a cache is active, this returns the canvas that holds the image of this display object.
			 * Use this to display the result of a cache. This will be a HTMLCanvasElement unless special cache rules have been deliberately enabled for this cache.
			 * @see {@link easeljs.DisplayObject#cache}
			 * @type {HTMLCanvasElement | Object}
			 * @default null
			 * @readonly
			 */
			this.cacheCanvas = null;

			/**
			 * If a cache has been made, this returns the class that is managing the cacheCanvas and its properties.
			 * @see {@link easeljs.BitmapCache}
			 * @type {easeljs.BitmapCache}
			 * @default null
			 * @readonly
			 */
			this.bitmapCache = null;

			/**
			 * Unique ID for this display object. Makes display objects easier for some uses.
			 * @type {Number}
			 */
			this.id = uid();

			/**
			 * Indicates whether to include this object when running mouse interactions. Setting this to `false` for children
			 * of a {@link easeljs.Container} will cause events on the Container to not fire when that child is
			 * clicked. Setting this property to `false` does not prevent the {@link easeljs.Container#getObjectsUnderPoint}
			 * method from returning the child.
			 *
			 * <strong>Note:</strong> In EaselJS 0.7.0, the `mouseEnabled` property will not work properly with nested Containers.
			 *
			 * @type {Boolean}
			 * @default true
			 */
			this.mouseEnabled = true;

			/**
			 * If false, the tick will not run on this display object (or its children). This can provide some performance benefits.
			 * In addition to preventing the {@link core.Ticker#event:tick} event from being dispatched, it will also prevent tick related updates
			 * on some display objects (ex. Sprite & MovieClip frame advancing, DOMElement visibility handling).
			 * @type Boolean
			 * @default true
			 */
			this.tickEnabled = true;

			/**
			 * An optional name for this display object. Included in {@link easeljs.DisplayObject#toString}. Useful for debugging.
			 * @type {String}
			 * @default null
			 */
			this.name = null;

			/**
			 * A reference to the {@link easeljs.Container} or {@link easeljs.Stage} object that
			 * contains this display object, or null if it has not been added to one.
			 * @type {easeljs.Container}
			 * @default null
			 * @readonly
			 */
			this.parent = null;

			/**
			 * The left offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate
			 * around its center, you would set regX and {@link easeljs.DisplayObject#regY} to 50.
			 * @type {Number}
			 * @default 0
			 */
			this.regX = 0;

			/**
			 * The y offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate around
			 * its center, you would set {@link easeljs.DisplayObject#regX} and regY to 50.
			 * @type {Number}
			 * @default 0
			 */
			this.regY = 0;

			/**
			 * The rotation in degrees for this display object.
			 * @type {Number}
			 * @default 0
			 */
			this.rotation = 0;

			/**
			 * The factor to stretch this display object horizontally. For example, setting scaleX to 2 will stretch the display
			 * object to twice its nominal width. To horizontally flip an object, set the scale to a negative number.
			 * @type {Number}
			 * @default 1
			 */
			this.scaleX = 1;

			/**
			 * The factor to stretch this display object vertically. For example, setting scaleY to 0.5 will stretch the display
			 * object to half its nominal height. To vertically flip an object, set the scale to a negative number.
			 * @type {Number}
			 * @default 1
			 */
			this.scaleY = 1;

			/**
			 * The factor to skew this display object horizontally.
			 * @type {Number}
			 * @default 0
			 */
			this.skewX = 0;

			/**
			 * The factor to skew this display object vertically.
			 * @type {Number}
			 * @default 0
			 */
			this.skewY = 0;

			/**
			 * A shadow object that defines the shadow to render on this display object. Set to `null` to remove a shadow. If
			 * null, this property is inherited from the parent container.
			 * @type {easeljs.Shadow}
			 * @default null
			 */
			this.shadow = null;

			/**
			 * Indicates whether this display object should be rendered to the canvas and included when running the Stage
			 * {@link easeljs.Stage#getObjectsUnderPoint} method.
			 * @type {Boolean}
			 * @default true
			 */
			this.visible = true;

			/**
			 * The x (horizontal) position of the display object, relative to its parent.
			 * @type {Number}
			 * @default 0
			 */
			this.x = 0;

			/**
			 * The y (vertical) position of the display object, relative to its parent.
			 * @type {Number}
			 * @default 0
			 */
			this.y = 0;

			/**
			 * If set, defines the transformation for this display object, overriding all other transformation properties
			 * (x, y, rotation, scale, skew).
			 * @type {easeljs.Matrix2D}
			 * @default null
			 */
			this.transformMatrix = null;

			/**
			 * The composite operation indicates how the pixels of this display object will be composited with the elements
			 * behind it. If `null`, this property is inherited from the parent container.
			 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing "WHATWG spec on compositing"}
			 * @type {String}
			 * @default null
			 */
			this.compositeOperation = null;

			/**
			 * Indicates whether the display object should be drawn to a whole pixel when {@link easeljs.Stage#snapToPixelEnabled} is true.
			 * To enable/disable snapping on whole categories of display objects, set this value on the prototype (Ex. Text.prototype.snapToPixel = true).
			 * @type {Boolean}
			 * @default true
			 */
			this.snapToPixel = true;

			/**
			 * An array of Filter objects to apply to this display object. Filters are only applied / updated when {@link easeljs.DisplayObject#cache}
			 * or {@link easeljs.DisplayObject#updateCache} is called on the display object, and only apply to the area that is cached.
			 * @type {Array<easeljs.Filter>}
			 * @default null
			 */
			this.filters = null;

			/**
			 * A Shape instance that defines a vector mask (clipping path) for this display object.  The shape's transformation
			 * will be applied relative to the display object's parent coordinates (as if it were a child of the parent).
			 * @type {easeljs.Shape}
			 * @default null
			 */
			this.mask = null;

			/**
			 * A display object that will be tested when checking mouse interactions or testing {@link easeljs.Container#getObjectsUnderPoint}.
			 * The hit area will have its transformation applied relative to this display object's coordinate space (as though
			 * the hit test object were a child of this display object and relative to its regX/Y). The hitArea will be tested
			 * using only its own `alpha` value regardless of the alpha value on the target display object, or the target's
			 * ancestors (parents).
			 *
			 * If set on a {@link easeljs.Container}, children of the Container will not receive mouse events.
			 * This is similar to setting {@link easeljs.DisplayObject#mouseChildren} to false.
			 *
			 * Note that hitArea is NOT currently used by the `hitTest()` method, nor is it supported for {@link easeljs.Stage}.
			 *
			 * @type {easeljs.DisplayObject}
			 * @default null
			 */
			this.hitArea = null;

			/**
			 * A CSS cursor (ex. "pointer", "help", "text", etc) that will be displayed when the user hovers over this display
			 * object. You must enable mouseover events using the {@link easeljs.Stage#enableMouseOver} method to
			 * use this property. Setting a non-null cursor on a Container will override the cursor set on its descendants.
			 *
			 * @type {String}
			 * @default null
			 */
			this.cursor = null;

			/**
			 * @protected
			 * @type {easeljs.DisplayProps}
			 */
			this._props = new DisplayProps();

			/**
			 * @protected
			 * @type {easeljs.Rectangle}
			 */
			this._rectangle = new Rectangle();

			/**
			 * @protected
			 * @type {easeljs.Rectangle}
			 * @default null
			 */
			this._bounds = null;

			/**
			 * Where StageGL should look for required display properties, matters only for leaf display objects. Containers
			 * or cached objects won't use this property, it's for native display of terminal elements.
			 * @protected
			 * @type {Number}
			 * @default 0
			 */
			this._webGLRenderStyle = DisplayObject._StageGL_NONE;
		}

		/**
		 * Returns the {@link easeljs.Stage} instance that this display object will be rendered on, or null if it has not been added to one.
		 * @type {Stage}
		 * @readonly
		 */
		get stage () {
			// uses dynamic access to avoid circular dependencies;
			let o = this;
			while (o.parent) { o = o.parent; }
			if (/^\[Stage(GL)?(\s\(name=\w+\))?\]$/.test(o.toString())) { return o; }
			return null;
		}

		/**
		 * Set both the {@link easeljs.DisplayObject#scaleX} and the {@link easeljs.DisplayObject#scaleY} property to the same value.
		 * Note that when you get the value, if the `scaleX` and `scaleY` are different values, it will return only the `scaleX`.
		 * @type {Number}
		 * @default 1
		 */
		set scale (value) { this.scaleX = this.scaleY = value; }
		get scale () { return this.scaleX; }

		/**
		 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
		 * This does not account for whether it would be visible within the boundaries of the stage.
		 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
		 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
		 */
		isVisible () {
			return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
		}

		/**
		 * Alias for drawCache(). Used by grandchildren (or deeper) in their draw method to directly
		 * call {@link easeljs.DisplayObject#drawCache}, bypassing their parent(s).
		 *
		 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
		 * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache. For example,
		 * used for drawing the cache (to prevent it from simply drawing an existing cache back into itself).
		 * @return {Boolean}
		 */
		draw (ctx, ignoreCache = false) {
			return this.drawCache(ctx, ignoreCache);
		}

		/**
		 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
		 * Returns `true` if the draw was handled (useful for overriding functionality).
		 *
		 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
		 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
		 * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache. For example,
		 * used for drawing the cache (to prevent it from simply drawing an existing cache back into itself).
		 * @return {Boolean}
		 */
		drawCache (ctx, ignoreCache = false) {
			let cache = this.bitmapCache;
			if (cache && !ignoreCache) {
				return cache.draw(ctx);
			}
			return false;
		}

		/**
		 * Applies this display object's transformation, alpha, globalCompositeOperation, clipping path (mask), and shadow
		 * to the specified context. This is typically called prior to {@link easeljs.DisplayObject#draw}.
		 * @param {CanvasRenderingContext2D} ctx The canvas 2D to update.
		 */
		updateContext (ctx) {
			let o=this, mask=o.mask, mtx=o._props.matrix;

			if (mask && mask.graphics && !mask.graphics.isEmpty()) {
				mask.getMatrix(mtx);
				ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);

				mask.graphics.drawAsPath(ctx);
				ctx.clip();

				mtx.invert();
				ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
			}

			this.getMatrix(mtx);
			let tx = mtx.tx, ty = mtx.ty;
			if (DisplayObject._snapToPixelEnabled && o.snapToPixel) {
				tx = tx + (tx < 0 ? -0.5 : 0.5) | 0;
				ty = ty + (ty < 0 ? -0.5 : 0.5) | 0;
			}
			ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, tx, ty);
			ctx.globalAlpha *= o.alpha;
			if (o.compositeOperation) { ctx.globalCompositeOperation = o.compositeOperation; }
			if (o.shadow) { this._applyShadow(ctx, o.shadow); }
		}

		/**
		 * Draws the display object into a new element, which is then used for subsequent draws. Intended for complex content
		 * that does not change frequently (ex. a Container with many children that do not move, or a complex vector Shape),
		 * this can provide for much faster rendering because the content does not need to be re-rendered each tick. The
		 * cached display object can be moved, rotated, faded, etc freely, however if its content changes, you must manually
		 * update the cache by calling `updateCache()` again. You must specify the cached area via the x, y, w,
		 * and h parameters. This defines the rectangle that will be rendered and cached using this display object's coordinates.
		 *
		 * Note that filters need to be defined <em>before</em> the cache is applied or you will have to call updateCache after
		 * application. Check out the {@link easeljs.Filter} class for more information. Some filters
		 * (ex. {@link easeljs.BlurFilter}) may not work as expected in conjunction with the scale param.
		 *
		 * Usually, the resulting cacheCanvas will have the dimensions width*scale by height*scale, however some filters (ex. BlurFilter)
		 * will add padding to the canvas dimensions.
		 *
		 * Actual implementation of the caching mechanism can change with a {@link easeljs.StageGL} and so
		 * all caching and filter behaviour has been moved to the {@link easeljs.BitmapCache}
		 *
		 * @example
		 * // If you defined a Shape that drew a circle at 0, 0 with a radius of 25:
		 * var shape = new createjs.Shape();
		 * shape.graphics.beginFill("#ff0000").drawCircle(0, 0, 25);
		 * shape.cache(-25, -25, 50, 50);
		 *
		 * @param {Number} x The x coordinate origin for the cache region.
		 * @param {Number} y The y coordinate origin for the cache region.
		 * @param {Number} width The width of the cache region.
		 * @param {Number} height The height of the cache region.
		 * @param {Number} [scale=1] The scale at which the cache will be created. For example, if you cache a vector shape using
		 * 	myShape.cache(0,0,100,100,2) then the resulting cacheCanvas will be 200x200 px. This lets you scale and rotate
		 * 	cached elements with greater fidelity. Default is 1.
		 * @param {Object} [options] When using alternate displays there may be extra caching opportunities or needs.
		 */
		cache (x, y, width, height, scale = 1, options) {
			if (!this.bitmapCache) {
				this.bitmapCache = new BitmapCache();
			}
			this.bitmapCache.define(this, x, y, width, height, scale, options);
		}

		/**
		 * Redraws the display object to its cache. Calling updateCache without an active cache will throw an error.
		 * If compositeOperation is null the current cache will be cleared prior to drawing. Otherwise the display object
		 * will be drawn over the existing cache using the specified compositeOperation.
		 *
		 * Actual implementation of the caching mechanism can change with a {@link easeljs.StageGL} and so
		 * all caching and filter behaviour has been moved to the {@link easeljs.BitmapCache}
		 *
		 * @example
		 * // clear current graphics
		 * shapeInstance.clear();
		 * // draw new instructions
		 * shapeInstance.setStrokeStyle(3).beginStroke("#FF0000").moveTo(100, 100).lineTo(200,200);
		 * // update cache, drawing new line on top of old one
		 * shapeInstance.updateCache();
		 *
		 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing "WHATWG spec on compositing"}
		 * @param {String} compositeOperation The compositeOperation to use, or null to clear the cache and redraw it.
		 */
		updateCache (compositeOperation) {
			if (!this.bitmapCache) {
				throw "No cache found. cache() must be called before updateCache()";
			}
			this.bitmapCache.update(compositeOperation);
		}

		/**
		 * Clears the current cache.
		 * @see {@link easeljs.DisplayObject.#cache}
		 */
		uncache () {
			if (this.bitmapCache) {
				this.bitmapCache.release();
				this.bitmapCache = undefined;
			}
		}

		/**
		 * Returns a data URL for the cache, or null if this display object is not cached.
		 * Only generated if the cache has changed, otherwise returns last result.
		 * @return {String} The image data url for the cache.
		 */
		getCacheDataURL () {
			return this.bitmapCache ? this.bitmapCache.getDataURL() : null;
		}

		/**
		 * Transforms the specified x and y position from the coordinate space of the display object
		 * to the global (stage) coordinate space. For example, this could be used to position an HTML label
		 * over a specific point on a nested display object. Returns a Point instance with x and y properties
		 * correlating to the transformed coordinates on the stage.
		 *
		 * @example
		 * displayObject.x = 300;
		 * displayObject.y = 200;
		 * stage.addChild(displayObject);
		 * let point = displayObject.localToGlobal(100, 100);
		 * // Results in x=400, y=300
		 *
		 * @param {Number} x The x position in the source display object to transform.
		 * @param {Number} y The y position in the source display object to transform.
		 * @param {easeljs.Point | Object} [pt=Point] An object to copy the result into. If omitted a new Point object with x/y properties will be returned.
		 * @return {easeljs.Point} A Point instance with x and y properties correlating to the transformed coordinates
		 * on the stage.
		 */
		localToGlobal (x, y, pt = new Point()) {
			return this.getConcatenatedMatrix(this._props.matrix).transformPoint(x, y, pt);
		}

		/**
		 * Transforms the specified x and y position from the global (stage) coordinate space to the
		 * coordinate space of the display object. For example, this could be used to determine
		 * the current mouse position within the display object. Returns a Point instance with x and y properties
		 * correlating to the transformed position in the display object's coordinate space.
		 *
		 * @example
		 * displayObject.x = 300;
		 * displayObject.y = 200;
		 * stage.addChild(displayObject);
		 * let point = displayObject.globalToLocal(100, 100);
		 * // Results in x=-200, y=-100
		 *
		 * @param {Number} x The x position on the stage to transform.
		 * @param {Number} y The y position on the stage to transform.
		 * @param {easeljs.Point | Object} [pt=Point] An object to copy the result into. If omitted a new Point object with x/y properties will be returned.
		 * @return {easeljs.Point} A Point instance with x and y properties correlating to the transformed position in the
		 * display object's coordinate space.
		 */
		globalToLocal (x, y, pt = new Point()) {
			return this.getConcatenatedMatrix(this._props.matrix).invert().transformPoint(x, y, pt);
		}

		/**
		 * Transforms the specified x and y position from the coordinate space of this display object to the coordinate
		 * space of the target display object. Returns a Point instance with x and y properties correlating to the
		 * transformed position in the target's coordinate space. Effectively the same as using the following code with
		 * {@link easeljs.DisplayObject#localToGlobal} and {@link easeljs.DisplayObject#globalToLocal}.
		 *
		 * @example
		 * // long way
		 * let pt = this.localToGlobal(x, y);
		 * pt = target.globalToLocal(pt.x, pt.y);
		 * // shorthand
		 * let pt = this.localToLocal(x, y, target);
		 *
		 * @param {Number} x The x position in the source display object to transform.
		 * @param {Number} y The y position on the source display object to transform.
		 * @param {easeljs.DisplayObject} target The target display object to which the coordinates will be transformed.
		 * @param {easeljs.Point | Object} [pt] An object to copy the result into. If omitted a new Point object with x/y properties will be returned.
		 * @return {easeljs.Point} Returns a Point instance with x and y properties correlating to the transformed position
		 * in the target's coordinate space.
		 */
		localToLocal (x, y, target, pt) {
			pt = this.localToGlobal(x, y, pt);
			return target.globalToLocal(pt.x, pt.y, pt);
		}

		/**
		 * Shortcut method to quickly set the transform properties on the display object. All parameters are optional.
		 * Omitted parameters will have the default value set.
		 *
		 * @example
		 * displayObject.setTransform(100, 100, 2, 2);
		 *
		 * @param {Number} [x=0] The horizontal translation (x position) in pixels
		 * @param {Number} [y=0] The vertical translation (y position) in pixels
		 * @param {Number} [scaleX=1] The horizontal scale, as a percentage of 1
		 * @param {Number} [scaleY=1] the vertical scale, as a percentage of 1
		 * @param {Number} [rotation=0] The rotation, in degrees
		 * @param {Number} [skewX=0] The horizontal skew factor
		 * @param {Number} [skewY=0] The vertical skew factor
		 * @param {Number} [regX=0] The horizontal registration point in pixels
		 * @param {Number} [regY=0] The vertical registration point in pixels
		 * @return {easeljs.DisplayObject} Returns this instance. Useful for chaining commands.
		*/
		setTransform (x=0, y=0, scaleX=1, scaleY=1, rotation=0, skewX=0, skewY=0, regX=0, regY=0) {
			this.x = x;
			this.y = y;
			this.scaleX = scaleX;
			this.scaleY = scaleY;
			this.rotation = rotation;
			this.skewX = skewX;
			this.skewY = skewY;
			this.regX = regX;
			this.regY = regY;
			return this;
		}

		/**
		 * Returns a matrix based on this object's current transform.
		 * @param {easeljs.Matrix2D} [matrix] A Matrix2D object to populate with the calculated values. If null, a new Matrix object is returned.
		 * @return {easeljs.Matrix2D} A matrix representing this display object's transform.
		 */
		getMatrix (matrix) {
			let o = this, mtx = matrix&&matrix.identity() || new Matrix2D();
			return o.transformMatrix ?  mtx.copy(o.transformMatrix) : mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
		}

		/**
		 * Generates a Matrix2D object representing the combined transform of the display object and all of its
		 * parent Containers up to the highest level ancestor (usually the {@link easeljs.Stage}). This can
		 * be used to transform positions between coordinate spaces, such as with {@link easeljs.DisplayObject#localToGlobal}
		 * and {@link easeljs.DisplayObject#globalToLocal}.
		 *
		 * @param {easeljs.Matrix2D} [matrix] A Matrix2D object to populate with the calculated values. If null, a new Matrix2D object is returned.
		 * @return {easeljs.Matrix2D} The combined matrix.
		 */
		getConcatenatedMatrix (matrix) {
			let o = this, mtx = this.getMatrix(matrix);
			while (o = o.parent) {
				mtx.prependMatrix(o.getMatrix(o._props.matrix));
			}
			return mtx;
		}

		/**
		 * Generates a DisplayProps object representing the combined display properties of the  object and all of its
		 * parent Containers up to the highest level ancestor (usually the {@link easeljs.Stage}).
		 * @param {easeljs.DisplayProps} [props] A DisplayProps object to populate with the calculated values. If null, a new DisplayProps object is returned.
		 * @return {easeljs.DisplayProps} The combined display properties.
		 */
		getConcatenatedDisplayProps (props) {
			props = props ? props.identity() : new DisplayProps();
			let o = this, mtx = o.getMatrix(props.matrix);
			do {
				props.prepend(o.visible, o.alpha, o.shadow, o.compositeOperation);

				// we do this to avoid problems with the matrix being used for both operations when o._props.matrix is passed in as the props param.
				// this could be simplified (ie. just done as part of the prepend above) if we switched to using a pool.
				if (o != this) { mtx.prependMatrix(o.getMatrix(o._props.matrix)); }
			} while (o = o.parent);
			return props;
		}

		/**
		 * Tests whether the display object intersects the specified point in local coordinates (ie. draws a pixel with alpha > 0 at
		 * the specified position). This ignores the alpha, shadow, hitArea, mask, and compositeOperation of the display object.
		 *
		 * Please note that shape-to-shape collision is not currently supported by EaselJS.
		 *
		 * @example
		 * stage.addEventListener("stagemousedown", event => {
		 *   let hit = shape.hitTest(event.stageX, event.stageY);
		 *   // hit == true when shape is clicked
		 * });
		 *
		 * @param {Number} x The x position to check in the display object's local coordinates.
		 * @param {Number} y The y position to check in the display object's local coordinates.
		 * @return {Boolean} A Boolean indicating whether a visible portion of the DisplayObject intersect the specified
		 * local Point.
		*/
		hitTest (x, y) {
			let ctx = DisplayObject._hitTestContext;
			ctx.setTransform(1, 0, 0, 1, -x, -y);
			this.draw(ctx);

			let hit = this._testHit(ctx);
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, 2, 2);
			return hit;
		}

		/**
		 * Provides a chainable shortcut method for setting a number of properties on the instance.
		 *
		 * @example
		 * let graphics = new Graphics().beginFill("#ff0000").drawCircle(0, 0, 25);
		 * let shape = stage.addChild(new Shape()).set({ graphics, x: 100, y: 100, alpha: 0.5 });
		 *
		 * @param {Object} props A generic object containing properties to copy to the DisplayObject instance.
		 * @return {easeljs.DisplayObject} Returns the instance the method is called on (useful for chaining calls.)
		 * @chainable
		*/
		set (props) {
			for (let n in props) { this[n] = props[n]; }
			return this;
		}

		/**
		 * Returns a rectangle representing this object's bounds in its local coordinate system (ie. with no transformation).
		 * Objects that have been cached will return the bounds of the cache.
		 *
		 * Not all display objects can calculate their own bounds (ex. Shape). For these objects, you can use
		 * {@link easeljs.DisplayObject#setBounds} so that they are included when calculating Container bounds.
		 *
		 * <table>
		 * 	<tr><td><b>All</b></td><td>
		 * 		All display objects support setting bounds manually using setBounds(). Likewise, display objects that
		 * 		have been cached using cache() will return the bounds of their cache. Manual and cache bounds will override
		 * 		the automatic calculations listed below.
		 * 	</td></tr>
		 * 	<tr><td><b>Bitmap</b></td><td>
		 * 		Returns the width and height of the sourceRect (if specified) or image, extending from (x=0,y=0).
		 * 	</td></tr>
		 * 	<tr><td><b>Sprite</b></td><td>
		 * 		Returns the bounds of the current frame. May have non-zero x/y if a frame registration point was specified
		 * 		in the spritesheet data. See also {@link easeljs.SpriteSheet#getFrameBounds}
		 * 	</td></tr>
		 * 	<tr><td><b>Container</b></td><td>
		 * 		Returns the aggregate (combined) bounds of all children that return a non-null value from getBounds().
		 * 	</td></tr>
		 * 	<tr><td><b>Shape</b></td><td>
		 * 		Does not currently support automatic bounds calculations. Use setBounds() to manually define bounds.
		 * 	</td></tr>
		 * 	<tr><td><b>Text</b></td><td>
		 * 		Returns approximate bounds. Horizontal values (x/width) are quite accurate, but vertical values (y/height) are
		 * 		not, especially when using textBaseline values other than "top".
		 * 	</td></tr>
		 * 	<tr><td><b>BitmapText</b></td><td>
		 * 		Returns approximate bounds. Values will be more accurate if spritesheet frame registration points are close
		 * 		to (x=0,y=0).
		 * 	</td></tr>
		* </table>
		 *
		 * @example
		 * /* Bounds can be expensive to calculate for some objects (ex. text, or containers with many children), and
		 * are recalculated each time you call getBounds(). You can prevent recalculation on static objects by setting the
		 * bounds explicitly. *\/
		 * let bounds = obj.getBounds();
		 * obj.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
		 * // getBounds will now use the set values, instead of recalculating
		 *
		 * @example
		 * // To reduce memory impact, the returned Rectangle instance may be reused internally
		 * let bounds = obj.getBounds().clone();
		 * // OR:
		 * rect.copy(obj.getBounds());
		 *
		 * @return {easeljs.Rectangle} A Rectangle instance representing the bounds, or null if bounds are not available for this object.
		 */
		getBounds () {
			if (this._bounds) { return this._rectangle.copy(this._bounds); }
			let cacheCanvas = this.cacheCanvas;
			if (cacheCanvas) {
				let scale = this._cacheScale;
				return this._rectangle.setValues(this._cacheOffsetX, this._cacheOffsetY, cacheCanvas.width/scale, cacheCanvas.height/scale);
			}
			return null;
		}

		/**
		 * Returns a rectangle representing this object's bounds in its parent's coordinate system (ie. with transformations applied).
		 * Objects that have been cached will return the transformed bounds of the cache.
		 *
		 * Not all display objects can calculate their own bounds (ex. Shape). For these objects, you can use
		 * {@link easeljs.DisplayObject#setBounds} so that they are included when calculating Container bounds.
		 *
		 * To reduce memory impact, the returned Rectangle instance may be reused internally; clone the instance or copy its
		 * values if you need to retain it.
		 *
		 * Container instances calculate aggregate bounds for all children that return bounds via getBounds.
		 * @return {easeljs.Rectangle} A Rectangle instance representing the bounds, or null if bounds are not available for this object.
		 */
		getTransformedBounds () {
			return this._getBounds();
		}

		/**
		 * Allows you to manually specify the bounds of an object that either cannot calculate their own bounds (ex. Shape &
		 * Text) for future reference, or so the object can be included in Container bounds. Manually set bounds will always
		 * override calculated bounds.
		 *
		 * The bounds should be specified in the object's local (untransformed) coordinates. For example, a Shape instance
		 * with a 25px radius circle centered at 0,0 would have bounds of (-25, -25, 50, 50).
		 *
		 * @param {Number} x The x origin of the bounds. Pass null to remove the manual bounds.
		 * @param {Number} y The y origin of the bounds.
		 * @param {Number} width The width of the bounds.
		 * @param {Number} height The height of the bounds.
		 */
		setBounds (x, y, width, height) {
			if (x == null) { this._bounds = null; }
			this._bounds = (this._bounds || new Rectangle()).setValues(x, y, width, height);
		}

		/**
		 * Returns a clone of this DisplayObject. Some properties that are specific to this instance's current context are
		 * reverted to their defaults (for example .parent). Caches are not maintained across clones, and some elements
		 * are copied by reference (masks, individual filter instances, hit area)
		 *
		 * @return {easeljs.DisplayObject} A clone of the current DisplayObject instance.
		 */
		clone () {
			return this._cloneProps(new DisplayObject());
		}

		/**
		 * Returns a string representation of this object.
		 * @return {String} a string representation of the instance.
		 */
		toString () {
			return `[${this.constructor.name}${this.name ? ` (name=${this.name})` : ""}]`;
		}

		/**
		 * @protected
		 * @param {easeljs.DisplayObject} o The DisplayObject instance which will have properties from the current DisplayObject
		 * instance copied into.
		 * @return {easeljs.DisplayObject} o
		 */
		_cloneProps (o) {
			o.alpha = this.alpha;
			o.mouseEnabled = this.mouseEnabled;
			o.tickEnabled = this.tickEnabled;
			o.name = this.name;
			o.regX = this.regX;
			o.regY = this.regY;
			o.rotation = this.rotation;
			o.scaleX = this.scaleX;
			o.scaleY = this.scaleY;
			o.shadow = this.shadow;
			o.skewX = this.skewX;
			o.skewY = this.skewY;
			o.visible = this.visible;
			o.x  = this.x;
			o.y = this.y;
			o.compositeOperation = this.compositeOperation;
			o.snapToPixel = this.snapToPixel;
			o.filters = this.filters==null?null:this.filters.slice(0);
			o.mask = this.mask;
			o.hitArea = this.hitArea;
			o.cursor = this.cursor;
			o._bounds = this._bounds;
			return o;
		}

		/**
		 * @protected
		 * @param {CanvasRenderingContext2D} ctx
		 * @param {easeljs.Shadow} [shadow=Shadow]
		 */
		_applyShadow (ctx, shadow = Shadow.identity) {
			shadow = shadow;
			ctx.shadowColor = shadow.color;
			ctx.shadowOffsetX = shadow.offsetX;
			ctx.shadowOffsetY = shadow.offsetY;
			ctx.shadowBlur = shadow.blur;
		}

		/**
		 * @protected
		 * @param {Object} evtObj An event object that will be dispatched to all tick listeners. This object is reused between dispatchers to reduce construction & GC costs.
		 */
		_tick (evtObj) {
			// because tick can be really performance sensitive, check for listeners before calling dispatchEvent.
			let ls = this._listeners;
			if (ls && ls["tick"]) {
				// reset & reuse the event object to avoid construction / GC costs:
				evtObj.target = null;
				evtObj.propagationStopped = evtObj.immediatePropagationStopped = false;
				this.dispatchEvent(evtObj);
			}
		}

		/**
		 * @protected
		 * @param {CanvasRenderingContext2D} ctx
		 * @return {Boolean}
		 */
		_testHit (ctx) {
			try {
				return ctx.getImageData(0, 0, 1, 1).data[3] > 1;
			} catch (e) {
				if (!DisplayObject.suppressCrossDomainErrors) {
					throw "An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images.";
				}
				return false;
			}
		}

		/**
		 * @protected
		 * @param {easeljs.Matrix2D} matrix
		 * @param {Boolean} ignoreTransform If true, does not apply this object's transform.
		 * @return {easeljs.Rectangle}
		 */
		_getBounds (matrix, ignoreTransform) {
			return this._transformBounds(this.getBounds(), matrix, ignoreTransform);
		}

		/**
		 * @protected
		 * @param {easeljs.Rectangle} bounds
		 * @param {easeljs.Matrix2D} matrix
		 * @param {Boolean} ignoreTransform
		 * @return {easeljs.Rectangle}
		 */
		_transformBounds (bounds, matrix, ignoreTransform) {
			if (!bounds) { return bounds; }
			let { x, y, width, height } = bounds;
			let mtx = this._props.matrix;
			mtx = ignoreTransform ? mtx.identity() : this.getMatrix(mtx);

			if (x || y) { mtx.appendTransform(0,0,1,1,0,0,0,-x,-y); } // TODO: simplify this.
			if (matrix) { mtx.prependMatrix(matrix); }

			let x_a = width*mtx.a, x_b = width*mtx.b;
			let y_c = height*mtx.c, y_d = height*mtx.d;
			let tx = mtx.tx, ty = mtx.ty;

			let minX = tx, maxX = tx, minY = ty, maxY = ty;

			if ((x = x_a + tx) < minX) { minX = x; } else if (x > maxX) { maxX = x; }
			if ((x = x_a + y_c + tx) < minX) { minX = x; } else if (x > maxX) { maxX = x; }
			if ((x = y_c + tx) < minX) { minX = x; } else if (x > maxX) { maxX = x; }

			if ((y = x_b + ty) < minY) { minY = y; } else if (y > maxY) { maxY = y; }
			if ((y = x_b + y_d + ty) < minY) { minY = y; } else if (y > maxY) { maxY = y; }
			if ((y = y_d + ty) < minY) { minY = y; } else if (y > maxY) { maxY = y; }

			return bounds.setValues(minX, minY, maxX-minX, maxY-minY);
		}

		/**
		 * Indicates whether the display object has any mouse event listeners or a cursor.
		 * @protected
		 * @return {Boolean}
		 */
		_hasMouseEventListener () {
			let evts = DisplayObject._MOUSE_EVENTS;
			for (let i=0, l=evts.length; i<l; i++) {
				if (this.hasEventListener(evts[i])) { return true; }
			}
			return !!this.cursor;
		}

	}

	{
		let canvas = window.createjs && createjs.createCanvas?createjs.createCanvas():document.createElement("canvas"); // prevent errors on load in browsers without canvas.
		if (canvas.getContext) {
			/**
			 * @type {HTMLCanvasElement | Object}
			 * @static
			 */
			DisplayObject._hitTestCanvas = canvas;
			/**
			 * @type {CanvasRenderingContext2D}
			 * @static
			 */
			DisplayObject._hitTestContext = canvas.getContext("2d");
			canvas.width = canvas.height = 1;
		}
	}

	/**
	 * Listing of mouse event names. Used in _hasMouseEventListener.
	 * @static
	 * @type {Array<String>}
	 * @readonly
	 */
	DisplayObject._MOUSE_EVENTS = ["click","dblclick","mousedown","mouseout","mouseover","pressmove","pressup","rollout","rollover"];

	/**
	 * Suppresses errors generated when using features like hitTest, mouse events, and {{#crossLink "getObjectsUnderPoint"}}{{/crossLink}}
	 * with cross domain content.
	 * @static
	 * @type {Boolean}
	 * @default false
	 */
	DisplayObject.suppressCrossDomainErrors = false;

	/**
	 * @static
	 * @type {Boolean}
	 * @default false
	 */
	DisplayObject.snapToPixelEnabled = false;

	/**
	 * Enum like property for determining StageGL render lookup, i.e. where to expect properties.
	 * @static
	 * @type {Number}
	 */
	DisplayObject._StageGL_NONE = 0;

	/**
	 * Enum like property for determining StageGL render lookup, i.e. where to expect properties.
	 * @static
	 * @type {Number}
	 */
	DisplayObject._StageGL_SPRITE = 1;

	/**
	 * Enum like property for determining StageGL render lookup, i.e. where to expect properties.
	 * @static
	 * @type {Number}
	 */
	DisplayObject._StageGL_BITMAP = 2;

	/**
	 * Dispatched when the user presses their left mouse button over the display object.
	 * @see {@link easeljs.MouseEvent}
	 * @event easeljs.DisplayObject#mousedown
	 * @since 0.6.0
	 */

	/**
	 * Dispatched when the user presses their left mouse button and then releases it while over the display object.
	 * @see {@link easeljs.MouseEvent}
	 * @event easeljs.DisplayObject#click
	 * @since 0.6.0
	 */

	/**
	 * Dispatched when the user double clicks their left mouse button over this display object.
	 * @see {@link easeljs.MouseEvent}
	 * @event easeljs.DisplayObject#dblclick
	 * @since 0.6.0
	 */

	/**
	 * Dispatched when the user's mouse enters this display object. This event must be enabled using
	 * {@link easeljs.Stage#enableMouseOver}.
	 * @see {@link easeljs.DisplayObject#event:rollover}
	 * @see {@link easeljs.MouseEvent}
	 * @event easeljs.DisplayObject#mouseover
	 * @since 0.6.0
	 */

	/**
	 * Dispatched when the user's mouse leaves this display object. This event must be enabled using
	 * {@link easeljs.Stage#enableMouseOver}.
	 * @see {@link easeljs.DisplayObject#event:rollout}
	 * @see {@link easeljs.MouseEvent}
	 * @event easeljs.DisplayObject#mouseout
	 * @since 0.6.0
	 */

	/**
	 * This event is similar to {@link easeljs.DisplayObject#event:mouseover}, with the following
	 * differences: it does not bubble, and it considers {@link easeljs.Container} instances as an
	 * aggregate of their content.
	 *
	 * For example, myContainer contains two overlapping children: shapeA and shapeB. The user moves their mouse over
	 * shapeA and then directly on to shapeB. With a listener for {@link easeljs.DisplayObject#event:mouseover} on
	 * myContainer, two events would be received, each targeting a child element:
	 * <ol>
	 *   <li>when the mouse enters shapeA (target=shapeA)</li>
	 *   <li>when the mouse enters shapeB (target=shapeB)</li>
	 * </ol>
	 * However, with a listener for "rollover" instead, only a single event is received when the mouse first enters
	 * the aggregate myContainer content (target=myContainer).
	 *
	 * This event must be enabled using {@link easeljs.Stage#enableMouseOver}.
	 * @see {@link easeljs.MouseEvent}
	 * @event easeljs.DisplayObject#rollover
	 * @since 0.7.0
	 */

	/**
	 * This event is similar to {@link easeljs.DisplayObject#event:mouseout}, with the following
	 * differences: it does not bubble, and it considers {@link easeljs.Container} instances as an
	 * aggregate of their content.
	 *
	 * For example, myContainer contains two overlapping children: shapeA and shapeB. The user moves their mouse over
	 * shapeA, then directly on to shapeB, then off both. With a listener for {@link easeljs.DisplayObject#event:mouseout}
	 * on myContainer, two events would be received, each targeting a child element:<OL>
	 * <LI>when the mouse leaves shapeA (target=shapeA)</LI>
	 * <LI>when the mouse leaves shapeB (target=shapeB)</LI>
	 * </OL>
	 * However, with a listener for "rollout" instead, only a single event is received when the mouse leaves
	 * the aggregate myContainer content (target=myContainer).
	 *
	 * This event must be enabled using {@link easeljs.Stage#enableMouseOver}.
	 * @see {@link easeljs.MouseEvent}
	 * @event easeljs.DisplayObject#rollout
	 * @since 0.7.0
	 */

	/**
	 * After a {@link easeljs.DisplayObject#event:mousedown} occurs on a display object, a pressmove
	 * event will be generated on that object whenever the mouse moves until the mouse press is released. This can be
	 * useful for dragging and similar operations.
	 * @event easeljs.DisplayObject#pressmove
	 * @since 0.7.0
	 */

	/**
	 * After a {@link easeljs.DisplayObject#event:mousedown} occurs on a display object, a pressup event
	 * will be generated on that object when that mouse press is released. This can be useful for dragging and similar
	 * operations.
	 * @event easeljs.DisplayObject#pressup
	 * @since 0.7.0
	 */

	/**
	 * Dispatched when the display object is added to a parent container.
	 * @event easeljs.DisplayObject#added
	 */

	/**
	 * Dispatched when the display object is removed from its parent container.
	 * @event easeljs.DisplayObject#removed
	 */

	/**
	 * Dispatched on each display object on a stage whenever the stage updates. This occurs immediately before the
	 * rendering (draw) pass. When {@link easeljs.Stage#update} is called, first all display objects on
	 * the stage dispatch the tick event, then all of the display objects are drawn to stage. Children will have their
	 * tick event dispatched in order of their depth prior to the event being dispatched on their parent.
	 * @event easeljs.DisplayObject#tick
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type.
	 * @param {Array} params An array containing any arguments that were passed to the Stage.update() method.
	 * @since 0.6.0
	 */

	/**
	 * @license Container
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * A Container is a nestable display list that allows you to work with compound display elements. For  example you could
	 * group arm, leg, torso and head {{#crossLink "Bitmap"}}{{/crossLink}} instances together into a Person Container, and
	 * transform them as a group, while still being able to move the individual parts relative to each other. Children of
	 * containers have their `transform` and `alpha` properties concatenated with their parent
	 * Container.
	 *
	 * For example, a {{#crossLink "Shape"}}{{/crossLink}} with x=100 and alpha=0.5, placed in a Container with `x=50`
	 * and `alpha=0.7` will be rendered to the canvas at `x=150` and `alpha=0.35`.
	 * Containers have some overhead, so you generally shouldn't create a Container to hold a single child.
	 *
	 * @memberof easeljs
	 * @extends easeljs.DisplayObject
	 * @example
	 * import { Container } from "@createjs/easeljs";
	 * const container = new Container();
	 * container.addChild(bitmapInstance, shapeInstance);
	 * container.x = 100;
	 */
	class Container extends DisplayObject {

		constructor () {
			super();

			/**
			 * The array of children in the display list. You should usually use the child management methods such as
			 * {@link easeljs.Container#addChild}, {@link easeljs.Container#removeChild}, {@link easeljs.Container#swapChildren},
			 * etc, rather than accessing this directly, but it is included for advanced uses.
			 * @type {Array}
			 * @default []
			 */
			this.children = [];

			/**
			 * Indicates whether the children of this container are independently enabled for mouse/pointer interaction.
			 * If false, the children will be aggregated under the container - for example, a click on a child shape would
			 * trigger a click event on the container.
			 * @type {Boolean}
			 * @default true
			 */
			this.mouseChildren = true;

			/**
			 * If false, the tick will not be propagated to children of this Container. This can provide some performance benefits.
			 * In addition to preventing the {@link core.Ticker#event:tick} event from being dispatched, it will also prevent tick related updates
			 * on some display objects (ex. Sprite & MovieClip frame advancing, DOMElement visibility handling).
			 * @type {Boolean}
			 * @default true
			 */
			this.tickChildren = true;
		}

		/**
		 * Returns the number of children in the container.
		 * @type {Number}
		 * @readonly
		 */
		get numChildren () {
			return this.children.length;
		}

		isVisible () {
			let hasContent = this.cacheCanvas || this.children.length;
			return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
		}

		draw (ctx, ignoreCache = false) {
			if (super.draw(ctx, ignoreCache)) { return true; }

			// this ensures we don't have issues with display list changes that occur during a draw:
			let list = this.children.slice();
			for (let i=0,l=list.length; i<l; i++) {
				let child = list[i];
				if (!child.isVisible()) { continue; }

				// draw the child:
				ctx.save();
				child.updateContext(ctx);
				child.draw(ctx);
				ctx.restore();
			}
			return true;
		}

		/**
		 * Adds a child to the top of the display list.
		 *
		 * @example
		 * container.addChild(bitmapInstance);
		 * // You can also add multiple children at once:
		 * container.addChild(bitmapInstance, shapeInstance, textInstance);
		 *
		 * @param {...easeljs.DisplayObject} children The display object(s) to add.
		 * @return {easeljs.DisplayObject} The child that was added, or the last child if multiple children were added.
		 */
		addChild (...children) {
			const l = children.length;
			if (l === 0) { return null; }
			let child = children[0];
			if (l > 1) {
				for (let i = 0; i < l; i++) { child = this.addChild(children[i]); }
				return child;
			}
	    // Note: a lot of duplication with addChildAt, but push is WAY faster than splice.
	    let parent = child.parent, silent = parent === this;
	    parent && parent._removeChildAt(parent.children.indexOf(child), silent);
			child.parent = this;
			this.children.push(child);
	    if (!silent) { child.dispatchEvent("added"); }
			return child;
		}

		/**
		 * Adds a child to the display list at the specified index, bumping children at equal or greater indexes up one, and
		 * setting its parent to this container.
		 *
		 * @example
		 * container.addChildAt(child1, index);
		 * // You can also add multiple children, such as:
		 * container.addChildAt(child1, child2, ..., index);
		 * // The index must be between 0 and numChildren. For example, to add myShape under otherShape in the display list, you could use:
		 * container.addChildAt(myShape, container.getChildIndex(otherShape));
		 * // This would also bump otherShape's index up by one. Fails silently if the index is out of range.
		 *
		 * @param {...easeljs.DisplayObject} children The display object(s) to add.
		 * @param {Number} index The index to add the child at.
		 * @return {easeljs.DisplayObject} Returns the last child that was added, or the last child if multiple children were added.
		 */
		addChildAt (...children) {
			const l = children.length;
	    if (l === 0) { return null; }
	    let index = children.pop();
			if (index < 0 || index > this.children.length) { return children[l - 2]; }
			if (l > 2) {
				for (let i = 0; i < l - 1; i++) { this.addChildAt(children[i], index++); }
				return children[l - 2];
			}
			let child = children[0];
	    let parent = child.parent, silent = parent === this;
	    parent && parent._removeChildAt(parent.children.indexOf(child), silent);
			child.parent = this;
			this.children.splice(index++, 0, child);
	    if (!silent) { child.dispatchEvent("added"); }
			return child;
		}

		/**
		 * Removes the specified child from the display list. Note that it is faster to use removeChildAt() if the index is
		 * already known.
		 *
		 * @example
		 * container.removeChild(child);
		 * // You can also remove multiple children:
		 * container.removeChild(child1, child2, ...);
		 *
		 * @param {...easeljs.DisplayObject} children The display object(s) to remove.
		 * @return {Boolean} true if the child (or children) was removed, or false if it was not in the display list.
		 */
		removeChild (...children) {
			const l = children.length;
	    if (l === 0) { return true; }
			if (l > 1) {
				let good = true;
				for (let i = 0; i < l; i++) { good = good && this.removeChild(children[i]); }
				return good;
			}
			return this._removeChildAt(this.children.indexOf(children[0]));
		}

		/**
		 * Removes the child at the specified index from the display list, and sets its parent to null.
		 *
		 * @example
		 * container.removeChildAt(2);
		 * // You can also remove multiple children:
		 * container.removeChildAt(2, 7, ...)
		 *
		 * @param {...Number} indexes The indexes of children to remove.
		 * @return {Boolean} true if the child (or children) was removed, or false if any index was out of range.
		 */
		removeChildAt (...indexes) {
			const l = indexes.length;
	    if (l === 0) { return true; }
			if (l > 1) {
				indexes.sort((a, b) => b - a);
				let good = true;
				for (let i = 0; i < l; i++) { good = good && this._removeChildAt(indexes[i]); }
				return good;
			}
			return this._removeChildAt(indexes[0]);
		}

		/**
		 * Removes all children from the display list.
		 */
		removeAllChildren () {
			let kids = this.children;
			while (kids.length) { this._removeChildAt(0); }
		}

		/**
		 * Returns the child at the specified index.
		 * @param {Number} index The index of the child to return.
		 * @return {easeljs.DisplayObject} The child at the specified index. Returns null if there is no child at the index.
		 */
		getChildAt (index) {
			return this.children[index];
		}

		/**
		 * Returns the child with the specified name.
		 * @param {String} name The name of the child to return.
		 * @return {easeljs.DisplayObject} The child with the specified name.
		 */
		getChildByName (name) {
			let kids = this.children;
			const l = kids.length;
			for (let i = 0; i < l; i++) {
				if (kids[i].name === name) { return kids[i]; }
			}
			return null;
		}

		/**
		 * Performs an array sort operation on the child list.
		 *
		 * @example
		 * // Display children with a higher y in front.
		 * container.sortChildren((obj1, obj2, options) => {
		 * 	 if (obj1.y > obj2.y) { return 1; }
		 *   if (obj1.y < obj2.y) { return -1; }
		 *   return 0;
		 * });
		 *
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort}
		 * @param {Function} sortFunction the function to use to sort the child list.
		 */
		sortChildren (sortFunction) {
			this.children.sort(sortFunction);
		}

		/**
		 * Returns the index of the specified child in the display list, or -1 if it is not in the display list.
		 * @param {easeljs.DisplayObject} child The child to return the index of.
		 * @return {Number} The index of the specified child. -1 if the child is not found.
		 */
		getChildIndex (child) {
			return this.children.indexOf(child);
		}

		/**
		 * Swaps the children at the specified indexes. Fails silently if either index is out of range.
		 * @param {Number} index1
		 * @param {Number} index2
		 */
		swapChildrenAt (index1, index2) {
			let kids = this.children;
			let o1 = kids[index1];
			let o2 = kids[index2];
			if (!o1 || !o2) { return; }
			kids[index1] = o2;
			kids[index2] = o1;
		};

		/**
		 * Swaps the specified children's depth in the display list. Fails silently if either child is not a child of this
		 * Container.
		 * @param {easeljs.DisplayObject} child1
		 * @param {easeljs.DisplayObject} child2
		 */
		swapChildren (child1, child2) {
			let kids = this.children;
			const l = kids.length;
			let index1,index2;
			for (var i = 0; i < l; i++) {
				if (kids[i] === child1) { index1 = i; }
				if (kids[i] === child2) { index2 = i; }
				if (index1 != null && index2 != null) { break; }
			}
			if (i === l) { return; } // TODO: throw error?
			kids[index1] = child2;
			kids[index2] = child1;
		}

		/**
		 * Changes the depth of the specified child. Fails silently if the child is not a child of this container, or the index is out of range.
		 * @param {easeljs.DisplayObject} child
		 * @param {Number} index
		 */
		setChildIndex (child, index) {
			let kids = this.children;
			const l = kids.length;
			if (child.parent != this || index < 0 || index >= l) { return; }
			for (var i = 0; i < l; i++) {
				if (kids[i] === child) { break; }
			}
			if (i === l || i === index) { return; }
			kids.splice(i, 1);
			kids.splice(index, 0, child);
		}

		/**
		 * Returns true if the specified display object either is this container or is a descendent (child, grandchild, etc)
		 * of this container.
		 * @param {easeljs.DisplayObject} child The DisplayObject to be checked.
		 * @return {Boolean} true if the specified display object either is this container or is a descendent.
		 */
		contains (child) {
			while (child) {
				if (child === this) { return true; }
				child = child.parent;
			}
			return false;
		}

		/**
		 * Tests whether the display object intersects the specified local point (ie. draws a pixel with alpha > 0 at the
		 * specified position). This ignores the alpha, shadow and compositeOperation of the display object, and all
		 * transform properties including regX/Y.
		 * @param {Number} x The x position to check in the display object's local coordinates.
		 * @param {Number} y The y position to check in the display object's local coordinates.
		 * @return {Boolean} A Boolean indicating whether there is a visible section of a DisplayObject that overlaps the specified
		 * coordinates.
		 */
		hitTest (x, y) {
			// TODO: optimize to use the fast cache check where possible.
			return this.getObjectUnderPoint(x, y) != null;
		}

		/**
		 * Returns an array of all display objects under the specified coordinates that are in this container's display
		 * list. This routine ignores any display objects with {@link easeljs.DisplayObject#mouseEnabled} set to `false`.
		 * The array will be sorted in order of visual depth, with the top-most display object at index 0.
		 * This uses shape based hit detection, and can be an expensive operation to run, so it is best to use it carefully.
		 * For example, if testing for objects under the mouse, test on tick (instead of on {@link easeljs.DisplayObject#event:mousemove}),
		 * and only if the mouse's position has changed.
		 *
		 * <ul>
		 *   <li>By default (mode=0) this method evaluates all display objects.</li>
		 *   <li>By setting the `mode` parameter to `1`, the {@link easeljs.DisplayObject#mouseEnabled}
		 *       and {@link easeljs.DisplayObject#mouseChildren} properties will be respected.</li>
		 *   <li>Setting the `mode` to `2` additionally excludes display objects that do not have active mouse event
		 *       listeners or a {@link easeljs.DisplayObject#cursor} property. That is, only objects
		 *       that would normally intercept mouse interaction will be included. This can significantly improve performance
		 *       in some cases by reducing the number of display objects that need to be tested.</li>
		 * </ul>
		 *
		 * This method accounts for both {@link easeljs.DisplayObject#hitArea} and {@link easeljs.DisplayObject#mask}.
		 *
		 * @param {Number} x The x position in the container to test.
		 * @param {Number} y The y position in the container to test.
		 * @param {Number} [mode=0] The mode to use to determine which display objects to include. 0-all, 1-respect mouseEnabled/mouseChildren, 2-only mouse opaque objects.
		 * @return {Array<easeljs.DisplayObject>} An array of DisplayObjects under the specified coordinates.
		 */
		getObjectsUnderPoint (x, y, mode = 0) {
			let arr = [];
			let pt = this.localToGlobal(x, y);
			this._getObjectsUnderPoint(pt.x, pt.y, arr, mode > 0, mode === 1);
			return arr;
		}

		/**
		 * Similar to {@link easeljs.Container#getObjectsUnderPoint}, but returns only the top-most display
		 * object. This runs significantly faster than `getObjectsUnderPoint()`, but is still potentially an expensive
		 * operation.
		 *
		 * @param {Number} x The x position in the container to test.
		 * @param {Number} y The y position in the container to test.
		 * @param {Number} [mode=0] The mode to use to determine which display objects to include.  0-all, 1-respect mouseEnabled/mouseChildren, 2-only mouse opaque objects.
		 * @return {easeljs.DisplayObject} The top-most display object under the specified coordinates.
		 */
		getObjectUnderPoint (x, y, mode = 0) {
			let pt = this.localToGlobal(x, y);
			return this._getObjectsUnderPoint(pt.x, pt.y, null, mode > 0, mode === 1);
		}

		getBounds () {
			return this._getBounds(null, true);
		}

		getTransformedBounds () {
			return this._getBounds();
		}

		/**
		 * Returns a clone of this Container. Some properties that are specific to this instance's current context are
		 * reverted to their defaults (for example `.parent`).
		 * @param {Boolean} [recursive=false] If true, all of the descendants of this container will be cloned recursively. If false, the
		 * properties of the container will be cloned, but the new instance will not have any children.
		 * @return {easeljs.Container} A clone of the current Container instance.
		 */
		clone (recursive = false) {
			let o = this._cloneProps(new Container());
			if (recursive) { this._cloneChildren(o); }
			return o;
		}

		_tick (evtObj) {
			if (this.tickChildren) {
				for (let i = this.children.length - 1; i >= 0; i--) {
					let child = this.children[i];
					if (child.tickEnabled && child._tick) { child._tick(evtObj); }
				}
			}
			super._tick(evtObj);
		}

		/**
		 * Recursively clones all children of this container, and adds them to the target container.
		 * @protected
		 * @param {easeljs.Container} o The target container.
		 */
		_cloneChildren (o) {
			if (o.children.length) { o.removeAllChildren(); }
			let arr = o.children;
			const l = this.children.length;
			for (let i = 0; i < l; i++) {
				let clone = this.children[i].clone(true);
				clone.parent = o;
				arr.push(clone);
			}
		}

	  /**
	   * Removes the child at the specified index from the display list, and sets its parent to null.
	   * Used by `removeChildAt`, `addChild`, and `addChildAt`.
	   *
	   * @protected
	   * @param {Number} index The index of the child to remove.
	   * @param {Boolean} [silent=false] Prevents dispatch of `removed` event if true.
	   * @return {Boolean} true if the child (or children) was removed, or false if any index was out of range.
	   */
	  _removeChildAt (index, silent = false) {
			if (index < 0 || index > this.children.length - 1) { return false; }
			let child = this.children[index];
			if (child) { child.parent = null; }
			this.children.splice(index, 1);
			if (!silent) { child.dispatchEvent("removed"); }
			return true;
	  }

		/**
		 * @protected
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Array} arr
		 * @param {Boolean} mouse If true, it will respect mouse interaction properties like mouseEnabled, mouseChildren, and active listeners.
		 * @param {Boolean} activeListener If true, there is an active mouse event listener on a parent object.
		 * @param {Number} [currentDepth=0] Indicates the current depth of the search.
		 * @return {easeljs.DisplayObject}
		 */
		_getObjectsUnderPoint (x, y, arr, mouse, activeListener, currentDepth = 0) {
			if (!currentDepth && !this._testMask(this, x, y)) { return null; }
			let mtx, ctx = DisplayObject._hitTestContext;
			activeListener = activeListener || (mouse && this._hasMouseEventListener());

			// draw children one at a time, and check if we get a hit:
			let children = this.children;
			const l = children.length;
			for (let i = l - 1; i >= 0; i--) {
				let child = children[i];
				let hitArea = child.hitArea;
				if (!child.visible || (!hitArea && !child.isVisible()) || (mouse && !child.mouseEnabled)) { continue; }
				if (!hitArea && !this._testMask(child, x, y)) { continue; }

				// if a child container has a hitArea then we only need to check its hitArea, so we can treat it as a normal DO:
				if (!hitArea && child instanceof Container) {
					let result = child._getObjectsUnderPoint(x, y, arr, mouse, activeListener, currentDepth + 1);
					if (!arr && result) { return (mouse && !this.mouseChildren) ? this : result; }
				} else {
					if (mouse && !activeListener && !child._hasMouseEventListener()) { continue; }

					// TODO: can we pass displayProps forward, to avoid having to calculate this backwards every time? It's kind of a mixed bag. When we're only hunting for DOs with event listeners, it may not make sense.
					let props = child.getConcatenatedDisplayProps(child._props);
					mtx = props.matrix;

					if (hitArea) {
						mtx.appendMatrix(hitArea.getMatrix(hitArea._props.matrix));
						props.alpha = hitArea.alpha;
					}

					ctx.globalAlpha = props.alpha;
					ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx-x, mtx.ty-y);
					(hitArea || child).draw(ctx);
					if (!this._testHit(ctx)) { continue; }
					ctx.setTransform(1, 0, 0, 1, 0, 0);
					ctx.clearRect(0, 0, 2, 2);
					if (arr) { arr.push(child); }
					else { return (mouse && !this.mouseChildren) ? this : child; }
				}
			}
			return null;
		}

		/**
		 * @protected
		 * @param {easeljs.DisplayObject} target
		 * @param {Number} x
		 * @param {Number} y
		 * @return {Boolean} Indicates whether the x/y is within the masked region.
		 */
		_testMask (target, x, y) {
			let mask = target.mask;
			if (!mask || !mask.graphics || mask.graphics.isEmpty()) { return true; }

			let mtx = this._props.matrix, parent = target.parent;
			mtx = parent ? parent.getConcatenatedMatrix(mtx) : mtx.identity();
			mtx = mask.getMatrix(mask._props.matrix).prependMatrix(mtx);

			let ctx = DisplayObject._hitTestContext;
			ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx-x, mtx.ty-y);

			// draw the mask as a solid fill:
			mask.graphics.drawAsPath(ctx);
			ctx.fillStyle = "#000";
			ctx.fill();

			if (!this._testHit(ctx)) { return false; }
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, 2, 2);

			return true;
		}

		/**
		 * @protected
		 * @param {easeljs.Matrix2D} matrix
		 * @param {Boolean} ignoreTransform If true, does not apply this object's transform.
		 * @return {easeljs.Rectangle}
		 */
		_getBounds (matrix, ignoreTransform) {
			let bounds = super.getBounds();
			if (bounds) { return this._transformBounds(bounds, matrix, ignoreTransform); }

			let mtx = this._props.matrix;
			mtx = ignoreTransform ? mtx.identity() : this.getMatrix(mtx);
			if (matrix) { mtx.prependMatrix(matrix); }

			const l = this.children.length;
			let rect = null;
			for (let i = 0; i < l; i++) {
				let child = this.children[i];
				if (!child.visible || !(bounds = child._getBounds(mtx))) { continue; }
				if (rect) { rect.extend(bounds.x, bounds.y, bounds.width, bounds.height); }
				else { rect = bounds.clone(); }
			}
			return rect;
		}

	}

	/**
	 * @license MouseEvent
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * Passed as the parameter to all mouse/pointer/touch related events. For a listing of mouse events and their properties,
	 * see the {@link easeljs.DisplayObject} and {@link easeljs.Stage} event listings.
	 * @memberof easeljs
	 * @extends core.Event
	 * @param {String} type The event type.
	 * @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
	 * @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
	 * @param {Number} stageX The normalized x position relative to the stage.
	 * @param {Number} stageY The normalized y position relative to the stage.
	 * @param {easeljs.MouseEvent} nativeEvent The native DOM event related to this mouse event.
	 * @param {Number} pointerID The unique id for the pointer.
	 * @param {Boolean} primary Indicates whether this is the primary pointer in a multitouch environment.
	 * @param {Number} rawX The raw x position relative to the stage.
	 * @param {Number} rawY The raw y position relative to the stage.
	 * @param {easeljs.DisplayObject} relatedTarget The secondary target for the event.
	 */
	class MouseEvent extends Event {

		constructor (type, bubbles, cancelable, stageX, stageY, nativeEvent, pointerID, primary, rawX, rawY, relatedTarget) {
			super(type, bubbles, cancelable);

	// public properties:
			/**
			 * The normalized x position on the stage. This will always be within the range 0 to stage width.
			 * @type {Number}
			*/
			this.stageX = stageX;

			/**
			 * The normalized y position on the stage. This will always be within the range 0 to stage height.
			 * @type {Number}
			 */
			this.stageY = stageY;

			/**
			 * The raw x position relative to the stage. Normally this will be the same as the stageX value, unless
			 * stage.mouseMoveOutside is true and the pointer is outside of the stage bounds.
			 * @type {Number}
			*/
			this.rawX = (rawX==null)?stageX:rawX;

			/**
			 * The raw y position relative to the stage. Normally this will be the same as the stageY value, unless
			 * stage.mouseMoveOutside is true and the pointer is outside of the stage bounds.
			 * @type {Number}
			*/
			this.rawY = (rawY==null)?stageY:rawY;

			/**
			 * The native MouseEvent generated by the browser. The properties and API for this
			 * event may differ between browsers. This property will be null if the
			 * EaselJS property was not directly generated from a native MouseEvent.
			 * @type {HTMLMouseEvent}
			 */
			this.nativeEvent = nativeEvent;

			/**
			 * The unique id for the pointer (touch point or cursor). This will be either -1 for the mouse, or the system
			 * supplied id value.
			 * @type {Number}
			 */
			this.pointerID = pointerID;

			/**
			 * Indicates whether this is the primary pointer in a multitouch environment. This will always be true for the mouse.
			 * For touch pointers, the first pointer in the current stack will be considered the primary pointer.
			 * @type {Boolean}
			 */
			this.primary = !!primary;

			/**
			 * The secondary target for the event, if applicable. This is used for mouseout/rollout
			 * events to indicate the object that the mouse entered from, mouseover/rollover for the object the mouse exited,
			 * and stagemousedown/stagemouseup events for the object that was the under the cursor, if any.
			 *
			 * Only valid interaction targets will be returned (ie. objects with mouse listeners or a cursor set).
			 * @type {easeljs.DisplayObject}
			 */
			this.relatedTarget = relatedTarget;
		}

		/**
		 * Returns the x position of the mouse in the local coordinate system of the current target (ie. the dispatcher).
		 * @type {Number}
		 * @readonly
		 */
		get localX () {
			return this.currentTarget.globalToLocal(this.rawX, this.rawY).x;
		}

		/**
		 * Returns the y position of the mouse in the local coordinate system of the current target (ie. the dispatcher).
		 * @type {Number}
		 * @readonly
		 */
		get localY () {
			return this.currentTarget.globalToLocal(this.rawX, this.rawY).y;
		}

		/**
		 * Indicates whether the event was generated by a touch input (versus a mouse input).
		 * @type {Boolean}
		 * @readonly
		 */
		get isTouch () {
			return this.pointerID !== -1;
		}

		/**
		 * Returns a clone of the MouseEvent instance.
		 * @return {easeljs.MouseEvent} a clone of the MouseEvent instance.
		 */
		clone () {
			return new MouseEvent(this.type, this.bubbles, this.cancelable, this.stageX, this.stageY, this.nativeEvent, this.pointerID, this.primary, this.rawX, this.rawY);
		}

		/**
		 * Returns a string representation of this object.
		 * @return {String} a string representation of the instance.
		 */
		toString () {
			return `[${this.constructor.name} (type=${this.type} stageX=${this.stageX} stageY=${this.stageY})]`;
		}

	}

	/**
	 * @license Stage
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * A stage is the root level {@link easeljs.Container} for a display list. Each time its {@link easeljs.Stage#tick}
	 * method is called, it will render its display list to its target canvas.
	 *
	 * @memberof easeljs
	 * @extends easeljs.Container
	 * @example
	 * let stage = new Stage("canvasElementId");
	 * let image = new Bitmap("imagePath.png");
	 * stage.addChild(image);
	 * Ticker.addEventListener("tick", event => {
	 *   image.x += 10;
	 * 	 stage.update();
	 * });
	 *
	 * @param {HTMLCanvasElement | String | Object} canvas A canvas object that the Stage will render to, or the string id
	 * of a canvas object in the current document.
	 */
	class Stage extends Container {

		constructor (canvas) {
			super();

			/**
			 * Indicates whether the stage should automatically clear the canvas before each render. You can set this to `false`
			 * to manually control clearing (for generative art, or when pointing multiple stages at the same canvas for
			 * example).
			 *
			 * @example
			 * let stage = new Stage("canvasId");
			 * stage.autoClear = false;
			 *
			 * @type {Boolean}
			 * @default true
			 */
			this.autoClear = true;

			/**
			 * The canvas the stage will render to. Multiple stages can share a single canvas, but you must disable autoClear for all but the
			 * first stage that will be ticked (or they will clear each other's render).
			 *
			 * When changing the canvas property you must disable the events on the old canvas, and enable events on the
			 * new canvas or mouse events will not work as expected.
			 *
			 * @example
			 * stage.enableDOMEvents(false);
			 * stage.canvas = anotherCanvas;
			 * stage.enableDOMEvents(true);
			 *
			 * @type {HTMLCanvasElement | Object}
			 */
			this.canvas = (typeof canvas === "string") ? document.getElementById(canvas) : canvas;

			/**
			 * The current mouse X position on the canvas. If the mouse leaves the canvas, this will indicate the most recent
			 * position over the canvas, and mouseInBounds will be set to false.
			 * @type {Number}
			 * @default 0
			 * @readonly
			 */
			this.mouseX = 0;

			/**
			 * The current mouse Y position on the canvas. If the mouse leaves the canvas, this will indicate the most recent
			 * position over the canvas, and mouseInBounds will be set to false.
			 * @type {Number}
			 * @default 0
			 * @readonly
			 */
			this.mouseY = 0;

			/**
			 * Specifies the area of the stage to affect when calling update. This can be use to selectively
			 * re-draw specific regions of the canvas. If null, the whole canvas area is drawn.
			 * @type {easeljs.Rectangle}
			 */
			this.drawRect = null;

			/**
			 * Indicates whether display objects should be rendered on whole pixels. You can set the {@link easeljs.DisplayObject.snapToPixelEnabled}
			 * property of display objects to false to enable/disable this behaviour on a per instance basis.
			 * @type {Boolean}
			 * @default false
			 */
			this.snapToPixelEnabled = false;

			/**
			 * Indicates whether the mouse is currently within the bounds of the canvas.
			 * @type {Boolean}
			 * @default false
			 */
			this.mouseInBounds = false;

			/**
			 * If true, tick callbacks will be called on all display objects on the stage prior to rendering to the canvas.
			 * @type {Boolean}
			 * @default true
			 */
			this.tickOnUpdate = true;

			/**
			 * If true, mouse move events will continue to be called when the mouse leaves the target canvas.
			 * See {@link easeljs.Stage#mouseInBounds}, and {@link easeljs.MouseEvent} x/y/rawX/rawY.
			 * @type {Boolean}
			 * @default false
			 */
			this.mouseMoveOutside = false;


			/**
			 * Prevents selection of other elements in the html page if the user clicks and drags, or double clicks on the canvas.
			 * This works by calling `preventDefault()` on any mousedown events (or touch equivalent) originating on the canvas.
			 * @type {Boolean}
			 * @default true
			 */
			this.preventSelection = true;

			/**
			 * The hitArea property is not supported for Stage.
			 * @property hitArea
			 * @override
			 * @default null
			 * @private
			 */

			/**
			 * Holds objects with data for each active pointer id. Each object has the following properties:
			 * x, y, event, target, overTarget, overX, overY, inBounds, posEvtObj (native event that last updated position)
			 * @type {Object}
			 * @private
			 */
			this._pointerData = {};

			/**
			 * Number of active pointers.
			 * @type {Number}
			 * @private
			 */
			this._pointerCount = 0;

			/**
			 * The ID of the primary pointer.
			 * @type {String}
			 * @private
			 */
			this._primaryPointerID = null;

			/**
			 * @protected
			 * @type {Number}
			 */
			this._mouseOverIntervalID = null;

			/**
			 * @protected
			 * @type {easeljs.Stage}
			 */
			this._nextStage = null;

			/**
			 * @protected
			 * @type {easeljs.Stage}
			 */
			this._prevStage = null;

			this.enableDOMEvents(true);
		}

		/**
		 * Specifies a target stage that will have mouse/touch interactions relayed to it after this stage handles them.
		 * This can be useful in cases where you have multiple layered canvases and want user interactions
		 * events to pass through.
		 *
		 * MouseOver, MouseOut, RollOver, and RollOut interactions are also passed through using the mouse over settings
		 * of the top-most stage, but are only processed if the target stage has mouse over interactions enabled.
		 * Considerations when using roll over in relay targets:
		 * <ol>
		 *   <li> The top-most (first) stage must have mouse over interactions enabled (via enableMouseOver)</li>
		 *   <li> All stages that wish to participate in mouse over interaction must enable them via enableMouseOver</li>
		 *   <li> All relay targets will share the frequency value of the top-most stage</li>
		 * </ol>
		 *
		 * @example <caption>Relay mouse events from topStage to bottomStage</caption>
		 * topStage.nextStage = bottomStage;
		 *
		 * @example <caption>Disable DOM events</caption>
		 * stage.enableDOMEvents(false);
		 *
		 * @type {easeljs.Stage}
		 */
		get nextStage () { return this._nextStage; }
		set nextStage (stage) {
			if (this._nextStage) { this._nextStage._prevStage = null; }
			if (stage) { stage._prevStage = this; }
			this._nextStage = stage;
		}

	// public methods:
		/**
		 * Each time the update method is called, the stage will call {@link easeljs.Stage#tick}
		 * unless {@link easeljs.Stage#tickOnupdate} is set to false,
		 * and then render the display list to the canvas.
		 *
		 * @param {Object} [props] Props object to pass to `tick()`. Should usually be a {@link core.Ticker} event object, or similar object with a delta property.
		 */
		update (props) {
			if (!this.canvas) { return; }
			if (this.tickOnUpdate) { this.tick(props); }
			if (this.dispatchEvent("drawstart", false, true) === false) { return; }
			DisplayObject._snapToPixelEnabled = this.snapToPixelEnabled;
			let r = this.drawRect, ctx = this.canvas.getContext("2d");
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			if (this.autoClear) {
				if (r) { ctx.clearRect(r.x, r.y, r.width, r.height); }
				else { ctx.clearRect(0, 0, this.canvas.width+1, this.canvas.height+1); }
			}
			ctx.save();
			if (this.drawRect) {
				ctx.beginPath();
				ctx.rect(r.x, r.y, r.width, r.height);
				ctx.clip();
			}
			this.updateContext(ctx);
			this.draw(ctx, false);
			ctx.restore();
			this.dispatchEvent("drawend");
		}

		/**
		 * Propagates a tick event through the display list. This is automatically called by {@link easeljs.Stage#update}
		 * unless {@link easeljs.Stage#tickOnUpdate} is set to false.
		 *
		 * If a props object is passed to `tick()`, then all of its properties will be copied to the event object that is
		 * propagated to listeners.
		 *
		 * Some time-based features in EaselJS (for example {@link easeljs.Sprite#framerate} require that
		 * a {@link core.Ticker#event:tick} event object (or equivalent object with a delta property) be
		 * passed as the `props` parameter to `tick()`.
		 *
		 * @example
		 * Ticker.on("tick", (evt) => {
		 *   // clone the event object from Ticker, and add some custom data to it:
		 * 	 let data = evt.clone().set({ greeting: "hello", name: "world" });
		 * 	 // pass it to stage.update():
		 * 	 stage.update(data); // subsequently calls tick() with the same param
		 * });
		 *
		 * shape.on("tick", (evt) => {
		 *   console.log(evt.delta); // the delta property from the Ticker tick event object
		 * 	 console.log(evt.greeting, evt.name); // custom data: "hello world"
		 * });
		 *
		 * @emits easeljs.Stage#event:tickstart
		 * @emits easeljs.Stage#event:tickend
		 * @param {Object} [props] An object with properties that should be copied to the event object. Should usually be a Ticker event object, or similar object with a delta property.
		 */
		tick (props) {
			if (!this.tickEnabled || this.dispatchEvent("tickstart", false, true) === false) { return; }
			let evtObj = new Event("tick");
			if (props) {
				for (let n in props) {
					if (props.hasOwnProperty(n)) { evtObj[n] = props[n]; }
				}
			}
			this._tick(evtObj);
			this.dispatchEvent("tickend");
		}

		/**
		 * Default event handler that calls the Stage {@link easeljs.Stage#update} method when a {@link easeljs.DisplayObject#event:tick}
		 * event is received. This allows you to register a Stage instance as a event listener on {@link core.Ticker} directly.
		 * Note that if you subscribe to ticks using this pattern, then the tick event object will be passed through to
		 * display object tick handlers, instead of `delta` and `paused` parameters.
		 */
		handleEvent (evt) {
			if (evt.type === "tick") { this.update(evt); }
		}

		/**
		 * Clears the target canvas. Useful if {@link easeljs.State#autoClear} is set to `false`.
		 */
		clear () {
			if (!this.canvas) { return; }
			let ctx = this.canvas.getContext("2d");
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, this.canvas.width+1, this.canvas.height+1);
		}

		/**
		 * Returns a data url that contains a Base64-encoded image of the contents of the stage. The returned data url can
		 * be specified as the src value of an image element.
		 *
		 * @param {String} [backgroundColor] The background color to be used for the generated image. Any valid CSS color
		 * value is allowed. The default value is a transparent background.
		 * @param {String} [mimeType="image/png"] The MIME type of the image format to be create. If an unknown MIME type
		 * is passed in, or if the browser does not support the specified MIME type, the default value will be used.
		 * @return {String} a Base64 encoded image.
		 */
		toDataURL (backgroundColor, mimeType = "image/png") {
			let data, ctx = this.canvas.getContext('2d'), w = this.canvas.width, h = this.canvas.height;

			if (backgroundColor) {
				data = ctx.getImageData(0, 0, w, h);
				var compositeOperation = ctx.globalCompositeOperation;
				ctx.globalCompositeOperation = "destination-over";

				ctx.fillStyle = backgroundColor;
				ctx.fillRect(0, 0, w, h);
			}

			let dataURL = this.canvas.toDataURL(mimeType);

			if (backgroundColor) {
				ctx.putImageData(data, 0, 0);
				ctx.globalCompositeOperation = compositeOperation;
			}

			return dataURL;
		}

		/**
		 * Enables or disables (by passing a frequency of 0) mouse over {@link easeljs.DisplayObject#event:mouseover}
		 * and {@link easeljs.DisplayObject#event:mouseout} and roll over events {@link easeljs.DisplayObject#event:rollover}
		 * and {@link easeljs.DisplayObject#event:rollout} for this stage's display list. These events can
		 * be expensive to generate, so they are disabled by default. The frequency of the events can be controlled
		 * independently of mouse move events via the optional `frequency` parameter.
		 *
		 * @example
		 * const stage = new Stage("canvasId");
		 * stage.enableMouseOver(10); // 10 updates per second
		 *
		 * @param {Number} [frequency=20] Optional param specifying the maximum number of times per second to broadcast
		 * mouse over/out events. Set to 0 to disable mouse over events completely. Maximum is 50. A lower frequency is less
		 * responsive, but uses less CPU.
		 */
		enableMouseOver (frequency = 20) {
			if (this._mouseOverIntervalID) {
				clearInterval(this._mouseOverIntervalID);
				this._mouseOverIntervalID = null;
				if (frequency === 0) {
					this._testMouseOver(true);
				}
			}
			if (frequency <= 0) { return; }
			this._mouseOverIntervalID = setInterval(() => this._testMouseOver(), 1000/Math.min(50,frequency));
		}

		/**
		 * Enables or disables the event listeners that stage adds to DOM elements (window, document and canvas). It is good
		 * practice to disable events when disposing of a Stage instance, otherwise the stage will continue to receive
		 * events from the page.
		 * When changing the canvas property you must disable the events on the old canvas, and enable events on the
		 * new canvas or mouse events will not work as expected.
		 *
		 * @example
		 * stage.enableDOMEvents(false);
		 * stage.canvas = anotherCanvas;
		 * stage.enableDOMEvents(true);
		 *
		 * @param {Boolean} [enable=true] Indicates whether to enable or disable the events.
		 */
		enableDOMEvents (enable = true) {
			let ls = this._eventListeners;
			if (!enable && ls) {
				for (let n in ls) {
					let o = ls[n];
					o.t.removeEventListener(n, o.f, false);
				}
				this._eventListeners = null;
			} else if (enable && !ls && this.canvas) {
				let t = window.addEventListener ? window : document;
				ls = this._eventListeners = {
					mouseup: {t, f:e => this._handleMouseUp(e) },
					mousemove: {t, f:e => this._handleMouseMove(e) },
					dblclick: {t:this.canvas, f:e => this._handleDoubleClick(e) },
					mousedown: {t:this.canvas, f:e => this._handleMouseDown(e) }
				};
				for (let n in ls) {
					let o = ls[n];
					o.t.addEventListener && o.t.addEventListener(n, o.f, false);
				}
			}
		}

		/**
		 * Stage instances cannot be cloned.
		 * @throws Stage cannot be cloned
		 * @override
		 */
		clone () {
			throw "Stage cannot be cloned.";
		}

		/**
		 * @protected
		 * @param {HTMLElement} e
		 * @returns {Object}
		 */
		_getElementRect (e) {
			let bounds;
			try { bounds = e.getBoundingClientRect(); } // this can fail on disconnected DOM elements in IE9
			catch (err) { bounds = {top:e.offsetTop, left:e.offsetLeft, width:e.offsetWidth, height:e.offsetHeight}; }

			let offX = (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || document.body.clientLeft || 0);
			let offY = (window.pageYOffset || document.scrollTop || 0) - (document.clientTop  || document.body.clientTop  || 0);

			let styles = window.getComputedStyle ? getComputedStyle(e, null) : e.currentStyle; // IE <9 compatibility.
			let padL = parseInt(styles.paddingLeft)+parseInt(styles.borderLeftWidth);
			let padT = parseInt(styles.paddingTop)+parseInt(styles.borderTopWidth);
			let padR = parseInt(styles.paddingRight)+parseInt(styles.borderRightWidth);
			let padB = parseInt(styles.paddingBottom)+parseInt(styles.borderBottomWidth);

			// note: in some browsers bounds properties are read only.
			return {
				left: bounds.left+offX+padL,
				right: bounds.right+offX-padR,
				top: bounds.top+offY+padT,
				bottom: bounds.bottom+offY-padB
			};
		}

		/**
		 * @protected
		 * @param {Number} id
		 * @returns {Object}
		 */
		_getPointerData (id) {
			let data = this._pointerData[id];
			if (!data) { data = this._pointerData[id] = {x:0, y:0}; }
			return data;
		}

		/**
		 * @protected
		 * @param {easeljs.MouseEvent} [e=window.event]
		 */
		_handleMouseMove (e = window.event) {
			this._handlePointerMove(-1, e, e.pageX, e.pageY);
		}

		/**
		 * @emits {@link easeljs.DisplayObject#event:mouseleave}
		 * @emits {@link easeljs.DisplayObject#event:mouseenter}
		 * @emits {@link easeljs.DisplayObject#event:pressmove}
		 * @emits {@link easeljs.Stage#event:stagemousemove}
		 * @protected
		 * @param {Number} id
		 * @param {easeljs.MouseEvent | Event} e
		 * @param {Number} pageX
		 * @param {Number} pageY
		 * @param {easeljs.Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
		 */
		_handlePointerMove (id, e, pageX, pageY, owner) {
			if (this._prevStage && owner === undefined) { return; } // redundant listener.
			if (!this.canvas) { return; }
			let nextStage=this._nextStage, o=this._getPointerData(id);

			let inBounds = o.inBounds;
			this._updatePointerPosition(id, e, pageX, pageY);
			if (inBounds || o.inBounds || this.mouseMoveOutside) {
				if (id === -1 && o.inBounds === !inBounds) {
					this._dispatchMouseEvent(this, (inBounds ? "mouseleave" : "mouseenter"), false, id, o, e);
				}

				this._dispatchMouseEvent(this, "stagemousemove", false, id, o, e);
				this._dispatchMouseEvent(o.target, "pressmove", true, id, o, e);
			}

			nextStage&&nextStage._handlePointerMove(id, e, pageX, pageY, null);
		}

		/**
		 * @protected
		 * @param {Number} id
		 * @param {easeljs.MouseEvent | Event} e
		 * @param {Number} pageX
		 * @param {Number} pageY
		 */
		_updatePointerPosition (id, e, pageX, pageY) {
			let rect = this._getElementRect(this.canvas);
			pageX -= rect.left;
			pageY -= rect.top;

			let w = this.canvas.width;
			let h = this.canvas.height;
			pageX /= (rect.right-rect.left)/w;
			pageY /= (rect.bottom-rect.top)/h;
			let o = this._getPointerData(id);
			if (o.inBounds = (pageX >= 0 && pageY >= 0 && pageX <= w-1 && pageY <= h-1)) {
				o.x = pageX;
				o.y = pageY;
			} else if (this.mouseMoveOutside) {
				o.x = pageX < 0 ? 0 : (pageX > w-1 ? w-1 : pageX);
				o.y = pageY < 0 ? 0 : (pageY > h-1 ? h-1 : pageY);
			}

			o.posEvtObj = e;
			o.rawX = pageX;
			o.rawY = pageY;

			if (id === this._primaryPointerID || id === -1) {
				this.mouseX = o.x;
				this.mouseY = o.y;
				this.mouseInBounds = o.inBounds;
			}
		}

		/**
		 * @protected
		 * @param {easeljs.MouseEvent} e
		 */
		_handleMouseUp (e) {
			this._handlePointerUp(-1, e, false);
		}

		/**
		 * @emits {@link easeljs.Stage#event:stagemouseup}
		 * @emits {@link easeljs.DisplayObject#event:click}
		 * @emits {@link easeljs.DisplayObject#event:pressup}
		 * @protected
		 * @param {Number} id
		 * @param {easeljs.MouseEvent | Event} e
		 * @param {Boolean} clear
		 * @param {easeljs.Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
		 */
		_handlePointerUp (id, e, clear, owner) {
			let nextStage = this._nextStage, o = this._getPointerData(id);
			if (this._prevStage && owner === undefined) { return; } // redundant listener.

			let target=null, oTarget = o.target;
			if (!owner && (oTarget || nextStage)) { target = this._getObjectsUnderPoint(o.x, o.y, null, true); }

			if (o.down) { this._dispatchMouseEvent(this, "stagemouseup", false, id, o, e, target); o.down = false; }

			if (target === oTarget) { this._dispatchMouseEvent(oTarget, "click", true, id, o, e); }
			this._dispatchMouseEvent(oTarget, "pressup", true, id, o, e);

			if (clear) {
				if (id==this._primaryPointerID) { this._primaryPointerID = null; }
				delete(this._pointerData[id]);
			} else { o.target = null; }

			nextStage&&nextStage._handlePointerUp(id, e, clear, owner || target && this);
		}

		/**
		 * @protected
		 * @param {easeljs.MouseEvent} e
		 */
		_handleMouseDown (e) {
			this._handlePointerDown(-1, e, e.pageX, e.pageY);
		}

		/**
		 * @emits {@link easeljs.Stage#event:stagemousedown}
		 * @emits {@link easeljs.DisplayObject#event:mousedown}
		 * @protected
		 * @param {Number} id
		 * @param {easeljs.MouseEvent | Event} e
		 * @param {Number} pageX
		 * @param {Number} pageY
		 * @param {easeljs.Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
		 */
		_handlePointerDown (id, e, pageX, pageY, owner) {
			if (this.preventSelection) { e.preventDefault(); }
			if (this._primaryPointerID == null || id === -1) { this._primaryPointerID = id; } // mouse always takes over.

			if (pageY != null) { this._updatePointerPosition(id, e, pageX, pageY); }
			let target = null, nextStage = this._nextStage, o = this._getPointerData(id);
			if (!owner) { target = o.target = this._getObjectsUnderPoint(o.x, o.y, null, true); }

			if (o.inBounds) { this._dispatchMouseEvent(this, "stagemousedown", false, id, o, e, target); o.down = true; }
			this._dispatchMouseEvent(target, "mousedown", true, id, o, e);

			nextStage&&nextStage._handlePointerDown(id, e, pageX, pageY, owner || target && this);
		}

		/**
		 * @emits {@link easeljs.DisplayObject#event:mouseout}
		 * @emits {@link easeljs.DisplayObject#event:rollout}
		 * @emits {@link easeljs.DisplayObject#event:rollover}
		 * @emits {@link easeljs.DisplayObject#event:mouseover}
		 * @param {Boolean} clear If true, clears the mouseover / rollover (ie. no target)
		 * @param {easeljs.Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
		 * @param {easeljs.Stage} eventTarget The stage that the cursor is actively over.
		 * @protected
		 */
		_testMouseOver (clear, owner, eventTarget) {
			if (this._prevStage && owner === undefined) { return; } // redundant listener.

			let nextStage = this._nextStage;
			if (!this._mouseOverIntervalID) {
				// not enabled for mouseover, but should still relay the event.
				nextStage&&nextStage._testMouseOver(clear, owner, eventTarget);
				return;
			}
			let o = this._getPointerData(-1);
			// only update if the mouse position has changed. This provides a lot of optimization, but has some trade-offs.
			if (!o || (!clear && this.mouseX === this._mouseOverX && this.mouseY === this._mouseOverY && this.mouseInBounds)) { return; }

			let e = o.posEvtObj;
			let isEventTarget = eventTarget || e&&(e.target === this.canvas);
			let target=null, common = -1, cursor="";

			if (!owner && (clear || this.mouseInBounds && isEventTarget)) {
				target = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, true);
				this._mouseOverX = this.mouseX;
				this._mouseOverY = this.mouseY;
			}

			let oldList = this._mouseOverTarget||[];
			let oldTarget = oldList[oldList.length-1];
			let list = this._mouseOverTarget = [];

			// generate ancestor list and check for cursor:
			let t = target;
			while (t) {
				list.unshift(t);
				if (!cursor) { cursor = t.cursor; }
				t = t.parent;
			}
			this.canvas.style.cursor = cursor;
			if (!owner && eventTarget) { eventTarget.canvas.style.cursor = cursor; }

			// find common ancestor:
			for (let i=0,l=list.length; i<l; i++) {
				if (list[i] != oldList[i]) { break; }
				common = i;
			}

			if (oldTarget != target) {
				this._dispatchMouseEvent(oldTarget, "mouseout", true, -1, o, e, target);
			}

			for (let i=oldList.length-1; i>common; i--) {
				this._dispatchMouseEvent(oldList[i], "rollout", false, -1, o, e, target);
			}

			for (let i=list.length-1; i>common; i--) {
				this._dispatchMouseEvent(list[i], "rollover", false, -1, o, e, oldTarget);
			}

			if (oldTarget != target) {
				this._dispatchMouseEvent(target, "mouseover", true, -1, o, e, oldTarget);
			}

			nextStage&&nextStage._testMouseOver(clear, owner || target && this, eventTarget || isEventTarget && this);
		}

		/**
		 * @emits {@link easeljs.DisplayObject#event:dblclick}
		 * @protected
		 * @param {easeljs.MouseEvent} e
		 * @param {easeljs.Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
		 */
		_handleDoubleClick (e, owner) {
			let target=null, nextStage=this._nextStage, o=this._getPointerData(-1);
			if (!owner) {
				target = this._getObjectsUnderPoint(o.x, o.y, null, true);
				this._dispatchMouseEvent(target, "dblclick", true, -1, o, e);
			}
			nextStage&&nextStage._handleDoubleClick(e, owner || target && this);
		}

		/**
		 * @protected
		 * @param {easeljs.DisplayObject} target
		 * @param {String} type
		 * @param {Boolean} bubbles
		 * @param {Number} pointerId
		 * @param {Object} o
		 * @param {easeljs.MouseEvent} [nativeEvent]
		 * @param {easeljs.DisplayObject} [relatedTarget]
		 */
		_dispatchMouseEvent (target, type, bubbles, pointerId, o, nativeEvent, relatedTarget) {
			// TODO: might be worth either reusing MouseEvent instances, or adding a willTrigger method to avoid GC.
			if (!target || (!bubbles && !target.hasEventListener(type))) { return; }
			/*
			// TODO: account for stage transformations?
			this._mtx = this.getConcatenatedMatrix(this._mtx).invert();
			let pt = this._mtx.transformPoint(o.x, o.y);
			let evt = new MouseEvent(type, bubbles, false, pt.x, pt.y, nativeEvent, pointerId, pointerId==this._primaryPointerID || pointerId==-1, o.rawX, o.rawY);
			*/
			let evt = new MouseEvent(type, bubbles, false, o.x, o.y, nativeEvent, pointerId, pointerId === this._primaryPointerID || pointerId === -1, o.rawX, o.rawY, relatedTarget);
			target.dispatchEvent(evt);
		}

	}

	/**
	 * Dispatched when the user moves the mouse over the canvas.
	 * @see {@link easeljs.MouseEvent}
	 * @event easeljs.Stage#stagemousemove
	 * @since 0.6.0
	 */
	/**
	 * Dispatched when the user presses their left mouse button on the canvas.
	 * You can use {@link easeljs.Stage#mouseInBounds} to check whether the mouse is currently within the stage bounds.
	 * @see {@link easeljs.MouseEvent}
	 * @event easeljs.Stage#stagemousedown
	 * @since 0.6.0
	 */
	/**
	 * Dispatched when the user the user presses somewhere on the stage, then releases the mouse button anywhere that the page can detect it (this varies slightly between browsers).
	 * You can use {@link easeljs.Stage#mouseInBounds} to check whether the mouse is currently within the stage bounds.
	 * @see {@link easeljs.MouseEvent}
	 * @event easeljs.Stage#stagemouseup
	 * @since 0.6.0
	 */
	/**
	 * Dispatched when the mouse moves from within the canvas area (mouseInBounds === true) to outside it (mouseInBounds === false).
	 * This is currently only dispatched for mouse input (not touch).
	 * @see {@link easeljs.MouseEvent}
	 * @event easeljs.Stage#mouseleave
	 * @since 0.7.0
	 */
	/**
	 * Dispatched when the mouse moves into the canvas area (mouseInBounds === false) from outside it (mouseInBounds === true).
	 * This is currently only dispatched for mouse input (not touch).
	 * @see {@link easeljs.MouseEvent}
	 * @event easeljs.Stage#mouseenter
	 * @since 0.7.0
	 */
	/**
	 * Dispatched each update immediately before the tick event is propagated through the display list.
	 * You can call preventDefault on the event object to cancel propagating the tick event.
	 * @event easeljs.Stage#tickstart
	 * @since 0.7.0
	 */
	/**
	 * Dispatched each update immediately after the tick event is propagated through the display list. Does not fire if
	 * tickOnUpdate is false. Precedes the "drawstart" event.
	 * @event easeljs.Stage#tickend
	 * @since 0.7.0
	 */
	/**
	 * Dispatched each update immediately before the canvas is cleared and the display list is drawn to it.
	 * You can call preventDefault on the event object to cancel the draw.
	 * @event easeljs.Stage#drawstart
	 * @since 0.7.0
	 */
	/**
	 * Dispatched each update immediately after the display list is drawn to the canvas and the canvas context is restored.
	 * @event easeljs.Stage#drawend
	 * @since 0.7.0
	 */

	/**
	 * @license Canvas
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * Global utility for creating canvases.
	 * @memberof easeljs
	 * @name easeljs.createCanvas
	 * @param {Number} [width=1]
	 * @param {Number} [height=1]
	 */
	function createCanvas(width=1, height=1) {
		let c;
		if (window.createjs !== undefined && window.createjs.createCanvas !== undefined) {
			c = window.createjs.createCanvas();
		}
		if (window.document !== undefined && window.document.createElement !== undefined) {
			c = document.createElement("canvas");
		}
		if (c !== undefined) {
			c.width = width;
			c.height = height;
			return c;
		}

		throw "Canvas not supported in this environment.";
	}

	/**
	 * @license VideoBuffer
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2010 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * @license Bitmap
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * @license Sprite
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * Dispatched when an animation reaches its ends.
	 * @event easeljs.Sprite#animationend
	 * @property {Object} target The object that dispatched the event.
	 * @property {String} type The event type.
	 * @property {String} name The name of the animation that just ended.
	 * @property {String} next The name of the next animation that will be played, or null. This will be the same as name if the animation is looping.
	 * @since 0.6.0
	 */

	/**
	 * Dispatched any time the current frame changes. For example, this could be due to automatic advancement on a tick,
	 * or calling gotoAndPlay() or gotoAndStop().
	 * @event easeljs.Sprite#change
	 * @property {Object} target The object that dispatched the event.
	 * @property {String} type The event type.
	 */

	/**
	 * @license BitmapText
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * @license DOMElement
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
	 * are not full EaselJS display objects and do not participate in EaselJS mouse events.
	 * @event easeljs.DOMElement#click
	 */

	/**
	 * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
	 * are not full EaselJS display objects and do not participate in EaselJS mouse events.
	 * @event easeljs.DOMElement#dblClick
	 */

	/**
	 * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
	 * are not full EaselJS display objects and do not participate in EaselJS mouse events.
	 * @event easeljs.DOMElement#mousedown
	 */

	/**
	 * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
	 * are not full EaselJS display objects and do not participate in EaselJS mouse events.
	 * @event easeljs.DOMElement#mouseover
	 */

	/**
	 * Disabled in DOMElement.
	 * @event easeljs.DOMElement#tick
	 */

	/**
	 * @license Graphics
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * The Graphics class exposes an easy to use API for generating vector drawing instructions and drawing them to a
	 * specified context. Note that you can use Graphics without any dependency on the EaselJS framework by calling {@link easeljs.Graphics#draw}
	 * directly, or it can be used with the {@link easeljs.Shape} object to draw vector graphics within the
	 * context of an EaselJS display list.
	 *
	 * There are two approaches to working with Graphics object: calling methods on a Graphics instance (the "Graphics API"), or
	 * instantiating Graphics command objects and adding them to the graphics queue via {@link easeljs.Graphics#append}.
	 * The former abstracts the latter, simplifying beginning and ending paths, fills, and strokes.
	 *
	 * <h4>Tiny API</h4>
	 * The Graphics class also includes a "tiny API", which is one or two-letter methods that are shortcuts for all of the
	 * Graphics methods. These methods are great for creating compact instructions, and is used by the Toolkit for CreateJS
	 * to generate readable code. All tiny methods are marked as protected, so you can view them by enabling protected
	 * descriptions in the docs.
	 *
	 * <table>
	 *     <tr><td><b>Tiny</b></td><td><b>Method</b></td><td><b>Tiny</b></td><td><b>Method</b></td></tr>
	 *     <tr><td>mt</td><td>{@link easeljs.Graphics#moveTo}</td>
	 *     <td>lt</td> <td>{@link easeljs.Graphics#lineTo}</td></tr>
	 *     <tr><td>a/at</td><td>{@link easeljs.Graphics#arc} / {@link easeljs.Graphics#arcTo}</td>
	 *     <td>bt</td><td>{@link easeljs.Graphics#bezierCurveTo}</td></tr>
	 *     <tr><td>qt</td><td>{@link easeljs.Graphics#quadraticCurveTo} (also curveTo)</td>
	 *     <td>r</td><td>{@link easeljs.Graphics#rect}</td></tr>
	 *     <tr><td>cp</td><td>{@link easeljs.Graphics#closePath}</td>
	 *     <td>c</td><td>{@link easeljs.Graphics#clear}</td></tr>
	 *     <tr><td>f</td><td>{@link easeljs.Graphics#beginFill}</td>
	 *     <td>lf</td><td>{@link easeljs.Graphics#beginLinearGradientFill}</td></tr>
	 *     <tr><td>rf</td><td>{@link easeljs.Graphics#beginRadialGradientFill}</td>
	 *     <td>bf</td><td>{@link easeljs.Graphics#beginBitmapFill}</td></tr>
	 *     <tr><td>ef</td><td>{@link easeljs.Graphics#endFill}</td>
	 *     <td>ss / sd</td><td>{@link easeljs.Graphics#setStrokeStyle} / {@link easeljs.Graphics#setStrokeDash}</td></tr>
	 *     <tr><td>s</td><td>{@link easeljs.Graphics#beginStroke}</td>
	 *     <td>ls</td><td>{@link easeljs.Graphics#beginLinearGradientStroke}</td></tr>
	 *     <tr><td>rs</td><td>{@link easeljs.Graphics#beginRadialGradientStroke}</td>
	 *     <td>bs</td><td>{@link easeljs.Graphics#beginBitmapStroke}</td></tr>
	 *     <tr><td>es</td><td>{@link easeljs.Graphics#endStroke}</td>
	 *     <td>dr</td><td>{@link easeljs.Graphics#drawRect}</td></tr>
	 *     <tr><td>rr</td><td>{@link easeljs.Graphics#drawRoundRect}</td>
	 *     <td>rc</td><td>{@link easeljs.Graphics#drawRoundRectComplex}</td></tr>
	 *     <tr><td>dc</td><td>{@link easeljs.Graphics#drawCircle}</td>
	 *     <td>de</td><td>{@link easeljs.Graphics#drawEllipse}</td></tr>
	 *     <tr><td>dp</td><td>{@link easeljs.Graphics#drawPolyStar}</td>
	 *     <td>p</td><td>{@link easeljs.Graphics#decodePath}</td></tr>
	 * </table>
	 *
	 * @example
	 * var g = new createjs.Graphics();
	 * g.setStrokeStyle(1);
	 * g.beginStroke("#000000");
	 * g.beginFill("red");
	 * g.drawCircle(0,0,30);
	 *
	 * @example
	 * // All drawing methods in Graphics return the Graphics instance, so they can be chained together.
	 * graphics.beginStroke("red").beginFill("blue").drawRect(20, 20, 100, 50);
	 *
	 * @example
	 * // Each graphics API call generates a command object (see below). The last command to be created can be accessed via .command
	 * let fillCommand = graphics.beginFill("red").command;
	 * fillCommand.style = "blue";
	 * // or change it to a bitmap fill:
	 * fillCommand.bitmap(img);
	 *
	 * @example
	 * // For more direct control of rendering, you can instantiate and append command objects to the graphics queue directly.
	 * // In this case, you need to manage path creation manually, and ensure that fill/stroke is applied to a defined path:
	 *
	 * // start a new path. Graphics.beginCmd is a reusable BeginPath instance:
	 * graphics.append(Graphics.beginCmd);
	 * // we need to define the path before applying the fill:
	 * let circle = new Graphics.Circle(0,0,30);
	 * graphics.append(circle);
	 * // fill the path we just defined:
	 * let fill = new Graphics.Fill("red");
	 * graphics.append(fill);
	 *
	 * // These approaches can be used together, for example to insert a custom command:
	 * graphics.beginFill("red");
	 * let customCommand = new CustomSpiralCommand(etc);
	 * graphics.append(customCommand);
	 * graphics.beginFill("blue");
	 * graphics.drawCircle(0, 0, 30);
	 *
	 * @example <caption>Using the Tiny API</caption>
	 * graphics.s("red").f("blue").r(20, 20, 100, 50);
	 *
	 * @see {@link easeljs.Graphics#append}
	 * @memberof easeljs
	 */
	class Graphics {

		constructor () {
			/**
			 * Holds a reference to the last command that was created or appended. For example, you could retain a reference
			 * to a Fill command in order to dynamically update the color later by using:
			 *
			 * @example
			 * let fill = graphics.beginFill("red").command;
			 * // update color later:
			 * fill.style = "yellow";
			 *
			 * @type {Object}
			 * @default null
			 */
			this.command = null;


		// private properties
			/**
			 * @protected
			 * @type {easeljs.Graphics.Stroke}
			 */
			this._stroke = null;

			/**
			 * @protected
			 * @type {easeljs.Graphics.StrokeStyle}
			 */
			this._strokeStyle = null;

			/**
			 * @protected
			 * @type {easeljs.Graphics.StrokeStyle}
			 */
			this._oldStrokeStyle = null;

			/**
			 * @protected
			 * @type {easeljs.Graphics.StrokeDash}
			 */
			this._strokeDash = null;

			/**
			 * @protected
			 * @type {easeljs.Graphics.StrokeDash}
			 */
			this._oldStrokeDash = null;

			/**
			 * @protected
			 * @type {easeljs.Graphics.Fill}
			 */
			this._fill = null;

			/**
			 * @protected
			 * @type {Boolean}
			 */
			this._strokeIgnoreScale = false;

			/**
			 * Indicates the last instruction index that was committed.
			 * @protected
			 * @type {Number}
			 * @default 0
			 */
			this._commitIndex = 0;

			/**
			 * @protected
			 * @type {Array}
			 */
			this._instructions = [];

			/**
			 * Uncommitted instructions.
			 * @protected
			 * @type {Array}
			 */
			this._activeInstructions = [];

			/**
			 * This indicates that there have been changes to the activeInstruction list since the last updateInstructions call.
			 * @protected
			 * @type {Boolean}
			 * @default false
			 */
			this._dirty = false;

			/**
			 * Index to draw from if a store operation has happened.
			 * @protected
			 * @type {Number}
			 * @default 0
			 */
			this._storeIndex = 0;

			/**
			 * Maps the familiar ActionScript `curveTo()` method to the functionally similar {@link easeljs.Graphics#quadraticCurveTo} method.
			 * @param {Number} cpx
			 * @param {Number} cpy
			 * @param {Number} x
			 * @param {Number} y
			 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
			 * @chainable
			 */
			this.curveTo = this.quadraticCurveTo;

			/**
			 * Maps the familiar ActionScript `drawRect()` method to the functionally similar {@link easeljs.Graphics#rect} method.
			 * @param {Number} x
			 * @param {Number} y
			 * @param {Number} w Width of the rectangle
			 * @param {Number} h Height of the rectangle
			 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
			 * @chainable
			 */
			this.drawRect = this.rect;

			// tiny api
			this.mt = this.moveTo;
			this.lt = this.lineTo;
			this.at = this.arcTo;
			this.bt = this.bezierCurveTo;
			this.qt = this.quadraticCurveTo;
			this.a = this.arc;
			this.r = this.rect;
			this.cp = this.closePath;
			this.c = this.clear;
			this.f = this.beginFill;
			this.lf = this.beginLinearGradientFill;
			this.rf = this.beginRadialGradientFill;
			this.bf = this.beginBitmapFill;
			this.ef = this.endFill;
			this.ss = this.setStrokeStyle;
			this.sd = this.setStrokeDash;
			this.s = this.beginStroke;
			this.ls = this.beginLinearGradientStroke;
			this.rs = this.beginRadialGradientStroke;
			this.bs = this.beginBitmapStroke;
			this.es = this.endStroke;
			this.dr = this.drawRect;
			this.rr = this.drawRoundRect;
			this.rc = this.drawRoundRectComplex;
			this.dc = this.drawCircle;
			this.de = this.drawEllipse;
			this.dp = this.drawPolyStar;
			this.p = this.decodePath;

			this.clear();
		}

		/**
		 * Returns a CSS compatible color string based on the specified RGB numeric color values in the format
		 * "rgba(255,255,255,1.0)", or if alpha is null then in the format "rgb(255,255,255)".
		 * It also supports passing a single hex color value as the first param, and an optional alpha value as the second
		 * param.
		 *
		 * @example
		 * Graphics.getRGB(50, 100, 150, 0.5); // rgba(50,100,150,0.5)
		 * Graphics.getRGB(0xFF00FF, 0.2); // rgba(255,0,255,0.2)
		 *
		 * @static
		 * @param {Number} r The red component for the color, between 0 and 0xFF (255).
		 * @param {Number} g The green component for the color, between 0 and 0xFF (255).
		 * @param {Number} b The blue component for the color, between 0 and 0xFF (255).
		 * @param {Number} [alpha] The alpha component for the color where 0 is fully transparent and 1 is fully opaque.
		 * @return {String} A CSS compatible color string based on the specified RGB numeric color values in the format
		 * "rgba(255,255,255,1.0)", or if alpha is null then in the format "rgb(255,255,255)".
		 */
		static getRGB (r, g, b, alpha) {
			if (r != null && b == null) {
				alpha = g;
				b = r&0xFF;
				g = r>>8&0xFF;
				r = r>>16&0xFF;
			}
			if (alpha == null) {
				return `rgb(${r},${g},${b})`;
			} else {
				return `rgba(${r},${g},${b},${alpha})`;
			}
		}

		/**
		 * Returns a CSS compatible color string based on the specified HSL numeric color values in the format "hsla(360,100,100,1.0)",
		 * or if alpha is null then in the format "hsl(360,100,100)".
		 *
		 * @example
		 * Graphics.getHSL(150, 100, 70); // hsl(150,100,70)
		 *
		 * @static
		 * @param {Number} hue The hue component for the color, between 0 and 360.
		 * @param {Number} saturation The saturation component for the color, between 0 and 100.
		 * @param {Number} lightness The lightness component for the color, between 0 and 100.
		 * @param {Number} [alpha] The alpha component for the color where 0 is fully transparent and 1 is fully opaque.
		 * @return {String} A CSS compatible color string based on the specified HSL numeric color values in the format
		 * "hsla(360,100,100,1.0)", or if alpha is null then in the format "hsl(360,100,100)".
		 */
		static getHSL (hue, saturation, lightness, alpha) {
			if (alpha == null) {
				return `hsl(${hue % 360},${saturation}%,${lightness}%)`;
			} else {
				return `hsl(${hue % 360},${saturation}%,${lightness}%,${alpha})`;
			}
		}

		/**
		 * Returns the graphics instructions array. Each entry is a graphics command object (ex. Graphics.Fill, Graphics.Rect)
		 * Modifying the returned array directly is not recommended, and is likely to result in unexpected behaviour.
		 *
		 * This property is mainly intended for introspection of the instructions (ex. for graphics export).
		 * @type {Array}
		 * @readonly
		 */
		get instructions () {
			this._updateInstructions();
			return this._instructions;
		}

		/**
		 * Returns true if this Graphics instance has no drawing commands.
		 * @return {Boolean} Returns true if this Graphics instance has no drawing commands.
		 */
		isEmpty () {
			return !(this._instructions.length || this._activeInstructions.length);
		}

		/**
		 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
		 * Returns true if the draw was handled (useful for overriding functionality).
		 *
		 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
		 *
		 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
		 * @param {Object} data Optional data that is passed to graphics command exec methods. When called from a Shape instance, the shape passes itself as the data parameter. This can be used by custom graphic commands to insert contextual data.
		 */
		draw (ctx, data) {
			this._updateInstructions();
			let instr = this._instructions;
			const l = instr.length;
			for (let i = this._storeIndex; i < l; i++) {
				instr[i].exec(ctx, data);
			}
		}

		/**
		 * Draws only the path described for this Graphics instance, skipping any non-path instructions, including fill and
		 * stroke descriptions. Used for `DisplayObject.mask` to draw the clipping path, for example.
		 *
		 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
		 *
		 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
		 */
		drawAsPath (ctx) {
			this._updateInstructions();
			let instr, instrs = this._instructions;
			const l = instrs.length;
			for (let i = this._storeIndex; i < l; i++) {
				// the first command is always a beginPath command.
				if ((instr = instrs[i]).path !== false) { instr.exec(ctx); }
			}
		}

		/**
		 * Moves the drawing point to the specified position.
		 * A tiny API method "mt" also exists.
		 * @param {Number} x The x coordinate the drawing point should move to.
		 * @param {Number} y The y coordinate the drawing point should move to.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls).
		 * @chainable
		 */
		moveTo (x, y) {
			return this.append(new MoveTo(x,y), true);
		}

		/**
		 * Draws a line from the current drawing point to the specified position, which become the new current drawing
		 * point. Note that you *must* call {@link easeljs.Graphics#moveTo} before the first `lineTo()`.
		 * A tiny API method "lt" also exists.
		 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#complex-shapes-(paths) "WHATWG spec"}
		 * @param {Number} x The x coordinate the drawing point should draw to.
		 * @param {Number} y The y coordinate the drawing point should draw to.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		lineTo (x, y) {
			return this.append(new LineTo(x,y));
		}

		/**
		 * Draws an arc with the specified control points and radius.
		 * A tiny API method "at" also exists.
		 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-arcto "WHATWG spec"}
		 * @param {Number} x1
		 * @param {Number} y1
		 * @param {Number} x2
		 * @param {Number} y2
		 * @param {Number} radius
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		arcTo (x1, y1, x2, y2, radius) {
			return this.append(new ArcTo(x1, y1, x2, y2, radius));
		}

		/**
		 * Draws an arc defined by the radius, startAngle and endAngle arguments, centered at the position (x, y).
		 * A tiny API method "a" also exists.
		 *
		 * @example
		 * // draw a full circle with a radius of 20 centered at (100, 100)
		 * arc(100, 100, 20, 0, Math.PI*2);
		 *
		 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-arc "WHATWG spec"}
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} radius
		 * @param {Number} startAngle Measured in radians.
		 * @param {Number} endAngle Measured in radians.
		 * @param {Boolean} anticlockwise
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		arc (x, y, radius, startAngle, endAngle, anticlockwise) {
			return this.append(new Arc(x, y, radius, startAngle, endAngle, anticlockwise));
		}

		/**
		 * Draws a quadratic curve from the current drawing point to (x, y) using the control point (cpx, cpy).
		 * A tiny API method "qt" also exists.
		 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-quadraticcurveto "WHATWG spec"}
		 * @param {Number} cpx
		 * @param {Number} cpy
		 * @param {Number} x
		 * @param {Number} y
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		quadraticCurveTo (cpx, cpy, x, y) {
			return this.append(new QuadraticCurveTo(cpx, cpy, x, y));
		}

		/**
		 * Draws a bezier curve from the current drawing point to (x, y) using the control points (cp1x, cp1y) and (cp2x, cp2y).
		 * A tiny API method "bt" also exists.
		 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-beziercurveto "WHATWG spec"}
		 * @param {Number} cp1x
		 * @param {Number} cp1y
		 * @param {Number} cp2x
		 * @param {Number} cp2y
		 * @param {Number} x
		 * @param {Number} y
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		bezierCurveTo (cp1x, cp1y, cp2x, cp2y, x, y) {
			return this.append(new BezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y));
		}

		/**
		 * Draws a rectangle at (x, y) with the specified width and height using the current fill and/or stroke.
		 * A tiny API method "r" also exists.
		 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-rect "WHATWG spec"}
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} w Width of the rectangle
		 * @param {Number} h Height of the rectangle
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		rect (x, y, w, h) {
			return this.append(new Rect(x, y, w, h));
		}

		/**
		 * Closes the current path, effectively drawing a line from the current drawing point to the first drawing point specified
		 * since the fill or stroke was last set.
		 * A tiny API method "cp" also exists.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		closePath () {
			return this._activeInstructions.length ? this.append(new ClosePath()) : this;
		}

		/**
		 * Clears all drawing instructions, effectively resetting this Graphics instance. Any line and fill styles will need
		 * to be redefined to draw shapes following a clear call.
		 * A tiny API method "c" also exists.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		clear () {
			this._instructions.length = this._activeInstructions.length = this._commitIndex = 0;
			this._strokeStyle = this._oldStrokeStyle = this._stroke = this._fill = this._strokeDash = this._oldStrokeDash = null;
			this._dirty = this._strokeIgnoreScale = false;
			return this;
		}

		/**
		 * Begins a fill with the specified color. This ends the current sub-path.
		 * A tiny API method "f" also exists.
		 * @param {String} color A CSS compatible color value (ex. "red", "#FF0000", or "rgba(255,0,0,0.5)"). Setting to
		 * null will result in no fill.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		beginFill (color) {
			return this._setFill(color ? new Fill(color) : null);
		}

		/**
		 * Begins a linear gradient fill defined by the line (x0, y0) to (x1, y1).
		 * A tiny API method "lf" also exists.
		 *
		 * @example <caption>Define a black to white vertical gradient ranging from 20px to 120px, and draw a square to display it</caption>
		 * graphics.beginLinearGradientFill(["#000","#FFF"], [0, 1], 0, 20, 0, 120).drawRect(20, 20, 120, 120);
		 *
		 * @param {Array} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define a gradient
		 * drawing from red to blue.
		 * @param {Array} ratios An array of gradient positions which correspond to the colors. For example, [0.1, 0.9] would draw
		 * the first color to 10% then interpolating to the second color at 90%.
		 * @param {Number} x0 The position of the first point defining the line that defines the gradient direction and size.
		 * @param {Number} y0 The position of the first point defining the line that defines the gradient direction and size.
		 * @param {Number} x1 The position of the second point defining the line that defines the gradient direction and size.
		 * @param {Number} y1 The position of the second point defining the line that defines the gradient direction and size.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		beginLinearGradientFill (colors, ratios, x0, y0, x1, y1) {
			return this._setFill(new Fill().linearGradient(colors, ratios, x0, y0, x1, y1));
		}

		/**
		 * Begins a radial gradient fill. This ends the current sub-path.
		 * A tiny API method "rf" also exists.
		 *
		 * @example <caption>Define a red to blue radial gradient centered at (100, 100), with a radius of 50, and draw a circle to display it</caption>
		 * graphics.beginRadialGradientFill(["#F00","#00F"], [0, 1], 100, 100, 0, 100, 100, 50).drawCircle(100, 100, 50);
		 *
		 * @param {Array} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define
		 * a gradient drawing from red to blue.
		 * @param {Array} ratios An array of gradient positions which correspond to the colors. For example, [0.1,
		 * 0.9] would draw the first color to 10% then interpolating to the second color at 90%.
		 * @param {Number} x0 Center position of the inner circle that defines the gradient.
		 * @param {Number} y0 Center position of the inner circle that defines the gradient.
		 * @param {Number} r0 Radius of the inner circle that defines the gradient.
		 * @param {Number} x1 Center position of the outer circle that defines the gradient.
		 * @param {Number} y1 Center position of the outer circle that defines the gradient.
		 * @param {Number} r1 Radius of the outer circle that defines the gradient.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		beginRadialGradientFill (colors, ratios, x0, y0, r0, x1, y1, r1) {
			return this._setFill(new Fill().radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1));
		}

		/**
		 * Begins a pattern fill using the specified image. This ends the current sub-path.
		 * A tiny API method "bf" also exists.
		 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} image The Image, Canvas, or Video object to use
		 * as the pattern. Must be loaded prior to creating a bitmap fill, or the fill will be empty.
		 * @param {String} repetition Optional. Indicates whether to repeat the image in the fill area. One of "repeat",
		 * "repeat-x", "repeat-y", or "no-repeat". Defaults to "repeat". Note that Firefox does not support "repeat-x" or
		 * "repeat-y" (latest tests were in FF 20.0), and will default to "repeat".
		 * @param {easeljs.Matrix2D} matrix Optional. Specifies a transformation matrix for the bitmap fill. This transformation
		 * will be applied relative to the parent transform.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		beginBitmapFill (image, repetition, matrix) {
			return this._setFill(new Fill(null, matrix).bitmap(image, repetition));
		}

		/**
		 * Ends the current sub-path, and begins a new one with no fill. Functionally identical to `beginFill(null)`.
		 * A tiny API method "ef" also exists.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		endFill () {
			return this.beginFill();
		}

		/**
		 * Sets the stroke style.
		 * A tiny API method "ss" also exists.
		 *
		 * @example
		 * graphics.setStrokeStyle(8,"round").beginStroke("#F00");
		 *
		 * @param {Number} thickness The width of the stroke.
		 * @param {String | Number} [caps=0] Indicates the type of caps to use at the end of lines. One of butt,
		 * round, or square. Defaults to "butt". Also accepts the values 0 (butt), 1 (round), and 2 (square) for use with
		 * the tiny API.
		 * @param {String | Number} [joints=0] Specifies the type of joints that should be used where two lines meet.
		 * One of bevel, round, or miter. Defaults to "miter". Also accepts the values 0 (miter), 1 (round), and 2 (bevel)
		 * for use with the tiny API.
		 * @param {Number} [miterLimit=10] If joints is set to "miter", then you can specify a miter limit ratio which
		 * controls at what point a mitered joint will be clipped.
		 * @param {Boolean} [ignoreScale=false] If true, the stroke will be drawn at the specified thickness regardless
		 * of active transformations.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		setStrokeStyle (thickness, caps = 0, joints = 0, miterLimit = 10, ignoreScale = false) {
			this._updateInstructions(true);
			this._strokeStyle = this.command = new StrokeStyle(thickness, caps, joints, miterLimit, ignoreScale);

			// ignoreScale lives on Stroke, not StrokeStyle, so we do a little trickery:
			if (this._stroke) { this._stroke.ignoreScale = ignoreScale; }
			this._strokeIgnoreScale = ignoreScale;
			return this;
		}

		/**
		 * Sets or clears the stroke dash pattern.
		 * A tiny API method `sd` also exists.
		 *
		 * @example
		 * graphics.setStrokeDash([20, 10], 0);
		 *
		 * @param {Array} [segments] An array specifying the dash pattern, alternating between line and gap.
		 * For example, `[20,10]` would create a pattern of 20 pixel lines with 10 pixel gaps between them.
		 * Passing null or an empty array will clear the existing stroke dash.
		 * @param {Number} [offset=0] The offset of the dash pattern. For example, you could increment this value to create a "marching ants" effect.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		setStrokeDash (segments, offset = 0) {
			this._updateInstructions(true);
			this._strokeDash = this.command = new StrokeDash(segments, offset);
			return this;
		}

		/**
		 * Begins a stroke with the specified color. This ends the current sub-path.
		 * A tiny API method "s" also exists.
		 *
		 * @param {String} color A CSS compatible color value (ex. "#FF0000", "red", or "rgba(255,0,0,0.5)"). Setting to
		 * null will result in no stroke.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		beginStroke (color) {
			return this._setStroke(color ? new Stroke(color) : null);
		}

		/**
		 * Begins a linear gradient stroke defined by the line (x0, y0) to (x1, y1). This ends the current sub-path.
		 * A tiny API method "ls" also exists.
		 *
		 * @example <caption>Define a black to white vertical gradient ranging from 20px to 120px, and draw a square to display it</caption>
		 * graphics.setStrokeStyle(10)
		 *   .beginLinearGradientStroke(["#000","#FFF"], [0, 1], 0, 20, 0, 120)
		 *   .drawRect(20, 20, 120, 120);
		 *
		 * @param {Array<String>} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define
		 * a gradient drawing from red to blue.
		 * @param {Array<Number>} ratios An array of gradient positions which correspond to the colors. For example, [0.1,
		 * 0.9] would draw the first color to 10% then interpolating to the second color at 90%.
		 * @param {Number} x0 The position of the first point defining the line that defines the gradient direction and size.
		 * @param {Number} y0 The position of the first point defining the line that defines the gradient direction and size.
		 * @param {Number} x1 The position of the second point defining the line that defines the gradient direction and size.
		 * @param {Number} y1 The position of the second point defining the line that defines the gradient direction and size.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		beginLinearGradientStroke (colors, ratios, x0, y0, x1, y1) {
			return this._setStroke(new Stroke().linearGradient(colors, ratios, x0, y0, x1, y1));
		}

		/**
		 * Begins a radial gradient stroke. This ends the current sub-path.
		 * A tiny API method "rs" also exists.
		 *
		 * @example <caption>Define a red to blue radial gradient centered at (100, 100), with a radius of 50, and draw a rectangle to display it</caption>
		 * graphics.setStrokeStyle(10)
		 *   .beginRadialGradientStroke(["#F00","#00F"], [0, 1], 100, 100, 0, 100, 100, 50)
		 *   .drawRect(50, 90, 150, 110);
		 *
		 * @param {Array<String>} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define
		 * a gradient drawing from red to blue.
		 * @param {Array<Number>} ratios An array of gradient positions which correspond to the colors. For example, [0.1,
		 * 0.9] would draw the first color to 10% then interpolating to the second color at 90%, then draw the second color
		 * to 100%.
		 * @param {Number} x0 Center position of the inner circle that defines the gradient.
		 * @param {Number} y0 Center position of the inner circle that defines the gradient.
		 * @param {Number} r0 Radius of the inner circle that defines the gradient.
		 * @param {Number} x1 Center position of the outer circle that defines the gradient.
		 * @param {Number} y1 Center position of the outer circle that defines the gradient.
		 * @param {Number} r1 Radius of the outer circle that defines the gradient.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		beginRadialGradientStroke (colors, ratios, x0, y0, r0, x1, y1, r1) {
			return this._setStroke(new Stroke().radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1));
		}

		/**
		 * Begins a pattern fill using the specified image. This ends the current sub-path. Note that unlike bitmap fills,
		 * strokes do not currently support a matrix parameter due to limitations in the canvas API.
		 * A tiny API method "bs" also exists.
		 *
		 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} image The Image, Canvas, or Video object to use
		 * as the pattern. Must be loaded prior to creating a bitmap fill, or the fill will be empty.
		 * @param {String} [repetition="repeat"] Indicates whether to repeat the image in the fill area. One of
		 * "repeat", "repeat-x", "repeat-y", or "no-repeat". Defaults to "repeat".
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		beginBitmapStroke (image, repetition = "repeat") {
			// NOTE: matrix is not supported for stroke because transforms on strokes also affect the drawn stroke width.
			return this._setStroke(new Stroke().bitmap(image, repetition));
		}

		/**
		 * Ends the current sub-path, and begins a new one with no stroke. Functionally identical to `beginStroke(null)`.
		 * A tiny API method "es" also exists.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		endStroke () {
			return this.beginStroke();
		}

		/**
		 * Draws a rounded rectangle with all corners with the specified radius.
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} w
		 * @param {Number} h
		 * @param {Number} radius Corner radius.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		drawRoundRect (x, y, w, h, radius) {
			return this.drawRoundRectComplex(x, y, w, h, radius, radius, radius, radius);
		}

		/**
		 * Draws a rounded rectangle with different corner radii. Supports positive and negative corner radii.
		 * A tiny API method "rc" also exists.
		 * @param {Number} x The horizontal coordinate to draw the round rect.
		 * @param {Number} y The vertical coordinate to draw the round rect.
		 * @param {Number} w The width of the round rect.
		 * @param {Number} h The height of the round rect.
		 * @param {Number} radiusTL Top left corner radius.
		 * @param {Number} radiusTR Top right corner radius.
		 * @param {Number} radiusBR Bottom right corner radius.
		 * @param {Number} radiusBL Bottom left corner radius.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		drawRoundRectComplex (x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
			return this.append(new RoundRect(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL));
		}

		/**
		 * Draws a circle with the specified radius at (x, y).
		 * A tiny API method "dc" also exists.
		 *
		 * @example
		 * let g = new Graphics();
		 * g.setStrokeStyle(1);
		 * g.beginStroke(Graphics.getRGB(0,0,0));
		 * g.beginFill(Graphics.getRGB(255,0,0));
		 * g.drawCircle(0,0,3);
		 * let s = new Shape(g);
		 * s.x = 100;
		 * s.y = 100;
		 * stage.addChild(s);
		 * stage.update();
		 *
		 * @param {Number} x x coordinate center point of circle.
		 * @param {Number} y y coordinate center point of circle.
		 * @param {Number} radius Radius of circle.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		drawCircle (x, y, radius) {
			return this.append(new Circle(x, y, radius));
		}

		/**
		 * Draws an ellipse (oval) with a specified width (w) and height (h). Similar to {@link easels.Graphics#drawCircle},
		 * except the width and height can be different.
		 * A tiny API method "de" also exists.
		 * @param {Number} x The left coordinate point of the ellipse. Note that this is different from {@link easels.Graphics#drawCircle}
		 * which draws from center.
		 * @param {Number} y The top coordinate point of the ellipse. Note that this is different from {@link easels.Graphics#drawCircle}
		 * which draws from the center.
		 * @param {Number} w The height (horizontal diameter) of the ellipse. The horizontal radius will be half of this
		 * number.
		 * @param {Number} h The width (vertical diameter) of the ellipse. The vertical radius will be half of this number.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		drawEllipse (x, y, w, h) {
			return this.append(new Ellipse(x, y, w, h));
		}

		/**
		 * Draws a star if pointSize is greater than 0, or a regular polygon if pointSize is 0 with the specified number of points.
		 * A tiny API method "dp" also exists.
		 *
		 * @example <caption>Draw a 5 pointed star shape centered at 100, 100 and with a radius of 50</caption>
		 * graphics.beginFill("#FF0").drawPolyStar(100, 100, 50, 5, 0.6, -90);
		 * // Note: -90 makes the first point vertical
		 *
		 * @param {Number} x Position of the center of the shape.
		 * @param {Number} y Position of the center of the shape.
		 * @param {Number} radius The outer radius of the shape.
		 * @param {Number} sides The number of points on the star or sides on the polygon.
		 * @param {Number} pointSize The depth or "pointy-ness" of the star points. A pointSize of 0 will draw a regular
		 * polygon (no points), a pointSize of 1 will draw nothing because the points are infinitely pointy.
		 * @param {Number} angle The angle of the first point / corner. For example a value of 0 will draw the first point
		 * directly to the right of the center.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		drawPolyStar (x, y, radius, sides, pointSize, angle) {
			return this.append(new PolyStar(x, y, radius, sides, pointSize, angle));
		}

		/**
		 * Appends a graphics command object to the graphics queue. Command objects expose an "exec" method
		 * that accepts two parameters: the Context2D to operate on, and an arbitrary data object passed into
		 * {@link easeljs.Graphics#draw}. The latter will usually be the Shape instance that called draw.
		 *
		 * This method is used internally by Graphics methods, such as drawCircle, but can also be used directly to insert
		 * built-in or custom graphics commands.
		 *
		 * @example
		 * // attach data to our shape, so we can access it during the draw:
		 * shape.color = "red";
		 *
		 * // append a Circle command object:
		 * shape.graphics.append(new Graphics.Circle(50, 50, 30));
		 *
		 * // append a custom command object with an exec method that sets the fill style
		 * // based on the shape's data, and then fills the circle.
		 * shape.graphics.append({
		 *   exec: (ctx, shape) => {
		 *     ctx.fillStyle = shape.color;
		 *     ctx.fill();
		 *   }
		 * });
		 *
		 * @param {Object} command A graphics command object exposing an "exec" method.
		 * @param {Boolean} clean The clean param is primarily for internal use. A value of true indicates that a command does not generate a path that should be stroked or filled.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		append (command, clean) {
			this._activeInstructions.push(command);
			this.command = command;
			if (!clean) { this._dirty = true; }
			return this;
		}

		/**
		 * Decodes a compact encoded path string into a series of draw instructions.
		 * This format is not intended to be human readable, and is meant for use by authoring tools.
		 * The format uses a base64 character set, with each character representing 6 bits, to define a series of draw
		 * commands.
		 *
		 * Each command is comprised of a single "header" character followed by a variable number of alternating x and y
		 * position values. Reading the header bits from left to right (most to least significant): bits 1 to 3 specify the
		 * type of operation (0-moveTo, 1-lineTo, 2-quadraticCurveTo, 3-bezierCurveTo, 4-closePath, 5-7 unused). Bit 4
		 * indicates whether position values use 12 bits (2 characters) or 18 bits (3 characters), with a one indicating the
		 * latter. Bits 5 and 6 are currently unused.
		 *
		 * Following the header is a series of 0 (closePath), 2 (moveTo, lineTo), 4 (quadraticCurveTo), or 6 (bezierCurveTo)
		 * parameters. These parameters are alternating x/y positions represented by 2 or 3 characters (as indicated by the
		 * 4th bit in the command char). These characters consist of a 1 bit sign (1 is negative, 0 is positive), followed
		 * by an 11 (2 char) or 17 (3 char) bit integer value. All position values are in tenths of a pixel. Except in the
		 * case of move operations which are absolute, this value is a delta from the previous x or y position (as
		 * appropriate).
		 *
		 * For example, the string "A3cAAMAu4AAA" represents a line starting at -150,0 and ending at 150,0.
		 * <br />A - bits 000000. First 3 bits (000) indicate a moveTo operation. 4th bit (0) indicates 2 chars per
		 * parameter.
		 * <br />n0 - 110111011100. Absolute x position of -150.0px. First bit indicates a negative value, remaining bits
		 * indicate 1500 tenths of a pixel.
		 * <br />AA - 000000000000. Absolute y position of 0.
		 * <br />I - 001100. First 3 bits (001) indicate a lineTo operation. 4th bit (1) indicates 3 chars per parameter.
		 * <br />Au4 - 000000101110111000. An x delta of 300.0px, which is added to the previous x value of -150.0px to
		 * provide an absolute position of +150.0px.
		 * <br />AAA - 000000000000000000. A y delta value of 0.
		 *
		 * A tiny API method "p" also exists.
		 *
		 * @param {String} str The path string to decode.
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		decodePath (str) {
			let instructions = [this.moveTo, this.lineTo, this.quadraticCurveTo, this.bezierCurveTo, this.closePath];
			let paramCount = [2, 2, 4, 6, 0];
			let i = 0;
			const l = str.length;
			let params = [];
			let x = 0, y = 0;
			let base64 = Graphics._BASE_64;

			while (i < l) {
				let c = str.charAt(i);
				let n = base64[c];
				let fi = n>>3; // highest order bits 1-3 code for operation.
				let f = instructions[fi];
				// check that we have a valid instruction & that the unused bits are empty:
				if (!f || (n&3)) { throw `Bad path data (@${i}):c`; }
				const pl = paramCount[fi];
				if (!fi) { x=y=0; } // move operations reset the position.
				params.length = 0;
				i++;
				let charCount = (n>>2&1)+2;  // 4th header bit indicates number size for this operation.
				for (let p = 0; p < pl; p++) {
					let num = base64[str.charAt(i)];
					let sign = (num>>5) ? -1 : 1;
					num = ((num&31)<<6)|(base64[str.charAt(i+1)]);
					if (charCount === 3) { num = (num<<6)|(base64[str.charAt(i+2)]); }
					num = sign*num/10;
					if (p%2) { x = (num += x); }
					else { y = (num += y); }
					params[p] = num;
					i += charCount;
				}
				f.apply(this, params);
			}
			return this;
		}

		/**
		 * Stores all graphics commands so they won't be executed in future draws. Calling store() a second time adds to
		 * the existing store. This also affects `drawAsPath()`.
		 *
		 * This is useful in cases where you are creating vector graphics in an iterative manner (ex. generative art), so
		 * that only new graphics need to be drawn (which can provide huge performance benefits), but you wish to retain all
		 * of the vector instructions for later use (ex. scaling, modifying, or exporting).
		 *
		 * Note that calling store() will force the active path (if any) to be ended in a manner similar to changing
		 * the fill or stroke.
		 *
		 * For example, consider a application where the user draws lines with the mouse. As each line segment (or collection of
		 * segments) are added to a Shape, it can be rasterized using {@link easeljs.DisplayObject#updateCache},
		 * and then stored, so that it can be redrawn at a different scale when the application is resized, or exported to SVGraphics.
		 *
		 * @example
		 * // set up cache:
		 * shape.cache(0,0,500,500,scale);
		 *
		 * // when the user drags, draw a new line:
		 * shape.graphics.moveTo(oldX,oldY).lineTo(newX,newY);
		 * // then draw it into the existing cache:
		 * shape.updateCache("source-over");
		 * // store the new line, so it isn't redrawn next time:
		 * shape.store();
		 *
		 * // then, when the window resizes, we can re-render at a different scale:
		 * // first, unstore all our lines:
		 * shape.unstore();
		 * // then cache using the new scale:
		 * shape.cache(0,0,500,500,newScale);
		 * // finally, store the existing commands again:
		 * shape.store();
		 *
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		store () {
			this._updateInstructions(true);
			this._storeIndex = this._instructions.length;
			return this;
		}

		/**
		 * Unstores any graphics commands that were previously stored using {@link easeljs.Graphics#store}
		 * so that they will be executed in subsequent draw calls.
		 *
		 * @return {easeljs.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		unstore () {
			this._storeIndex = 0;
			return this;
		}

		/**
		 * Returns a clone of this Graphics instance. Note that the individual command objects are not cloned.
		 * @return {easeljs.Graphics} A clone of the current Graphics instance.
		 */
		clone () {
			let o = new Graphics();
			o.command = this.command;
			o._stroke = this._stroke;
			o._strokeStyle = this._strokeStyle;
			o._strokeDash = this._strokeDash;
			o._strokeIgnoreScale = this._strokeIgnoreScale;
			o._fill = this._fill;
			o._instructions = this._instructions.slice();
			o._commitIndex = this._commitIndex;
			o._activeInstructions = this._activeInstructions.slice();
			o._dirty = this._dirty;
			o._storeIndex = this._storeIndex;
			return o;
		}

		/**
		 * Returns a string representation of this object.
		 * @return {String} a string representation of the instance.
		 */
		toString () {
			return `[${this.constructor.name}]`;
		}

		/**
		 * @param {Boolean} commit
		 * @protected
		 */
		_updateInstructions (commit) {
			let instr = this._instructions, active = this._activeInstructions, commitIndex = this._commitIndex;

			if (this._dirty && active.length) {
				instr.length = commitIndex; // remove old, uncommitted commands
				instr.push(Graphics.beginCmd);

				const l = active.length, ll = instr.length;
				instr.length = ll+l;
				for (let i = 0; i < l; i++) { instr[i+ll] = active[i]; }

				if (this._fill) { instr.push(this._fill); }
				if (this._stroke) {
					// doesn't need to be re-applied if it hasn't changed.
					if (this._strokeDash !== this._oldStrokeDash) {
						instr.push(this._strokeDash);
					}
					if (this._strokeStyle !== this._oldStrokeStyle) {
						instr.push(this._strokeStyle);
					}
					if (commit) {
						this._oldStrokeDash = this._strokeDash;
						this._oldStrokeStyle = this._strokeStyle;
					}
					instr.push(this._stroke);
				}

				this._dirty = false;
			}

			if (commit) {
				active.length = 0;
				this._commitIndex = instr.length;
			}
		};

		/**
		 * @param {easeljs.Graphics.Fill} fill
		 * @protected
		 */
		_setFill (fill) {
			this._updateInstructions(true);
			this.command = this._fill = fill;
			return this;
		}

		/**
		 * @param {easeljs.Graphics.Stroke} stroke
		 * @protected
		 */
		_setStroke (stroke) {
			this._updateInstructions(true);
			if (this.command = this._stroke = stroke) {
				stroke.ignoreScale = this._strokeIgnoreScale;
			}
			return this;
		}

		static get LineTo () { return LineTo; }
		static get MoveTo () { return MoveTo; }
		static get ArcTo () { return ArcTo; }
		static get Arc () { return Arc; }
		static get QuadraticCurveTo () { return QuadraticCurveTo; }
		static get BezierCurveTo () { return BezierCurveTo; }
		static get Rect () { return Rect; }
		static get ClosePath () { return ClosePath; }
		static get BeginPath () { return BeginPath; }
		static get Fill () { return Fill; }
		static get Stroke () { return Stroke; }
		static get StrokeStyle () { return StrokeStyle; }
		static get StrokeDash () { return StrokeDash; }
		static get RoundRect () { return RoundRect; }
		static get Circle () { return Circle; }
		static get Ellipse () { return Ellipse; }
		static get PolyStar () { return PolyStar; }

	}

	/**
	 * @see {@link easeljs.Graphics#lineTo}
	 * @alias easeljs.Graphics.LineTo
	 * @param {Number} x
	 * @param {Number} y
	 */
	class LineTo {
		constructor (x, y) {
			/**
			 * @type {Number}
			 */
			this.x = x;
			/**
			 * @type {Number}
			 */
			this.y = y;
		}
		/**
		 * Execute the Graphics command in the provided Canvas context.
		 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
		 */
		exec (ctx) {
			ctx.lineTo(this.x, this.y);
		}
	}

	/**
	 * @see {@link easeljs.Graphics#moveTo}
	 * @alias easeljs.Graphics.MoveTo
	 * @param {Number} x
	 * @param {Number} y
	 */
	class MoveTo {
	 	constructor (x, y) {
			/**
			 * @type {Number}
			 */
	 		this.x = x;
			/**
			 * @type {Number}
			 */
			this.y = y;
	 	}
		/**
		 * @param {CanvasRenderingContext2D} ctx
		 */
	 	exec (ctx) {
	 		ctx.moveTo(this.x, this.y);
	 	}
	}


	/**
	 * @see {@link easeljs.Graphics#arcTo}
	 * @alias easeljs.Graphics.ArcTo
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} x2
	 * @param {Number} y2
	 * @param {Number} radius
	 */
	class ArcTo {
	 	constructor (x1, y1, x2, y2, radius) {
			/**
			 * @type {Number}
			 */
		 	this.x1 = x1;
			/**
			 * @type {Number}
			 */
			this.y1 = y1;
			/**
			 * @type {Number}
			 */
		 	this.x2 = x2;
			/**
			 * @type {Number}
			 */
			this.y2 = y2;
			/**
			 * @type {Number}
			 */
		 	this.radius = radius;
	 	}
		/**
		 * Execute the Graphics command in the provided Canvas context.
		 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
		 */
	 	exec (ctx) {
	 		ctx.arcTo(this.x1, this.y1, this.x2, this.y2, this.radius);
	 	}
	}

	/**
	 * @see {@link easeljs.Graphics#arc}
	 * @alias easeljs.Graphics.Arc
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 * @param {Number} startAngle
	 * @param {Number} endAngle
	 * @param {Boolean} [anticlockwise=false]
	 */
	class Arc {
	 	constructor (x, y, radius, startAngle, endAngle, anticlockwise = false) {
			/**
			 * @type {Number}
			 */
		 	this.x = x;
			/**
			 * @type {Number}
			 */
			this.y = y;
			/**
			 * @type {Number}
			 */
		 	this.radius = radius;
			/**
			 * @type {Number}
			 */
		 	this.startAngle = startAngle;
			/**
			 * @type {Number}
			 */
			this.endAngle = endAngle;
			/**
			 * @type {Boolean}
			 */
		 	this.anticlockwise = anticlockwise;
	 	}
		/**
		 * Execute the Graphics command in the provided Canvas context.
		 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
		 */
	 	exec (ctx) {
	 		ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise);
	 	}
	}

	/**
	 * @see {@link easeljs.Graphics#quadraticCurveTo}
	 * @alias easeljs.Graphics.QuadraticCurveTo
	 * @param {Number} cpx
	 * @param {Number} cpy
	 * @param {Number} x
	 * @param {Number} y
	 */
	class QuadraticCurveTo {
	 	constructor (cpx, cpy, x, y) {
			/**
			 * @property cpx
			 * @type Number
			 */
		 	this.cpx = cpx;
			/**
			 * @property cpy
			 * @type Number
			 */
			this.cpy = cpy;
			/**
			 * @property x
			 * @type Number
			 */
		 	this.x = x;
			/**
			 * @property y
			 * @type Number
			 */
			this.y = y;
	 	}
		/**
		 * Execute the Graphics command in the provided Canvas context.
		 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
		 */
	 	exec (ctx) {
	 		ctx.quadraticCurveTo(this.cpx, this.cpy, this.x, this.y);
	 	}
	}

	/**
	 * @see {@link easeljs.Graphics#bezierCurveTo}
	 * @alias easeljs.Graphics.BezierCurveTo
	 * @param {Number} cp1x
	 * @param {Number} cp1y
	 * @param {Number} cp2x
	 * @param {Number} cp2y
	 * @param {Number} x
	 * @param {Number} y
	 */
	class BezierCurveTo {
	 	constructor (cp1x, cp1y, cp2x, cp2y, x, y) {
			/**
			 * @type {Number}
			 */
		 	this.cp1x = cp1x;
			/**
			 * @type {Number}
			 */
			this.cp1y = cp1y;
			/**
			 * @type {Number}
			 */
		 	this.cp2x = cp2x;
			/**
			 * @type {Number}
			 */
			this.cp2y = cp2y;
			/**
			 * @type {Number}
			 */
		 	this.x = x;
			/**
			 * @type {Number}
			 */
			this.y = y;
	 	}
		/**
		 * Execute the Graphics command in the provided Canvas context.
		 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
		 */
	 	exec (ctx) {
	 		ctx.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x, this.y);
	 	}
	}

	/**
	 * @see {@link easeljs.Graphics#rect}
	 * @alias easeljs.Graphics.Rect
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w
	 * @param {Number} h
	 */
	class Rect {
	 	constructor (x, y, w, h) {
			/**
			 * @type {Number}
			 */
		 	this.x = x;
			/**
			 * @type {Number}
			 */
			this.y = y;
			/**
			 * @type {Number}
			 */
		 	this.w = w;
			/**
			 * @type {Number}
			 */
			this.h = h;
	 	}
		/**
		 * Execute the Graphics command in the provided Canvas context.
		 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
		 */
	 	exec (ctx) {
	 		ctx.rect(this.x, this.y, this.w, this.h);
	 	}
	}

	/**
	 * @see {@link easeljs.Graphics#closePath}
	 * @alias easeljs.Graphics.ClosePath
	 */
	class ClosePath {
	 	constructor () { }
		/**
		 * Execute the Graphics command in the provided Canvas context.
		 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
		 */
	 	exec (ctx) {
	 		ctx.closePath();
	 	}
	}

	/**
	 * @see {@link easeljs.Graphics#beginPath}
	 * @alias easeljs.Graphics.BeginPath
	 */
	class BeginPath {
	 	constructor () { }
		/**
		 * Execute the Graphics command in the provided Canvas context.
		 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
		 */
	 	exec (ctx) {
	 		ctx.beginPath();
	 	}
	}

	/**
	 * @see {@link easeljs.Graphics#beginFill}
	 * @alias easeljs.Graphics.Fill
	 * @param {Object} style A valid Context2D fillStyle.
	 * @param {Matrix2D} matrix
	 */
	class Fill {
		constructor (style, matrix) {
			/**
			 * A valid Context2D fillStyle.
			 * @type {Object}
			 */
			this.style = style;
			/**
			 * @type {easeljs.Matrix2D}
			 */
			this.matrix = matrix;
			/**
			 * @type {Boolean}
			 */
			this.path = false;
		}
		/**
		 * Execute the Graphics command in the provided Canvas context.
		 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
		 */
		exec (ctx) {
			if (!this.style) { return; }
			ctx.fillStyle = this.style;
			let mtx = this.matrix;
			if (mtx) { ctx.save(); ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty); }
			ctx.fill();
			if (mtx) { ctx.restore(); }
		}
		/**
		 * Creates a linear gradient style and assigns it to {@link easeljs.Graphics.Fill#style}.
		 * @see {@link easeljs.Graphics#beginLinearGradientFill}
		 * @param {Array<String>} colors
		 * @param {Array<Number>} ratios
		 * @param {Number} x0
		 * @param {Number} y0
		 * @param {Number} x1
		 * @param {Number} y1
		 * @return {easeljs.Graphics.Fill} Returns this Fill object for chaining or assignment.
		 */
		linearGradient (colors, ratios, x0, y0, x1, y1) {
			let o = this.style = Graphics._ctx.createLinearGradient(x0, y0, x1, y1);
			const l = colors.length;
			for (let i = 0; i < l; i++) { o.addColorStop(ratios[i], colors[i]); }
			o.props = {colors, ratios, x0, y0, x1, y1, type:"linear"};
			return this;
		}
		/**
		 * Creates a linear gradient style and assigns it to {@link easeljs.Graphics.Fill#style}.
		 * @see {@link easeljs.Graphics#beginRadialGradientFill}
		 * @param {Array<String>} colors
		 * @param {Array<Number>} ratios
		 * @param {Number} x0
		 * @param {Number} y0
		 * @param {Number} r0
		 * @param {Number} x1
		 * @param {Number} y1
		 * @param {Number} r1
		 * @return {easeljs.Graphics.Fill} Returns this Fill object for chaining or assignment.
		 */
		radialGradient (colors, ratios, x0, y0, r0, x1, y1, r1) {
			let o = this.style = Graphics._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
			const l = colors.length;
			for (let i = 0; i < l; i++) { o.addColorStop(ratios[i], colors[i]); }
			o.props = {colors, ratios, x0, y0, r0, x1, y1, r1, type: "radial"};
			return this;
		}
		/**
		 * Creates a linear gradient style and assigns it to {@link easeljs.Graphics.Fill#style}.
		 * @see {@link easeljs.Graphics#beginBitmapFill}
		 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} image  Must be loaded prior to creating a bitmap fill, or the fill will be empty.
		 * @param {String} [repetition=""] One of: repeat, repeat-x, repeat-y, or no-repeat.
		 * @return {easeljs.Graphics.Fill} Returns this Fill object for chaining or assignment.
		 */
		bitmap (image, repetition = "") {
			if (image.naturalWidth || image.getContext || image.readyState >= 2) {
				let o = this.style = Graphics._ctx.createPattern(image, repetition);
				o.props = {image, repetition, type: "bitmap"};
			}
			return this;
		}
	}

	/**
	 * @see {@link easeljs.Graphics#beginStroke}
	 * @alias easeljs.Graphics.Stroke
	 * @extends easeljs.Graphics.Fill
	 * @param {Object} style A valid Context2D fillStyle.
	 * @param {Boolean} ignoreScale
	 */
	class Stroke extends Fill {
		constructor (style, ignoreScale) {
			super();
			/**
			 * A valid Context2D strokeStyle.
			 * @type {Object}
			 */
			this.style = style;
			/**
			 * @type {Boolean}
			 */
			this.ignoreScale = ignoreScale;
			/**
			 * @type {Boolean}
			 */
			this.path = false;
		}
		/**
		 * Execute the Graphics command in the provided Canvas context.
		 * @override
		 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
		 */
		exec (ctx) {
			if (!this.style) { return; }
			ctx.strokeStyle = this.style;
			if (this.ignoreScale) { ctx.save(); ctx.setTransform(1,0,0,1,0,0); }
			ctx.stroke();
			if (this.ignoreScale) { ctx.restore(); }
		}
	}

	/**
	 * @see {@link easeljs.Graphics#setStrokeStyle}
	 * @alias easeljs.Graphics.StrokeStyle
	 * @param {Number} [width=1]
	 * @param {String} [caps=butt]
	 * @param {String} [joints=miter]
	 * @param {Number} [miterLimit=10]
	 * @param {Boolean} [ignoreScale=false]
	 */
	class StrokeStyle {
		constructor (width=1, caps="butt", joints="miter", miterLimit=10, ignoreScale=false) {
			/**
			 * @type {Number}
			 */
			this.width = width;
			/**
			 * One of: butt, round, square
			 * @type {String}
			 */
			this.caps = caps;
			/**
			 * One of: round, bevel, miter
			 * @type {String}
			 */
			this.joints = joints;
			/**
			 * @type {Number}
			 */
			this.miterLimit = miterLimit;
			/**
			 * @type {Boolean}
			 */
			this.ignoreScale = ignoreScale;
			/**
			 * @type {Boolean}
			 */
			this.path = false;
		}
		/**
		 * Execute the Graphics command in the provided Canvas context.
		 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
		 */
		exec (ctx) {
			ctx.lineWidth = this.width;
			ctx.lineCap = (isNaN(this.caps) ? this.caps : Graphics._STROKE_CAPS_MAP[this.caps]);
			ctx.lineJoin = (isNaN(this.joints) ? this.joints : Graphics._STROKE_JOINTS_MAP[this.joints]);
			ctx.miterLimit = this.miterLimit;
			ctx.ignoreScale = this.ignoreScale;
		}
	}

	/**
	 * @see {@link easeljs.Graphics#setStrokeDash}
	 * @alias easeljs.Graphics.StrokeDash
	 * @param {Array} [segments=[]]
	 * @param {Number} [offset=0]
	 */
	class StrokeDash {
	 	constructor (segments=[], offset=0) {
			/**
			 * @type {Array}
			 */
		 	this.segments = segments;
			/**
			 * @type {Number}
			 */
		 	this.offset = offset;
	 	}

		/**
		 * Execute the Graphics command in the provided Canvas context.
		 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
		 */
	 	exec (ctx) {
	 		if (ctx.setLineDash) { // feature detection.
		 		ctx.setLineDash(this.segments);
		 		ctx.lineDashOffset = this.offset;
		 	}
	 	}
	}

	/**
	 * @see {@link easeljs.Graphics#drawRoundRectComplex}
	 * @alias easeljs.Graphics.RoundRect
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w
	 * @param {Number} h
	 * @param {Number} radiusTL
	 * @param {Number} radiusTR
	 * @param {Number} radiusBR
	 * @param {Number} radiusBL
	 */
	class RoundRect {
	 	constructor (x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
			/**
			 * @type {Number}
			 */
		 	this.x = x;
			/**
			 * @type {Number}
			 */
			this.y = y;
			/**
			 * @type {Number}
			 */
		 	this.w = w;
			/**
			 * @type {Number}
			 */
			this.h = h;
			/**
			 * @type {Number}
			 */
		 	this.radiusTL = radiusTL;
			/**
			 * @type {Number}
			 */
			this.radiusTR = radiusTR;
			/**
			 * @type {Number}
			 */
		 	this.radiusBR = radiusBR;
			/**
			 * @type {Number}
			 */
			this.radiusBL = radiusBL;
	 	}
		/**
		 * Execute the Graphics command in the provided Canvas context.
		 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
		 */
	 	exec (ctx) {
	 		let max = (this.w<this.h?this.w:this.h)/2;
		 	let mTL=0, mTR=0, mBR=0, mBL=0;
		 	let x = this.x, y = this.y, w = this.w, h = this.h;
		 	let rTL = this.radiusTL, rTR = this.radiusTR, rBR = this.radiusBR, rBL = this.radiusBL;

		 	if (rTL < 0) { rTL *= (mTL=-1); }
		 	if (rTL > max) { rTL = max; }
		 	if (rTR < 0) { rTR *= (mTR=-1); }
		 	if (rTR > max) { rTR = max; }
		 	if (rBR < 0) { rBR *= (mBR=-1); }
		 	if (rBR > max) { rBR = max; }
		 	if (rBL < 0) { rBL *= (mBL=-1); }
		 	if (rBL > max) { rBL = max; }

		 	ctx.moveTo(x+w-rTR, y);
		 	ctx.arcTo(x+w+rTR*mTR, y-rTR*mTR, x+w, y+rTR, rTR);
		 	ctx.lineTo(x+w, y+h-rBR);
		 	ctx.arcTo(x+w+rBR*mBR, y+h+rBR*mBR, x+w-rBR, y+h, rBR);
		 	ctx.lineTo(x+rBL, y+h);
		 	ctx.arcTo(x-rBL*mBL, y+h+rBL*mBL, x, y+h-rBL, rBL);
		 	ctx.lineTo(x, y+rTL);
		 	ctx.arcTo(x-rTL*mTL, y-rTL*mTL, x+rTL, y, rTL);
		 	ctx.closePath();
	 	}
	}

	/**
	 * @see {@link easeljs.Graphics#drawCircle}
	 * @alias easeljs.Graphics.Circle
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 */
	class Circle {
	 	constructor (x, y, radius) {
			/**
			 * @type {Number}
			 */
		 	this.x = x;
			/**
			 * @type {Number}
			 */
			this.y = y;
			/**
			 * @type {Number}
			 */
		 	this.radius = radius;
	 	}
		/**
		 * Execute the Graphics command in the provided Canvas context.
		 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
		 */
	 	exec (ctx) {
	 		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
	 	}
	}

	/**
	 * @see {@link easeljs.Graphics#drawEllipse}
	 * @alias easeljs.Graphics.Ellipse
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w
	 * @param {Number} h
	 */
	class Ellipse {
	 	constructor (x, y, w, h) {
			/**
			 * @type {Number}
			 */
		 	this.x = x;
			/**
			 * @type {Number}
			 */
			this.y = y;
			/**
			 * @type {Number}
			 */
		 	this.w = w;
			/**
			 * @type {Number}
			 */
			this.h = h;
	 	}
		/**
		 * Execute the Graphics command in the provided Canvas context.
		 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
		 */
	 	exec (ctx) {
	 		let x = this.x, y = this.y;
		 	let w = this.w, h = this.h;

		 	let k = 0.5522848;
		 	let ox = (w / 2) * k;
		 	let oy = (h / 2) * k;
		 	let xe = x + w;
		 	let ye = y + h;
		 	let xm = x + w / 2;
		 	let ym = y + h / 2;

		 	ctx.moveTo(x, ym);
		 	ctx.bezierCurveTo(x, ym-oy, xm-ox, y, xm, y);
		 	ctx.bezierCurveTo(xm+ox, y, xe, ym-oy, xe, ym);
		 	ctx.bezierCurveTo(xe, ym+oy, xm+ox, ye, xm, ye);
		 	ctx.bezierCurveTo(xm-ox, ye, x, ym+oy, x, ym);
	 	}
	}

	/**
	 *  @see {@link easeljs.Graphics#drawPolyStar}
	 * @alias easeljs.Graphics.PolyStar
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 * @param {Number} sides
	 * @param {Number} [pointSize=0]
	 * @param {Number} [angle=0]
	 */
	class PolyStar {
	 	constructor (x, y, radius, sides, pointSize=0, angle=0) {
			/**
			 * @type {Number}
			 */
		 	this.x = x;
			/**
			 * @type {Number}
			 */
			this.y = y;
			/**
			 * @type {Number}
			 */
		 	this.radius = radius;
			/**
			 * @type {Number}
			 */
		 	this.sides = sides;
			/**
			 * @type {Number}
			 */
		 	this.pointSize = pointSize;
			/**
			 * @type {Number}
			 */
		 	this.angle = angle;
	 	}
		/**
		 * Execute the Graphics command in the provided Canvas context.
		 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
		 */
	 	exec (ctx) {
	 		let x = this.x, y = this.y;
		 	let radius = this.radius;
		 	let angle = this.angle/180*Math.PI;
		 	let sides = this.sides;
		 	let ps = 1-this.pointSize;
		 	let a = Math.PI/sides;

		 	ctx.moveTo(x+Math.cos(angle)*radius, y+Math.sin(angle)*radius);
		 	for (let i = 0; i < sides; i++) {
		 		angle += a;
		 		if (ps != 1) {
		 			ctx.lineTo(x+Math.cos(angle)*radius*ps, y+Math.sin(angle)*radius*ps);
		 		}
		 		angle += a;
		 		ctx.lineTo(x+Math.cos(angle)*radius, y+Math.sin(angle)*radius);
		 	}
		 	ctx.closePath();
	 	}
	}

	/**
	 * A reusable instance of {@link easeljs.Graphics.BeginPath} to avoid unnecessary instantiation.
	 * @static
	 * @readonly
	 * @type {easeljs.Graphics.BeginPath}
	 */
	Graphics.beginCmd = new BeginPath();
	/**
	 * Map of Base64 characters to values. Used by {@link easeljs.Graphics#decodePath}.
	 * @static
	 * @readonly
	 * @protected
	 * @type {Object}
	 */
	Graphics._BASE_64 = {"A":0,"B":1,"C":2,"D":3,"E":4,"F":5,"G":6,"H":7,"I":8,"J":9,"K":10,"L":11,"M":12,"N":13,"O":14,"P":15,"Q":16,"R":17,"S":18,"T":19,"U":20,"V":21,"W":22,"X":23,"Y":24,"Z":25,"a":26,"b":27,"c":28,"d":29,"e":30,"f":31,"g":32,"h":33,"i":34,"j":35,"k":36,"l":37,"m":38,"n":39,"o":40,"p":41,"q":42,"r":43,"s":44,"t":45,"u":46,"v":47,"w":48,"x":49,"y":50,"z":51,"0":52,"1":53,"2":54,"3":55,"4":56,"5":57,"6":58,"7":59,"8":60,"9":61,"+":62,"/":63};
	/**
	 * Maps numeric values for the caps parameter of {@link easeljs.Graphics#setStrokeStyle} to
	 * corresponding string values. This is primarily for use with the tiny API.<br />
	 * The mappings are as follows:
	 * <ul>
	 *   <li>0 to "butt"</li>
	 *   <li>1 to "round"</li>
	 *   <li>2 to "square".</li>
	 * </ul>
	 *
	 * @example <caption>Set line caps to "square"</caption>
	 * graphics.ss(16, 2);
	 *
	 * @static
	 * @readonly
	 * @protected
	 * @type {Array<String>}
	 */
	Graphics._STROKE_CAPS_MAP = ["butt","round","square"];
	/**
	 * Maps numeric values for the joints parameter of {@link easeljs.Graphics#setStrokeStyle} to
	 * corresponding string values. This is primarily for use with the tiny API.<br />
	 * The mappings are as follows:
	 * <ul>
	 *   <li>0 to "miter"</li>
	 *   <li>1 to "round"</li>
	 *   <li>2 to "bevel".</li>
	 * </ul>
	 *
	 * @example <caption>Set the line joints to "bevel"</caption>
	 * graphics.ss(16, 0, 2);
	 *
	 * @static
	 * @readonly
	 * @protected
	 * @type {Array<String>}
	 */
	Graphics._STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
	/**
	 * @static
	 * @readonly
	 * @protected
	 * @type {CanvasRenderingContext2D}
	 */
	Graphics._ctx = createCanvas().getContext("2d");

	/**
	 * @license AbstractTween
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * Base class that both {@link tweenjs.Tween} and {@link tweenjs.Timeline} extend. Should not be instantiated directly.
	 *
	 * @memberof tweenjs
	 * @extends core.EventDispatcher
	 *
	 * @param {Object} [props] The configuration properties to apply to this instance (ex. `{loop:-1, paused:true}`).
	 * @param {Boolean} [props.useTicks=false] See the {@link tweenjs.AbstractTween#useTicks} property for more information.
	 * @param {Boolean} [props.ignoreGlobalPause=false] See the {@link tweenjs.AbstractTween#ignoreGlobalPause} for more information.
	 * @param {Number|Boolean} [props.loop=0] See the {@link tweenjs.AbstractTween#loop} for more information.
	 * @param {Boolean} [props.reversed=false] See the {@link tweenjs.AbstractTween#reversed} for more information.
	 * @param {Boolean} [props.bounce=false] See the {@link tweenjs.AbstractTween#bounce} for more information.
	 * @param {Number} [props.timeScale=1] See the {@link tweenjs.AbstractTween#timeScale} for more information.
	 * @param {Function} [props.onChange] Adds the specified function as a listener to the {@link tweenjs.AbstractTween#event:change} event.
	 * @param {Function} [props.onComplete] Adds the specified function as a listener to the {@link tweenjs.AbstractTween#event:complete} event.
	 */
	class AbstractTween extends EventDispatcher {

	  constructor (props) {
	    super();

			/**
			 * Causes this tween to continue playing when a global pause is active. For example, if TweenJS is using {@link core.Ticker},
			 * then setting this to false (the default) will cause this tween to be paused when `Ticker.setPaused(true)`
			 * is called. See the {@link tweenjs.Tween#tick} method for more info. Can be set via the `props` parameter.
			 * @type {Boolean}
			 * @default false
			 */
			this.ignoreGlobalPause = false;

			/**
			 * Indicates the number of times to loop. If set to -1, the tween will loop continuously.
			 * @type {Number}
			 * @default 0
			 */
			this.loop = 0;

			/**
			 * Uses ticks for all durations instead of milliseconds. This also changes the behaviour of some actions (such as `call`).
			 * Changing this value on a running tween could have unexpected results.
			 * @type {Boolean}
			 * @default false
			 * @readonly
			 */
			this.useTicks = false;

			/**
			 * Causes the tween to play in reverse.
			 * @type {Boolean}
			 * @default false
			 */
			this.reversed = false;

			/**
			 * Causes the tween to reverse direction at the end of each loop.
			 * @type {Boolean}
			 * @default false
			 */
			this.bounce = false;

			/**
			 * Changes the rate at which the tween advances. For example, a `timeScale` value of `2` will double the
			 * playback speed, a value of `0.5` would halve it.
			 * @type {Number}
			 * @default 1
			 */
			this.timeScale = 1;

			/**
			 * Indicates the duration of this tween in milliseconds (or ticks if `useTicks` is true), irrespective of `loops`.
			 * This value is automatically updated as you modify the tween. Changing it directly could result in unexpected
			 * behaviour.
			 * @type {Number}
			 * @default 0
			 * @readonly
			 */
			this.duration = 0;

			/**
			 * The current normalized position of the tween. This will always be a value between 0 and `duration`.
			 * Changing this property directly will have unexpected results, use {@link tweenjs.Tween#setPosition}.
			 * @type {Object}
			 * @default 0
			 * @readonly
			 */
			this.position = 0;

			/**
			 * The raw tween position. This value will be between `0` and `loops * duration` while the tween is active, or -1 before it activates.
			 * @type {Number}
			 * @default -1
			 * @readonly
			 */
			this.rawPosition = -1;

			/**
			 * @private
			 * @default false
			 */
			this._paused = true;

			/**
			 * @private
			 * @type {Tween}
			 * @default null
			 */
			this._next = null;

			/**
			 * @private
			 * @type {Tween}
			 * @default null
			 */
			this._prev = null;

			/**
			 * @private
			 * @type {Object}
			 * @default null
			 */
			this._parent = null;

			/**
			 * @private
			 * @type {Object}
			 */
			this._labels = null;

			/**
			 * @private
			 * @type {Object[]}
			 */
			this._labelList = null;

			if (props) {
				this.useTicks = !!props.useTicks;
				this.ignoreGlobalPause = !!props.ignoreGlobalPause;
				this.loop = props.loop === true ? -1 : (props.loop||0);
				this.reversed = !!props.reversed;
				this.bounce = !!props.bounce;
				this.timeScale = props.timeScale||1;
				props.onChange && this.addEventListener("change", props.onChange);
				props.onComplete && this.addEventListener("complete", props.onComplete);
			}

			// while `position` is shared, it needs to happen after ALL props are set, so it's handled in _init()
	  }

		/**
		 * Returns a list of the labels defined on this tween sorted by position.
		 * @type {Object[]}
		 */
		get labels () {
			let list = this._labelList;
			if (!list) {
				list = this._labelList = [];
				let labels = this._labels;
				for (let label in labels) {
					list.push({ label, position: labels[label] });
				}
				list.sort((a, b) => a.position - b.position);
			}
			return list;
		}
		set labels (labels) {
			this._labels = labels;
			this._labelList = null;
		}

	  /**
	   * Returns the name of the label on or immediately before the current position. For example, given a tween with
	   * two labels, "first" on frame index 4, and "second" on frame 8, currentLabel would return:
	   * <ul>
	   *   <li>null if the current position is 2.</li>
	   *   <li>"first" if the current position is 4.</li>
	   *   <li>"first" if the current position is 7.</li>
	   *   <li>"second" if the current position is 15.</li>
	   * </ul>
	   * @type {String}
	   * @readonly
	   */
	  get currentLabel () {
	    let labels = this.labels;
	    let pos = this.position;
	    for (let i = 0, l = labels.length; i < l; i++) { if (pos < labels[i].position) { break; } }
	    return (i === 0) ? null : labels[i-1].label;
	  }

	  /**
	   * Pauses or unpauses the tween. A paused tween is removed from the global registry and is eligible for garbage collection
	   * if no other references to it exist.
	   * @type {Boolean}
		 */
		get paused () { return this._paused; }
	  set paused (paused) {
	    Tween._register(this, paused);
			this._paused = paused;
	  }

		/**
		 * Advances the tween by a specified amount.	 *
		 * @param {Number} delta The amount to advance in milliseconds (or ticks if useTicks is true). Negative values are supported.
		 * @param {Boolean} [ignoreActions=false] If true, actions will not be executed due to this change in position.
		 */
		advance (delta, ignoreActions = false) {
			this.setPosition(this.rawPosition + delta * this.timeScale, ignoreActions);
		}

		/**
		 * Advances the tween to a specified position.
		 *
		 * @emits tweenjs.AbstractTween#event:change
		 * @emits tweenjs.AbstractTween#event:complete
		 *
		 * @param {Number} rawPosition The raw position to seek to in milliseconds (or ticks if useTicks is true).
		 * @param {Boolean} [ignoreActions=false] If true, do not run any actions that would be triggered by this operation.
		 * @param {Boolean} [jump=false] If true, only actions at the new position will be run. If false, actions between the old and new position are run.
		 * @param {Function} [callback] Primarily for use with MovieClip, this callback is called after properties are updated, but before actions are run.
		 */
		setPosition (rawPosition, ignoreActions = false, jump = false, callback) {
			const d = this.duration, loopCount = this.loop, prevRawPos = this.rawPosition;
	    let loop = 0, t = 0, end = false;

			// normalize position:
			if (rawPosition < 0) { rawPosition = 0; }

			if (d === 0) {
				// deal with 0 length tweens.
				end = true;
				if (prevRawPos !== -1) { return end; } // we can avoid doing anything else if we're already at 0.
			} else {
				loop = rawPosition / d | 0;
				t = rawPosition - loop * d;

				end = (loopCount !== -1 && rawPosition >= loopCount * d + d);
				if (end) { rawPosition = (t = d) * (loop = loopCount) + d; }
				if (rawPosition === prevRawPos) { return end; } // no need to update

				// current loop is reversed
				if (!this.reversed !== !(this.bounce && loop % 2)) { t = d - t; }
			}

			// set this in advance in case an action modifies position:
			this.position = t;
			this.rawPosition = rawPosition;

			this._updatePosition(jump, end);
			if (end) { this.paused = true; }

			callback && callback(this);

			if (!ignoreActions) { this._runActions(prevRawPos, rawPosition, jump, !jump && prevRawPos === -1); }

			this.dispatchEvent("change");
			if (end) { this.dispatchEvent("complete"); }
		}

		/**
		 * Calculates a normalized position based on a raw position.
		 *
		 * @example
		 * // given a tween with a duration of 3000ms set to loop:
		 * console.log(myTween.calculatePosition(3700); // 700
		 *
		 * @param {Number} rawPosition A raw position.
		 */
		calculatePosition (rawPosition) {
			// largely duplicated from setPosition, but necessary to avoid having to instantiate generic objects to pass values (end, loop, position) back.
			const d = this.duration, loopCount = this.loop;
	    let loop = 0, t = 0;

			if (d === 0) { return 0; }
			if (loopCount !== -1 && rawPosition >= loopCount * d + d) {
	      t = d;
	      loop = loopCount;
	    } else if (rawPosition < 0) {
	      t = 0;
	    } else {
	      loop = rawPosition / d | 0;
	      t = rawPosition - loop * d;
	    }

			return (!this.reversed !== !(this.bounce && loop % 2)) ? d - t : t;
		}

		/**
		 * Adds a label that can be used with {@link tweenjs.Timeline#gotoAndPlay}/{@link tweenjs.Timeline#gotoAndStop}.
		 *
		 * @param {String} label The label name.
		 * @param {Number} position The position this label represents.
		 */
		addLabel (label, position) {
			if (!this._labels) { this._labels = {}; }
			this._labels[label] = position;
			const list = this._labelList;
			if (list) {
				for (let i = 0, l = list.length; i < l; i++) { if (position < list[i].position) { break; } }
				list.splice(i, 0, { label, position });
			}
		}

		/**
		 * Unpauses this timeline and jumps to the specified position or label.
		 *
		 * @param {String|Number} positionOrLabel The position in milliseconds (or ticks if `useTicks` is `true`)
		 * or label to jump to.
		 */
		gotoAndPlay (positionOrLabel) {
			this.paused = false;
			this._goto(positionOrLabel);
		}

		/**
		 * Pauses this timeline and jumps to the specified position or label.
		 *
		 * @param {String|Number} positionOrLabel The position in milliseconds (or ticks if `useTicks` is `true`) or label
		 * to jump to.
		 */
		gotoAndStop (positionOrLabel) {
			this.paused = true;
			this._goto(positionOrLabel);
		}

		/**
		 * If a numeric position is passed, it is returned unchanged. If a string is passed, the position of the
		 * corresponding frame label will be returned, or `null` if a matching label is not defined.
		 *
		 * @param {String|Number} positionOrLabel A numeric position value or label String.
		 */
		resolve (positionOrLabel) {
			const pos = Number(positionOrLabel);
	    return isNaN(pos) ? this._labels && this._labels[positionOrLabel] : pos;
		}

		/**
		 * Returns a string representation of this object.
		 *
		 * @return {String} a string representation of the instance.
		 */
		toString () {
			return `[${this.constructor.name}${this.name ? ` (name=${this.name})` : ""}]`;
		}

		/**
		 * @throws AbstractTween cannot be cloned.
		 */
		clone () {
			throw "AbstractTween cannot be cloned.";
		}

		/**
		 * Shared logic that executes at the end of the subclass constructor.
		 *
		 * @private
		 *
		 * @param {Object} [props]
		 */
		_init (props) {
			if (!props || !props.paused) { this.paused = false; }
			if (props && props.position != null) { this.setPosition(props.position); }
		}

		/**
		 * @private
		 * @param {String|Number} positionOrLabel
		 */
		_goto (positionOrLabel) {
			const pos = this.resolve(positionOrLabel);
			if (pos != null) { this.setPosition(pos, false, true); }
		}

		/**
	   * Runs actions between startPos & endPos. Separated to support action deferral.
	   *
		 * @private
		 *
		 * @param {Number} startRawPos
		 * @param {Number} endRawPos
		 * @param {Boolean} jump
		 * @param {Boolean} includeStart
		 */
		_runActions (startRawPos, endRawPos, jump, includeStart) {
		  // console.log(this.passive === false ? " > Tween" : "Timeline", "run", startRawPos, endRawPos, jump, includeStart);
			// if we don't have any actions, and we're not a Timeline, then return:
			// TODO: a cleaner way to handle this would be to override this method in Tween, but I'm not sure it's worth the overhead.
			if (!this._actionHead && !this.tweens) { return; }

			const d = this.duration, loopCount = this.loop;
	    let reversed = this.reversed, bounce = this.bounce;
			let loop0, loop1, t0, t1;

			if (d === 0) {
				// deal with 0 length tweens:
				loop0 = loop1 = t0 = t1 = 0;
				reversed = bounce = false;
			} else {
				loop0 = startRawPos / d | 0;
				loop1 = endRawPos / d | 0;
				t0 = startRawPos - loop0 * d;
				t1 = endRawPos - loop1 * d;
			}

			// catch positions that are past the end:
			if (loopCount !== -1) {
				if (loop1 > loopCount) { t1 = d; loop1 = loopCount; }
				if (loop0 > loopCount) { t0 = d; loop0 = loopCount; }
			}

			// special cases:
			if (jump) { return this._runActionsRange(t1, t1, jump, includeStart); } // jump.
	    else if (loop0 === loop1 && t0 === t1 && !jump && !includeStart) { return; } // no actions if the position is identical and we aren't including the start
			else if (loop0 === -1) { loop0 = t0 = 0; } // correct the -1 value for first advance, important with useTicks.

			const dir = (startRawPos <= endRawPos);
			let loop = loop0;
			do {
				let rev = !reversed !== !(bounce && loop % 2);
				let start = (loop === loop0) ? t0 : dir ? 0 : d;
				let end = (loop === loop1) ? t1 : dir ? d : 0;

				if (rev) {
					start = d - start;
					end = d - end;
				}

				if (bounce && loop !== loop0 && start === end) ;
				else if (this._runActionsRange(start, end, jump, includeStart || (loop !== loop0 && !bounce))) { return true; }

				includeStart = false;
			} while ((dir && ++loop <= loop1) || (!dir && --loop >= loop1));
		}

	  /**
	   * @private
	   * @abstract
	   * @throws Must be overridden by a subclass.
		 */
		_runActionsRange (startPos, endPos, jump, includeStart) {
			throw "_runActionsRange is abstract and must be overridden by a subclass.";
		}

	  /**
		 * @private
	   * @abstract
	   * @throws Must be overridden by a subclass.
		 */
		_updatePosition (jump, end) {
	    throw "_updatePosition is abstract and must be overridden by a subclass.";
		}

	}

	/**
	 * Dispatched whenever the tween's position changes. It occurs after all tweened properties are updated and actions
	 * are executed.
	 * @event tweenjs.AbstractTween#change
	 */
	/**
	 * Dispatched when the tween reaches its end and has paused itself. This does not fire until all loops are complete;
	 * tweens that loop continuously will never fire a complete event.
	 * @event tweenjs.AbstractTween#complete
	 */

	/**
	 * @license Ease
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * The Ease class provides a collection of easing functions for use with TweenJS. It does not use the standard 4 param
	 * easing signature. Instead it uses a single param which indicates the current linear ratio (0 to 1) of the tween.
	 *
	 * Most methods on Ease can be passed directly as easing functions:
	 *
	 *      Tween.get(target).to({x:100}, 500, Ease.linear);
	 *
	 * However, methods beginning with "get" will return an easing function based on parameter values:
	 *
	 *      Tween.get(target).to({y:200}, 500, Ease.getPowIn(2.2));
	 *
	 * Please see the <a href="http://www.createjs.com/Demos/TweenJS/Tween_SparkTable">spark table demo</a> for an
	 * overview of the different ease types on <a href="http://tweenjs.com">TweenJS.com</a>.
	 *
	 * <em>Equations derived from work by Robert Penner.</em>
	 *
	 * @memberof tweenjs
	 * @module Ease
	 */

	/**
	 * @param {Number} t
	 * @return {Number}
	 */
	function linear (t) {
		return t;
	}

	/**
	 * Configurable elastic ease.
	 * @param {Number} amplitude
	 * @param {Number} period
	 * @return {Function}
	 */
	function getElasticIn (amplitude, period) {
		let pi2 = Math.PI * 2;
		return function (t) {
			if (t === 0 || t === 1) return t;
			let s = period / pi2 * Math.asin(1 / amplitude);
			return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
		};
	}

	/**
	 * Configurable elastic ease.
	 * @param {Number} amplitude
	 * @param {Number} period
	 * @return {Function}
	 */
	function getElasticOut (amplitude, period) {
		let pi2 = Math.PI * 2;
		return function (t) {
			if (t === 0 || t === 1) return t;
			let s = period / pi2 * Math.asin(1 / amplitude);
			return amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / period) + 1;
		};
	}

	/**
	 * Configurable elastic ease.
	 * @param {Number} amplitude
	 * @param {Number} period
	 * @return {Function}
	 */
	function getElasticInOut (amplitude, period) {
		let pi2 = Math.PI * 2;
		return function (t) {
			let s = period / pi2 * Math.asin(1 / amplitude);
			if ((t *= 2) < 1) return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
			return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * pi2 / period) * 0.5 + 1;
		};
	}
	/**
	 * @param {Number} t
	 * @return {Number}
	 */
	const elasticIn = getElasticIn(1, 0.3);
	/**
	 * @param {Number} t
	 * @return {Number}
	 */
	const elasticOut = getElasticOut(1, 0.3);
	/**
	 * @param {Number} t
	 * @return {Number}
	 */
	const elasticInOut = getElasticInOut(1, 0.3 * 1.5);

	/**
	 * @license Tween
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * Tweens properties for a single target. Methods can be chained to create complex animation sequences:
	 *
	 * @example
	 * Tween.get(target)
	 *   .wait(500)
	 *   .to({ alpha: 0, visible: false }, 1000)
	 *   .call(handleComplete);
	 *
	 * Multiple tweens can share a target, however if they affect the same properties there could be unexpected
	 * behaviour. To stop all tweens on an object, use {@link tweenjs.Tween#removeTweens} or pass `override:true`
	 * in the props argument.
	 *
	 * 	createjs.Tween.get(target, {override:true}).to({x:100});
	 *
	 * Subscribe to the {@link tweenjs.Tween#event:change} event to be notified when the tween position changes.
	 *
	 * 	createjs.Tween.get(target, {override:true}).to({x:100}).addEventListener("change", handleChange);
	 * 	function handleChange(event) {
	 * 		// The tween changed.
	 * 	}
	 *
	 * @see {@link tweenjs.Tween.get}
	 *
	 * @memberof tweenjs
	 * @extends tweenjs.AbstractTween
	 *
	 * @param {Object} target The target object that will have its properties tweened.
	 * @param {Object} [props] The configuration properties to apply to this instance (ex. `{loop:-1, paused:true}`).
	 * @param {Boolean} [props.useTicks]
	 * @param {Boolean} [props.ignoreGlobalPause]
	 * @param {Number|Boolean} [props.loop]
	 * @param {Boolean} [props.reversed]
	 * @param {Boolean} [props.bounce]
	 * @param {Number} [props.timeScale]
	 * @param {Object} [props.pluginData]
	 * @param {Boolean} [props.paused]
	 * @param {*} [props.position] indicates the initial position for this tween
	 * @param {*} [props.onChange] adds the specified function as a listener to the `change` event
	 * @param {*} [props.onComplete] adds the specified function as a listener to the `complete` event
	 * @param {*} [props.override] if true, removes all existing tweens for the target
	 */
	class Tween extends AbstractTween {

		constructor (target, props) {
			super(props);

			/**
			 * Allows you to specify data that will be used by installed plugins. Each plugin uses this differently, but in general
			 * you specify data by assigning it to a property of `pluginData` with the same name as the plugin.
			 * Note that in many cases, this data is used as soon as the plugin initializes itself for the tween.
			 * As such, this data should be set before the first `to` call in most cases.
			 *
			 * Some plugins also store working data in this object, usually in a property named `_PluginClassName`.
			 * See the documentation for individual plugins for more details.
			 *
			 * @example
			 * myTween.pluginData.SmartRotation = data;
			 * myTween.pluginData.SmartRotation_disabled = true;
			 *
			 *
			 * @default null
			 * @type {Object}
			 */
			this.pluginData = null;

			/**
			 * The target of this tween. This is the object on which the tweened properties will be changed.
			 * @type {Object}
			 * @readonly
			 */
			this.target = target;

			/**
			 * Indicates the tween's current position is within a passive wait.
			 * @type {Boolean}
			 * @default false
			 * @readonly
			 */
			this.passive = false;

			/**
			 * @private
			 * @type {TweenStep}
			 */
			this._stepHead = new TweenStep(null, 0, 0, {}, null, true);

			/**
			 * @private
			 * @type {TweenStep}
			 */
			this._stepTail = this._stepHead;

			/**
			 * The position within the current step. Used by MovieClip.
			 * @private
			 * @type {Number}
			 * @default 0
			 */
			this._stepPosition = 0;

			/**
			 * @private
			 * @type {TweenAction}
			 * @default null
			 */
			this._actionHead = null;

			/**
			 * @private
			 * @type {TweenAction}
			 * @default null
			 */
			this._actionTail = null;

			/**
			 * Plugins added to this tween instance.
			 * @private
			 * @type {Object[]}
			 * @default null
			 */
			this._plugins = null;

			/**
			 * Hash for quickly looking up added plugins. Null until a plugin is added.
			 * @private
			 * @type {Object}
			 * @default null
			 */
			this._pluginIds = null;


			/**
			 * Used by plugins to inject new properties.
			 * @private
			 * @type {Object}
			 * @default null
			 */
			this._injected = null;

			if (props) {
				this.pluginData = props.pluginData;
				if (props.override) { Tween.removeTweens(target); }
			}
			if (!this.pluginData) { this.pluginData = {}; }

			this._init(props);
		}

		/**
		 * Returns a new tween instance. This is functionally identical to using `new Tween(...)`, but may look cleaner
		 * with the chained syntax of TweenJS.
		 *
		 * @static
		 * @example
		 * let tween = Tween.get(target).to({ x: 100 }, 500);
		 * // equivalent to:
		 * let tween = new Tween(target).to({ x: 100 }, 500);
		 *
		 * @param {Object} target The target object that will have its properties tweened.
		 * @param {Object} [props] The configuration properties to apply to this instance (ex. `{loop:-1, paused:true}`).
		 * @param {Boolean} [props.useTicks]
		 * @param {Boolean} [props.ignoreGlobalPause]
		 * @param {Number|Boolean} [props.loop]
		 * @param {Boolean} [props.reversed]
		 * @param {Boolean} [props.bounce]
		 * @param {Number} [props.timeScale]
		 * @param {Object} [props.pluginData]
		 * @param {Boolean} [props.paused]
		 * @param {*} [props.position] indicates the initial position for this tween
		 * @param {*} [props.onChange] adds the specified function as a listener to the `change` event
		 * @param {*} [props.onComplete] adds the specified function as a listener to the `complete` event
		 * @param {*} [props.override] if true, removes all existing tweens for the target
		 * @return {Tween} A reference to the created tween.
		 */
		static get (target, props) {
			return new Tween(target, props);
		}

		/**
		 * Advances all tweens. This typically uses the {{#crossLink "Ticker"}}{{/crossLink}} class, but you can call it
		 * manually if you prefer to use your own "heartbeat" implementation.
		 *
		 * @static
		 *
		 * @param {Number} delta The change in time in milliseconds since the last tick. Required unless all tweens have
		 * `useTicks` set to true.
		 * @param {Boolean} paused Indicates whether a global pause is in effect. Tweens with {@link tweenjs.Tween#ignoreGlobalPause}
		 * will ignore this, but all others will pause if this is `true`.
		 */
		static tick (delta, paused) {
			let tween = Tween._tweenHead;
			while (tween) {
				let next = tween._next; // in case it completes and wipes its _next property
				if ((paused && !tween.ignoreGlobalPause) || tween._paused) ;
				else { tween.advance(tween.useTicks ? 1: delta); }
				tween = next;
			}
		}

		/**
		 * Handle events that result from Tween being used as an event handler. This is included to allow Tween to handle
		 * {@link tweenjs.Ticker#event:tick} events from the {@link tweenjs.Ticker}.
		 * No other events are handled in Tween.
		 *
		 * @static
		 * @since 0.4.2
		 *
		 * @param {Object} event An event object passed in by the {@link core.EventDispatcher}. Will
		 * usually be of type "tick".
		 */
		static handleEvent (event) {
			if (event.type === "tick") {
				this.tick(event.delta, event.paused);
			}
		}

		/**
		 * Removes all existing tweens for a target. This is called automatically by new tweens if the `override`
		 * property is `true`.
		 *
		 * @static
		 *
		 * @param {Object} target The target object to remove existing tweens from.=
		 */
		static removeTweens (target) {
			if (!target.tweenjs_count) { return; }
			let tween = Tween._tweenHead;
			while (tween) {
				let next = tween._next;
				if (tween.target === target) { tween.paused = true; }
				tween = next;
			}
			target.tweenjs_count = 0;
		}

		/**
		 * Stop and remove all existing tweens.
		 *
		 * @static
		 * @since 0.4.1
		 */
		static removeAllTweens () {
			let tween = Tween._tweenHead;
			while (tween) {
				let next = tween._next;
				tween._paused = true;
				tween.target && (tween.target.tweenjs_count = 0);
				tween._next = tween._prev = null;
				tween = next;
			}
			Tween._tweenHead = Tween._tweenTail = null;
		}

		/**
		 * Indicates whether there are any active tweens on the target object (if specified) or in general.
		 *
		 * @static
		 *
		 * @param {Object} [target] The target to check for active tweens. If not specified, the return value will indicate
		 * if there are any active tweens on any target.
		 * @return {Boolean} Indicates if there are active tweens.
		 */
		static hasActiveTweens (target) {
			if (target) { return !!target.tweenjs_count; }
			return !!Tween._tweenHead;
		}

		/**
		 * Installs a plugin, which can modify how certain properties are handled when tweened. See the {{#crossLink "SamplePlugin"}}{{/crossLink}}
		 * for an example of how to write TweenJS plugins. Plugins should generally be installed via their own `install` method, in order to provide
		 * the plugin with an opportunity to configure itself.
		 *
		 * @static
		 *
		 * @param {Object} plugin The plugin to install
		 * @param {Object} props The props to pass to the plugin
		 */
		static installPlugin (plugin, props) {
			plugin.install(props);
			const priority = (plugin.priority = plugin.priority || 0), arr = (Tween._plugins = Tween._plugins || []);
			for (let i = 0, l = arr.length; i < l; i++) {
				if (priority < arr[i].priority) { break; }
			}
			arr.splice(i, 0, plugin);
		}

		/**
		 * Registers or unregisters a tween with the ticking system.
		 *
		 * @private
		 * @static
		 *
		 * @param {Tween} tween The tween instance to register or unregister.
		 * @param {Boolean} paused If `false`, the tween is registered. If `true` the tween is unregistered.
		 */
		static _register (tween, paused) {
			const target = tween.target;
			if (!paused && tween._paused) {
				// TODO: this approach might fail if a dev is using sealed objects
				if (target) { target.tweenjs_count = target.tweenjs_count ? target.tweenjs_count + 1 : 1; }
				let tail = Tween._tweenTail;
				if (!tail) { Tween._tweenHead = Tween._tweenTail = tween; }
				else {
					Tween._tweenTail = tail._next = tween;
					tween._prev = tail;
				}
				if (!Tween._inited) { Ticker.addEventListener("tick", Tween); Tween._inited = true; }
			} else if (paused && !tween._paused) {
				if (target) { target.tweenjs_count--; }
				let next = tween._next, prev = tween._prev;

				if (next) { next._prev = prev; }
				else { Tween._tweenTail = prev; } // was tail
				if (prev) { prev._next = next; }
				else { Tween._tweenHead = next; } // was head.

				tween._next = tween._prev = null;
			}
		}

		/**
		 * Adds a wait (essentially an empty tween).
		 *
		 * @example
		 * // This tween will wait 1s before alpha is faded to 0.
		 * Tween.get(target)
		 *   .wait(1000)
		 *   .to({ alpha: 0 }, 1000);
		 *
		 * @param {Number} duration The duration of the wait in milliseconds (or in ticks if `useTicks` is true).
		 * @param {Boolean} [passive=false] Tween properties will not be updated during a passive wait. This
		 * is mostly useful for use with {@link tweenjs.Timeline} instances that contain multiple tweens
		 * affecting the same target at different times.
		 * @chainable
		 */
		wait (duration, passive = false) {
			if (duration > 0) { this._addStep(+duration, this._stepTail.props, null, passive); }
			return this;
		}

		/**
		 * Adds a tween from the current values to the specified properties. Set duration to 0 to jump to these value.
		 * Numeric properties will be tweened from their current value in the tween to the target value. Non-numeric
		 * properties will be set at the end of the specified duration.
		 *
		 * @example
		 * Tween.get(target)
		 *   .to({ alpha: 0, visible: false }, 1000);
		 *
		 * @param {Object} props An object specifying property target values for this tween (Ex. `{x:300}` would tween the x
		 * property of the target to 300).
		 * @param {Number} [duration=0] The duration of the tween in milliseconds (or in ticks if `useTicks` is true).
		 * @param {Function} [ease=Ease.linear] The easing function to use for this tween. See the {@link tweenjs.Ease}
		 * class for a list of built-in ease functions.
		 * @chainable
		 */
		to (props, duration = 0, ease = linear) {
			if (duration < 0) { duration = 0; }
			const step = this._addStep(+duration, null, ease);
			this._appendProps(props, step);
			return this;
		}

		/**
		 * Adds a label that can be used with {@link tweenjs.Tween#gotoAndPlay}/{@link tweenjs.Tween#gotoAndStop}
		 * at the current point in the tween.
		 *
		 * @example
		 * let tween = Tween.get(foo)
		 *   .to({ x: 100 }, 1000)
		 *   .label("myLabel")
		 *   .to({ x: 200 }, 1000);
		 * // ...
		 * tween.gotoAndPlay("myLabel"); // would play from 1000ms in.
		 *
		 * @param {String} label The label name.
		 * @chainable
		 */
		label (name) {
			this.addLabel(name, this.duration);
			return this;
		}

		/**
		 * Adds an action to call the specified function.
		 *
		 * @example
		 * // would call myFunction() after 1 second.
		 * Tween.get()
		 *   .wait(1000)
		 *   .call(myFunction);
		 *
		 * @param {Function} callback The function to call.
		 * @param {Array} [params]. The parameters to call the function with. If this is omitted, then the function
		 * will be called with a single param pointing to this tween.
		 * @param {Object} [scope]. The scope to call the function in. If omitted, it will be called in the target's scope.
		 * @chainable
		 */
		call (callback, params, scope) {
			return this._addAction(scope || this.target, callback, params || [this]);
		}

		/**
		 * Adds an action to set the specified props on the specified target. If `target` is null, it will use this tween's
		 * target. Note that for properties on the target object, you should consider using a zero duration {@link tweenjs.Tween#to}
		 * operation instead so the values are registered as tweened props.
		 *
		 * @example
		 * tween.wait(1000)
		 *   .set({ visible: false }, foo);
		 *
		 * @param {Object} props The properties to set (ex. `{ visible: false }`).
		 * @param {Object} [target] The target to set the properties on. If omitted, they will be set on the tween's target.
		 * @chainable
		 */
		set (props, target) {
			return this._addAction(target || this.target, this._set, [ props ]);
		}

		/**
		 * Adds an action to play (unpause) the specified tween. This enables you to sequence multiple tweens.
		 *
		 * @example
		 * tween.to({ x: 100 }, 500)
		 *   .play(otherTween);
		 *
		 * @param {Tween} [tween] The tween to play. Defaults to this tween.
		 * @chainable
		 */
		play (tween) {
	    return this._addAction(tween || this, this._set, [{ paused: false }]);
		}

		/**
		 * Adds an action to pause the specified tween.
		 * At 60fps the tween will advance by ~16ms per tick, if the tween above was at 999ms prior to the current tick, it
	   * will advance to 1015ms (15ms into the second "step") and then pause.
		 *
		 * @example
		 * tween.pause(otherTween)
		 *   .to({ alpha: 1 }, 1000)
		 *   .play(otherTween);
		 *
		 * // Note that this executes at the end of a tween update,
		 * // so the tween may advance beyond the time the pause action was inserted at.
	   *
	   * tween.to({ foo: 0 }, 1000)
	   *   .pause()
	   *   .to({ foo: 1 }, 1000);
		 *
		 * @param {Tween} [tween] The tween to pause. Defaults to this tween.
		 * @chainable
		 */
		pause (tween) {
			return this._addAction(tween || this, this._set, [{ paused: false }]);
		}

		/**
		 * @throws Tween cannot be cloned.
		 */
		clone () {
			throw "Tween can not be cloned.";
		}

		/**
		 * @private
		 * @param {Object} plugin
		 */
		_addPlugin (plugin) {
			let ids = this._pluginIds || (this._pluginIds = {}), id = plugin.id;
			if (!id || ids[id]) { return; } // already added

			ids[id] = true;
			let plugins = this._plugins || (this._plugins = []), priority = plugin.priority || 0;
			for (let i = 0, l = plugins.length; i < l; i++) {
				if (priority < plugins[i].priority) {
					plugins.splice(i, 0, plugin);
					return;
				}
			}
			plugins.push(plugin);
		}

		/**
		 * @private
		 * @param {} jump
		 * @param {Boolean} end
	   */
		_updatePosition (jump, end) {
			let step = this._stepHead.next, t = this.position, d = this.duration;
			if (this.target && step) {
				// find our new step index:
				let stepNext = step.next;
				while (stepNext && stepNext.t <= t) { step = step.next; stepNext = step.next; }
				let ratio = end ? d === 0 ? 1 : t/d : (t-step.t)/step.d; // TODO: revisit this.
				this._updateTargetProps(step, ratio, end);
			}
			this._stepPosition = step ? t - step.t : 0;
		}

		/**
		 * @private
		 * @param {Object} step
		 * @param {Number} ratio
		 * @param {Boolean} end Indicates to plugins that the full tween has ended.
		 */
		_updateTargetProps (step, ratio, end) {
			if (this.passive = !!step.passive) { return; } // don't update props.

			let v, v0, v1, ease;
			let p0 = step.prev.props;
			let p1 = step.props;
			if (ease = step.ease) { ratio = ease(ratio, 0, 1, 1); }

			let plugins = this._plugins;
			proploop : for (let n in p0) {
				v0 = p0[n];
				v1 = p1[n];

				// values are different & it is numeric then interpolate:
				if (v0 !== v1 && (typeof(v0) === "number")) {
					v = v0 + (v1 - v0) * ratio;
				} else {
					v = ratio >= 1 ? v1 : v0;
				}

				if (plugins) {
					for (let i = 0, l = plugins.length; i < l; i++) {
						let value = plugins[i].change(this, step, n, v, ratio, end);
						if (value === Tween.IGNORE) { continue proploop; }
						if (value !== undefined) { v = value; }
					}
				}
				this.target[n] = v;
			}

		}

		/**
		 * @private
		 * @param {Number} startPos
		 * @param {Number} endPos
		 * @param {Boolean} includeStart
		 */
		_runActionsRange (startPos, endPos, jump, includeStart) {
			let rev = startPos > endPos;
			let action = rev ? this._actionTail : this._actionHead;
			let ePos = endPos, sPos = startPos;
			if (rev) { ePos = startPos; sPos = endPos; }
			let t = this.position;
			while (action) {
				let pos = action.t;
				if (pos === endPos || (pos > sPos && pos < ePos) || (includeStart && pos === startPos)) {
					action.funct.apply(action.scope, action.params);
					if (t !== this.position) { return true; }
				}
				action = rev ? action.prev : action.next;
			}
		}

		/**
		 * @private
		 * @param {Object} props
		 */
		_appendProps (props, step, stepPlugins) {
			let initProps = this._stepHead.props, target = this.target, plugins = Tween._plugins;
			let n, i, value, initValue, inject;

			let oldStep = step.prev, oldProps = oldStep.props;
			let stepProps = step.props || (step.props = this._cloneProps(oldProps));
			let cleanProps = {};

			for (n in props) {
				if (!props.hasOwnProperty(n)) { continue; }
				cleanProps[n] = stepProps[n] = props[n];

				if (initProps[n] !== undefined) { continue; }

				initValue = undefined; // accessing missing properties on DOMElements when using CSSPlugin is INSANELY expensive, so we let the plugin take a first swing at it.
				if (plugins) {
	        for (i = plugins.length - 1; i >= 0; i--) {
						value = plugins[i].init(this, n, initValue);
						if (value !== undefined) { initValue = value; }
						if (initValue === Tween.IGNORE) {
							(ignored = ignored || {})[n] = true;
							delete(stepProps[n]);
							delete(cleanProps[n]);
							break;
						}
					}
				}

				if (initValue !== Tween.IGNORE) {
					if (initValue === undefined) { initValue = target[n]; }
					oldProps[n] = (initValue === undefined) ? null : initValue;
				}
			}

			for (n in cleanProps) {
				value = props[n];

				// propagate old value to previous steps:
				let o, prev = oldStep;
				while ((o = prev) && (prev = o.prev)) {
					if (prev.props === o.props) { continue; } // wait step
					if (prev.props[n] !== undefined) { break; } // already has a value, we're done.
					prev.props[n] = oldProps[n];
				}
			}

			if (stepPlugins && (plugins = this._plugins)) {
	      for (i = plugins.length - 1; i >= 0; i--) {
					plugins[i].step(this, step, cleanProps);
				}
			}

			if (inject = this._injected) {
				this._injected = null;
				this._appendProps(inject, step, false);
			}
		}

		/**
		 * Used by plugins to inject properties onto the current step. Called from within `Plugin.step` calls.
		 * For example, a plugin dealing with color, could read a hex color, and inject red, green, and blue props into the tween.
		 * See the SamplePlugin for more info.
		 * @see tweenjs.SamplePlugin
		 * @private
		 * @param {String} name
		 * @param {Object} value
		 */
		_injectProp (name, value) {
			let o = this._injected || (this._injected = {});
			o[name] = value;
		}

		/**
		 * @private
		 * @param {Number} duration
		 * @param {Object} props
		 * @param {Function} ease
		 * @param {Boolean} [passive=false]
		 */
		_addStep (duration, props, ease, passive = false) {
			let step = new TweenStep(this._stepTail, this.duration, duration, props, ease, passive);
			this.duration += duration;
			return this._stepTail = (this._stepTail.next = step);
		}

		/**
		 * @private
		 * @param {Object} scope
		 * @param {Function} funct
		 * @param {Array} params
		 */
		_addAction (scope, funct, params) {
			let action = new TweenAction(this._actionTail, this.duration, scope, funct, params);
			if (this._actionTail) { this._actionTail.next = action; }
			else { this._actionHead = action; }
			this._actionTail = action;
			return this;
		}

		/**
		 * @private
		 * @param {Object} props
		 */
		_set (props) {
			for (let n in props) {
				this[n] = props[n];
			}
		}

		/**
		 * @private
		 * @param {Object} props
		 */
		_cloneProps (props) {
			let o = {};
			for (let n in props) { o[n] = props[n]; }
			return o;
		}

	}

	// tiny api (primarily for tool output):
	{
		let p = Tween.prototype;
		p.w = p.wait;
		p.t = p.to;
		p.c = p.call;
		p.s = p.set;
	}

	// static properties
	/**
	 * Constant returned by plugins to tell the tween not to use default assignment.
	 * @property IGNORE
	 * @type {Object}
	 * @static
	 */
	Tween.IGNORE = {};

	/**
	 * @property _listeners
	 * @type {Tween[]}
	 * @static
	 * @private
	 */
	Tween._tweens = [];

	/**
	 * @property _plugins
	 * @type {Object}
	 * @static
	 * @private
	 */
	Tween._plugins = null;

	/**
	 * @property _tweenHead
	 * @type {Tween}
	 * @static
	 * @private
	 */
	Tween._tweenHead = null;

	/**
	 * @property _tweenTail
	 * @type {Tween}
	 * @static
	 * @private
	 */
	Tween._tweenTail = null;

	// helpers:

	/**
	 * @private
	 * @param {*} prev
	 * @param {*} t
	 * @param {*} d
	 * @param {*} props
	 * @param {*} ease
	 * @param {*} passive
	 */
	class TweenStep {

		constructor (prev, t, d, props, ease, passive) {
			this.next = null;
			this.prev = prev;
			this.t = t;
			this.d = d;
			this.props = props;
			this.ease = ease;
			this.passive = passive;
			this.index = prev ? prev.index + 1 : 0;
		}

	}

	/**
	 * @private
	 * @param {*} prev
	 * @param {*} t
	 * @param {*} scope
	 * @param {*} funct
	 * @param {*} params
	 */
	class TweenAction {

		constructor (prev, t, scope, funct, params) {
			this.next = null;
			this.d = 0;
			this.prev = prev;
			this.t = t;
			this.scope = scope;
			this.funct = funct;
			this.params = params;
		}

	}

	/**
	 * @license Timeline
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2010 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * README: Export Order
	 *
	 * Due to some classes having circular import bindings (whether at the top of the import chain or deeper in),
	 * some exports here are in reverse order (such as Tween being exported before AbstractTween).
	 * This is explained here: https://github.com/rollup/rollup/issues/845#issuecomment-240277194
	 */

	/**
	 * @license MovieClip
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * @license Shape
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * A Shape allows you to display vector art in the display list. It composites a {@link easeljs.Graphics}
	 * instance which exposes all of the vector drawing methods. The Graphics instance can be shared between multiple Shape
	 * instances to display the same vector graphics with different positions or transforms.
	 *
	 * If the vector art will not change between draws, you may want to use the {@link easeljs.DisplayObject#cache}
	 * method to reduce the rendering cost.
	 *
	 * @memberof easeljs
	 * @example
	 * var graphics = new Graphics().beginFill("#ff0000").drawRect(0, 0, 100, 100);
	 * var shape = new Shape(graphics);
	 * // Alternatively use can also use the graphics property of the Shape class to renderer the same as above.
	 * var shape = new Shape();
	 * shape.graphics.beginFill("#ff0000").drawRect(0, 0, 100, 100);
	 *
	 * @extends easeljs.DisplayObject
	 * @param {easeljs.Graphics} [graphics] The graphics instance to display. If null, a new Graphics instance will be created.
	 */
	class Shape extends DisplayObject {

		constructor (graphics = new Graphics()) {
			super();

			/**
			 * The graphics instance to display.
			 * @type {easeljs.Graphics}
			 */
			this.graphics = graphics;
		}

		isVisible () {
			let hasContent = this.cacheCanvas || (this.graphics && !this.graphics.isEmpty());
			return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
		}

		draw (ctx, ignoreCache = false) {
			if (super.draw(ctx, ignoreCache)) { return true; }
			this.graphics.draw(ctx, this);
			return true;
		}

		/**
		 * Returns a clone of this Shape. Some properties that are specific to this instance's current context are reverted to
		 * their defaults (for example .parent).
		 * @override
		 * @param {Boolean} [recursive=false] If true, this Shape's {@link easeljs.Graphics} instance will also be
		 * cloned. If false, the Graphics instance will be shared with the new Shape.
		 */
		clone (recursive = false) {
			let g = (recursive && this.graphics) ? this.graphics.clone() : this.graphics;
			return this._cloneProps(new Shape(g));
		}

	}

	/**
	 * @license SpriteSheet
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPliED, INCLUDING BUT NOT liMITED TO THE WARRANTIES
	 * OF MERCHANTABIliTY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HolDERS BE liABLE FOR ANY CLAIM, DAMAGES OR OTHER liABIliTY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEAliNGS IN THE SOFTWARE.
	 */

	/**
	 * Dispatched when all images are loaded.  Note that this only fires if the images
	 * were not fully loaded when the sprite sheet was initialized. You should check the complete property
	 * to prior to adding a listener. Ex.
	 *
	 * 	var sheet = new createjs.SpriteSheet(data);
	 * 	if (!sheet.complete) {
	 * 		// not preloaded, listen for the complete event:
	 * 		sheet.addEventListener("complete", handler);
	 * 	}
	 *
	 * @event easeljs.SpriteSheet#complete
	 * @property {Object} target The object that dispatched the event.
	 * @property {String} type The event type.
	 * @since 0.6.0
	 */

	/**
	 * Dispatched when getFrame is called with a valid frame index. This is primarily intended for use by {@link easeljs.SpriteSheetBuilder}
	 * when doing on-demand rendering.
	 * @event easeljs.SpriteSheet#getframe
	 * @property {Number} index The frame index.
	 * @property {Object} frame The frame object that getFrame will return.
	 */

	/**
	 * Dispatched when an image encounters an error. A SpriteSheet will dispatch an error event for each image that
	 * encounters an error, and will still dispatch a {@link easeljs.SpriteSheet#event:complete}
	 * event once all images are finished processing, even if an error is encountered.
	 * @event easeljs.SpriteSheet#error
	 * @property {String} src The source of the image that failed to load.
	 * @since 0.8.2
	 */

	/**
	 * @license Text
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * Display one or more lines of dynamic text (not user editable) in the display list. Line wrapping support (using the
	 * lineWidth) is very basic, wrapping on spaces and tabs only. Note that as an alternative to Text, you can position HTML
	 * text above or below the canvas relative to items in the display list using the {@link easeljs.DisplayObject#localToGlobal}
	 * method, or using {@link easeljs.DOMElement}.
	 *
	 * <b>Please note that Text does not support HTML text, and can only display one font style at a time.</b> To use
	 * multiple font styles, you will need to create multiple text instances, and position them manually.
	 *
	 * CreateJS Text supports web fonts (the same rules as Canvas). The font must be loaded and supported by the browser
	 * before it can be displayed.
	 *
	 * <strong>Note:</strong> Text can be expensive to generate, so cache instances where possible. Be aware that not all
	 * browsers will render Text exactly the same.
	 *
	 * @memberof easeljs
	 * @extends easeljs.DisplayObject
	 * @example
	 * let text = new Text("Hello World", "20px Arial", "#ff7700");
	 * text.x = 100;
	 * text.textBaseline = "alphabetic";
	 *
	 * @param {String} [text] The text to display.
	 * @param {String} [font] The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold
	 * 36px Arial").
	 * @param {String} [color] The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex.
	 * "#F00", "red", or "#FF0000").
	 */
	class Text extends DisplayObject {

		constructor (text, font, color) {
			super();

			/**
			 * The text to display.
			 * @type {String}
			 */
			this.text = text;

			/**
			 * The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold 36px Arial").
			 * @type {String}
			 */
			this.font = font;

			/**
			 * The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex. "#F00"). Default is "#000".
			 * It will also accept valid canvas fillStyle values.
			 * @type {String}
			 */
			this.color = color;

			/**
			 * The horizontal text alignment. Any of "start", "end", "left", "right", and "center".
			 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles "WHATWG spec"}
			 * @type {String}
			 * @default left
			 */
			this.textAlign = "left";

			/**
			 * The vertical alignment point on the font. Any of "top", "hanging", "middle", "alphabetic", "ideographic", or "bottom".
			 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles "WHATWG spec"}
			 * @type {String}
			 * @default top
			*/
			this.textBaseline = "top";

			/**
			 * The maximum width to draw the text. If maxWidth is specified (not null), the text will be condensed or
			 * shrunk to make it fit in this width.
			 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles "WHATWG spec"}
			 * @type {Number}
			*/
			this.maxWidth = null;

			/**
			 * If greater than 0, the text will be drawn as a stroke (outline) of the specified width.
			 * @type {Number}
			 */
			this.outline = 0;

			/**
			 * Indicates the line height (vertical distance between baselines) for multi-line text. If null or 0,
			 * the value of getMeasuredLineHeight is used.
			 * @type {Number}
			 * @default 0
			 */
			this.lineHeight = 0;

			/**
			 * Indicates the maximum width for a line of text before it is wrapped to multiple lines. If null,
			 * the text will not be wrapped.
			 * @type {Number}
			 */
			this.lineWidth = null;
		}

	 	isVisible () {
	 		let hasContent = this.cacheCanvas || (this.text != null && this.text !== "");
	 		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
	 	}

	 	draw (ctx, ignoreCache) {
	 		if (super.draw(ctx, ignoreCache)) { return true; }

	 		let col = this.color || "#000";
	 		if (this.outline) { ctx.strokeStyle = col; ctx.lineWidth = this.outline*1; }
	 		else { ctx.fillStyle = col; }

	 		this._drawText(this._prepContext(ctx));
	 		return true;
	 	}

	 	/**
	 	 * Returns the measured, untransformed width of the text without wrapping. Use getBounds for a more robust value.
	 	 * @return {Number} The measured, untransformed width of the text.
	 	 */
	 	getMeasuredWidth () {
	 		return this._getMeasuredWidth(this.text);
	 	}

	 	/**
	 	 * Returns an approximate line height of the text, ignoring the lineHeight property. This is based on the measured
	 	 * width of a "M" character multiplied by 1.2, which provides an approximate line height for most fonts.
	 	 * @return {Number} an approximate line height of the text, ignoring the lineHeight property. This is
	 	 * based on the measured width of a "M" character multiplied by 1.2, which approximates em for most fonts.
	 	 */
	 	getMeasuredLineHeight () {
	 		return this._getMeasuredWidth("M")*1.2;
	 	}

	 	/**
	 	 * Returns the approximate height of multi-line text by multiplying the number of lines against either the
	 	 * `lineHeight` (if specified) or {@link easeljs.Text#getMeasuredLineHeight}. Note that
	 	 * this operation requires the text flowing logic to run, which has an associated CPU cost.
	 	 * @return {Number} The approximate height of the untransformed multi-line text.
	 	 */
	 	getMeasuredHeight () {
	 		return this._drawText(null, {}).height;
	 	}

	 	getBounds () {
	 		let rect = super.getBounds();
	 		if (rect) { return rect; }
	 		if (this.text == null || this.text === "") { return null; }
	 		let o = this._drawText(null, {});
	 		let w = (this.maxWidth && this.maxWidth < o.width) ? this.maxWidth : o.width;
	 		let x = w * Text.H_OFFSETS[this.textAlign||"left"];
	 		let lineHeight = this.lineHeight||this.getMeasuredLineHeight();
	 		let y = lineHeight * Text.V_OFFSETS[this.textBaseline||"top"];
	 		return this._rectangle.setValues(x, y, w, o.height);
	 	}

	 	/**
	 	 * Returns an object with width, height, and lines properties. The width and height are the visual width and height
	 	 * of the drawn text. The lines property contains an array of strings, one for
	 	 * each line of text that will be drawn, accounting for line breaks and wrapping. These strings have trailing
	 	 * whitespace removed.
	 	 * @return {Object} An object with width, height, and lines properties.
	 	 */
	 	getMetrics () {
	 		let o = {lines:[]};
	 		o.lineHeight = this.lineHeight || this.getMeasuredLineHeight();
	 		o.vOffset = o.lineHeight * Text.V_OFFSETS[this.textBaseline||"top"];
	 		return this._drawText(null, o, o.lines);
	 	}

	 	/**
	 	 * Returns a clone of the Text instance.
	 	 * @return {easeljs.Text} a clone of the Text instance.
	 	 */
	 	clone () {
	 		return this._cloneProps(new Text(this.text, this.font, this.color));
	 	}

	 	/**
	 	 * Returns a string representation of this object.
	 	 * @override
	 	 * @return {String} a string representation of the instance.
	 	 */
	 	toString () {
	 		return `[${this.constructor.name} (text=${this.text.length > 20 ? `${this.text.substr(0, 17)}...` : this.text})]`;
	 	}

	 	/**
	 	 * @param {easeljs.Text} o
	 	 * @protected
	 	 * @return {easeljs.Text} o
	 	 */
	 	_cloneProps (o) {
	 		super._cloneProps(o);
	 		o.textAlign = this.textAlign;
	 		o.textBaseline = this.textBaseline;
	 		o.maxWidth = this.maxWidth;
	 		o.outline = this.outline;
	 		o.lineHeight = this.lineHeight;
	 		o.lineWidth = this.lineWidth;
	 		return o;
	 	}

	 	/**
	 	 * @param {CanvasRenderingContext2D} ctx
	 	 * @return {CanvasRenderingContext2D}
	 	 * @protected
	 	 */
	 	_prepContext (ctx) {
	 		ctx.font = this.font||"10px sans-serif";
	 		ctx.textAlign = this.textAlign||"left";
	 		ctx.textBaseline = this.textBaseline||"top";
			ctx.lineJoin = "miter";
			ctx.miterLimit = 2.5;
			return ctx;
		}

		/**
		 * Draws multiline text.
		 * @param {CanvasRenderingContext2D} ctx
		 * @param {Object} o
		 * @param {Array} lines
		 * @return {Object}
		 * @protected
		 */
	 	_drawText (ctx, o, lines) {
	 		const paint = !!ctx;
	 		if (!paint) {
	 			ctx = Text._ctx;
	 			ctx.save();
	 			this._prepContext(ctx);
	 		}
	 		let lineHeight = this.lineHeight||this.getMeasuredLineHeight();

	 		let maxW = 0, count = 0;
	 		let hardLines = String(this.text).split(/(?:\r\n|\r|\n)/);
	 		for (let str of hardLines) {
	 			let w = null;

	 			if (this.lineWidth != null && (w = ctx.measureText(str).width) > this.lineWidth) {
	 				// text wrapping:
	 				let words = str.split(/(\s)/);
	 				str = words[0];
	 				w = ctx.measureText(str).width;

					const l = words.length;
	 				for (let i=1; i<l; i+=2) {
	 					// Line needs to wrap:
	 					let wordW = ctx.measureText(words[i] + words[i+1]).width;
	 					if (w + wordW > this.lineWidth) {
	 						if (paint) { this._drawTextLine(ctx, str, count*lineHeight); }
	 						if (lines) { lines.push(str); }
	 						if (w > maxW) { maxW = w; }
	 						str = words[i+1];
	 						w = ctx.measureText(str).width;
	 						count++;
	 					} else {
	 						str += words[i] + words[i+1];
	 						w += wordW;
	 					}
	 				}
	 			}

	 			if (paint) { this._drawTextLine(ctx, str, count*lineHeight); }
	 			if (lines) { lines.push(str); }
	 			if (o && w == null) { w = ctx.measureText(str).width; }
	 			if (w > maxW) { maxW = w; }
	 			count++;
	 		}

	 		if (o) {
	 			o.width = maxW;
	 			o.height = count*lineHeight;
	 		}
	 		if (!paint) { ctx.restore(); }
	 		return o;
	 	}

	 	/**
	 	 * @param {CanvasRenderingContext2D} ctx
	 	 * @param {String} text
	 	 * @param {Number} y
	 	 * @protected
	 	 */
	 	_drawTextLine (ctx, text, y) {
	 		// Chrome 17 will fail to draw the text if the last param is included but null, so we feed it a large value instead:
	 		if (this.outline) { ctx.strokeText(text, 0, y, this.maxWidth||0xFFFF); }
	 		else { ctx.fillText(text, 0, y, this.maxWidth||0xFFFF); }
	 	}

	 	/**
	 	 * @param {String} text
	 	 * @protected
	 	 */
	 	_getMeasuredWidth (text) {
	 		let ctx = Text._ctx;
	 		ctx.save();
	 		let w = this._prepContext(ctx).measureText(text).width;
	 		ctx.restore();
	 		return w;
	 	}

	}

	/**
	 * Lookup table for the ratio to offset bounds x calculations based on the textAlign property.
	 * @type {Object}
	 * @readonly
	 * @static
	 */
	Text.H_OFFSETS = {start: 0, left: 0, center: -0.5, end: -1, right: -1};
	/**
	 * Lookup table for the ratio to offset bounds y calculations based on the textBaseline property.
	 * @type {Object}
	 * @readonly
	 * @static
	 */
	Text.V_OFFSETS = {top: 0, hanging: -0.01, middle: -0.4, alphabetic: -0.8, ideographic: -0.85, bottom: -1};

	/**
	 * @property _ctx
	 * @type {CanvasRenderingContext2D}
	 * @private
	 * @static
	 */
	Text._ctx = createCanvas().getContext("2d");

	/**
	 * @license AlphaMapFilter
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * @license AlphaMaskFilter
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * @license BlurFilter
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * BoxBlur Algorithm by Mario Klingemann, quasimondo.com
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * @license ColorFilter
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * @license ColorMatrix
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * Provides helper functions for assembling a matrix for use with the {@link easeljs.ColorMatrixFilter}.
	 * Most methods return the instance to facilitate chained calls.
	 *
	 * @memberof easeljs
	 * @example
	 * colorMatrix.adjustHue(20).adjustBrightness(50);
	 *
	 * @param {Number} brightness
	 * @param {Number} contrast
	 * @param {Number} saturation
	 * @param {Number} hue
	 */
	class ColorMatrix {

		constructor (brightness, contrast, saturation, hue) {
			this.setColor(brightness, contrast, saturation, hue);
		}

		/**
		 * Resets the instance with the specified values.
		 * @param {Number} brightness
		 * @param {Number} contrast
		 * @param {Number} saturation
		 * @param {Number} hue
		 * @return {easeljs.ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		setColor (brightness, contrast, saturation, hue) {
			return this.reset().adjustColor(brightness, contrast, saturation, hue);
		}

		/**
		 * Resets the matrix to identity values.
		 * @return {easeljs.ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		reset () {
			return this.copy(ColorMatrix.IDENTITY_MATRIX);
		}

		/**
		 * Shortcut method to adjust brightness, contrast, saturation and hue. Equivalent to calling adjustHue(hue), adjustContrast(contrast),
		 * adjustBrightness(brightness), adjustSaturation(saturation), in that order.
		 * @param {Number} brightness
		 * @param {Number} contrast
		 * @param {Number} saturation
		 * @param {Number} hue
		 * @return {easeljs.ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		adjustColor (brightness, contrast, saturation, hue) {
			return this.adjustBrightness(brightness).adjustContrast(contrast).adjustSaturation(saturation).adjustHue(hue);
		}

		/**
		 * Adjusts the brightness of pixel color by adding the specified value to the red, green and blue channels.
		 * Positive values will make the image brighter, negative values will make it darker.
		 * @param {Number} value A value between -255 & 255 that will be added to the RGB channels.
		 * @return {easeljs.ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		adjustBrightness (value) {
			if (value === 0 || isNaN(value)) { return this; }
			value = this._cleanValue(value, 255);
			this._multiplyMatrix([
				1,0,0,0,value,
				0,1,0,0,value,
				0,0,1,0,value,
				0,0,0,1,0,
				0,0,0,0,1
			]);
			return this;
		}

		/**
		 * Adjusts the contrast of pixel color.
		 * Positive values will increase contrast, negative values will decrease contrast.
		 * @param {Number} value A value between -100 & 100.
		 * @return {easeljs.ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		adjustContrast (value) {
			if (value === 0 || isNaN(value)) { return this; }
			value = this._cleanValue(value, 100);
			let x;
			if (value<0) {
				x = 127+value/100*127;
			} else {
				x = value%1;
				if (x === 0) {
					x = ColorMatrix.DELTA_INDEX[value];
				} else {
					x = ColorMatrix.DELTA_INDEX[(value<<0)]*(1-x)+ColorMatrix.DELTA_INDEX[(value<<0)+1]*x; // use linear interpolation for more granularity.
				}
				x = x*127+127;
			}
			this._multiplyMatrix([
				x/127,0,0,0,0.5*(127-x),
				0,x/127,0,0,0.5*(127-x),
				0,0,x/127,0,0.5*(127-x),
				0,0,0,1,0,
				0,0,0,0,1
			]);
			return this;
		}

		/**
		 * Adjusts the color saturation of the pixel.
		 * Positive values will increase saturation, negative values will decrease saturation (trend towards greyscale).
		 * @param {Number} value A value between -100 & 100.
		 * @return {easeljs.ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		adjustSaturation (value) {
			if (value === 0 || isNaN(value)) { return this; }
			value = this._cleanValue(value, 100);
			let x = 1+((value > 0) ? 3*value/100 : value/100);
			let lumR = 0.3086;
			let lumG = 0.6094;
			let lumB = 0.0820;
			this._multiplyMatrix([
				lumR*(1-x)+x,lumG*(1-x),lumB*(1-x),0,0,
				lumR*(1-x),lumG*(1-x)+x,lumB*(1-x),0,0,
				lumR*(1-x),lumG*(1-x),lumB*(1-x)+x,0,0,
				0,0,0,1,0,
				0,0,0,0,1
			]);
			return this;
		}


		/**
		 * Adjusts the hue of the pixel color.
		 * @param {Number} value A value between -180 & 180.
		 * @return {easeljs.ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		adjustHue (value) {
			if (value === 0 || isNaN(value)) { return this; }
			value = this._cleanValue(value, 180)/180*Math.PI;
			let cosVal = Math.cos(value);
			let sinVal = Math.sin(value);
			let lumR = 0.213;
			let lumG = 0.715;
			let lumB = 0.072;
			this._multiplyMatrix([
				lumR+cosVal*(1-lumR)+sinVal*(-lumR),lumG+cosVal*(-lumG)+sinVal*(-lumG),lumB+cosVal*(-lumB)+sinVal*(1-lumB),0,0,
				lumR+cosVal*(-lumR)+sinVal*(0.143),lumG+cosVal*(1-lumG)+sinVal*(0.140),lumB+cosVal*(-lumB)+sinVal*(-0.283),0,0,
				lumR+cosVal*(-lumR)+sinVal*(-(1-lumR)),lumG+cosVal*(-lumG)+sinVal*(lumG),lumB+cosVal*(1-lumB)+sinVal*(lumB),0,0,
				0,0,0,1,0,
				0,0,0,0,1
			]);
			return this;
		}

		/**
		 * Concatenates (multiplies) the specified matrix with this one.
		 * @param {Array} matrix An array or ColorMatrix instance.
		 * @return {easeljs.ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		concat (matrix) {
			matrix = this._fixMatrix(matrix);
			if (matrix.length != ColorMatrix.LENGTH) { return this; }
			this._multiplyMatrix(matrix);
			return this;
		}

		/**
		 * @return {easeljs.ColorMatrix} A clone of this ColorMatrix.
		 */
		clone () {
			return (new ColorMatrix()).copy(this);
		}

		/**
		 * Return a length 25 (5x5) array instance containing this matrix's values.
		 * @return {Array} An array holding this matrix's values.
		 */
		toArray () {
			const arr = [];
			const l = ColorMatrix.LENGTH;
			for (let i=0; i<l; i++) {
				arr[i] = this[i];
			}
			return arr;
		}

		/**
		 * Copy the specified matrix's values to this matrix.
		 * @param {Array | easeljs.ColorMatrix} matrix An array or ColorMatrix instance.
		 * @return {easeljs.ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
		 * @chainable
		 */
		copy (matrix) {
			const l = ColorMatrix.LENGTH;
			for (let i=0;i<l;i++) {
				this[i] = matrix[i];
			}
			return this;
		}

		/**
		 * Returns a string representation of this object.
		 * @return {String} a string representation of the instance.
		 */
		toString () {
			return `[${this.constructor.name}]`;
		}

		/**
		 * @param {Array} matrix
		 * @protected
		 */
		_multiplyMatrix (matrix) {
			let col = [];

			for (let i=0;i<5;i++) {
				for (let j=0;j<5;j++) {
					col[j] = this[j+i*5];
				}
				for (let j=0;j<5;j++) {
					let val=0;
					for (let k=0;k<5;k++) {
						val += matrix[j+k*5]*col[k];
					}
					this[j+i*5] = val;
				}
			}
		}

		/**
		 * Make sure values are within the specified range, hue has a limit of 180, brightness is 255, others are 100.
		 * @param {Number} value The raw number
		 * @param {Number} limit The maximum that the number can be. The minimum is the limit * -1.
		 * @protected
		 */
		_cleanValue (value, limit) {
			return Math.min(limit, Math.max(-limit, value));
		}

		/**
		 * Makes sure matrixes are 5x5 (25 long).
		 * @param {Array} matrix
		 * @protected
		 */
		_fixMatrix (matrix) {
			if (matrix instanceof ColorMatrix) { matrix = matrix.toArray(); }
			if (matrix.length < ColorMatrix.LENGTH) {
				matrix = matrix.slice(0, matrix.length).concat(ColorMatrix.IDENTITY_MATRIX.slice(matrix.length, ColorMatrix.LENGTH));
			} else if (matrix.length > ColorMatrix.LENGTH) {
				matrix = matrix.slice(0, ColorMatrix.LENGTH);
			}
			return matrix;
		}

	}

	/**
	 * Array of delta values for contrast calculations.
	 * @type {Array<Number>}
	 * @protected
	 * @readonly
	 * @static
	 */
	ColorMatrix.DELTA_INDEX = Object.freeze([
	 	0,    0.01, 0.02, 0.04, 0.05, 0.06, 0.07, 0.08, 0.1,  0.11,
	 	0.12, 0.14, 0.15, 0.16, 0.17, 0.18, 0.20, 0.21, 0.22, 0.24,
	 	0.25, 0.27, 0.28, 0.30, 0.32, 0.34, 0.36, 0.38, 0.40, 0.42,
	 	0.44, 0.46, 0.48, 0.5,  0.53, 0.56, 0.59, 0.62, 0.65, 0.68,
	 	0.71, 0.74, 0.77, 0.80, 0.83, 0.86, 0.89, 0.92, 0.95, 0.98,
	 	1.0,  1.06, 1.12, 1.18, 1.24, 1.30, 1.36, 1.42, 1.48, 1.54,
	 	1.60, 1.66, 1.72, 1.78, 1.84, 1.90, 1.96, 2.0,  2.12, 2.25,
	 	2.37, 2.50, 2.62, 2.75, 2.87, 3.0,  3.2,  3.4,  3.6,  3.8,
	 	4.0,  4.3,  4.7,  4.9,  5.0,  5.5,  6.0,  6.5,  6.8,  7.0,
	 	7.3,  7.5,  7.8,  8.0,  8.4,  8.7,  9.0,  9.4,  9.6,  9.8,
	 	10.0
	]);
	/**
	 * Identity matrix values.
	 * @type {Array<Number>}
	 * @protected
	 * @readonly
	 * @static
	 */
	ColorMatrix.IDENTITY_MATRIX = Object.freeze([
	 	1,0,0,0,0,
	 	0,1,0,0,0,
	 	0,0,1,0,0,
	 	0,0,0,1,0,
	 	0,0,0,0,1
	]);
	/**
	 * The constant length of a color matrix.
	 * @type {Number}
	 * @protected
	 * @readonly
	 * @static
	 */
	ColorMatrix.LENGTH = 25;

	/**
	 * @license ColorMatrixFilter
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/*
	* @license ButtonHelper
	* Visit http://createjs.com/ for documentation, updates and examples.
	*
	* Copyright (c) 2017 gskinner.com, inc.
	*
	* Permission is hereby granted, free of charge, to any person
	* obtaining a copy of this software and associated documentation
	* files (the "Software"), to deal in the Software without
	* restriction, including without limitation the rights to use,
	* copy, modify, merge, publish, distribute, sublicense, and/or sell
	* copies of the Software, and to permit persons to whom the
	* Software is furnished to do so, subject to the following
	* conditions:
	*
	* The above copyright notice and this permission notice shall be
	* included in all copies or substantial portions of the Software.
	*
	* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	* OTHER DEALINGS IN THE SOFTWARE.
	*/

	/**
	 * @license Touch
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * @license SpriteSheetBuilder
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * Dispatched when a build completes.
	 * @event easeljs.SpriteSheetBuilder#complete
	 * @property {Object} target The object that dispatched the event.
	 * @property {String} type The event type.
	 * @since 0.6.0
	 */

	/**
	 * Dispatched when an asynchronous build has progress.
	 * @event easeljs.SpriteSheetBuilder#progress
	 * @property {Object} target The object that dispatched the event.
	 * @property {String} type The event type.
	 * @property {Number} progress The current progress value (0-1).
	 * @since 0.6.0
	 */

	/*
	* @license SpriteSheetUtils
	* Visit http://createjs.com/ for documentation, updates and examples.
	*
	* Copyright (c) 2017 gskinner.com, inc.
	*
	* Permission is hereby granted, free of charge, to any person
	* obtaining a copy of this software and associated documentation
	* files (the "Software"), to deal in the Software without
	* restriction, including without limitation the rights to use,
	* copy, modify, merge, publish, distribute, sublicense, and/or sell
	* copies of the Software, and to permit persons to whom the
	* Software is furnished to do so, subject to the following
	* conditions:
	*
	* The above copyright notice and this permission notice shall be
	* included in all copies or substantial portions of the Software.
	*
	* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	* OTHER DEALINGS IN THE SOFTWARE.
	*/

	/**
	 * The SpriteSheetUtils class is a collection of static methods for working with {{#crossLink "SpriteSheet"}}{{/crossLink}}s.
	 * A sprite sheet is a series of images (usually animation frames) combined into a single image on a regular grid. For
	 * example, an animation consisting of 8 100x100 images could be combined into a 400x200 sprite sheet (4 frames across
	 * by 2 high). The SpriteSheetUtils class uses a static interface and should not be instantiated.
	 *
	 * @memberof easeljs
	 * @name easeljs.SpriteSheetUtils
	 */
	({

		/**
		 * @protected
		 * @type {HTMLCanvasElement | Object}
		 */
		_workingCanvas: createCanvas(),

		/**
		 * @protected
		 * @type {CanvasRenderingContext2D}
		 */
		get _workingContext () { return this._workingCanvas.getContext("2d"); },

		/**
		 * Returns a single frame of the specified sprite sheet as a new PNG image. An example of when this may be useful is
		 * to use a spritesheet frame as the source for a bitmap fill.
		 *
		 * <strong>WARNING:</strong> In almost all cases it is better to display a single frame using a {@link easeljs.Sprite}
		 * with a {@link easeljs.Sprite#gotoAndStop} call than it is to slice out a frame using this
		 * method and display it with a Bitmap instance. You can also crop an image using the {@link easeljs.Bitmap#sourceRect}
		 * property of {@link easeljs.Bitmap}.
		 *
		 * The extractFrame method may cause cross-domain warnings since it accesses pixels directly on the canvas.
		 *
		 * @param {easeljs.SpriteSheet} spriteSheet The SpriteSheet instance to extract a frame from.
		 * @param {Number | String} frameOrAnimation The frame number or animation name to extract. If an animation
		 * name is specified, only the first frame of the animation will be extracted.
		 * @return {HTMLImageElement} a single frame of the specified sprite sheet as a new PNG image.
		 */
		extractFrame (spriteSheet, frameOrAnimation) {
			if (isNaN(frameOrAnimation)) {
				frameOrAnimation = spriteSheet.getAnimation(frameOrAnimation).frames[0];
			}
			let data = spriteSheet.getFrame(frameOrAnimation);
			if (!data) { return null; }
			let r = data.rect;
			let canvas = this._workingCanvas;
			canvas.width = r.width;
			canvas.height = r.height;
			this._workingContext.drawImage(data.image, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height);
			let img = document.createElement("img");
			img.src = canvas.toDataURL("image/png");
			return img;
		},

		/**
		 * @protected
		 * @param {easeljs.SpriteSheet} spriteSheet
		 * @param {Number} count
		 * @param {Number} h
		 * @param {Number} v
		 */
		_flip (spriteSheet, count, h, v) {
			let imgs = spriteSheet._images;
			let canvas = this._workingCanvas;
			let ctx = this._workingContext;
			const il = imgs.length/count;
			for (let i=0; i<il; i++) {
				let src = imgs[i];
				src.__tmp = i; // a bit hacky, but faster than doing indexOf below.
				ctx.setTransform(1,0,0,1,0,0);
				ctx.clearRect(0,0,canvas.width+1,canvas.height+1);
				canvas.width = src.width;
				canvas.height = src.height;
				ctx.setTransform(h?-1:1, 0, 0, v?-1:1, h?src.width:0, v?src.height:0);
				ctx.drawImage(src,0,0);
				let img = document.createElement("img");
				img.src = canvas.toDataURL("image/png");
				// work around a strange bug in Safari:
				img.width = (src.width||src.naturalWidth);
				img.height = (src.height||src.naturalHeight);
				imgs.push(img);
			}

			let frames = spriteSheet._frames;
			const fl = frames.length/count;
			for (let i=0; i<fl; i++) {
				let src = frames[i];
				let rect = src.rect.clone();
				let img = imgs[src.image.__tmp+il*count];

				let frame = {image:img,rect,regX:src.regX,regY:src.regY};
				if (h) {
					rect.x = (img.width||img.naturalWidth)-rect.x-rect.width; // update rect
					frame.regX = rect.width-src.regX; // update registration point
				}
				if (v) {
					rect.y = (img.height||img.naturalHeight)-rect.y-rect.height;  // update rect
					frame.regY = rect.height-src.regY; // update registration point
				}
				frames.push(frame);
			}

			let sfx = `_${h?"h":""}${v?"v":""}`;
			let names = spriteSheet._animations;
			let data = spriteSheet._data;
			const al = names.length/count;
			for (let i=0; i<al; i++) {
				let name = names[i];
				let src = data[name];
				let anim = {name:name+sfx,speed:src.speed,next:src.next,frames:[]};
				if (src.next) { anim.next += sfx; }
				let frames = src.frames;
				for (let i=0,l=frames.length;i<l;i++) {
					anim.frames.push(frames[i]+fl*count);
				}
				data[anim.name] = anim;
				names.push(anim.name);
			}
		}

	});

	/**
	 * @license WebGLInspector
	 * Visit http://createjs.com/ for documentation, updates and examples.
	 *
	 * Copyright (c) 2017 gskinner.com, inc.
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	 */

	/**
	 * The core classes of EaselJS.
	 * @namespace easeljs
	 *
	 * @example
	 * import { Stage, Shape } from "@createjs/easeljs";
	 * const stage = new Stage("myCanvas");
	 * const shape = new Shape();
	 * shape.graphics.beginFill("red").drawCircle(0, 0, 50);
	 * stage.addChild(shape);
	 * stage.update();
	 */

	// Do some initialization
	// Set size of canvas
	const canvas = document.getElementById("screen");
	canvas.width = window.outerWidth / 2;
	canvas.height = 2000;

	var stage = new Stage('screen');
	var shape = new Shape();
	shape.graphics.beginFill('grey').drawRect(
	    window.outerWidth /2 ,
	    0, canvas.width, canvas.height);
	stage.addChild(shape);
	stage.update();

	// even though Rollup is bundling all your files together, errors and
	// logs will still point to your original source modules
	console.log('if you have sourcemaps enabled in your devtools, click on main.js:5 -->');

}());
//# sourceMappingURL=bundle.js.map
