

var i , j , l , k , v , o = {} ;
module.exports = o ;



for ( i = 0 ; i < 100 ; i ++ )
{
	k = '' ;
	v = '' ;
	
	for ( j = 0 , l = 1 + Math.floor( Math.random() * 30 ) ; j < l ; j ++ )
	{
		k += String.fromCharCode( Math.floor( Math.random() * 256 ) ) ;
	}
	
	for ( j = 0 , l = 1 + Math.floor( Math.random() * 1000 ) ; j < l ; j ++ )
	{
		v += String.fromCharCode( Math.floor( Math.random() * 256 ) ) ;
	}
	
	o[ k ] = v ;
}


