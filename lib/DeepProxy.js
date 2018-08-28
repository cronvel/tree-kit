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



function DeepProxy( target , handler = {} ) {
	this.target = target ;
	this.handler = handler ;
	this.proxies = new WeakMap() ;

	return this.getProxy( target ) ;
}

module.exports = DeepProxy ;



DeepProxy.prototype.getProxy = function( target , fromCtx , fromProperty ) {
	// First, check if that object is already proxified, so we can return it immediately
	var proxy = this.proxies.get( target ) ;
	if ( proxy ) { return proxy ; }
	
	// Create a proxy for this object, and add it to the weakmap
	proxy = new Proxy(
		{
			self: this ,
			target: target ,
			path: fromCtx ? fromCtx.path.concat( fromProperty ) : []
		} ,
		deepHandler
	) ;
	
	this.proxies.set( target , proxy ) ;
	
	return proxy ;
} ;



var deepHandler = {
	get: ( ctx , property ) => {
		if ( ctx.target[ property ] && typeof ctx.target[ property ] === 'object' ) {
			return ctx.self.getProxy( ctx.target[ property ] , ctx , property ) ;
		}
		
		if ( ctx.self.handler.get ) {
			//return ctx.self.handler.get( ctx.target , property , ctx.self.target , ctx.path.concat( property ) ) ;
			return ctx.self.handler.get( ctx.target , property , ctx.self.target , ctx.path ) ;
		}
		
		return ctx.target[ property ] ;
	}
} ;

