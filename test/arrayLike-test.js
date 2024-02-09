/*
	Tree Kit

	Copyright (c) 2014 - 2021 Cédric Ronvel

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

/* global expect, describe, it */

"use strict" ;



const arrayLike = require( '../lib/arrayLike.js' ) ;



describe( "Array-like methods" , () => {

	it( ".map()" , () => {
		var object = {
			a: { key1: 'value1' , key2: 'value2' } ,
			b: { key1: 'alt-value1' , key2: 'value2' } ,
			c: { key1: 'value1' , key2: 'alt-value2' }
		} ;

		expect( arrayLike.map( object , item => item.key1 ) ).to.equal( {
			a: 'value1' ,
			b: 'alt-value1' ,
			c: 'value1'
		} ) ;

		expect( arrayLike.map( object , item => item.key1 === 'value1' ) ).to.equal( {
			a: true ,
			b: false ,
			c: true
		} ) ;

		expect( arrayLike.map( object , item => ( { newKey: item.key1 } ) ) ).to.equal( {
			a: { newKey: 'value1' } ,
			b: { newKey: 'alt-value1' } ,
			c: { newKey: 'value1' }
		} ) ;
	} ) ;

	it( ".filter()" , () => {
		var object = {
			a: { key1: 'value1' , key2: 'value2' } ,
			b: { key1: 'alt-value1' , key2: 'value2' } ,
			c: { key1: 'value1' , key2: 'alt-value2' }
		} ;

		expect( arrayLike.filter( object , item => item.key1 === 'value1' ) ).to.equal( {
			a: { key1: 'value1' , key2: 'value2' } ,
			c: { key1: 'value1' , key2: 'alt-value2' }
		} ) ;

		expect( arrayLike.filter( object , item => item.key2 === 'value2' ) ).to.equal( {
			a: { key1: 'value1' , key2: 'value2' } ,
			b: { key1: 'alt-value1' , key2: 'value2' }
		} ) ;
	} ) ;
} ) ;

