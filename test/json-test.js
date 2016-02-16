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
var json = tree.json ;
var expect = require( 'expect.js' ) ;





			/* Helpers */



function testEq( v )
{
	expect( json.stringify( v ) ).to.be( JSON.stringify( v ) ) ;
}




			/* Tests */



describe( "JSON" , function() {
	
	it( "Basic tests" , function() {
		testEq( undefined ) ;
		testEq( null ) ;
		testEq( true ) ;
		testEq( false ) ;
		
		testEq( 0 ) ;
		testEq( 0.0000000123 ) ;
		testEq( -0.0000000123 ) ;
		testEq( 1234 ) ;
		testEq( -1234 ) ;
		testEq( NaN ) ;
		testEq( Infinity ) ;
		testEq( - Infinity ) ;
		
		testEq( '' ) ;
		testEq( '0' ) ;
		testEq( '1' ) ;
		testEq( '123' ) ;
		testEq( 'A' ) ;
		testEq( 'ABC' ) ;
		testEq( '\ta"b"c\n\rAB\tC\né~\'#&|_\\-ł"»¢/æ//nĸ^' ) ;
		
		testEq( {} ) ;
		testEq( {a:1,b:'2'} ) ;
		testEq( {a:1,b:'2',c:true,d:null,e:undefined} ) ;
		testEq( {a:1,b:'2',sub:{c:true,d:null,e:undefined,sub:{f:''}}} ) ;
		
		testEq( [] ) ;
		testEq( [1,'2'] ) ;
		testEq( [1,'2',[null,undefined,true]] ) ;
	} ) ;
} ) ;

