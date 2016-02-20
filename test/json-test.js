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

"use strict" ;



var fs = require( 'fs' ) ;
var tree = require( '../lib/tree.js' ) ;
var json = tree.json ;
var expect = require( 'expect.js' ) ;





			/* Helpers */



function testStringifyEq( v )
{
	expect( json.stringify( v ) )
		.to.be( JSON.stringify( v ) ) ;
}

function testParseEq( s )
{
	expect( JSON.stringify(
			json.parse( s )
		) )
		.to.be( JSON.stringify(
			JSON.parse( s )
		) ) ;
}




			/* Tests */



describe( "JSON" , function() {
	
	it( "stringify()" , function() {
		
		testStringifyEq( undefined ) ;
		testStringifyEq( null ) ;
		testStringifyEq( true ) ;
		testStringifyEq( false ) ;
		
		testStringifyEq( 0 ) ;
		testStringifyEq( 0.0000000123 ) ;
		testStringifyEq( -0.0000000123 ) ;
		testStringifyEq( 1234 ) ;
		testStringifyEq( -1234 ) ;
		testStringifyEq( NaN ) ;
		testStringifyEq( Infinity ) ;
		testStringifyEq( - Infinity ) ;
		
		testStringifyEq( '' ) ;
		testStringifyEq( '0' ) ;
		testStringifyEq( '1' ) ;
		testStringifyEq( '123' ) ;
		testStringifyEq( 'A' ) ;
		testStringifyEq( 'ABC' ) ;
		testStringifyEq( '\ta"b"c\n\rAB\tC\né~\'#&|_\\-ł"»¢/æ//nĸ^' ) ;
		testStringifyEq( '\t\v\x00\x01\x7f\x1fa\x7fa' ) ;
		
		testStringifyEq( {} ) ;
		testStringifyEq( {a:1,b:'2'} ) ;
		testStringifyEq( {a:1,b:'2',c:true,d:null,e:undefined} ) ;
		testStringifyEq( {a:1,b:'2',sub:{c:true,d:null,e:undefined,sub:{f:''}}} ) ;
		
		testStringifyEq( [] ) ;
		testStringifyEq( [1,'2'] ) ;
		testStringifyEq( [1,'2',[null,undefined,true]] ) ;
		
		testStringifyEq( require( '../sample/sample1.json' ) ) ;
		testStringifyEq( require( '../sample/stringFlatObject.js' ) ) ;
		
		// Investigate why it does not work
		//testStringifyEq( require( '../sample/garbageStringObject.js' ) ) ;
	} ) ;
	
	it( "parse()" , function() {
		
		testParseEq( 'null' ) ;
		testParseEq( 'true' ) ;
		testParseEq( 'false' ) ;
		
		testParseEq( '0' ) ;
		testParseEq( '1' ) ;
		testParseEq( '123' ) ;
		testParseEq( '-123' ) ;
		testParseEq( '123.456' ) ;
		testParseEq( '-123.456' ) ;
		testParseEq( '0.123' ) ;
		testParseEq( '-0.123' ) ;
		testParseEq( '0.00123' ) ;
		testParseEq( '-0.00123' ) ;
		
		testParseEq( '""' ) ;
		testParseEq( '"abc"' ) ;
		testParseEq( '"abc\\"def"' ) ;
		testParseEq( '"abc\\ndef\\tghi\\rjkl"' ) ;
		testParseEq( '"abc\\u0000\\u007f\\u0061def\\"\\"jj"' ) ;
		
		testParseEq( '{}' ) ;
		testParseEq( '{"a":1}' ) ;
		testParseEq( '{"a":1,"b":"string","c":"","d":null,"e":true,"f":false}' ) ;
		testParseEq( '{"a":1,"b":"string","c":"","d":null,"e":true,"f":false,"sub":{"g":123,"h":{},"i":{"j":"J!"}}}' ) ;
		
		testParseEq( '[]' ) ;
		testParseEq( '[1,2,3]' ) ;
		testParseEq( '[-12,1.5,"toto",true,false,null,0.3]' ) ;
		testParseEq( '[-12,1.5,"toto",true,false,null,0.3,[1,2,3],[4,5,6]]' ) ;
		
		testParseEq( '{"a":1,"b":"string","c":"","d":null,"e":true,"f":false,"sub":{"g":123,"h":[1,2,3],"i":["j","J!"]}}' ) ;
		testParseEq( '[-12,1.5,"toto",{"g":123,"h":[1,2,3],"i":["j","J!"]},true,false,null,0.3,[1,2,3],[4,5,6]]' ) ;
		
		testParseEq( ' { "a" :   1 , "b":  \n"string",\n  "c":"" \t,\n\t"d" :   null,"e":true,   "f"   :   false  , "sub":{"g":123,"h":[1,2,3],"i":["j","J!"]}}' ) ;
		
		testParseEq( fs.readFileSync( __dirname + '/../sample/sample1.json' ).toString() ) ;
	} ) ;
} ) ;

