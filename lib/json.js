/*
	The Cedric's Swiss Knife (CSK) - CSK object tree toolbox

	Copyright (c) 2016 Cédric Ronvel 
	
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



var json = {} ;
module.exports = json ;



var escapeStringMap = { '\r': '\\r', '\n': '\\n', '\t': '\\t', '\x7f': '' , '"': '\\"' } ;
var escapeStringRegex = /[\x00-\x1f\x7f"]/g ;

function escapeString( str ) {
	var i , c ;
	
	// Most string are left untouched, so it's worth checking first if something must be changed.
	// Gain 33% of perf gain on the whole stringify().
	for ( i = str.length - 1 ; i >= 0 ; i -- )
	{
		c = str.charCodeAt( i ) ;
		if ( c <= 0x1f || c === 0x7f )
		{
			return str.replace( escapeStringRegex , escapeStringReplaceCallback ) ;
		}
	}
	
	return str ;
}

function escapeStringReplaceCallback( match )
{
	if ( escapeStringMap[ match ] !== undefined ) { return escapeStringMap[ match ] ; }
	//if ( match in escapeStringMap ) { return escapeStringMap[ match ] ; }		// <-- slower than the undefined check
	
	var hex = match.charCodeAt( 0 ).toString( 16 ) ;
	
	switch ( hex.length )
	{
		// The order matters
		case 2 :
			return '\\x00' + hex ;
		case 1 :
			return '\\x000' + hex ;
		case 4 :
			return '\\x' + hex ;
		case 3 :
			return '\\x0' + hex ;
	}
}



function stringifyAnyType( v , runtime )
{
	if ( v === undefined || v === null )
	{
		runtime.str += "null" ;
		return ;
	}
	
	switch ( typeof v )
	{
		case 'boolean' :
			return stringifyBoolean( v , runtime ) ;
		case 'number' :
			return stringifyNumber( v , runtime ) ;
		case 'string' :
			return stringifyString( v , runtime ) ;
		case 'object' :
			return stringifyAnyObject( v , runtime ) ;
	}
}

function stringifyBoolean( v , runtime )
{
	runtime.str += ( v ? "true" : "false" ) ;
}

function stringifyNumber( v , runtime )
{
	if ( Number.isNaN( v ) || v === Infinity || v === -Infinity ) { runtime.str += "null" ; }
	else { runtime.str += v ; }
}

function stringifyString( v , runtime )
{
	runtime.str += '"' + escapeString( v ) + '"' ;
}

function stringifyAnyObject( v , runtime )
{
	if ( typeof v.toJSON === 'function' )
	{
		runtime.str += v.toJSON() ;
	}
	else if ( Array.isArray( v ) )
	{
		stringifyArray( v , runtime ) ;
	}
	else
	{
		stringifyStrictObject( v , runtime ) ;
	}
}

function stringifyArray( v , runtime )
{
	var i = 0 , iMax = v.length ;
	
	runtime.str += '[' ;
	
	for ( ; i < iMax ; i ++ )
	{
		runtime.str += ( i ? ',' : '' ) ;
		stringifyAnyType( v[ i ] , runtime ) ;
	}
	
	runtime.str += ']' ;
}

// Faster than stringifyStrictObject_(), but cost a bit more memory
function stringifyStrictObject( v , runtime )
{
	var i , iMax , keys ;
	
	runtime.str += '{' ;
	
	keys = Object.keys( v ) ;
	
	for ( i = 0 , iMax = keys.length ; i < iMax ; i ++ )
	{
		if ( v[ keys[ i ] ] !== undefined )
		{
			runtime.str += ( i ? ',"' : '"' ) + escapeString( keys[ i ] ) + '":' ;
			stringifyAnyType( v[ keys[ i ] ] , runtime ) ;
		}
	}
	
	runtime.str += '}' ;
}

// A bit slower than stringifyStrictObject(), but use slightly less memory
function stringifyStrictObject_( v , runtime )
{
	var k , comma = false ;
	
	runtime.str += '{' ;
	
	for ( k in v )
	{
		if ( v[ k ] !== undefined && v.hasOwnProperty( k ) )
		//if ( v[ k ] !== undefined )	// Faster, but include properties of the prototype
		{
			runtime.str += ( comma ? ',"' : '"' ) + escapeString( k ) + '":' ;
			stringifyAnyType( v[ k ] , runtime ) ;
			comma = true ;
		}
	}
	
	runtime.str += '}' ;
}



json.stringify = function stringify( v )
{
	if ( v === undefined ) { return undefined ; }
	
	var runtime = {
		str: ''
	} ;
	
	stringifyAnyType( v , runtime ) ;
	return runtime.str ;
} ;



