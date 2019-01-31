/*
	Tree Kit

	Copyright (c) 2014 - 2018 Cédric Ronvel

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

"use strict" ;



const dotPath = {} ;
module.exports = dotPath ;



const EMPTY_PATH = [] ;

function toPathArray( path ) {
	if ( Array.isArray( path ) ) {
		return path ;
	}
	else if ( ! path ) {
		return EMPTY_PATH ;
	}
	else if ( typeof path === 'string' ) {
		return path.split( '.' ) ;
	}
	
	throw new TypeError( '[tree.dotPath]: the path argument should be a string or an array' ) ;
}



// Walk the tree using the path array.
function walk( object , pathArray ) {
	var i , iMax ,
		pointer = object ;

	for ( i = 0 , iMax = pathArray.length ; i < iMax ; i ++ ) {
		if ( ! pointer || ( typeof pointer !== 'object' && typeof pointer !== 'function' ) ) {
			return undefined ;
		}

		pointer = pointer[ pathArray[ i ] ] ;
	}
	
	return pointer ;
}



// Walk the tree, stop before the last path part.
function walkBeforeLast( object , pathArray ) {
	var i , iMax ,
		pointer = object ;

	for ( i = 0 , iMax = pathArray.length - 1 ; i < iMax ; i ++ ) {
		if ( ! pointer || ( typeof pointer !== 'object' && typeof pointer !== 'function' ) ) {
			return undefined ;
		}

		pointer = pointer[ pathArray[ i ] ] ;
	}
	
	return pointer ;
}



// Walk the tree, create missing element: pave the path up to before the last part of the path.
// Return that before-the-last element.
// Object MUST be an object! no check are performed for the first step!
function pave( object , pathArray ) {
	var i , iMax ,
		key ,
		pointer = object ;

	for ( i = 0 , iMax = pathArray.length - 1 ; i < iMax ; i ++ ) {
		key = pathArray[ i ] ;

		if ( ! pointer[ key ] || ( typeof pointer[ key ] !== 'object' && typeof pointer[ key ] !== 'function' ) ) {
			pointer[ key ] = {} ;
		}

		pointer = pointer[ key ] ;
	}
	
	return pointer ;
}



dotPath.get = function( object , path ) {
	return walk( object , toPathArray( path ) ) ;
} ;



dotPath.set = function( object , path , value ) {
	if ( ! object || ( typeof object !== 'object' && typeof object !== 'function' ) ) {
		// Throw?
		return undefined ;
	}
	
	var pathArray = toPathArray( path ) ;
	var pointer = pave( object , pathArray ) ;

	pointer[ pathArray[ pathArray.length - 1 ] ] = value ;

	return object ;
} ;



dotPath.delete = function( object , path ) {
	var pathArray = toPathArray( path ) ;
	var pointer = walkBeforeLast( object , pathArray ) ;

	if ( ! pointer || ( typeof pointer !== 'object' && typeof pointer !== 'function' ) ) {
		return false ;
	}
	
	return delete pointer[ pathArray[ pathArray.length - 1 ] ] ;
} ;

