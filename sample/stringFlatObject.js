

var i , j , l , k , v , o = {} ;
module.exports = o ;



for ( i = 0 ; i < 100 ; i ++ )
{
	k = '' ;
	v = '' ;
	
	for ( j = 0 , l = 1 + Math.floor( Math.random() * 30 ) ; j < l ; j ++ )
	{
		k += String.fromCharCode( 0x20 + Math.floor( Math.random() * 0x5f ) ) ;
	}
	
	for ( j = 0 , l = 1 + Math.floor( Math.random() * 1000 ) ; j < l ; j ++ )
	{
		v += String.fromCharCode( 0x20 + Math.floor( Math.random() * 0x5f ) ) ;
	}
	
	o[ k ] = v ;
}


