

var i2 = 0 , d = 0 , o = {} ;
module.exports = o ;


function create( o )
{
	var i , j , l , k , v ;
	
	for ( i = 0 ; i < 20 && (++i2) < 1000 ; i ++ )
	{
		k = '' ;
		
		for ( j = 0 , l = 1 + Math.floor( Math.random() * 30 ) ; j < l ; j ++ )
		{
			k += String.fromCharCode( 0x61 + Math.floor( Math.random() * 26 ) ) ;
		}
		
		switch ( i % 4 )
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
			case 3 :
				if ( d > 100 ) { break ; }
				v = {} ;
				d ++ ;
				create( v ) ;
				d -- ;
				break ;
		}
		
		o[ k ] = v ;
	}
}

create( o ) ;

//console.log( JSON.stringify( o , null , '  ' ) ) ;
