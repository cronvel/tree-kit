/*
	The Cedric's Swiss Knife (CSK) - CSK object tree toolbox test suite

	Copyright (c) 2014 Cédric Ronvel 
	
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





			/* Helper functions */



// The input tree used in most tests
input = {
	'undefined' : undefined ,
	'null' : null ,
	'bool' : true ,
	'true' : true ,
	'false' : false ,
	int : 12 ,
	float : 2.47 ,
	string : 'Oh my god' ,
	scalar : "42" ,
	email : 'toto@example.com' ,
	array : [ 1 , 2 , 3 ] ,
	object : {} ,
	range : 47 ,
	color : 'blue' ,
	note : 'sol' ,  
	size : 37 ,     
	useless : 'useless' ,
	attachement : {
		filename : 'preview.png' ,
		md5 : 'a20f6c76483c9702ee8f29ed42972417'
	} ,
	files: {
		'background.png' : {
			size : '97856' ,
			md5 : 'ddc349bd71d7bc5411471cb427a8a2f5'
		} ,
		'header.png' : {
			size : '44193' ,
			md5 : '6bf8104c8bcdb502fdba01dde5bada6a'
		} ,
		'footer.png' : {
			size : '36411' ,
			md5 : '69f82995d2fb6ae540fff4caa725b6b7'
		}
	} ,
	filesArray: [
		{
			name : 'background.png' ,
			size : '97856' ,
			md5 : 'ddc349bd71d7bc5411471cb427a8a2f5'
		} ,
		{
			name : 'header.png' ,
			size : '44193' ,
			md5 : '6bf8104c8bcdb502fdba01dde5bada6a'
		} ,
		{
			name : 'footer.png' ,
			size : '36411' ,
			md5 : '69f82995d2fb6ae540fff4caa725b6b7'
		}
	] ,
	subtree : {
		a : 'A' ,
		b : 2 ,
		subtree: {
			d : 4 ,
			e : undefined ,
			f : 3.14
		} ,
		c : 'plusplus' ,
		subtree2: {
			g : 6 ,
			h : [] ,
			i : 'iii'
		}
	} ,
	anotherSubtree : {
		j : 'Djay' ,
		k : 'ok' ,
		subtree: {
			l : '1one' ,
			m : false ,
			n : 'nay'
		} ,
		o : 'mg' ,
		subtree2: {
			p : true ,
			q : [4,5,6] ,
			r : '2'
		}
	}
} ;




			/* Tests */



describe( "extend()" , function() {
	
	it( "should extend correctly an empty Object with a flat Object without depth (with or without the 'deep' option)" , function() {
		var copy ;
		
		var expected = {
			d : 4 ,
			e : undefined ,
			f : 3.14 ,
			g : 6 ,
			h : [] ,
			i : 'iii'
		} ;
		
		copy = tree.extend( { deep: true } , {} , input.subtree.subtree ) ;
		expect( tree.extend( null , copy , input.subtree.subtree2 ) ).to.eql( expected ) ;
		
		copy = tree.extend( { deep: true } , {} , input.subtree.subtree ) ;
		expect( tree.extend( { deep: true } , copy , input.subtree.subtree2 ) ).to.eql( expected ) ;
	} ) ;
	
	it( "should extend an empty Object with a deep Object performing a SHALLOW copy, the result should be equal to the deep Object, nested object MUST be equal AND identical" , function() {
		var copy ;
		
		copy = tree.extend( null , {} , input.subtree ) ;
		expect( copy ).to.eql( input.subtree ) ;
		expect( copy ).not.to.equal( input.subtree ) ;
		expect( copy.subtree2 ).to.equal( input.subtree.subtree2 ) ;
	} ) ;
		
	it( "with the 'deep' option should extend an empty Object with a deep Object performing a DEEP copy, the result should be equal to the deep Object, nested object MUST be equal BUT NOT identical" , function() {
		copy = tree.extend( { deep: true } , {} , input.subtree ) ;
		expect( copy ).to.eql( input.subtree ) ;
		expect( copy ).not.to.equal( input.subtree ) ;
		expect( copy.subtree2 ).not.to.equal( input.subtree.subtree2 ) ;
	} ) ;
	
	it( "should extend (by default) properties of the prototype chain" , function() {
		
		var proto = {
			proto1: 'proto1' ,
			proto2: 'proto2' ,
		} ;
		
		var o = Object.create( proto ) ;
		
		o.own1 = 'own1' ;
		o.own2 = 'own2' ;
		
		expect( tree.extend( null , {} , o ) ).to.eql( {
			proto1: 'proto1' ,
			proto2: 'proto2' ,
			own1: 'own1' ,
			own2: 'own2'
		} ) ;
		
		expect( tree.extend( { deep: true } , {} , o ) ).to.eql( {
			proto1: 'proto1' ,
			proto2: 'proto2' ,
			own1: 'own1' ,
			own2: 'own2'
		} ) ;
	} ) ;
	
	it( "with the 'own' option should ONLY extend OWNED properties, properties of the prototype chain are SKIPPED" , function() {
		
		var proto = {
			proto1: 'proto1' ,
			proto2: 'proto2' ,
		} ;
		
		var o = Object.create( proto ) ;
		
		o.own1 = 'own1' ;
		o.own2 = 'own2' ;
		
		expect( tree.extend( { own: true } , {} , o ) ).to.eql( {
			own1: 'own1' ,
			own2: 'own2'
		} ) ;
		
		expect( tree.extend( { deep: true, own: true } , {} , o ) ).to.eql( {
			own1: 'own1' ,
			own2: 'own2'
		} ) ;
	} ) ;
	
	it( "with the 'deep' option should extend a deep Object into another deep Object correctly" , function() {
		
		var copy ;
		
		copy = tree.extend( { deep: true } , {} , input.subtree ) ;
		expect( tree.extend( null , copy , input.anotherSubtree ) ).to.eql( {
			a : 'A' ,
			b : 2 ,
			subtree: {
				l : '1one' ,
				m : false ,
				n : 'nay'
			} ,
			c : 'plusplus' ,
			subtree2: {
				p : true ,
				q : [4,5,6] ,
				r : '2'
			} ,
			j : 'Djay' ,
			k : 'ok' ,
			o : 'mg'
		} ) ;
		
		copy = tree.extend( { deep: true } , {} , input.subtree ) ;
		expect( tree.extend( { deep: true } , copy , input.anotherSubtree ) ).to.eql( {
			a : 'A' ,
			b : 2 ,
			subtree: {
				d : 4 ,
				e : undefined ,
				f : 3.14 ,
				l : '1one' ,
				m : false ,
				n : 'nay'
			} ,
			c : 'plusplus' ,
			subtree2: {
				g : 6 ,
				h : [] ,
				i : 'iii',
				p : true ,
				q : [4,5,6] ,
				r : '2'
			} ,
			j : 'Djay' ,
			k : 'ok' ,
			o : 'mg'
		} ) ;
	} ) ;
	
	it( "with the 'proto' option and a null (or falsy) target, it should create and return a new Object with the prototype of the source Object" , function() {
		
		var e , o , proto ;
		
		proto = {
			proto1: 'proto1' ,
			proto2: 'proto2' ,
			hello: function() { console.log( "Hello!" ) ; }
		} ;
		
		o = Object.create( proto ) ;
		o.own1 = 'own1' ;
		o.own2 = 'own2' ;
		
		e = tree.extend( { proto: true } , null , o ) ;
		
		expect( e ).not.to.be( o ) ;
		expect( e.__proto__ ).to.equal( proto ) ;	// jshint ignore:line
		expect( e ).to.eql( { own1: 'own1' , own2: 'own2' } ) ;
		expect( e.proto1 ).to.be( 'proto1' ) ;
		expect( e.proto2 ).to.be( 'proto2' ) ;
		expect( typeof e.hello ).to.equal( 'function' ) ;
	} ) ;
	
	it( "with the 'proto' option should change the prototype of each target properties for the prototype of the related source properties, if 'deep' is enabled it does so recursively" , function() {
		
		var e , o , proto1 , proto2 ;
		
		proto1 = {
			proto1: 'proto1' ,
			hello: function() { console.log( "Hello!" ) ; }
		} ;
		
		proto2 = {
			proto2: 'proto2' ,
			world: function() { console.log( "World!" ) ; }
		} ;
		
		o = {
			own1: 'own1' ,
			own2: 'own2' ,
			embed1: Object.create( proto1 , { a: { value: 'a' , enumerable: true } } ) ,
			embed2: Object.create( proto2 , { b: { value: 'b' , enumerable: true } } )
		} ;
		
		e = tree.extend( { proto: true } , {} , o ) ;
		
		expect( e ).not.to.be( o ) ;
		expect( e ).to.eql( {
			own1: 'own1' ,
			own2: 'own2' ,
			embed1: { a: 'a' } ,
			embed2: { b: 'b' }
		} ) ;
		expect( e.embed1 ).to.be( o.embed1 ) ;
		expect( e.embed2 ).to.be( o.embed2 ) ;
		expect( e.embed1.proto1 ).to.be( 'proto1' ) ;
		expect( e.embed2.proto2 ).to.be( 'proto2' ) ;
		expect( typeof e.embed1.hello ).to.equal( 'function' ) ;
		expect( typeof e.embed2.world ).to.equal( 'function' ) ;
		
		
		e = tree.extend( { proto: true, deep: true } , {} , o ) ;
		
		expect( e ).not.to.be( o ) ;
		expect( e ).to.eql( {
			own1: 'own1' ,
			own2: 'own2' ,
			embed1: { a: 'a' } ,
			embed2: { b: 'b' }
		} ) ;
		expect( e.embed1 ).not.to.be( o.embed1 ) ;
		expect( e.embed2 ).not.to.be( o.embed2 ) ;
		expect( e.embed1.proto1 ).to.be( 'proto1' ) ;
		expect( e.embed2.proto2 ).to.be( 'proto2' ) ;
		expect( typeof e.embed1.hello ).to.equal( 'function' ) ;
		expect( typeof e.embed2.world ).to.equal( 'function' ) ;
	} ) ;
	
	it( "with 'nofunc' option should not extend function" ) ;
	it( "with 'move' option should move source properties to target properties, i.e. delete them form the source" ) ;
	it( "with 'inherit' option should inherit rather than extend: each source property create a new Object with itself as the prototype into the related target property" ) ;
	//it( "with 'mutateRoot' option" ) ;
} ) ;



