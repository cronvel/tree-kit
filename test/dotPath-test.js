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



const dotPath = require( '../lib/dotPath.js' ) ;



describe( "Tree's dot-path on objects" , () => {

	it( "dotPath.get() on object structure" , () => {
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

		expect( dotPath.get( o , 'a' ) ).to.be( 5 ) ;
		expect( dotPath.get( o , 'sub' ) ).to.equal( {
			b: "toto" ,
			sub: {
				c: true
			}
		} ) ;

		expect( dotPath.get( o , 'sub.b' ) ).to.be( "toto" ) ;
		expect( dotPath.get( o , 'sub.sub' ) ).to.equal( { c: true } ) ;
		expect( dotPath.get( o , 'sub.sub.c' ) ).to.be( true ) ;
		expect( dotPath.get( o , 'd' ) ).to.be( null ) ;
		expect( dotPath.get( o , 'nothing' ) ).to.be( undefined ) ;
		expect( dotPath.get( o , 'sub.nothing' ) ).to.be( undefined ) ;
		expect( dotPath.get( o , 'nothing.nothing' ) ).to.be( undefined ) ;
	} ) ;

	it( "should support the empty path part syntax", () => {
		var o = {
			"": {
				hidden: "value" ,
				"": {
					hidden2: "value2" ,
				} ,
				sub: {
					"": {
						hidden3: "value3" ,
					} ,
				}
			}
		} ;

		expect( dotPath.get( o , '' ) ).to.be( o ) ;
		expect( dotPath.get( o , '.' ) ).to.be( o[''] ) ;
		expect( dotPath.get( o , '.hidden' ) ).to.be( "value" ) ;
		expect( dotPath.get( o , '..' ) ).to.be( o[''][''] ) ;
		expect( dotPath.get( o , '..hidden2' ) ).to.be( "value2" ) ;
		expect( dotPath.get( o , '.sub' ) ).to.be( o[''].sub ) ;
		expect( dotPath.get( o , '.sub..' ) ).to.be( o[''].sub[''] ) ;
		expect( dotPath.get( o , '.sub..hidden3' ) ).to.be( "value3" ) ;
	} ) ;

	it( "dotPath.delete() on object structure" , () => {
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

		dotPath.delete( o , 'a' ) ;
		dotPath.delete( o , 'sub.sub' ) ;
		dotPath.delete( o , 'non.existant.path' ) ;

		expect( o ).to.equal( {
			sub: {
				b: "toto"
			} ,
			d: null
		} ) ;
	} ) ;

	it( "dotPath.set() on object structure" , () => {
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

		dotPath.set( o , 'a' , "8" ) ;
		dotPath.set( o , 'sub.b' , false ) ;
		dotPath.set( o , 'sub.sub' , { x: 18 , y: 27 } ) ;
		dotPath.set( o , 'non.existant.path' , 'new' ) ;

		expect( o ).to.equal( {
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

	it( "dotPath.define() on object structure" , () => {
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

		dotPath.define( o , 'a' , "8" ) ;
		dotPath.define( o , 'sub.b' , false ) ;
		dotPath.define( o , 'unexistant' , '!' ) ;
		dotPath.define( o , 'sub.sub' , { x: 18 , y: 27 } ) ;
		dotPath.define( o , 'non.existant.path' , 'new' ) ;

		expect( o ).to.equal( {
			a: 5 ,
			unexistant: '!' ,
			sub: {
				b: "toto" ,
				sub: {
					c: true
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

	it( "dotPath.inc() and dotPath.dec() on object structure" , () => {
		var o = {
			a: 5 ,
			sub: {
				b: 10 ,
				sub: {
					c: true
				}
			} ,
			d: null
		} ;

		dotPath.inc( o , 'a' ) ;
		dotPath.dec( o , 'sub.b' ) ;
		dotPath.inc( o , 'sub' ) ;
		dotPath.dec( o , 'sub.sub' ) ;
		dotPath.inc( o , 'non.existant.path' ) ;
		dotPath.dec( o , 'another.non.existant.path' ) ;

		expect( o ).to.equal( {
			a: 6 ,
			sub: {
				b: 9 ,
				sub: {
					c: true
				}
			} ,
			d: null ,
			non: {
				existant: {
					path: 1
				}
			} ,
			another: {
				non: {
					existant: {
						path: -1
					}
				}
			}
		} ) ;
	} ) ;

	it( "dotPath.append() and dotPath.prepend() on object structure" , () => {
		var o = {
			a: null ,
			sub: {
				b: [ 'some' ] ,
				sub: {
					c: [ 'value' ]
				}
			}
		} ;

		dotPath.append( o , 'a' , 'hello' ) ;
		dotPath.append( o , 'sub.b' , 'value' ) ;
		dotPath.prepend( o , 'sub.sub.c' , 'other' ) ;
		dotPath.prepend( o , 'sub.sub.c' , 'some' ) ;
		dotPath.append( o , 'sub.sub.c' , '!' ) ;
		dotPath.append( o , 'non.existant.path' , '!' ) ;
		dotPath.prepend( o , 'another.non.existant.path' , '!' ) ;

		expect( o ).to.equal( {
			a: [ 'hello' ] ,
			sub: {
				b: [ 'some' , 'value' ] ,
				sub: {
					c: [ 'some' , 'other' , 'value' , '!' ]
				}
			} ,
			non: {
				existant: {
					path: [ '!' ]
				}
			} ,
			another: {
				non: {
					existant: {
						path: [ '!' ]
					}
				}
			}
		} ) ;
	} ) ;

	it( "dotPath.concat() and dotPath.insert() on object structure" , () => {
		var o = {
			a: null ,
			sub: {
				b: [ 'hi' ] ,
				sub: {
					c: [ 'again' ]
				}
			}
		} ;

		dotPath.concat( o , 'a' , [ 'hello' , 'world' ] ) ;
		dotPath.concat( o , 'sub.b' , [ 'hello' , 'world' ] ) ;
		dotPath.insert( o , 'sub.sub.c' , [ 'hello' , 'world' ] ) ;

		expect( o ).to.equal( {
			a: [ 'hello' , 'world' ] ,
			sub: {
				b: [ 'hi' , 'hello' , 'world' ] ,
				sub: {
					c: [ 'hello' , 'world' , 'again' ]
				}
			}
		} ) ;
	} ) ;

	it( "dotPath.autoPush()" , () => {
		var o = {
			a: 1 ,
			sub: {
				b: [ 'some' ] ,
				sub: {
					c: [ 'some' , 'other' , 'value' ]
				}
			}
		} ;

		dotPath.autoPush( o , 'a' , 'hello' ) ;
		dotPath.autoPush( o , 'd' , 'D' ) ;
		dotPath.autoPush( o , 'sub.b' , 'value' ) ;
		dotPath.autoPush( o , 'sub.sub.c' , '!' ) ;
		dotPath.autoPush( o , 'non.existant.path' , '!' ) ;

		expect( o ).to.equal( {
			a: [ 1 , 'hello' ] ,
			d: 'D' ,
			sub: {
				b: [ 'some' , 'value' ] ,
				sub: {
					c: [ 'some' , 'other' , 'value' , '!' ]
				}
			} ,
			non: {
				existant: {
					path: '!'
				}
			}
		} ) ;
	} ) ;
} ) ;



describe( "Tree's dot-path on arrays" , () => {

	it( "dotPath.get() on a simple array" , () => {
		var a = [ 'a' , 'b' , 'c' ] ;

		expect( dotPath.get( a , '0' ) ).to.be( 'a' ) ;
		expect( dotPath.get( a , '1' ) ).to.be( 'b' ) ;
		expect( dotPath.get( a , '2' ) ).to.be( 'c' ) ;
		expect( dotPath.get( a , '3' ) ).to.be( undefined ) ;
		expect( dotPath.get( a , 'length' ) ).to.be( 3 ) ;
	} ) ;

	it( "dotPath.get() on nested arrays" , () => {
		var a = [ 'a' , [ [ 'b' , 'c' ] , 'd' , [ 'e' , 'f' ] ] ] ;

		expect( dotPath.get( a , '0' ) ).to.be( 'a' ) ;
		expect( dotPath.get( a , '1' ) ).to.equal( [ [ 'b' , 'c' ] , 'd' , [ 'e' , 'f' ] ] ) ;
		expect( dotPath.get( a , '2' ) ).to.be( undefined ) ;

		expect( dotPath.get( a , '1.0' ) ).to.equal( [ 'b' , 'c' ] ) ;
		expect( dotPath.get( a , '1.1' ) ).to.equal( 'd' ) ;
		expect( dotPath.get( a , '1.2' ) ).to.equal( [ 'e' , 'f' ] ) ;
		expect( dotPath.get( a , '1.3' ) ).to.be( undefined ) ;
		expect( dotPath.get( a , '1.length' ) ).to.be( 3 ) ;
	} ) ;

	it( "dotPath.set() on a simple array" , () => {
		var a ;

		a = [ 'a' , 'b' , 'c' ] ;

		dotPath.set( a , '1' , 'B' ) ;

		expect( a ).to.equal( [ 'a' , 'B' , 'c' ] ) ;
		expect( dotPath.get( a , 'length' ) ).to.be( 3 ) ;

		a = [ 'a' , 'b' , 'c' ] ;

		dotPath.set( a , '1' , 'BBB' ) ;

		expect( a ).to.equal( [ 'a' , 'BBB' , 'c' ] ) ;
		expect( dotPath.get( a , 'length' ) ).to.be( 3 ) ;
	} ) ;

	it( "dotPath.delete() on a simple array" , () => {
		var a ;

		a = [ 'a' , 'b' , 'c' ] ;
		dotPath.delete( a , '1' ) ;
		expect( a ).to.equal( [ 'a' , undefined , 'c' ] ) ;
		expect( dotPath.get( a , 'length' ) ).to.be( 3 ) ;

		a = [ 'a' , 'b' , 'c' ] ;
		dotPath.delete( a , '2' ) ;
		expect( a ).to.equal( [ 'a' , 'b' , undefined ] ) ;
		expect( dotPath.get( a , 'length' ) ).to.be( 3 ) ;
	} ) ;

	it( "dotPath.set() on structure mixing arrays and objects" ) ;
} ) ;



describe( "Tree's dot-path on mixed object and arrays" , () => {

	it( "dotPath.get() on a simple array" , () => {
		var a = {
			method: 'get' ,
			populate: [ 'parents' , 'godfather' ]
		} ;

		expect( dotPath.get( a , 'method' ) ).to.be( 'get' ) ;
		expect( dotPath.get( a , 'populate' ) ).to.equal( [ 'parents' , 'godfather' ] ) ;
		expect( dotPath.get( a , 'populate.0' ) ).to.be( 'parents' ) ;
		expect( dotPath.get( a , 'populate.1' ) ).to.be( 'godfather' ) ;
		expect( dotPath.get( a , 'populate.2' ) ).to.be( undefined ) ;
	} ) ;

	it( "dotPath.set() on a simple array" , () => {
		var a = {
			method: 'get' ,
			populate: [ 'parent' , 'godfather' ]
		} ;

		dotPath.set( a , 'method' , 'post' ) ;
		dotPath.set( a , 'populate.0' , 'friends' ) ;

		expect( a ).to.equal( {
			method: 'post' ,
			populate: [ 'friends' , 'godfather' ]
		} ) ;
	} ) ;
} ) ;



describe( "Tree's array dot-path on objects" , () => {

	it( "dotPath.get() on object structure" , () => {
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

		expect( dotPath.get( o , [ 'a' ] ) ).to.be( 5 ) ;
		expect( dotPath.get( o , [ 'sub' ] ) ).to.be.like( {
			b: "toto" ,
			sub: {
				c: true
			}
		} ) ;

		expect( dotPath.get( o , [ 'sub' , 'b' ] ) ).to.be( "toto" ) ;
		expect( dotPath.get( o , [ 'sub' , 'sub' ] ) ).to.be.like( { c: true } ) ;
		expect( dotPath.get( o , [ 'sub' , 'sub' , 'c' ] ) ).to.be( true ) ;
		expect( dotPath.get( o , [ 'd' ] ) ).to.be( null ) ;
		expect( dotPath.get( o , [ 'nothing' ] ) ).to.be( undefined ) ;
		expect( dotPath.get( o , [ 'sub' , 'nothing' ] ) ).to.be( undefined ) ;
		expect( dotPath.get( o , [ 'nothing' , 'nothing' ] ) ).to.be( undefined ) ;
	} ) ;

	it( "dotPath.delete() on object structure" , () => {
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

		dotPath.delete( o , [ 'a' ] ) ;
		dotPath.delete( o , [ 'sub' , 'sub' ] ) ;
		dotPath.delete( o , [ 'non' , 'existant' , 'path' ] ) ;

		expect( o ).to.be.like( {
			sub: {
				b: "toto"
			} ,
			d: null
		} ) ;
	} ) ;

	it( "dotPath.set() on object structure" , () => {
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

		dotPath.set( o , [ 'a' ] , "8" ) ;
		dotPath.set( o , [ 'sub' , 'b' ] , false ) ;
		dotPath.set( o , [ 'sub' , 'sub' ] , { x: 18 , y: 27 } ) ;
		dotPath.set( o , [ 'non' , 'existant' , 'path' ] , 'new' ) ;

		expect( o ).to.be.like( {
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

	it( "dotPath.define() on object structure" , () => {
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

		dotPath.define( o , [ 'a' ] , "8" ) ;
		dotPath.define( o , [ 'sub' , 'b' ] , false ) ;
		dotPath.define( o , [ 'unexistant' ] , '!' ) ;
		dotPath.define( o , [ 'sub' , 'sub' ] , { x: 18 , y: 27 } ) ;
		dotPath.define( o , [ 'non' , 'existant' , 'path' ] , 'new' ) ;

		expect( o ).to.be.like( {
			a: 5 ,
			unexistant: '!' ,
			sub: {
				b: "toto" ,
				sub: {
					c: true
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

	it( "dotPath.inc() and dotPath.dec() on object structure" , () => {
		var o = {
			a: 5 ,
			sub: {
				b: 10 ,
				sub: {
					c: true
				}
			} ,
			d: null
		} ;

		dotPath.inc( o , [ 'a' ] ) ;
		dotPath.dec( o , [ 'sub' , 'b' ] ) ;
		dotPath.inc( o , [ 'sub' ] ) ;
		dotPath.dec( o , [ 'sub' , 'sub' ] ) ;
		dotPath.inc( o , [ 'non' , 'existant' , 'path' ] ) ;
		dotPath.dec( o , [ 'another' , 'non' , 'existant' , 'path' ] ) ;

		expect( o ).to.be.like( {
			a: 6 ,
			sub: {
				b: 9 ,
				sub: {
					c: true
				}
			} ,
			d: null ,
			non: {
				existant: {
					path: 1
				}
			} ,
			another: {
				non: {
					existant: {
						path: -1
					}
				}
			}
		} ) ;

	} ) ;
} ) ;



describe( ".dotPath() security issues" , () => {

	it( "Prototype pollution using .__proto__" , () => {
		delete Object.prototype.hack ;
		expect( () => dotPath.set( {} , '__proto__.hack' , 'hacked' ) ).to.throw() ;
		expect( Object.prototype.hack ).to.be.undefined() ;
		expect( () => dotPath.set( {} , '__proto__' , 'hacked' ) ).to.throw() ;
		expect( () => dotPath.set( {a:{}} , 'a.__proto__' , 'hacked' ) ).to.throw() ;
		expect( () => dotPath.delete( {} , '__proto__' , 'hacked' ) ).to.throw() ;
		expect( () => dotPath.delete( {} , '__proto__.hack' , 'hacked' ) ).to.throw() ;
	} ) ;

	it( "Prototype pollution using a path array: [['__proto__']]" , () => {
		delete Object.prototype.hack ;
		expect( () => dotPath.set( {} , [['__proto__'],'hack'] , 'hacked' ) ).to.throw() ;
		expect( Object.prototype.hack ).to.be.undefined() ;
		expect( () => dotPath.set( {} , '__proto__' , 'hacked' ) ).to.throw() ;
		expect( () => dotPath.set( {a:{}} , 'a.__proto__' , 'hacked' ) ).to.throw() ;
		expect( () => dotPath.delete( {} , '__proto__' , 'hacked' ) ).to.throw() ;
		expect( () => dotPath.delete( {} , '__proto__.hack' , 'hacked' ) ).to.throw() ;
	} ) ;

	it( "Prototype pollution using .constructor" , () => {
		delete Object.prototype.hack ;
		expect( () => dotPath.set( {} , 'constructor.prototype' , 'hacked' ) ).to.throw() ;
		expect( () => dotPath.set( {} , 'constructor.prototype.hack' , 'hacked' ) ).to.throw() ;
		expect( Object.prototype.hack ).to.be.undefined() ;

		// Check that we can still return a function, but not go inside of it
		function fn() {}
		fn.a = 'A' ;
		expect( dotPath.get( { fn } , 'fn' ) ).to.be( fn ) ;
		expect( () => dotPath.get( { fn } , 'fn.a' ) ).to.throw() ;
		expect( () => dotPath.get( { fn } , 'fn.prototype' ) ).to.throw() ;
		expect( () => dotPath.set( { fn } , 'fn.a' , 'B' ) ).to.throw() ;
		expect( fn.a ).to.be( 'A' ) ;

		var o = { fn } ;
		dotPath.set( o , 'fn' , 'notfn' ) ;
		expect( o.fn ).to.be( 'notfn' ) ;
	} ) ;
} ) ;

