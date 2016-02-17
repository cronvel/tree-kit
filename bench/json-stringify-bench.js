

var json = require( '../lib/json.js' ) ;
var sample = require( './sample1.json' ) ;


bench( 'JSON stringify' , 'Native JSON.stringify()' , function() {
	JSON.stringify( sample ) ;
} ) ;

bench( 'JSON stringify' , 'tree.json.stringify()' , function() {
	json.stringify( sample ) ;
} ) ;

