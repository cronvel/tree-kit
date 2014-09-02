

# Tree Kit

This lib is a toolbox that provide functions to operate with nested `Object` structure.
It features the classic `.extend()` method, but provide a whole bunch of options that the others library lack.

* License: MIT
* Current status: beta
* Platform: Node.js only (browser support is planned)



# Install

Use Node Package Manager:

    npm install tree-kit



# Library references

In all examples below, it is assumed that you have required the lib into the `tree` variable:
```js
var tree = require( 'tree-kit' ) ;
```



## .extend( options , target , source1 , [source2] , [...] )

* options `Object` extend options, it supports the properties:
	* own `boolean` only copy owned properties from the sources
	* deep `boolean` perform a deep (recursive) extend
	* move `boolean` move properties from the sources object to the target object (delete properties from the sources object)
	* preserve `boolean` existing properties in the target object will not be overwritten
	* nofunc `boolean` skip properties that are functions
	* proto `boolean` alter the target's prototype so that it matches the source's prototype.
	  It forces option 'own'. Specifying multiple sources does not make sens here.
	* inherit `boolean` make the target inherit from the source (the target's prototype will be the source itself, not its prototype).
	  It forces option 'own' and disable 'proto'. Specifying multiple sources does not make sens here.
	* skipRoot `boolean` prevent the prototype of the target **root** object from mutation.
	  Only nested objects' prototype will be mutated.
	* deepBlacklist `Array` list of black-listed prototype: the recursiveness of the 'deep' option will be disabled for
	  object whose prototype is listed (only direct prototype will match, for performance purpose the rest of the
	  prototype chain will not be checked)
	* deepWhitelist `Array` the opposite of deepBlacklist, it's a white-list
	* flat `boolean|string` sources properties are copied in a way to produce a *flat* target, the target's key
	  is the full path (separated by '.') of the source's key, also if a string is provided it will be used as
	  the path separator
	* unflat `boolean|string` it is the opposite of 'flat': assuming that the sources are in the *flat* format,
	  it expands all flat properties -- whose name are path with '.' as the separator -- deeply into the target, 
	  also if a string is provided it will be used as the path separator
* target `Object` the target of the extend, properties will be copied to this object
* source `Object` the source of the extend, properties will be copied from this object

This is a full-featured *extend* of an object with one or more source object.

It is easily translated from jQuery-like *extend()*:
* `extend( target , source )` translate into `tree.extend( null , target , source )`
* `extend( true , target , source )` translate into `tree.extend( { deep: true } , target , source )`

However, here we have full control over what will be extended and how.

By default, `tree.extend()` will copy all enumerable properties, and perform a shallow copy (a nested object is not cloned, it remains
a reference of the original one).

With the *deep* option, a deep copy is performed, so nested object are cloned too.

The *own* option clone only owned properties from the sources, properties that are part of the source's prototype would not be copied/cloned.

You can also clone an object as close as it is possible to do in javascript by doing this:
```js
var clone = tree.extend( { deep: true, proto: true } , null , original ) ;
```
Also please note that:
* properties that are not enumerable will never be cloned: javascript does not provide a way to search for them
* design pattern using private members cannot be truly cloned since those private members are hidden in an inaccessible closure's scope

Mixing *inherit* and *deep* provides a nice multi-level inheritance.

With the *flat* option example:
```js
var o = {
	one: 1,
	sub: {
		two: 2,
		three: 3
	}
} ;

var flatCopy = tree.extend( { flat: true } , {} , o ) ;
```
... it will produce:
```js
{
	one: 1,
	"sub.two": 2,
	"sub.three": 3
}
```

By the way, the *unflat* option does the opposite, and thus can reverse this back to the original form.


## .diff( left , right , [options] )

* left `Object` the left-hand side object structure
* right `Object` the right-hand side object structure
* options `Object` containing options, it supports:
	* path `string` the initial path, default: empty string
	* pathSeparator `string` the path separator, default: '.'

This tool reports diff between a left-hand side and right-hand side object structure.
It returns an object, each key is a path where a difference is reported, the value being an object containing (again) the path
and a human-readable message.

See this example:
```js
var left = {
	a: 'a',
	b: 2,
	c: 'three',
	sub: {
		e: 5,
		f: 'six',
	}
} ;

var right = {
	b: 2,
	c: 3,
	d: 'dee',
	sub: {
		e: 5,
		f: 6,
	}
} ;

console.log( tree.diff( a , b ) ) ;
```
It will output:
```js
{ '.a': { path: '.a', message: 'does not exist in right-hand side' },
  '.c': { path: '.c', message: 'different typeof: string - number' },
  '.sub.f': { path: '.sub.f', message: 'different typeof: string - number' },
  '.d': { path: '.d', message: 'does not exist in left-hand side' } }
```





Full BDD spec generated by Mocha:


