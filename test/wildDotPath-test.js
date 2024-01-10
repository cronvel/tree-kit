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



const wildDotPath = require( '../lib/wildDotPath.js' ) ;



describe( "Tree's wild-dot-path" , () => {

	it( "wildDotPath.get() on array of objects" , () => {
		var a = {
			embedded: [
				{ firstName: 'Bobby' , lastName: 'Fischer' } ,
				{ firstName: 'Bob' , lastName: 'Ross' } ,
				{ firstName: 'Joe' , lastName: 'Doe' }
			]
		} ;

		expect( wildDotPath.get( a , 'embedded.*' ) ).to.equal( [
			{ firstName: 'Bobby' , lastName: 'Fischer' } ,
			{ firstName: 'Bob' , lastName: 'Ross' } ,
			{ firstName: 'Joe' , lastName: 'Doe' }
		] ) ;
		expect( wildDotPath.get( a , 'embedded.*.firstName' ) ).to.equal( [ 'Bobby' , 'Bob' , 'Joe' ] ) ;
		expect( wildDotPath.get( a , 'embedded.*.lastName' ) ).to.equal( [ 'Fischer' , 'Ross' , 'Doe' ] ) ;
		expect( wildDotPath.get( a , 'embedded.*.unexistant' ) ).to.equal( [ undefined , undefined , undefined ] ) ;
		expect( wildDotPath.get( a , 'unexistant.*.unexistant' ) ).to.equal( [] ) ;
		expect( wildDotPath.get( a , 'embedded.1.firstName' ) ).to.equal( [ 'Bob' ] ) ;

		expect( wildDotPath.getPathValue( a , 'embedded.*.firstName' ) ).to.equal( {
			"embedded.0.firstName": 'Bobby' ,
			"embedded.1.firstName": 'Bob' ,
			"embedded.2.firstName": 'Joe'
		} ) ;
	} ) ;

	it( "wildDotPath.get() on object of objects" , () => {
		var a = {
			embedded: {
				father: { firstName: 'Bobby' , lastName: 'Fischer' } ,
				godfather: { firstName: 'Bob' , lastName: 'Ross' } ,
				friend: { firstName: 'Joe' , lastName: 'Doe' }
			}
		} ;

		expect( wildDotPath.get( a , 'embedded.*' ) ).to.equal( [
			{ firstName: 'Bobby' , lastName: 'Fischer' } ,
			{ firstName: 'Bob' , lastName: 'Ross' } ,
			{ firstName: 'Joe' , lastName: 'Doe' }
		] ) ;
		expect( wildDotPath.get( a , 'embedded.*.firstName' ) ).to.equal( [ 'Bobby' , 'Bob' , 'Joe' ] ) ;
		expect( wildDotPath.get( a , 'embedded.*.lastName' ) ).to.equal( [ 'Fischer' , 'Ross' , 'Doe' ] ) ;
		expect( wildDotPath.get( a , 'embedded.*.unexistant' ) ).to.equal( [ undefined , undefined , undefined ] ) ;
		expect( wildDotPath.get( a , 'unexistant.*.unexistant' ) ).to.equal( [] ) ;
		expect( wildDotPath.get( a , 'embedded.godfather.firstName' ) ).to.equal( [ 'Bob' ] ) ;

		expect( wildDotPath.getPathValue( a , 'embedded.*.firstName' ) ).to.equal( {
			"embedded.father.firstName": 'Bobby' ,
			"embedded.godfather.firstName": 'Bob' ,
			"embedded.friend.firstName": 'Joe'
		} ) ;
	} ) ;
} ) ;

