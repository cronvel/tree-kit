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



var json = {} ;
module.exports = json ;



var escapeControlMap = { '\r': '\\r', '\n': '\\n', '\t': '\\t', '\x7f': '' , '"': '\\"' } ;

function escapeControl( str ) {
	return str.replace( /[\x00-\x1f\x7f"]/g , function( match ) {
		
		if ( escapeControlMap[ match ] !== undefined ) { return escapeControlMap[ match ] ; }
		
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
	} ) ;
}

                                        

function stringify_( v , runtime )
{
	var i = 0 , iMax , k , str ;
	
	switch ( v )
	{
		case true :
			return "true" ;
		case false :
			return "false" ;
		case null :
			return "null" ;
		case undefined :
			return "null" ;
	}
	
	switch ( typeof v )
	{
		case 'number' :
			if ( isNaN( v ) || v === Infinity || v === -Infinity ) { return "null" ; }
			return '' + v ;
		case 'string' :
			return '"' + escapeControl( v ) + '"' ;
		case 'object' :
			if ( Array.isArray( v ) )
			{
				str = '[' ;
				for ( i = 0 , iMax = v.length ; i < iMax ; i ++ )
				{
					str += ( i ? ',' : '' ) + stringify_( v[ i ] ) ;
				}
				return str + ']' ;
			}
			else if ( v.toJSON && typeof v.toJSON === 'string' )
			{
				return v.toJSON() ;
			}
			else
			{
				str = '{' ;
				for ( k in v )
				{
					if ( v[ k ] !== undefined && v.hasOwnProperty( k ) )
					{
						str += ( i ? ',"' : '"' ) + k + '":' + stringify_( v[ k ] ) ;
						i = 1 ;
					}
				}
				return str + '}' ;
			}
	}
}



json.stringify = function stringify( v )
{
	if ( v === undefined ) { return undefined ; }
	
	var runtime = {
		str: ''
	} ;
	
	return stringify_( v , runtime ) ;
	
	//return runtime.str ;
} ;



