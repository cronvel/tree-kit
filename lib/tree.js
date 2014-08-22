/*
	The Cedric's Swiss Knife (CSK) - CSK object tree toolbox

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

/*
	TODO:
	- negative mask
	- constraint check
	- Maskable object, like in csk-php
*/

// Load modules
var util = require( 'util' ) ;



// Create and export
var tree = {} ;
module.exports = tree ;





/*
	== Extend function ==
*/



/*
	options:
		* own: only copy owned properties
		* deep: perform a deep (recursive) extend
		* move: move properties to target (delete properties from the sources)
		* preserve: existing properties in the target object are not overwritten
		* nofunc: skip functions
		* proto: try to clone objects with the right prototype, using Object.create() or mutating it with __proto__,
			it forces option 'own'.
		* inherit: rather than mutating target prototype for source prototype like the 'proto' option does, here it is
			the source itself that IS the prototype for the target. Force option 'own' and disable 'proto'.
		* skipRoot: the prototype of the target root object is NOT mutated only if this option is set.
*/
tree.extend = function extend( options , target )
{
	var i , source , sourceKeys , index , key , newTarget = false , length = arguments.length ;
	
	if ( ! options || typeof options !== 'object' ) { options = {} ; }
	
	var depth = options.depth || 0 ;
	options.depth = depth + 1 ;
	
	
	// Things applied only for the root, not for recursive call
	if ( ! depth )
	{
		// If the prototype is applied, only owned properties should be copied
		if ( options.inherit ) { options.own = true ; options.proto = false ; }
		else if ( options.proto ) { options.own = true ; }
		
		if ( ! target || ( typeof target !== 'object' && typeof target !== 'function' ) )
		{
			newTarget = true ;
		}
		
		if ( ! options.skipRoot && ( options.inherit || options.proto ) )
		{
			for ( i = length - 1 ; i > 1 ; i -- )
			{
				source = arguments[ i ] ;
				if ( source && ( typeof source === 'object' || typeof source === 'function' ) )
				{
					if ( options.inherit )
					{
						if ( newTarget ) { target = Object.create( source ) ; }
						else { target.__proto__ = source ; }	// jshint ignore:line
					}
					else if ( options.proto )
					{
						if ( newTarget ) { target = Object.create( source.__proto__ ) ; }	// jshint ignore:line
						else { target.__proto__ = source.__proto__ ; }	// jshint ignore:line
					}
					
					break ;
				}
			}
		}
		else if ( newTarget )
		{
			target = {} ;
		}
	}
	
	
	// Extend part
	for ( i = 2 ; i < length ; i ++ )
	{
		source = arguments[ i ] ;
		if ( ! source || ( typeof source !== 'object' && typeof source !== 'function' ) ) { continue ; }
		
		if ( options.own ) { sourceKeys = Object.keys( source ) ; }
		else { sourceKeys = source ; }
		
		for ( key in sourceKeys )
		{
			if ( options.own ) { key = sourceKeys[ key ] ; }
			
			// Prevent never-ending loop, do not copy if property is a function and we don't want them
			if ( target === source[ key ] || ( options.nofunc && typeof source[ key ] === 'function' ) ) { continue; }
			
			if ( options.deep && source[ key ] && ( typeof source[ key ] === 'object' || typeof source[ key ] === 'function' ) )
			{
				if ( ! target[ key ] || ! target.hasOwnProperty( key ) || ( typeof target[ key ] !== 'object' && typeof target[ key ] !== 'function' ) )
				{
					if ( Array.isArray( source[ key ] ) ) { target[ key ] = [] ; }
					else if ( options.inherit ) { target[ key ] = Object.create( source[ key ] ) ; }
					else if ( options.proto ) { target[ key ] = Object.create( source[ key ].__proto__ ) ; }	// jshint ignore:line
					else { target[ key ] = {} ; }
				}
				else if ( options.proto && target[ key ].__proto__ !== source[ key ].__proto__ )	// jshint ignore:line
				{
					target[ key ].__proto__ = source[ key ].__proto__ ;	// jshint ignore:line
				}
				else if ( options.inherit && target[ key ].__proto__ !== source[ key ] )	// jshint ignore:line
				{
					target[ key ].__proto__ = source[ key ] ;	// jshint ignore:line
				}
				
				// Never reference original objects, clone them
				target[ key ] = tree.extend( options , target[ key ] , source[ key ] ) ;
			}
			else if ( options.preserve && target[ key ] !== undefined )
			{
				// Do not overwrite, and so do not delete source's properties that were not moved
				continue ;
			}
			else if ( ! options.inherit )
			{
				target[ key ] = source[ key ] ;
			}
			
			// Delete owned property of the source object
			if ( options.move ) { delete source[ key ] ; }
		}
	}
	
	return target ;
} ;



