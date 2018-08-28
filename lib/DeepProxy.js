/*
	Tree Kit

	Copyright (c) 2014 - 2018 Cédric Ronvel

	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

"use strict" ;



function DeepProxy( target , handler = {} , options = {} ) {
	this.target = target ;
	this.handler = handler ;
	this.pathArray = !! options.pathArray ;
	this.proxies = new WeakMap() ;

	return this.getProxyFor( target ) ;
}

module.exports = DeepProxy ;



DeepProxy.prototype.getProxyFor = function( target , fromCtx , fromProperty ) {
	var proxy ;
	
	// First, check if that object is already proxified, so we can return it immediately
	if ( ( proxy = this.proxies.get( target ) ) ) { return proxy ; }
	
	// Create the handler context
	var ctx = {
		root: this ,
		nested: ( property_ ) => this.getProxyFor( target[ property_ ] , ctx , property_ ) ,
		//target: target ,
		isArray: Array.isArray( target ) ,
		path: fromCtx ?
			this.addPathNode( fromCtx , fromProperty ) :
			( this.pathArray ? [] : '' )
	} ;
	
	// Create a new proxy, bind all handlers to the context
	proxy = new Proxy( target , {
		apply: deepHandler.apply.bind( ctx ) ,
		construct: deepHandler.apply.bind( ctx ) ,
		//enumerate: deepHandler.enumerate.bind( ctx ) ,
		getPrototypeOf: deepHandler.getPrototypeOf.bind( ctx ) ,
		isExtensible: deepHandler.isExtensible.bind( ctx ) ,
		ownKeys: deepHandler.ownKeys.bind( ctx ) ,
		preventExtensions: deepHandler.preventExtensions.bind( ctx ) ,
		setPrototypeOf: deepHandler.setPrototypeOf.bind( ctx ) ,
		
		defineProperty: deepHandler.defineProperty.bind( ctx ) ,
		deleteProperty: deepHandler.deleteProperty.bind( ctx ) ,
		get: deepHandler.get.bind( ctx ) ,   // non-common
		getOwnPropertyDescriptor: deepHandler.getOwnPropertyDescriptor.bind( ctx ) ,
		has: deepHandler.has.bind( ctx ) ,
		set: deepHandler.set.bind( ctx )
	} ) ;
	
	this.proxies.set( target , proxy ) ;
	
	return proxy ;
} ;



DeepProxy.prototype.addPathNode = function( ctx , property ) {
	if ( this.pathArray ) {
		return ctx.path.concat( property ) ;
	}
	
	// Check if this is an array index
	if ( ctx.isArray && ! Number.isNaN( + property ) ) {
		return ctx.path + '[' + property + ']' ;
	}
	
	return ctx.path ? ctx.path + '.' + property : property ;
} ;



const deepHandler = {
	get: function( target , property , receiver ) {
		if ( this.root.handler.get ) {
			return this.root.handler.get.call( this , target , property , receiver , this.root.addPathNode( this , property ) ) ;
		}
		
		if ( target[ property ] && ( typeof target[ property ] === 'object' || typeof target[ property ] === 'function' ) ) {
			//return this.root.getProxyFor( target[ property ] , this , property ) ;
			return this.nested( property ) ;
		}
		
		if ( this.root.handler.getLeaf ) {
			return this.root.handler.getLeaf.call( this , target , property , receiver , this.root.addPathNode( this , property ) ) ;
		}
		
		return Reflect.get( target , property , receiver ) ;
	}
} ;



const commonTraps = [
	'apply' ,
	'construct' ,
	//'enumerate' ,
	'getPrototypeOf' ,
	'isExtensible' ,
	'ownKeys' ,
	'preventExtensions' ,
	'setPrototypeOf'
] ;



const commonPropertyTraps = [
	'defineProperty' ,
	'deleteProperty' ,
	//'get' ,	// non-common
	'getOwnPropertyDescriptor' ,
	'has' ,
	'set'
] ;



commonTraps.forEach( trapName => {
	deepHandler[ trapName ] = function( target , ... args ) {
		if ( this.root.handler[ trapName ] ) {
			return this.root.handler[ trapName ].call( this , target , ... args , this.path ) ;
		}

		return Reflect[ trapName ]( target , ... args ) ;
	}
} ) ;



commonPropertyTraps.forEach( trapName => {
	deepHandler[ trapName ] = function( target , property , ... args ) {
		if ( this.root.handler[ trapName ] ) {
			return this.root.handler[ trapName ].call( this , target , property , ... args , this.root.addPathNode( this , property ) ) ;
		}

		return Reflect[ trapName ]( target , property , ... args ) ;
	}
} ) ;

