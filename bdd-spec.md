# TOC
   - [extend()](#extend)
   - [Masks](#masks)
   - [Inverse masks](#inverse-masks)
<a name=""></a>
 
<a name="extend"></a>
# extend()
should extend correctly an empty Object with a flat Object without depth (with or without the 'deep' option).

```js
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
```

should extend an empty Object with a deep Object performing a SHALLOW copy, the result should be equal to the deep Object, nested object MUST be equal AND identical.

```js
var copy ;

copy = tree.extend( null , {} , input.subtree ) ;
expect( copy ).to.eql( input.subtree ) ;
expect( copy ).not.to.equal( input.subtree ) ;
expect( copy.subtree2 ).to.equal( input.subtree.subtree2 ) ;
```

with the 'deep' option should extend an empty Object with a deep Object performing a DEEP copy, the result should be equal to the deep Object, nested object MUST be equal BUT NOT identical.

```js
copy = tree.extend( { deep: true } , {} , input.subtree ) ;
expect( copy ).to.eql( input.subtree ) ;
expect( copy ).not.to.equal( input.subtree ) ;
expect( copy.subtree2 ).not.to.equal( input.subtree.subtree2 ) ;
```

should extend (by default) properties of the prototype chain.

```js
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
```

with the 'own' option should ONLY extend OWNED properties, properties of the prototype chain are SKIPPED.

```js
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
```

with the 'deep' option should extend a deep Object into another deep Object correctly.

```js
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
```

with the 'proto' option and a null (or falsy) target, it should create and return a new Object with the prototype of the source Object.

```js
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
```

with the 'proto' option should change the prototype of each target properties for the prototype of the related source properties, if 'deep' is enabled it does so recursively.

```js
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
```

with 'nofunc' option should skip function.

```js
var e , o , proto ;

proto = {
	proto1: 'proto1' ,
	proto2: 'proto2' ,
	hello: function() { console.log( "Hello..." ) ; }
} ;

o = Object.create( proto ) ;
o.own1 = 'own1' ;
o.world = function() { console.log( "world!!!" ) ; } ;
o.own2 = 'own2' ;

// default behaviour
e = tree.extend( { nofunc: true } , null , o ) ;
expect( e ).not.to.be( o ) ;
expect( e ).to.eql( { own1: 'own1' , own2: 'own2' , proto1: 'proto1' , proto2: 'proto2' } ) ;

// with 'own'
e = tree.extend( { nofunc: true , own: true } , null , o ) ;
expect( e ).not.to.be( o ) ;
expect( e ).to.eql( { own1: 'own1' , own2: 'own2' } ) ;

// with 'proto', function exists if there are in the prototype
e = tree.extend( { nofunc: true , proto: true } , null , o ) ;
expect( e ).not.to.be( o ) ;
expect( e.__proto__ ).to.equal( proto ) ;	// jshint ignore:line
expect( e ).to.eql( { own1: 'own1' , own2: 'own2' } ) ;
expect( e.proto1 ).to.be( 'proto1' ) ;
expect( e.proto2 ).to.be( 'proto2' ) ;
expect( typeof e.hello ).to.equal( 'function' ) ;
```

with 'move' option should move source properties to target properties, i.e. delete them form the source.

```js
var e , o ;

e = {
	one: '1' ,
	two: 2 ,
	three: 'THREE'
} ;

o = {
	three: 3 ,
	four: '4'
} ;

tree.extend( { move: true } , e , o ) ;
expect( e ).to.eql( { one: '1' , two: 2 , three: 3 , four: '4' } ) ;
expect( o ).to.eql( {} ) ;
```

with 'inherit' option should inherit rather than extend: each source property create a new Object or mutate existing Object into the related target property, using itself as the prototype.

```js
var e , o ;

o = {
	three: 3 ,
	four: '4'
} ;

e = {} ;

tree.extend( { inherit: true } , e , o ) ;

expect( e.__proto__ ).to.equal( o ) ;	// jshint ignore:line
expect( e ).to.eql( {} ) ;
expect( e.three ).to.be( 3 ) ;
expect( e.four ).to.be( '4' ) ;


e = {
	one: '1' ,
	two: 2 ,
	three: 'THREE'
} ;

tree.extend( { inherit: true } , e , o ) ;

expect( e.__proto__ ).to.equal( o ) ;	// jshint ignore:line
expect( e ).to.eql( { one: '1' , two: 2 , three: 'THREE' } ) ;
expect( e.three ).to.be( 'THREE' ) ;
expect( e.four ).to.be( '4' ) ;
```

<a name="masks"></a>
# Masks
should apply a simple mask tree to the input tree.

```js
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
```

should apply a mask tree with wildcard '*' to the input tree.

```js
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
```

should apply a mask tree with wildcard '*' to match array in the input tree.

```js
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

//console.log( "\n\n\n\n" , output , "\n\n\n\n" ) ;
```

should apply a mask with a mask's leaf callback to the input tree.

```js
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
```

should apply a mask containing other masks to the input tree.

```js
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
```

<a name="inverse-masks"></a>
# Inverse masks
should apply a simple mask tree to the input tree.

```js
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
```