tree.diff = function diff( left , right , options )
{
	var i , key , keyPath , leftTypeof , rightTypeof , depth , diffArray , length , arrayMode ;
	
	leftTypeof = typeof left ;
	rightTypeof = typeof right ;
	
	if (
		! left || ( leftTypeof !== 'object' && leftTypeof !== 'function' ) ||
		! right || ( rightTypeof !== 'object' && rightTypeof !== 'function' )
	)
	{
		throw new Error( '[tree] diff() needs objects as argument #0 and #1' ) ;
	} 
	
	if ( ! options || typeof options !== 'object' ) { options = {} ; }
	
	depth = options.depth || 0 ;
	
	// Things applied only for the root, not for recursive call
	if ( ! depth )
	{
		options.diffArray = [] ;
		if ( ! options.path ) { options.path = '' ; }
	}
	
	diffArray = options.diffArray ;
	
	
	// Left part
	if ( Array.isArray( left ) )
	{
		arrayMode = true ;
		length = left.length ;
	}
	else
	{
		arrayMode = false ;
		leftKeys = Object.keys( left ) ;
		length = leftKeys.length ;
	}
	
	for ( i = 0 ; i < length ; i ++ )
	{
		key = arrayMode ? i : leftKeys[ i ] ;
		keyPath = options.path + '.' + key ;
		//console.log( 'L keyPath:' , keyPath ) ;
		
		if ( ! right.hasOwnProperty( key ) )
		{
			diffArray.push( { path: keyPath , message: 'does not exist in right hand-side' } ) ;
			continue ;
		}
		
		leftTypeof = typeof left[ key ] ;
		rightTypeof = typeof right[ key ] ;
		
		if ( leftTypeof !== rightTypeof )
		{
			diffArray.push( { path: keyPath , message: 'different typeof: ' + leftTypeof + ' - ' + rightTypeof } ) ;
			continue ;
		}
		
		if ( leftTypeof === 'object' || leftTypeof === 'function' )
		{
			// Cleanup the 'null is an object' mess
			if ( ! left[ key ] )
			{
				if ( right[ key ] ) { diffArray.push( { path: keyPath , message: 'different type: null - Object' } ) ; }
				continue ;
			}
			
			if ( ! right[ key ] )
			{
				diffArray.push( { path: keyPath , message: 'different type: Object - null' } ) ;
				continue ;
			}
			
			if ( Array.isArray( left[ key ] ) && ! Array.isArray( right[ key ] ) )
			{
				diffArray.push( { path: keyPath , message: 'different type: Array - Object' } ) ;
				continue ;
			}
			
			if ( ! Array.isArray( left[ key ] ) && Array.isArray( right[ key ] ) )
			{
				diffArray.push( { path: keyPath , message: 'different type: Object - Array' } ) ;
				continue ;
			}
			
			tree.diff( left[ key ] , right[ key ] , { path: keyPath , depth: depth + 1 , diffArray: diffArray } ) ;
			continue ;
		}
		
		if ( left[ key ] !== right[ key ] )
		{
			diffArray.push( { path: keyPath , message: 'different value: ' + left[ key ] + ' - ' + right[ key ] } ) ;
			continue ;
		}
	}
	
	
	// Right part
	if ( Array.isArray( right ) )
	{
		arrayMode = true ;
		length = right.length ;
	}
	else
	{
		arrayMode = false ;
		rightKeys = Object.keys( right ) ;
		length = rightKeys.length ;
	}
	
	for ( i = 0 ; i < length ; i ++ )
	{
		key = arrayMode ? i : rightKeys[ i ] ;
		keyPath = options.path + '.' + key ;
		//console.log( 'R keyPath:' , keyPath ) ;
		
		if ( ! left.hasOwnProperty( key ) )
		{
			diffArray.push( { path: keyPath , message: 'does not exist in left hand-side' } ) ;
			continue ;
		}
	}
	
	return diffArray.length ? diffArray : null ;
} ;



