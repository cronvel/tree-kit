

var json = require( '../lib/json.js' ) ;
var fs = require( 'fs' ) ;





benchmark( 'JSON parse(), real-world JSON' , function() {
	
	var sample = fs.readFileSync( __dirname + '/../sample/sample1.json' ).toString() ;
	
	competitor( 'Native JSON.parse()' , function() {
		JSON.parse( sample ) ;
	} ) ;
	
	competitor( 'tree.json.parse()' , function() {
		json.parse( sample ) ;
	} ) ;
} ) ;



benchmark( 'JSON stringify(), real-world JSON' , function() {
	
	var sample = require( '../sample/sample1.json' ) ;
	
	competitor( 'Native JSON.stringify()' , function() {
		JSON.stringify( sample ) ;
	} ) ;
	
	competitor( 'tree.json.stringify()' , function() {
		json.stringify( sample ) ;
	} ) ;
} ) ;



benchmark( 'JSON stringify(), flat object with big strings' , function() {
	
	var sample = require( '../sample/stringFlatObject.js' ) ;
	
	competitor( 'Native JSON.stringify()' , function() {
		JSON.stringify( sample ) ;
	} ) ;
	
	competitor( 'tree.json.stringify()' , function() {
		json.stringify( sample ) ;
	} ) ;
} ) ;



benchmark( 'JSON stringify(), flat object with big strings and full of bad chars' , function() {
	
	var sample = require( '../sample/garbageStringObject.js' ) ;
	
	competitor( 'Native JSON.stringify()' , function() {
		JSON.stringify( sample ) ;
	} ) ;
	
	competitor( 'tree.json.stringify()' , function() {
		json.stringify( sample ) ;
	} ) ;
} ) ;



benchmark( 'JSON stringify(), big flat object' , function() {
	
	var sample = require( '../sample/bigFlatObject.js' ) ;
	
	competitor( 'Native JSON.stringify()' , function() {
		JSON.stringify( sample ) ;
	} ) ;
	
	competitor( 'tree.json.stringify()' , function() {
		json.stringify( sample ) ;
	} ) ;
} ) ;



benchmark( 'JSON stringify(), big deep object' , function() {
	
	var sample = require( '../sample/bigDeepObject.js' ) ;
	
	competitor( 'Native JSON.stringify()' , function() {
		JSON.stringify( sample ) ;
	} ) ;
	
	competitor( 'tree.json.stringify()' , function() {
		json.stringify( sample ) ;
	} ) ;
} ) ;

