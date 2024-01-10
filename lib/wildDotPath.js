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

"use strict" ;



const wildDotPath = {} ;
module.exports = wildDotPath ;



const EMPTY_PATH = [] ;
const PROTO_POLLUTION_MESSAGE = 'This would cause prototype pollution' ;



function toPathArray( path ) {
	if ( Array.isArray( path ) ) {
		/*
		let i , iMax = path.length ;
		for ( i = 0 ; i < iMax ; i ++ ) {
			if ( typeof path[ i ] !== 'string' || typeof path[ i ] !== 'number' ) { path[ i ] = '' + path[ i ] ; }
		}
		//*/
		return path ;
	}

	if ( ! path ) { return EMPTY_PATH ; }
	if ( typeof path === 'string' ) {
		return path[ path.length - 1 ] === '.' ? path.slice( 0 , - 1 ).split( '.' ) : path.split( '.' ) ;
	}

	throw new TypeError( '[tree.wildDotPath]: the path argument should be a string or an array' ) ;
}



// Walk the tree using the path array.
function wildWalk( object , pathArray , maxOffset = 0 , index = 0 , result = [] ) {
	var indexMax , key ,
		pointer = object ;

	for ( indexMax = pathArray.length + maxOffset ; index < indexMax ; index ++ ) {
		key = pathArray[ index ] ;

		if ( typeof key === 'object' || key === '__proto__' || typeof pointer === 'function' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }
		if ( ! pointer || typeof pointer !== 'object' ) { return result ; }

		if ( key === '*' ) {
			for ( let subPointer of Array.isArray( pointer ) ? pointer : Object.values( pointer ) ) {
				wildWalk( subPointer , pathArray , maxOffset , index + 1 , result ) ;
			}

			return result ;
		}

		pointer = pointer[ key ] ;
	}

	result.push( pointer ) ;

	return result ;
}



// Same than wildWalk, but return an object of path => value.
function wildWalkPathValue( object , pathArray , maxOffset = 0 , index = 0 , path = '' , result = {} ) {
	var indexMax , key ,
		pointer = object ;

	for ( indexMax = pathArray.length + maxOffset ; index < indexMax ; index ++ ) {
		key = pathArray[ index ] ;

		if ( typeof key === 'object' || key === '__proto__' || typeof pointer === 'function' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }
		if ( ! pointer || typeof pointer !== 'object' ) { return result ; }

		if ( key === '*' ) {
			if ( Array.isArray( pointer ) ) {
				let subKey = 0 ;
				for ( let subPointer of pointer ) {
					wildWalkPathValue( subPointer , pathArray , maxOffset , index + 1 , path ? path + '.' + subKey : subKey , result ) ;
					subKey ++ ;
				}
			}
			else {
				for ( let [ subKey , subPointer ] of Object.entries( pointer ) ) {
					wildWalkPathValue( subPointer , pathArray , maxOffset , index + 1 , path ? path + '.' + subKey : subKey , result ) ;
				}
			}

			return result ;
		}

		path = path ? path + '.' + key : key ;
		pointer = pointer[ key ] ;
	}

	result[ path ] = pointer ;

	return result ;
}



// Get with wildcard, return an array
wildDotPath.get = ( object , path ) => wildWalk( object , toPathArray( path ) ) ;
wildDotPath.getPathValue = ( object , path ) => wildWalkPathValue( object , toPathArray( path ) ) ;