/*
describe( "Diff" , function() {
	
	it( "Test needed there!" ) ;
} ) ;
*/



describe( "Masks" , function() {
	
	it( 'should apply a simple mask tree to the input tree' , function() {
		
		var mask = tree.createMask( {
			int: true,
			float: true,
			attachement: {
				filename: true,
				unexistant: true
			},
			unexistant: true,
			subtree: {
				subtree: true
			}
		} ) ;
		
		var output = mask.applyTo( input ) ;
		
		expect( output ).to.eql( {
			int: 12,
			float: 2.47,
			attachement: {
				filename: 'preview.png'
			},
			subtree: {
				subtree: {
					d: 4,
					e: undefined,
					f: 3.14
				}
			}
		} ) ;
	} ) ;
	
	it( "should apply a mask tree with wildcard '*' to the input tree" , function() {
		
		var mask = tree.createMask( {
			'files': {
				'*': {
					size: true,
					unexistant: true
				}
			}
		} ) ;
		
		var output = mask.applyTo( input ) ;
		
		expect( output.files ).to.be.an( Object ) ;
		expect( output ).to.eql( {
			files: {
				'background.png' : {
					size : '97856'
				} ,
				'header.png' : {
					size : '44193'
				} ,
				'footer.png' : {
					size : '36411'
				}
			}
		} ) ;
	} ) ;
	
	it( "should apply a mask tree with wildcard '*' to match array in the input tree" , function() {
		
		var mask = tree.createMask( {
			'filesArray': {
				'*': {
					name: true,
					size: true,
					unexistant: true
				}
			}
		} ) ;
		
		var output = mask.applyTo( input ) ;
		
		expect( output.filesArray ).to.be.an( Array ) ;
		expect( output ).to.eql( {
			filesArray: [
				{
					name : 'background.png' ,
					size : '97856'
				} ,
				{
					name : 'header.png' ,
					size : '44193'
				} ,
				{
					name : 'footer.png' ,
					size : '36411'
				}
			]
		} ) ;
		console.log( "\n\n\n\n" , output , "\n\n\n\n" ) ;
	} ) ;
	
	it( "should apply a mask with a mask's leaf callback to the input tree" , function() {
		
		var leaf = function leaf( input , key , argument , path ) {
			//console.log( 'LEAF: ' , input , key , argument , path ) ;
			
			if ( ! input.hasOwnProperty( key ) ) { return new Error( 'not_found' ) ; }
			if ( typeof input[ key ] === 'number' ) { return input[ key ] + argument ; }
			return input[ key ] ;
		} ;
		
		var mask = tree.createMask(
			{
				int: 87 ,
				float: 14 ,
				subtree: {
					subtree: {
						f: 0.0016
					}
				} ,
				unexistant: 45
			} ,
			{ leaf: leaf }
		) ;
		
		var output = mask.applyTo( input ) ;
		
		expect( output ).to.eql( {
			int: 99,
			float: 16.47,
			subtree: {
				subtree: {
					f: 3.1416
				}
			}
		} ) ;
	} ) ;
	
	it( 'should apply a mask containing other masks to the input tree' , function() {
		
		var mask = tree.createMask( {
			int: true,
			float: true,
			attachement: tree.createMask( {
				filename: true,
				unexistant: true
			} ),
			unexistant: true,
			subtree: tree.createMask( {
				subtree: true
			} )
		} ) ;
		
		var output = mask.applyTo( input ) ;
		
		expect( output ).to.eql( {
			int: 12,
			float: 2.47,
			attachement: {
				filename: 'preview.png'
			},
			subtree: {
				subtree: {
					d: 4,
					e: undefined,
					f: 3.14
				}
			}
		} ) ;
	} ) ;
	
	it( 'variantes' ) ;
	/*	
		// Variante 1
		var mask1 = {
			a: true,
			b: true,
			c: true,
			sub: {
				subA: true,
				subB: true,
				subC: true
			}
		} ;
		
		// Variante 2
		var mask2 = [
			'a', 'b', 'c', [ 'sub' , [ 'subA' , 'subB' , 'subC' ] ]
		] ;
		
		// Variante 3
		var mask3 = [
			'a', 'b', 'c', [ 'sub' , 'subA' , 'subB' , 'subC' ]
		] ;
	*/
} ) ;



describe( "Inverse masks" , function() {
	
	it( 'should apply a simple mask tree to the input tree' , function() {
		
		var mask = tree.createInverseMask( {
			a: true,
			subtree: {
				d: true
			},
			subtree2: true
		} ) ;
		
		var output = mask.applyTo( input.subtree ) ;
		
		//console.log( output ) ;
		
		expect( output ).to.eql( {
			b: 2,
			subtree: {
				e: undefined,
				f: 3.14
			},
			c: 'plusplus'
		} ) ;
	} ) ;
} ) ;
		