/*
	== Mask-family class ==
	
	Recursively select values in the input object if the same path in the mask object is set.
*/



tree.Mask = function Mask()
{
	throw new Error( 'Cannot create a tree.Mask() directly' ) ;
} ;



var maskDefaultOptions = {
	clone: false ,
	path: '<object>' ,
	pathSeparator: '.'
} ;



/*
	options:
		clone: the output clone the input rather than reference it
		pathSeperator: when expressing path, this is the separator
		leaf: a callback to exec for each mask leaf
		node? a callback to exec for each mask node
*/
tree.createMask = function createMask( maskArgument , options )
{
	if ( maskArgument === null || typeof maskArgument !== 'object' )
	{
		throw new TypeError( '[tree] .createMask() : Argument #1 should be an object' ) ;
	}
	
	if ( options !== null && typeof options === 'object' ) { options = tree.extend( null , {} , maskDefaultOptions , options ) ; }
	else { options = maskDefaultOptions ; }
	
	var mask = Object.create( tree.Mask.prototype , {
		__options__: { value: options , writable: true  }
	} ) ;
	
	tree.extend( null , mask , maskArgument ) ;
	
	return mask ;
} ;



// Apply the mask to an input tree
tree.Mask.prototype.applyTo = function applyTo( input , context , contextOverideDefault )
{
	// Arguments checking
	if ( input === null || typeof input !== 'object' )
	{
		throw new TypeError( '[tree] .applyTo() : Argument #1 should be an object' ) ;
	}
	
	if ( contextOverideDefault )
	{
		context = tree.extend( null ,
			{
				mask: this ,
				options: this.__options__ ,
				path: this.__options__.path
			} ,
			context
		) ;
	}
	else if ( context === undefined )
	{
		context = {
			mask: this ,
			options: this.__options__ ,
			path: this.__options__.path
		} ;
	}
	
	
	// Init
	//console.log( context ) ;
	var result , nextPath , output ,
		i , key , maskValue ,
		maskKeyList = Object.keys( context.mask ) ,
		j , inputKey , inputValue , inputKeyList ;
	
	if ( Array.isArray( input ) ) { output = [] ; }
	else { output = {} ; }
	
	
	// Iterate through mask properties
	for ( i = 0 ; i < maskKeyList.length ; i ++ )
	{
		key = maskKeyList[ i ] ;
		maskValue = context.mask[ key ] ;
		
		//console.log( '\nnext loop: ' , key , maskValue ) ;
		
		// The special key * is a wildcard, it match everything
		if ( key === '*' )
		{
			//console.log( 'wildcard' ) ;
			inputKeyList = Object.keys( input ) ;
			
			for ( j = 0 ; j < inputKeyList.length ; j ++ )
			{
				inputKey = inputKeyList[ j ] ;
				inputValue = input[ inputKey ] ;
				
				//console.log( '*: ' , inputKey ) ;
				nextPath = context.path + context.options.pathSeparator + inputKey ;
				
				// If it is an array or object, recursively check it
				if ( maskValue !== null && typeof maskValue === 'object' )
				{
					if ( input[ inputKey ] !== null && typeof input[ inputKey ] === 'object' )
					{
						if ( input[ inputKey ] instanceof tree.Mask )
						{
							output[ inputKey ] = input[ inputKey ].applyTo( input[ inputKey ] , { path: nextPath } , true ) ;
						}
						else
						{
							output[ inputKey ] = this.applyTo( input[ inputKey ] , tree.extend( null , {} , context , { mask: maskValue , path: nextPath } ) ) ;
						}
					}
					else if ( typeof context.options.leaf === 'function' )
					{
						output[ inputKey ] = this.applyTo( {} , tree.extend( null , {} , context , { mask: maskValue , path: nextPath } ) ) ;
					}
				}
				else if ( maskValue !== null && typeof context.options.leaf === 'function' )
				{
					//console.log( 'leaf callback' ) ;
					result = context.options.leaf( input , inputKey , maskValue , nextPath ) ;
					if ( ! ( result instanceof Error ) ) { output[ inputKey ] = result ; }
				}
				else
				{
					if ( context.options.clone && ( input[ inputKey ] !== null && typeof input[ inputKey ] === 'object' ) )
					{
						output[ inputKey ] = tree.extend( { deep: true } , {} , input[ inputKey ] ) ;
					}
					else
					{
						output[ inputKey ] = input[ inputKey ] ;
					}
				}
			}
			
			continue ;
		}
		
		
		nextPath = context.path + context.options.pathSeparator + key ;
		
		// If it is an object, recursively check it
		//if ( maskValue instanceof tree.Mask )
		if ( maskValue !== null && typeof maskValue === 'object' )
		{
			//console.log( 'sub' ) ;
			
			if ( input.hasOwnProperty( key ) && input[ key ] !== null && typeof input[ key ] === 'object' )
			{
				//console.log( 'recursive call' ) ;
				
				if ( input.key instanceof tree.Mask )
				{
					output[ key ] = input.key.applyTo( input[ key ] , { path: nextPath } , true ) ;
				}
				else
				{
					output[ key ] = this.applyTo( input[ key ] , tree.extend( null , {} , context , { mask: maskValue , path: nextPath } ) ) ;
				}
			}
			// recursive call only if there are callback
			else if ( context.options.leaf )
			{
				//console.log( 'recursive call' ) ;
				output[ key ] = this.applyTo( {} , tree.extend( null , {} , context , { mask: maskValue , path: nextPath } ) ) ;
			}
		}
		// If mask exists, add the key
		else if ( input.hasOwnProperty( key ) )
		{
			//console.log( 'property found' ) ;
			
			if ( maskValue !== undefined && typeof context.options.leaf === 'function' )
			{
				//console.log( 'leaf callback' ) ;
				result = context.options.leaf( input , key , maskValue , nextPath ) ;
				if ( ! ( result instanceof Error ) ) { output[ key ] = result ; }
			}
			else
			{
				if ( context.options.clone && ( input[ key ] !== null && typeof input[ key ] === 'object' ) )
				{
					output[ key ] = tree.extend( { deep: true } , {} , input[ key ] ) ;
				}
				else
				{
					output[ key ] = input[ key ] ;
				}
			}
		}
		else if ( maskValue !== undefined && typeof context.options.leaf === 'function' )
		{
			//console.log( 'leaf callback' ) ;
			result = context.options.leaf( input , key , maskValue , nextPath ) ;
			if ( ! ( result instanceof Error ) ) { output[ key ] = result ; }
		}
	}
	
	return output ;
} ;



