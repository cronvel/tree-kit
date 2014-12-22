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
	== Extend function ==
*/

/*
	TODO:
		* all: get non-enumerable properties as well, using Object.getOwnPropertyNames()
		* descriptor: copy property descriptor as well, using Object.getOwnPropertyDescriptor() & Object.defineProperty()
*/

/*
	options:
		* own: only copy owned properties
		* deep: perform a deep (recursive) extend
		* move: move properties to target (delete properties from the sources)
		* preserve: existing properties in the target object are not overwritten
		* nofunc: skip functions
		* deepFunc: in conjunction with 'deep', this will process sources functions like objects rather than
			copying/referencing them directly into the source, thus, the result will not be a function, it forces 'deep'
		* proto: try to clone objects with the right prototype, using Object.create() or mutating it with __proto__,
			it forces option 'own'.
		* inherit: rather than mutating target prototype for source prototype like the 'proto' option does, here it is
			the source itself that IS the prototype for the target. Force option 'own' and disable 'proto'.
		* skipRoot: the prototype of the target root object is NOT mutated only if this option is set.
		* flat: extend into the target top-level only, compose name with the path of the source, force 'deep',
			disable 'unflat', 'proto', 'inherit'
		* unflat: assume sources are in the 'flat' format, expand all properties deeply into the target, disable 'flat'
		* deepFilter
			* blacklist: list of black-listed prototype: the recursiveness of the 'deep' option will be disabled
				for object whose prototype is listed
			* whitelist: the opposite of blacklist
*/
function extend( runtime , options , target )
{
	var i , j , jmax , source , sourceKeys , sourceKey , targetKey , targetPointer , path ,
		newTarget = false , length = arguments.length ;
	
	if ( ! options || typeof options !== 'object' ) { options = {} ; }
	
	// Things applied only for the first call, not for recursive call
	if ( ! runtime )
	{
		runtime = { depth: 0 , prefix: '' } ;
		
		if ( options.deepFunc ) { options.deep = true ; }
		
		if ( options.deepFilter && typeof options.deepFilter === 'object' )
		{
			if ( options.deepFilter.whitelist && ( ! Array.isArray( options.deepFilter.whitelist ) || ! options.deepFilter.whitelist.length ) ) { delete options.deepFilter.whitelist ; }
			if ( options.deepFilter.blacklist && ( ! Array.isArray( options.deepFilter.blacklist ) || ! options.deepFilter.blacklist.length ) ) { delete options.deepFilter.blacklist ; }
			if ( ! options.deepFilter.whitelist && ! options.deepFilter.blacklist ) { delete options.deepFilter ; }
		}
		
		// 'flat' option force 'deep'
		if ( options.flat )
		{
			options.deep = true ;
			options.proto = false ;
			options.inherit = false ;
			options.unflat = false ;
			if ( typeof options.flat !== 'string' ) { options.flat = '.' ; }
		}
		
		if ( options.unflat )
		{
			options.deep = false ;
			options.proto = false ;
			options.inherit = false ;
			options.flat = false ;
			if ( typeof options.unflat !== 'string' ) { options.unflat = '.' ; }
		}
		
		// If the prototype is applied, only owned properties should be copied
		if ( options.inherit ) { options.own = true ; options.proto = false ; }
		else if ( options.proto ) { options.own = true ; }
		
		if ( ! target || ( typeof target !== 'object' && typeof target !== 'function' ) )
		{
			newTarget = true ;
		}
		
		if ( ! options.skipRoot && ( options.inherit || options.proto ) )
		{
			for ( i = length - 1 ; i >= 3 ; i -- )
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
	
	
	// Real extend processing part
	for ( i = 3 ; i < length ; i ++ )
	{
		source = arguments[ i ] ;
		if ( ! source || ( typeof source !== 'object' && typeof source !== 'function' ) ) { continue ; }
		
		if ( options.own ) { sourceKeys = Object.keys( source ) ; }
		else { sourceKeys = source ; }
		
		for ( sourceKey in sourceKeys )
		{
			if ( options.own ) { sourceKey = sourceKeys[ sourceKey ] ; }
			
			targetPointer = target ;
			targetKey = runtime.prefix + sourceKey ;
			
			// Do not copy if property is a function and we don't want them
			if ( options.nofunc && typeof source[ sourceKey ] === 'function' ) { continue; }
			
			// 'unflat' mode computing
			if ( options.unflat && runtime.depth === 0 )
			{
				path = sourceKey.split( options.unflat ) ;
				jmax = path.length - 1 ;
				
				if ( jmax )
				{
					for ( j = 0 ; j < jmax ; j ++ )
					{
						if ( ! targetPointer[ path[ j ] ] ||
							( typeof targetPointer[ path[ j ] ] !== 'object' &&
								typeof targetPointer[ path[ j ] ] !== 'function' ) )
						{
							targetPointer[ path[ j ] ] = {} ;
						}
						
						targetPointer = targetPointer[ path[ j ] ] ;
					}
					
					targetKey = runtime.prefix + path[ jmax ] ;
				}
			}
			
			
			// Prevent never-ending loop
			if ( targetPointer === source[ sourceKey ] ) { continue; }
			
			
			if ( options.deep &&
				source[ sourceKey ] &&
				( typeof source[ sourceKey ] === 'object' || ( options.deepFunc && typeof source[ sourceKey ] === 'function' ) ) &&
				( ! options.deepFilter ||
					( ( ! options.deepFilter.whitelist || options.deepFilter.whitelist.indexOf( source[ sourceKey ].__proto__ ) !== -1 ) &&	// jshint ignore:line
						( ! options.deepFilter.blacklist || options.deepFilter.blacklist.indexOf( source[ sourceKey ].__proto__ ) === -1 ) ) ) ) // jshint ignore:line
			{
				if ( options.flat )
				{
					extend(
						{ depth: runtime.depth + 1 , prefix: runtime.prefix + sourceKey + options.flat } ,
						options , targetPointer , source[ sourceKey ]
					) ;
				}
				else
				{
					if ( ! targetPointer[ targetKey ] || ! targetPointer.hasOwnProperty( targetKey ) || ( typeof targetPointer[ targetKey ] !== 'object' && typeof targetPointer[ targetKey ] !== 'function' ) )
					{
						if ( Array.isArray( source[ sourceKey ] ) ) { targetPointer[ targetKey ] = [] ; }
						else if ( options.proto ) { targetPointer[ targetKey ] = Object.create( source[ sourceKey ].__proto__ ) ; }	// jshint ignore:line
						else if ( options.inherit ) { targetPointer[ targetKey ] = Object.create( source[ sourceKey ] ) ; }
						else { targetPointer[ targetKey ] = {} ; }
					}
					else if ( options.proto && targetPointer[ targetKey ].__proto__ !== source[ sourceKey ].__proto__ )	// jshint ignore:line
					{
						targetPointer[ targetKey ].__proto__ = source[ sourceKey ].__proto__ ;	// jshint ignore:line
					}
					else if ( options.inherit && targetPointer[ targetKey ].__proto__ !== source[ sourceKey ] )	// jshint ignore:line
					{
						targetPointer[ targetKey ].__proto__ = source[ sourceKey ] ;	// jshint ignore:line
					}
					
					// Never reference original objects, clone them
					targetPointer[ targetKey ] = extend( { depth: runtime.depth + 1 , prefix: '' } , options , targetPointer[ targetKey ] , source[ sourceKey ] ) ;
				}
			}
			else if ( options.preserve && targetPointer[ targetKey ] !== undefined )
			{
				// Do not overwrite, and so do not delete source's properties that were not moved
				continue ;
			}
			else if ( ! options.inherit )
			{
				targetPointer[ targetKey ] = source[ sourceKey ] ;
			}
			
			// Delete owned property of the source object
			if ( options.move ) { delete source[ sourceKey ] ; }
		}
	}
	
	return target ;
}



exports.extend = extend.bind( undefined , null ) ;