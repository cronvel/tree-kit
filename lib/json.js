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
	var i , c ;
	
	//stringifyStringReplace( v , runtime ) ; return ;
	
	// Most string are left untouched, so it's worth checking first if something must be changed.
	// Gain 33% of perf on the whole stringify().
	//*
	for ( i = v.length - 1 ; i >= 0 ; i -- )
	{
		c = v.charCodeAt( i ) ;
		
		if (
			c <= 0x1f ||	// control chars
			c === 0x7f ||	// delete/backspace
			c === 0x5c ||	// backslash
			c === 0x22		// double quote
		)
		{
			stringifyStringReplace( v , runtime ) ;
			return ;
		}
	}
	//*/
	
	runtime.str += '"' + v + '"' ;
}



function stringifyStringReplace( v , runtime )
//function stringifyString( v , runtime )
{
	var i = 0 , iMax = v.length , c ;
	
	runtime.str += '"' ;
	
	for ( ; i < iMax ; i ++ )
	{
		c = v.charCodeAt( i ) ;
		
		if ( c === 0x09 )	// tab
		{
			runtime.str += '\\t' ;
		}
		else if ( c === 0x0a )	// new line
		{
			runtime.str += '\\n' ;
		}
		else if ( c === 0x0c )	// form feed
		{
			runtime.str += '\\f' ;
		}
		else if ( c === 0x0d )	// carriage return
		{
			runtime.str += '\\r' ;
		}
		else if ( c <= 0x0f )	// control chars
		{
			runtime.str += '\\u000' + c.toString( 16 ) ;
		}
		else if ( c <= 0x1f || c === 0x7f )	// control chars
		{
			runtime.str += '\\u00' + c.toString( 16 ) ;
		}
		else if ( c === 0x5c )	// backslash
		{
			runtime.str += '\\\\' ;
		}
		else if ( c === 0x22 )	// double-quote
		{
			runtime.str += '\\"' ;
		}
		else
		{
			runtime.str += v[ i ] ;
		}
	}
	
	runtime.str += '"' ;
}


var stringifyLookup = 
( function createStringifyLookup()
{
	var c = 0 , lookup = [] ;
	
	for ( ; c < 0x80 ; c ++ )
	{
		if ( c === 0x09 )	// tab
		{
			lookup[ c ] = '\\t' ;
		}
		else if ( c === 0x0a )	// new line
		{
			lookup[ c ] = '\\n' ;
		}
		else if ( c === 0x0c )	// form feed
		{
			lookup[ c ] = '\\f' ;
		}
		else if ( c === 0x0d )	// carriage return
		{
			lookup[ c ] = '\\r' ;
		}
		else if ( c <= 0x0f )	// control chars
		{
			lookup[ c ] = '\\u000' + c.toString( 16 ) ;
		}
		else if ( c <= 0x1f || c === 0x7f )	// control chars
		{
			lookup[ c ] = '\\u00' + c.toString( 16 ) ;
		}
		else if ( c === 0x5c )	// backslash
		{
			lookup[ c ] = '\\\\' ;
		}
		else if ( c === 0x22 )	// double-quote
		{
			lookup[ c ] = '\\"' ;
		}
		else
		{
			lookup[ c ] = String.fromCharCode( c ) ;
		}
	}
	
	return lookup ;
} )() ;



//function stringifyStringReplace( v , runtime )
function stringifyString( v , runtime )
{
	var i = 0 , iMax = v.length , c ;
	
	runtime.str += '"' ;
	
	for ( ; i < iMax ; i ++ )
	{
		c = v.charCodeAt( i ) ;
		
		if ( c < 0x80 )
		{
			runtime.str += stringifyLookup[ c ] ;
		}
		else
		{
			runtime.str += v[ i ] ;
		}
	}
	
	runtime.str += '"' ;
}



var escapeStringRegex = /[\x00-\x1f\x7f"\\]/g ;

//function stringifyStringReplace( v , runtime )
function stringifyString( v , runtime )
{
	runtime.str += '"' + v.replace( escapeStringRegex , escapeStringReplaceCallback ) + '"' ;
}

function escapeStringReplaceCallback( match )
{
	return stringifyLookup[ match.charCodeAt( 0 ) ] ;
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
		//runtime.str += ( i ? ',' : '' ) ;
		if ( i ) { runtime.str += ',' ; }
		stringifyAnyType( v[ i ] , runtime ) ;
	}
	
	runtime.str += ']' ;
}