// InverseMask: create an output tree from the input, by excluding properties of the mask

tree.InverseMask = function InverseMask()
{
	throw new Error( 'Cannot create a tree.InverseMask() directly' ) ;
} ;

util.inherits( tree.InverseMask , tree.Mask ) ;



/*
	options:
		clone: the output clone the input rather than reference it
		pathSeperator: when expressing path, this is the separator
*/
tree.createInverseMask = function createInverseMask( maskArgument , options )
{
	if ( maskArgument === null || typeof maskArgument !== 'object' )
	{
		throw new TypeError( '[tree] .createInverseMask() : Argument #1 should be an object' ) ;
	}
	
	if ( options !== null && typeof options === 'object' ) { options = tree.extend( null , {} , maskDefaultOptions , options ) ; }
	else { options = maskDefaultOptions ; }
	
	var mask = Object.create( tree.InverseMask.prototype , {
		__options__: { value: options , writable: true  }
	} ) ;
	
	tree.extend( null , mask , maskArgument ) ;
	
	return mask ;
} ;



// Apply the mask to an input tree
tree.InverseMask.prototype.applyTo = function applyTo( input , context , contextOverideDefault )
{
	// Arguments checking
	if ( input === null || typeof input !== 'object' )
	{
		throw new TypeError( '[tree] .applyTo() : Argument #1 should be an object' ) ;
	}
	
	if ( contextOverideDefault )
	{
		context = tree.extend( null ,
			{
				mask: this ,
				options: this.__options__ ,
				path: this.__options__.path
			} ,
			context
		) ;
	}
	else if ( context === undefined )
	{
		context = {
			mask: this ,
			options: this.__options__ ,
			path: this.__options__.path
		} ;
	}
	
	
	// Init
	//console.log( context ) ;
	var nextPath , output ,
		i , key , maskValue ,
		maskKeyList = Object.keys( context.mask ) ,
		j , inputKey , inputValue , inputKeyList ;
	
	if ( Array.isArray( input ) ) { output = tree.extend( { deep: true } , [] , input ) ; }
	else { output = tree.extend( { deep: true } , {} , input ) ; }
	
	//console.log( output ) ;
	
	// Iterate through mask properties
	for ( i = 0 ; i < maskKeyList.length ; i ++ )
	{
		key = maskKeyList[ i ] ;
		maskValue = context.mask[ key ] ;
		
		//console.log( '\nnext loop: ' , key , maskValue ) ;
		
		// The special key * is a wildcard, it match everything
		if ( key === '*' )
		{
			//console.log( 'wildcard' ) ;
			inputKeyList = Object.keys( input ) ;
			
			for ( j = 0 ; j < inputKeyList.length ; j ++ )
			{
				inputKey = inputKeyList[ j ] ;
				inputValue = input[ inputKey ] ;
				
				//console.log( '*: ' , inputKey ) ;
				nextPath = context.path + context.options.pathSeparator + inputKey ;
				
				// If it is an array or object, recursively check it
				if ( maskValue !== null && typeof maskValue === 'object' )
				{
					if ( input[ inputKey ] !== null && typeof input[ inputKey ] === 'object' )
					{
						if ( input[ inputKey ] instanceof tree.Mask )
						{
							output[ inputKey ] = input[ inputKey ].applyTo( input[ inputKey ] , { path: nextPath } , true ) ;
						}
						else
						{
							output[ inputKey ] = this.applyTo( input[ inputKey ] , tree.extend( null , {} , context , { mask: maskValue , path: nextPath } ) ) ;
						}
					}
				}
				else
				{
					delete output[ inputKey ] ;
				}
			}
			
			continue ;
		}
		
		
		nextPath = context.path + context.options.pathSeparator + key ;
		
		// If it is an object, recursively check it
		//if ( maskValue instanceof tree.Mask )
		if ( maskValue !== null && typeof maskValue === 'object' )
		{
			//console.log( 'sub' ) ;
			
			if ( input.hasOwnProperty( key ) && input[ key ] !== null && typeof input[ key ] === 'object' )
			{
				//console.log( 'recursive call' ) ;
				
				if ( input.key instanceof tree.Mask )
				{
					output[ key ] = input.key.applyTo( input[ key ] , { path: nextPath } , true ) ;
				}
				else
				{
					output[ key ] = this.applyTo( input[ key ] , tree.extend( null , {} , context , { mask: maskValue , path: nextPath } ) ) ;
				}
			}
		}
		// If mask exists, remove the key
		else if ( input.hasOwnProperty( key ) )
		{
			delete output[ key ] ;
		}
	}
	
	return output ;
} ;
