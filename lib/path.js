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
	var i , depth , pointer , key ;
	
	// Split the path into parts, find the depth
	path = path.split( '.' ) ;
	depth = path.length - 1 ;
	
	// The pointer start at the object's root
	pointer = object ;
	
	for ( i = 0 ; i < depth ; i ++ )
	{
		key = path[ i ] ;
		
		if ( ! pointer[ key ] || ( typeof pointer[ key ] !== 'object' && typeof pointer[ key ] !== 'function' ) )
		{
			if ( type !== 'set' ) { return undefined ; }
			pointer[ key ] = {} ;
		}
		
		pointer = pointer[ key ] ;
	}
	
	key = path[ depth ] ;
	
	switch ( type )
	{
		case 'get' :
			return pointer[ key ] ;
		case 'set' :
			pointer[ key ] = value ;
			return ;
		case 'delete' :
			return delete pointer[ key ] ;
	}
} ;



// get, set and delete use the same op() function
treePath.get = treePath.op.bind( undefined , 'get' ) ;
treePath.set = treePath.op.bind( undefined , 'set' ) ;
treePath.delete = treePath.op.bind( undefined , 'delete' ) ;



// Upgrade an object so it can support get, set and delete at its root
treePath.upgrade = function upgrade( object )
{
	Object.defineProperties( object , {
		get: { value: treePath.op.bind( undefined , 'get' , object ) } ,
		set: { value: treePath.op.bind( undefined , 'set' , object ) } ,
		"delete": { value: treePath.op.bind( undefined , 'delete' , object ) }
	} ) ;
} ;