// Faster than stringifyStrictObjectMemory(), but cost a bit more memory
function stringifyStrictObject( v , runtime )
{
	var i , iMax , keys ;
	
	runtime.str += '{' ;
	
	keys = Object.keys( v ) ;
	
	for ( i = 0 , iMax = keys.length ; i < iMax ; i ++ )
	{
		if ( v[ keys[ i ] ] !== undefined )
		{
			if ( i ) { runtime.str += ',' ; }
			stringifyString( keys[ i ] , runtime ) ;
			runtime.str += ':' ;
			stringifyAnyType( v[ keys[ i ] ] , runtime ) ;
		}
	}
	
	runtime.str += '}' ;
}



// A bit slower than stringifyStrictObject(), but use slightly less memory
function stringifyStrictObjectMemory( v , runtime )
{
	var k , comma = false ;
	
	runtime.str += '{' ;
	
	for ( k in v )
	{
		if ( v[ k ] !== undefined && v.hasOwnProperty( k ) )
		//if ( v[ k ] !== undefined )	// Faster, but include properties of the prototype
		{
			if ( comma ) { runtime.str += ',' ; }
			stringifyString( k , runtime ) ;
			runtime.str += ':' ;
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


















function parseIdle( str , runtime )
{
	var c ;
	
	for ( ; runtime.i < str.length ; runtime.i ++ )
	{
		c = str.charCodeAt( runtime.i ) ;
		
		if (
			c <= 0x20 // space and control chars are ignored
		)
		{
			continue ;
		}
		
		switch ( c )
		{
			case 0x22 :	// double-quote: this is a string
				runtime.i ++ ;
				parseString( str , runtime ) ;
				break ;
		}
	}
}

function parseString( str , runtime )
{
	var c ;
	
	runtime.v = '' ;
	
	for ( ; runtime.i < str.length ; runtime.i ++ )
	{
		c = str.charCodeAt( runtime.i ) ;
		
		switch ( c )
		{
			case 0x22 :	// double-quote: end of the string
				// Nothing to do, runtime.i is ++'ed by the caller
				return ;
			case 0x5c :	//backslash
				
				runtime.i ++ ;
				if ( runtime.i >= str.length ) { throw new SyntaxError( "Unexpected end" ) ; }
				
				switch ( str[ runtime.i ] )
				{
					case 't' :	// tab
						runtime.v += '\t' ;
						break ;
					case 'n' :	// tab
						runtime.v += '\n' ;
						break ;
					case 'r' :	// tab
						runtime.v += '\r' ;
						break ;
					case '"' :	// tab
						runtime.v += '"' ;
						break ;
					case '\\' :	// tab
						runtime.v += '\\' ;
						break ;
					case '/' :	// tab
						runtime.v += '/' ;
						break ;
					case 'u' : 	// unicode
						runtime.i ++ ;
						parseUnicode( str , runtime ) ;
						runtime.i -- ;
						break ;
					case 'b' :
						runtime.v += '\b' ;
						break ;
					case 'f' :
						runtime.v += '\f' ;
						break ;
					default :
						throw new SyntaxError( 'Unexpected token: "' + str[ runtime.i ] + '"' ) ;
				}
				
				break ;
				
			default :
				runtime.v += str[ runtime.i ] ;
		}
	}
}

function parseUnicode( str , runtime )
{
	if ( runtime.i + 5 >= str.length ) { throw new SyntaxError( "Unexpected end" ) ; }
	
	//runtime.v += String.fromCharCode( '0x' + str.slice( runtime.i , runtime.i + 4 ) ) ;
	
	var w = 24 , c , charCode = 0 ;
	
	for ( ; w >= 0 ; w -= 8 , runtime.i ++ )
	{
		c = str.charCodeAt( runtime.i ) ;
		
		if ( c >= 0x30 && c <= 0x39 )
		{
			charCode += ( c - 0x30 ) << w ;
		}
		else if ( c >= 0x61 && c <= 0x66 )
		{
			charCode += ( c - 0x57 ) << w ;
		}
		else if ( c >= 0x41 && c <= 0x46 )
		{
			charCode += ( c - 0x37 ) << w ;
		}
	}
	
	runtime.v += String.fromCharCode( charCode ) ;
}



json.parse = function parse( str )
{
	var runtime = {
		i: 0 ,
	} ;
	
	return parseIdle( str , runtime ) ;
} ;



