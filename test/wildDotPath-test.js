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

	it( ".get()/.getPaths()/.getPathValueMap() on array of objects" , () => {
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
		expect( wildDotPath.get( a , 'embedded.1.firstName' ) ).to.equal( [ 'Bob' ] ) ;
		expect( wildDotPath.get( a , 'unexistant.*.unexistant' ) ).to.equal( [] ) ;
		expect( wildDotPath.get( { a: 1 } , 'a.*' ) ).to.equal( [] ) ;
		expect( wildDotPath.get( 1 , 'a.*' ) ).to.equal( [] ) ;

		expect( wildDotPath.getPaths( a , 'embedded.*.firstName' ) ).to.equal( [
			"embedded.0.firstName" ,
			"embedded.1.firstName" ,
			"embedded.2.firstName"
		] ) ;

		expect( wildDotPath.getPathValueMap( a , 'embedded.*.firstName' ) ).to.equal( {
			"embedded.0.firstName": 'Bobby' ,
			"embedded.1.firstName": 'Bob' ,
			"embedded.2.firstName": 'Joe'
		} ) ;
	} ) ;

	it( ".get()/.getPaths()/.getPathValueMap() on object of objects" , () => {
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

		expect( wildDotPath.getPaths( a , 'embedded.*.firstName' ) ).to.equal( [
			"embedded.father.firstName" ,
			"embedded.godfather.firstName" ,
			"embedded.friend.firstName"
		] ) ;

		expect( wildDotPath.getPathValueMap( a , 'embedded.*.firstName' ) ).to.equal( {
			"embedded.father.firstName": 'Bobby' ,
			"embedded.godfather.firstName": 'Bob' ,
			"embedded.friend.firstName": 'Joe'
		} ) ;
	} ) ;

	it( ".set() on array of objects" , () => {
		var a = {
			embedded: [
				{ firstName: 'Bobby' , lastName: 'Fischer' } ,
				{ firstName: 'Bob' , lastName: 'Ross' } ,
				{ firstName: 'Joe' , lastName: 'Doe' }
			]
		} ;

		expect( wildDotPath.set( a , 'embedded.*.lastName' , 'Doe' ) ).to.be( 3 ) ;
		expect( a ).to.equal( {
			embedded: [
				{ firstName: 'Bobby' , lastName: 'Doe' } ,
				{ firstName: 'Bob' , lastName: 'Doe' } ,
				{ firstName: 'Joe' , lastName: 'Doe' }
			]
		} ) ;

		expect( wildDotPath.set( a , 'embedded.*.age' , 42 ) ).to.be( 3 ) ;
		expect( a ).to.equal( {
			embedded: [
				{ firstName: 'Bobby' , lastName: 'Doe' , age: 42 } ,
				{ firstName: 'Bob' , lastName: 'Doe' , age: 42 } ,
				{ firstName: 'Joe' , lastName: 'Doe' , age: 42 }
			]
		} ) ;

		expect( wildDotPath.set( { embedded: [] } , 'embedded.*.age' , 42 ) ).to.be( 0 ) ;

		// Should not throw, but should do nothing
		expect( wildDotPath.set( 1 , 'embedded.*.lastName' , 'Doe' ) ).to.be( 0 ) ;
		expect( wildDotPath.set( 1 , 'embedded' , 'Doe' ) ).to.be( 0 ) ;
	} ) ;

	it( ".set() should pave objects" , () => {
		var a = {
			embedded: [
				{ firstName: 'Bobby' , lastName: 'Fischer' } ,
				{ firstName: 'Bob' , lastName: 'Ross' } ,
				{ firstName: 'Joe' , lastName: 'Doe' }
			]
		} ;

		wildDotPath.set( a , 'embedded.*.data.age' , 42 ) ;
		expect( a ).to.equal( {
			embedded: [
				{ firstName: 'Bobby' , lastName: 'Fischer' , data: { age: 42 } } ,
				{ firstName: 'Bob' , lastName: 'Ross' , data: { age: 42 } } ,
				{ firstName: 'Joe' , lastName: 'Doe' , data: { age: 42 } }
			]
		} ) ;
	} ) ;

	it( ".define() on array of objects" , () => {
		var a = {
			embedded: [
				{ firstName: 'Bobby' , lastName: 'Fischer' } ,
				{ firstName: 'Jack' } ,
				{ firstName: 'Bob' , lastName: 'Ross' } ,
				{ firstName: 'Joe' }
			]
		} ;

		expect( wildDotPath.define( a , 'embedded.*.lastName' , 'Doe' ) ).to.be( 2 ) ;
		expect( a ).to.equal( {
			embedded: [
				{ firstName: 'Bobby' , lastName: 'Fischer' } ,
				{ firstName: 'Jack' , lastName: 'Doe' } ,
				{ firstName: 'Bob' , lastName: 'Ross' } ,
				{ firstName: 'Joe' , lastName: 'Doe' }
			]
		} ) ;
	} ) ;

	it( ".delete() on array of objects" , () => {
		var a = {
			embedded: [
				{ firstName: 'Bobby' , lastName: 'Fischer' } ,
				{ firstName: 'Jack' } ,
				{ firstName: 'Bob' , lastName: 'Ross' } ,
				{ firstName: 'Joe' }
			]
		} ;

		expect( wildDotPath.delete( a , 'embedded.*.lastName' ) ).to.be( 2 ) ;
		expect( a ).to.equal( {
			embedded: [
				{ firstName: 'Bobby' } ,
				{ firstName: 'Jack' } ,
				{ firstName: 'Bob' } ,
				{ firstName: 'Joe' }
			]
		} ) ;
	} ) ;

	it( ".inc()/.dec() on array of objects" , () => {
		var a = {
			embedded: [
				{ firstName: 'Bobby' , lastName: 'Fischer' , data: { age: 51 } } ,
				{ firstName: 'Bob' , lastName: 'Ross' , data: { age: 34 } } ,
				{ firstName: 'Joe' , lastName: 'Doe' , data: { age: 42 } }
			]
		} ;

		expect( wildDotPath.inc( a , 'embedded.*.data.age' ) ).to.be( 3 ) ;
		expect( a ).to.equal( {
			embedded: [
				{ firstName: 'Bobby' , lastName: 'Fischer' , data: { age: 52 } } ,
				{ firstName: 'Bob' , lastName: 'Ross' , data: { age: 35 } } ,
				{ firstName: 'Joe' , lastName: 'Doe' , data: { age: 43 } }
			]
		} ) ;

		expect( wildDotPath.dec( a , 'embedded.*.data.age' ) ).to.be( 3 ) ;
		expect( a ).to.equal( {
			embedded: [
				{ firstName: 'Bobby' , lastName: 'Fischer' , data: { age: 51 } } ,
				{ firstName: 'Bob' , lastName: 'Ross' , data: { age: 34 } } ,
				{ firstName: 'Joe' , lastName: 'Doe' , data: { age: 42 } }
			]
		} ) ;
	} ) ;

	it( ".append()/.prepend() on array of objects" , () => {
		var a = {
			embedded: [
				{ name: 'Jack' } ,
				{ name: 'Bobby' , friends: [ 'Jack' , 'Nickie' ] } ,
				{ name: 'Bob' , friends: [ 'Clara' ] } ,
				{ name: 'Joe' , friends: []  }
			]
		} ;

		expect( wildDotPath.append( a , 'embedded.*.friends' , 'Joana' ) ).to.be( 4 ) ;
		expect( a ).to.equal( {
			embedded: [
				{ name: 'Jack' , friends: [ 'Joana' ] } ,
				{ name: 'Bobby' , friends: [ 'Jack' , 'Nickie' , 'Joana' ] } ,
				{ name: 'Bob' , friends: [ 'Clara' , 'Joana' ] } ,
				{ name: 'Joe' , friends: [ 'Joana' ]  }
			]
		} ) ;

		a = {
			embedded: [
				{ name: 'Jack' } ,
				{ name: 'Bobby' , friends: [ 'Jack' , 'Nickie' ] } ,
				{ name: 'Bob' , friends: [ 'Clara' ] } ,
				{ name: 'Joe' , friends: []  }
			]
		} ;

		expect( wildDotPath.prepend( a , 'embedded.*.friends' , 'Joana' ) ).to.be( 4 ) ;
		expect( a ).to.equal( {
			embedded: [
				{ name: 'Jack' , friends: [ 'Joana' ] } ,
				{ name: 'Bobby' , friends: [ 'Joana' , 'Jack' , 'Nickie' ] } ,
				{ name: 'Bob' , friends: [ 'Joana' , 'Clara' ] } ,
				{ name: 'Joe' , friends: [ 'Joana' ]  }
			]
		} ) ;
	} ) ;

	it( ".autoPush() on array of objects" , () => {
		var a = {
			embedded: [
				{ name: 'Jack' } ,
				{ name: 'Bobby' , friends: [ 'Jack' , 'Nickie' ] } ,
				{ name: 'Bob' , friends: [ 'Clara' ] } ,
				{ name: 'Joe' , friends: []  }
			]
		} ;

		expect( wildDotPath.autoPush( a , 'embedded.*.friends' , 'Joana' ) ).to.be( 4 ) ;
		expect( a ).to.equal( {
			embedded: [
				{ name: 'Jack' , friends: 'Joana' } ,
				{ name: 'Bobby' , friends: [ 'Jack' , 'Nickie' , 'Joana' ] } ,
				{ name: 'Bob' , friends: [ 'Clara' , 'Joana' ] } ,
				{ name: 'Joe' , friends: [ 'Joana' ]  }
			]
		} ) ;

		expect( wildDotPath.autoPush( a , 'embedded.*.friends' , 'Nina' ) ).to.be( 4 ) ;
		expect( a ).to.equal( {
			embedded: [
				{ name: 'Jack' , friends: [ 'Joana' , 'Nina' ] } ,
				{ name: 'Bobby' , friends: [ 'Jack' , 'Nickie' , 'Joana' , 'Nina' ] } ,
				{ name: 'Bob' , friends: [ 'Clara' , 'Joana' , 'Nina' ] } ,
				{ name: 'Joe' , friends: [ 'Joana' , 'Nina' ]  }
			]
		} ) ;
	} ) ;

	it( ".concat()/.insert() on array of objects" , () => {
		var a = {
			embedded: [
				{ name: 'Jack' } ,
				{ name: 'Bobby' , friends: [ 'Jack' , 'Nickie' ] } ,
				{ name: 'Bob' , friends: [ 'Clara' ] } ,
				{ name: 'Joe' , friends: []  }
			]
		} ;

		expect( wildDotPath.concat( a , 'embedded.*.friends' , [ 'Joana' , 'Kate' ] ) ).to.be( 4 ) ;
		expect( a ).to.equal( {
			embedded: [
				{ name: 'Jack' , friends: [ 'Joana' , 'Kate' ] } ,
				{ name: 'Bobby' , friends: [ 'Jack' , 'Nickie' , 'Joana' , 'Kate' ] } ,
				{ name: 'Bob' , friends: [ 'Clara' , 'Joana' , 'Kate' ] } ,
				{ name: 'Joe' , friends: [ 'Joana' , 'Kate' ]  }
			]
		} ) ;

		a = {
			embedded: [
				{ name: 'Jack' } ,
				{ name: 'Bobby' , friends: [ 'Jack' , 'Nickie' ] } ,
				{ name: 'Bob' , friends: [ 'Clara' ] } ,
				{ name: 'Joe' , friends: []  }
			]
		} ;

		expect( wildDotPath.insert( a , 'embedded.*.friends' , [ 'Joana' , 'Kate' ] ) ).to.be( 4 ) ;
		expect( a ).to.equal( {
			embedded: [
				{ name: 'Jack' , friends: [ 'Joana' , 'Kate' ] } ,
				{ name: 'Bobby' , friends: [ 'Joana' , 'Kate' , 'Jack' , 'Nickie' ] } ,
				{ name: 'Bob' , friends: [ 'Joana' , 'Kate' , 'Clara' ] } ,
				{ name: 'Joe' , friends: [ 'Joana' , 'Kate' ]  }
			]
		} ) ;
	} ) ;
} ) ;

