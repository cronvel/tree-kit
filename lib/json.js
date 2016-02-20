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
	var i = 0 , l = v.length , c ;
	
	// Faster on big string than stringifyStringLookup(), also big string are more likely to have at least one bad char
	if ( l >= 200 ) { return stringifyStringRegex( v , runtime ) ; }
	
	// Most string are left untouched, so it's worth checking first if something must be changed.
	// Gain 33% of perf on the whole stringify().
	//*
	for ( ; i < l ; i ++ )
	{
		c = v.charCodeAt( i ) ;
		
		if (
			c <= 0x1f ||	// control chars
			c === 0x5c ||	// backslash
			c === 0x22		// double quote
		)
		{
			if ( l > 100 )
			{
				stringifyStringLookup( v , runtime ) ;
			}
			else
			{
				stringifyStringRegex( v , runtime ) ;
			}
			
			return ;
		}
	}
	//*/
	
	runtime.str += '"' + v + '"' ;
}



var stringifyStringLookup_ = 
( function createStringifyStringLookup()
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
		else if ( c <= 0x1f )	// control chars
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



function stringifyStringLookup( v , runtime )
//function stringifyString( v , runtime )
{
	var i = 0 , iMax = v.length , c ;
	
	runtime.str += '"' ;
	
	for ( ; i < iMax ; i ++ )
	{
		c = v.charCodeAt( i ) ;
		
		if ( c < 0x80 )
		{
			runtime.str += stringifyStringLookup_[ c ] ;
		}
		else
		{
			runtime.str += v[ i ] ;
		}
	}
	
	runtime.str += '"' ;
}



var stringifyStringRegex_ = /[\x00-\x1f"\\]/g ;

function stringifyStringRegex( v , runtime )
//function stringifyString( v , runtime )
{
	runtime.str += '"' + v.replace( stringifyStringRegex_ , stringifyStringRegexCallback ) + '"' ;
}

function stringifyStringRegexCallback( match )
{
	return stringifyStringLookup_[ match.charCodeAt( 0 ) ] ;
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


















function parseNull( str , runtime )
{
	if ( runtime.i + 2 >= str.length || str[ runtime.i ] !== 'u' || str[ runtime.i + 1 ] !== 'l' || str[ runtime.i + 2 ] !== 'l' )
	{
		throw new SyntaxError( "Unexpected " + str.slice( runtime.i , runtime.i + 3 ) ) ;
	}
	
	runtime.i += 3 ;
	return null ;
}



function parseTrue( str , runtime )
{
	if ( runtime.i + 2 >= str.length || str[ runtime.i ] !== 'r' || str[ runtime.i + 1 ] !== 'u' || str[ runtime.i + 2 ] !== 'e' )
	{
		throw new SyntaxError( "Unexpected " + str.slice( runtime.i , runtime.i + 3 ) ) ;
	}
	
	runtime.i += 3 ;
	return true ;
}



function parseFalse( str , runtime )
{
	if ( runtime.i + 3 >= str.length || str[ runtime.i ] !== 'a' || str[ runtime.i + 1 ] !== 'l' || str[ runtime.i + 2 ] !== 's' || str[ runtime.i + 3 ] !== 'e' )
	{
		throw new SyntaxError( "Unexpected " + str.slice( runtime.i , runtime.i + 4 ) ) ;
	}
	
	runtime.i += 4 ;
	return false ;
}



function parseNumber( str , runtime )
{
	// We are here because a digit trigger parseNumber(), so we assume that the regexp always match
	var match = str.slice( runtime.i ).match( /^-?[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?/ )[ 0 ] ;
	runtime.i += match.length ;
	return parseFloat( match ) ;
}



function parseString( str , runtime )
{
	var c , j = runtime.i , l = str.length , v = '' ;
	
	for ( ; j < l ; j ++ )
	{
		c = str.charCodeAt( j ) ;
		
		// This construct is intended: this is much faster (15%)
		if ( c === 0x22 || c === 0x5c || c <= 0x1f )
		{
			if ( c === 0x22	)	// double quote = end of the string
			{
				v += str.slice( runtime.i , j ) ;
				runtime.i = j + 1 ;
				return v ;
			}
			else if ( c === 0x5c )	// backslash
			{
				v += str.slice( runtime.i , j ) ;
				runtime.i = j + 1 ;
				v += parseBackSlash( str , runtime ) ;
				j = runtime.i - 1 ;
			}
			else if ( c <= 0x1f )	// illegal
			{
				throw new SyntaxError( "Unexpected control char 0x" + c.toString( 16 ) ) ;
			}
		}
	}
}



var parseBackSlashLookup_ = 
( function createParseBackSlashLookup()
{
	var c = 0 , lookup = [] ;
	
	for ( ; c < 0x80 ; c ++ )
	{
		if ( c === 0x62 )	// b
		{
			lookup[ c ] = '\b' ;
		}
		else if ( c === 0x66 )	// f
		{
			lookup[ c ] = '\f' ;
		}
		else if ( c === 0x6e )	// n
		{
			lookup[ c ] = '\n' ;
		}
		else if ( c === 0x72 )	// r
		{
			lookup[ c ] = '\r' ;
		}
		else if ( c === 0x74 )	// t
		{
			lookup[ c ] = '\t' ;
		}
		else if ( c === 0x5c )	// backslash
		{
			lookup[ c ] = '\\' ;
		}
		else if ( c === 0x2f )	// slash
		{
			lookup[ c ] = '/' ;
		}
		else if ( c === 0x22 )	// double-quote
		{
			lookup[ c ] = '"' ;
		}
		else
		{
			lookup[ c ] = '' ;
		}
	}
	
	return lookup ;
} )() ;



function parseBackSlash( str , runtime )
{
	var v , c = str.charCodeAt( runtime.i ) ;
	
	if ( runtime.i >= str.length ) { throw new SyntaxError( "Unexpected end" ) ; }
	
	if ( c === 0x75 )	// u
	{
		runtime.i ++ ;
		v = parseUnicode( str , runtime ) ;
		return v ;
	}
	else if ( ( v = parseBackSlashLookup_[ c ] ) )
	{
		runtime.i ++ ;
		return v ;
	}
	else
	{
		throw new SyntaxError( 'Unexpected token: "' + str[ runtime.i ] + '"' ) ;
	}
}



function parseUnicode( str , runtime )
{
	if ( runtime.i + 3 >= str.length ) { throw new SyntaxError( "Unexpected end" ) ; }
	
	var match = str.slice( runtime.i , runtime.i + 4 ).match( /[0-9a-f]{4}/ ) ;
	
	if ( ! match ) { throw new SyntaxError( "Unexpected " + str.slice( runtime.i , runtime.i + 4 ) ) ; }
	
	runtime.i += 4 ;
	
	// Or String.fromCodePoint() ?
	return String.fromCharCode( Number.parseInt( match[ 0 ] , 16 ) ) ;
}



function parseObject( str , runtime )
{
	var j = 0 , c , v = {} , k ;
	
	// Empty object? Try to parse a }
	c = parseIdle( str , runtime ) ;
	if ( c === 0x7d )
	{
		runtime.i ++ ;
		return v ;
	}
	
	for ( ;; j ++ )
	{
		// parse the key
		if ( c !== 0x22 ) { throw new Error( "Unexpected " + str[ runtime.i ] ) ; }
		runtime.i ++ ;
		k = parseString( str , runtime ) ;
		
		
		// parse the colon :
		c = parseIdle( str , runtime ) ;
		if ( c !== 0x3a ) { throw new Error( "Unexpected " + str[ runtime.i ] ) ; }
		runtime.i ++ ;
		
		
		// parse the value
		parseIdle( str , runtime ) ;
		v[ k ] = parseValue( str , runtime ) ;
		
		
		// parse comma , or end of object
		c = parseIdle( str , runtime ) ;
		switch ( c )
		{
			case 0x2c :	// ,   comma: next key-value
				runtime.i ++ ;
				break ;
			
			case 0x7d :	// }
				runtime.i ++ ;
				return v ;
			
			default :
				throw new Error( "Unexpected " + str[ runtime.i ] ) ;
		}
		
		c = parseIdle( str , runtime ) ;
	}
	
	throw new Error( "Unexpected end" ) ;
}



function parseArray( str , runtime )
{
	var j = 0 , c , v = [] ;
	
	// Empty array? Try to parse a ]
	c = parseIdle( str , runtime ) ;
	if ( c === 0x5d )
	{
		runtime.i ++ ;
		return v ;
	}
	
	for ( ;; j ++ )
	{
		// parse the value :
		v[ j ] = parseValue( str , runtime ) ;
		
		
		// parse comma , or end of array
		c = parseIdle( str , runtime ) ;
		switch ( c )
		{
			case 0x2c :	// ,   comma: next value
				runtime.i ++ ;
				break ;
			
			case 0x5d :	// ]
				runtime.i ++ ;
				return v ;
			
			default :
				throw new Error( "Unexpected " + str[ runtime.i ] ) ;
		}
		
		parseIdle( str , runtime ) ;
	}
	
	throw new Error( "Unexpected end" ) ;
}



function parseValue( str , runtime )
{
	var c ;
	
	c = str.charCodeAt( runtime.i ) ;
	
	if ( ( c >= 0x30 && c <= 0x39 ) || c === 0x2d )	// digit or minus
	{
		return parseNumber( str , runtime ) ;
	}
	else
	{
		runtime.i ++ ;
		
		switch ( c )
		{
			case 0x7b :	// {
				return parseObject( str , runtime ) ;
			case 0x5b :	// [
				return parseArray( str , runtime ) ;
			case 0x6e :	// n   null?
				return parseNull( str , runtime ) ;
			case 0x74 :	// t   true?
				return parseTrue( str , runtime ) ;
			case 0x66 :	// f   false?
				return parseFalse( str , runtime ) ;
			case 0x22 :	// "   double-quote: this is a string
				return parseString( str , runtime ) ;
			default :
				throw new SyntaxError( "Unexpected " + str[ runtime.i ] ) ;
		}
	}
}



function parseIdle( str , runtime )
{
	var c = -1 ;
	
	// Skip blank
	for ( ; runtime.i < str.length ; runtime.i ++ )
	{
		c = str.charCodeAt( runtime.i ) ;
		if ( c > 0x20 ) { return c ; }
	}
	
	return c ;
}



json.parse = function parse( str )
{
	var v , runtime = {
		i: 0 ,
		d: 0 ,
	} ;
	
	if ( typeof str !== 'string' )
	{
		if ( str && typeof str === 'object' ) { str = str.toString() ; }
	}
	
	parseIdle( str , runtime ) ;
	v = parseValue( str , runtime ) ;
	parseIdle( str , runtime ) ;
	
	if ( runtime.i < str.length ) { throw new SyntaxError( "Unexpected " + str[ runtime.i ] ) ; }
	
	return v ;
} ;


