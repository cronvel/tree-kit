/*
	The Cedric's Swiss Knife (CSK) - CSK object tree toolbox

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



var treePath = {} ;
exports.path = treePath ;



treePath.op = function op( type , object , path , value )
{
	var i , parts , last , pointer , key , isArray = false , pathArrayMode = false ;
	
	if ( typeof path === 'string' )
	{
		// Split the path into parts
		parts = path.match( /([.#]|[^.#]+)/g ) ;
		//parts = path.match( /([.#](?!$)|[^.#]+)/g ) ;
	}
	else if ( Array.isArray( path ) )
	{
		parts = path ;
		pathArrayMode = true ;
	}
	else
	{
		throw new TypeError( '[tree.path] .' + type + '(): the path argument should be a string or an array' ) ;
	}
	
	
	//console.log( parts ) ;
	// The pointer start at the object's root
	pointer = object ;
	
	last = parts.length - 1 ;
	
	for ( i = 0 ; i <= last ; i ++ )
	{
		if ( pathArrayMode )
		{
			if ( key === undefined )
			{
				key = parts[ i ] ;
				continue ;
			}
			
			if ( ! pointer[ key ] || ( typeof pointer[ key ] !== 'object' && typeof pointer[ key ] !== 'function' ) )
			{
				if ( type !== 'set' ) { return undefined ; }
				pointer[ key ] = {} ;
			}
			
			pointer = pointer[ key ] ;
			key = parts[ i ] ;
			
			continue ;
		}
		else if ( parts[ i ] === '.' )
		{
			isArray = false ;
			
			if ( key === undefined ) { continue ; }
			
			if ( ! pointer[ key ] || ( typeof pointer[ key ] !== 'object' && typeof pointer[ key ] !== 'function' ) )
			{
				if ( type !== 'set' ) { return undefined ; }
				pointer[ key ] = {} ;
			}
			
			pointer = pointer[ key ] ;
			
			continue ;
		}
		else if ( parts[ i ] === '#' )
		{
			isArray = true ;
			
			if ( key === undefined )
			{
				// The root element cannot be altered, we are in trouble if an array is expected but we have only a regular object.
				if ( ! Array.isArray( pointer ) ) { return undefined ; }
				continue ;
			}
			
			if ( ! pointer[ key ] || ! Array.isArray( pointer[ key ] ) )
			{
				if ( type !== 'set' ) { return undefined ; }
				pointer[ key ] = [] ;
			}
			
			pointer = pointer[ key ] ;
			
			continue ;
		}
		
		if ( ! isArray ) { key = parts[ i ] ; continue ; }
		
		switch ( parts[ i ] )
		{
			case 'length' :
				key = parts[ i ] ;
				break ;
			
			// Pseudo-key
			case 'first' :
				key = 0 ;
				break ;
			case 'last' :
				key = pointer.length - 1 ;
				if ( key < 0 ) { key = 0 ; }
				break ;
			case 'next' :
				if ( type !== 'set' ) { return undefined ; }
				key = pointer.length ;
				break ;
			case 'insert' :
				if ( type !== 'set' ) { return undefined ; }
				pointer.unshift( undefined ) ;
				key = 0 ;
				break ;
			
			// default = number
			default:
				// Convert the string key to a numerical index
				key = parseInt( parts[ i ] , 10 ) ;
		}
	}
	
	switch ( type )
	{
		case 'get' :
			return pointer[ key ] ;
		case 'set' :
			pointer[ key ] = value ;
			return ;
		case 'delete' :
			if ( isArray && typeof key === 'number' ) { pointer.splice( key , 1 ) ; }
			else { delete pointer[ key ] ; }
			return ;
		default :
			return undefined ;
	}
} ;



// get, set and delete use the same op() function
treePath.get = treePath.op.bind( undefined , 'get' ) ;
treePath.set = treePath.op.bind( undefined , 'set' ) ;
treePath.delete = treePath.op.bind( undefined , 'delete' ) ;



// Prototype used for object creation, so they can
treePath.prototype = {
	get: function( path ) { return treePath.get( this , path ) ; } ,
	set: function( path , value ) { return treePath.set( this , path , value ) ; } ,
	"delete": function( path ) { return treePath.delete( this , path ) ; } ,
} ;



// Upgrade an object so it can support get, set and delete at its root
treePath.upgrade = function upgrade( object )
{
	Object.defineProperties( object , {
		get: { value: treePath.op.bind( undefined , 'get' , object ) } ,
		set: { value: treePath.op.bind( undefined , 'set' , object ) } ,
		"delete": { value: treePath.op.bind( undefined , 'delete' , object ) }
	} ) ;
} ;



