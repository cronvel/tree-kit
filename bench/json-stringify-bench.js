#!/usr/bin/env node


var json = require( '../lib/json.js' ) ;
var sample = require( './sample1.json' ) ;


var ops = 5000 ;

while ( true )
{
	var start = Date.now() ;
	for ( i = 0 ; i < ops ; i++ ) { JSON.stringify( sample ) ; }
	var first = Date.now() - start ;
	
	start = Date.now();
	for ( i = 0 ; i < ops ; i++ ) { json.stringify( sample ) ; }
	var second = Date.now() - start ;
	
	console.log( "Native JSON.stringify() took %s" , first ) ;
	console.log( "Home-made json.stringify() took %s (%s times slower)\n" , second , second / first ) ;
}
