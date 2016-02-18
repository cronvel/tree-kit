

var json = require( '../lib/json.js' ) ;
var sample = require( './sample1.json' ) ;


benchmark( 'JSON stringify' , function() {
	
	competitor( 'Native JSON.stringify()' , function() {
		JSON.stringify( sample ) ;
	} ) ;

	competitor( 'tree.json.stringify()' , function() {
		json.stringify( sample ) ;
	} ) ;
} ) ;

