/*
	The Cedric's Swiss Knife (CSK) - CSK object tree toolbox test suite

	Copyright (c) 2014, 2015 Cédric Ronvel 
	
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

/* jshint unused:false */
/* global describe, it, before, after */


var tree = require( '../lib/tree.js' ) ;
var expect = require( 'expect.js' ) ;





			/* Tests */



describe( "Tree's path" , function() {
	
	it( "path.get()" , function() {
		
		var o = {
			a: 5 ,
			sub: {
				b: "toto" ,
				sub: {
					c: true
				}
			} ,
			d: null
		} ;
		
		expect( tree.path.get( o , 'a' ) ).to.be( 5 ) ;
		expect( tree.path.get( o , 'sub' ) ).to.eql( {
			b: "toto" ,
			sub: {
				c: true
			}
		} ) ;
		expect( tree.path.get( o , 'sub.b' ) ).to.be( "toto" ) ;
		expect( tree.path.get( o , 'sub.sub' ) ).to.eql( { c: true } ) ;
		expect( tree.path.get( o , 'sub.sub.c' ) ).to.be( true ) ;
		expect( tree.path.get( o , 'd' ) ).to.be( null ) ;
		expect( tree.path.get( o , 'nothing' ) ).to.be( undefined ) ;
		expect( tree.path.get( o , 'sub.nothing' ) ).to.be( undefined ) ;
		expect( tree.path.get( o , 'nothing.nothing' ) ).to.be( undefined ) ;
	} ) ;
	
	it( "path.set()" , function() {
		
		var o = {
			a: 5 ,
			sub: {
				b: "toto" ,
				sub: {
					c: true
				}
			} ,
			d: null
		} ;
		
		tree.path.set( o , 'a' , "8" ) ;
		tree.path.set( o , 'sub.b' , false ) ;
		tree.path.set( o , 'sub.sub' , { x: 18 , y: 27 } ) ;
		tree.path.set( o , 'non.existant.path' , 'new' ) ;
		
		expect( o ).to.eql( {
			a: "8" ,
			sub: {
				b: false ,
				sub: {
					x: 18 ,
					y: 27
				}
			} ,
			d: null ,
			non: {
				existant: {
					path: 'new'
				}
			}
		} ) ;
		
	} ) ;
	
	it( "path.delete()" , function() {
		
		var o = {
			a: 5 ,
			sub: {
				b: "toto" ,
				sub: {
					c: true ,
					sub: {
						f: ''
					}
				}
			} ,
			d: null
		} ;
		
		tree.path.delete( o , 'a' ) ;
		tree.path.delete( o , 'sub.sub' ) ;
		tree.path.delete( o , 'non.existant.path' ) ;
		
		expect( o ).to.eql( {
			sub: {
				b: "toto" ,
			} ,
			d: null
		} ) ;
		
	} ) ;
	
} ) ;


