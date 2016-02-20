

var i , j , l , k , v , o = {} ;
module.exports = o ;



for ( i = 0 ; i < 10000 ; i ++ )
{
	k = '' ;
	
	for ( j = 0 , l = 1 + Math.floor( Math.random() * 30 ) ; j < l ; j ++ )
	{
		k += String.fromCharCode( 0x61 + Math.floor( Math.random() * 26 ) ) ;
	}
	
	switch ( i % 3 )
	{
		case 0 :
			v = '' ;
			for ( j = 0 , l = 1 + Math.floor( Math.random() * 100 ) ; j < l ; j ++ )
			{
				v += String.fromCharCode( 0x20 + Math.floor( Math.random() * 0x60 ) ) ;
			}
			break ;
		case 1 :
			v = Math.random() * 1000000 ;
			break ;
		case 2 :
			v = Math.random() > 0.8 ? null : ( Math.random() > 0.5 ? true : false ) ;
			break ;
	}
	
	o[ k ] = v ;
}
