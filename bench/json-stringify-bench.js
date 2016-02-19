

var json = require( '../lib/json.js' ) ;
var sample = require( '../sample/sample1.json' ) ;

var garbageJson = {} ;

function init()
{
	var i , j , l , k , v ;
	
	for ( i = 0 ; i < 100 ; i ++ )
	{
		k = '' ;
		v = '' ;
		
		for ( j = 0 , l = 1 + Math.floor( Math.random() * 30 ) ; j < l ; j ++ )
		{
			k += String.fromCharCode( 0x20 + Math.floor( Math.random() * 128 ) ) ;
		}
		
		for ( j = 0 , l = 1 + Math.floor( Math.random() * 200 ) ; j < l ; j ++ )
		{
			v += String.fromCharCode( 0x20 + Math.floor( Math.random() * 128 ) ) ;
		}
		
		garbageJson[ k ] = v ;
	}
	
	//console.log( JSON.stringify( garbageJson ) ) ;
}

init() ;



benchmark( 'JSON stringify(), sample JSON' , function() {
	
	competitor( 'Native JSON.stringify()' , function() {
		JSON.stringify( sample ) ;
	} ) ;
	
	competitor( 'tree.json.stringify()' , function() {
		json.stringify( sample ) ;
	} ) ;
} ) ;



benchmark( 'JSON stringify(), garbage JSON' , function() {
	
	competitor( 'Native JSON.stringify()' , function() {
		JSON.stringify( garbageJson ) ;
	} ) ;
	
	competitor( 'tree.json.stringify()' , function() {
		json.stringify( garbageJson ) ;
	} ) ;
} ) ;

