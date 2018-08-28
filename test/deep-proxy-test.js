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



var DeepProxy = require( '../lib/DeepProxy.js' ) ;



describe( "DeepProxy" , () => {
	
	it( "get and deep get without handler" , () => {
		var object = { a: 1 , deep: { c: 3 , deeper: { hello: "world!" } } , array: [ 1 , 2 , 3 ] } ;
		var proxy = new DeepProxy( object ) ;
		
		expect( proxy ).not.to.be( object ) ;
		expect( proxy.a ).to.be( 1 ) ;
		expect( proxy.deep ).not.to.be( object.deep ) ;
		expect( proxy.deep.c ).to.be( 3 ) ;
		expect( proxy.deep.deeper ).not.to.be( object.deep.deeper ) ;
		expect( proxy.deep.deeper.hello ).to.be( "world!" ) ;
		expect( proxy.array ).not.to.be( object.array ) ;
		expect( proxy.array[ 0 ] ).to.be( 1 ) ;
		expect( proxy.array[ 1 ] ).to.be( 2 ) ;
		expect( proxy.array[ 2 ] ).to.be( 3 ) ;
		expect( proxy.array.length ).to.be( 3 ) ;
	} ) ;
	
	it( "get and deep get with handler" , () => {
		var object = { a: 1 , deep: { c: 3 , deeper: { hello: "world!" } } , array: [ 1 , 2 , 3 ] } ;
		
		var proxy = new DeepProxy( object , {
			get: ( target , property , root , path ) => {
				return '/' + path.join( '/' ) + ':' + target[ property ] ;
			}
		} ) ;
		
		expect( proxy ).not.to.be( object ) ;
		expect( proxy.a ).to.be( "/:1" ) ;
		expect( proxy.deep ).not.to.be( object.deep ) ;
		expect( proxy.deep.c ).to.be( "/deep:3" ) ;
		expect( proxy.deep.deeper ).not.to.be( object.deep.deeper ) ;
		expect( proxy.deep.deeper.hello ).to.be( "/deep/deeper:world!" ) ;
		expect( proxy.array ).not.to.be( object.array ) ;
		expect( proxy.array[ 0 ] ).to.be( "/array/0:1" ) ;
		expect( proxy.array[ 1 ] ).to.be( 2 ) ;
		expect( proxy.array[ 2 ] ).to.be( 3 ) ;
		expect( proxy.array.length ).to.be( 3 ) ;
	} ) ;
} ) ;



