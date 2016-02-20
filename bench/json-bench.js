

var json = require( '../lib/json.js' ) ;
var fs = require( 'fs' ) ;





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





benchmark( 'JSON parse(), real-world JSON' , function() {
	
	var sample = fs.readFileSync( __dirname + '/../sample/sample1.json' ).toString() ;
	
	competitor( 'Native JSON.parse()' , function() {
		JSON.parse( sample ) ;
	} ) ;
	
	competitor( 'tree.json.parse()' , function() {
		json.parse( sample ) ;
	} ) ;
} ) ;



benchmark( 'JSON parse(), dummy number' , function() {
	
	var sample = "123456789.123456789" ;
	
	competitor( 'Native JSON.parse()' , function() {
		JSON.parse( sample ) ;
	} ) ;
	
	competitor( 'tree.json.parse()' , function() {
		json.parse( sample ) ;
	} ) ;
} ) ;



benchmark( 'JSON parse(), dummy string' , function() {
	
	var sample = '"What a wonderful string!"' ;
	
	competitor( 'Native JSON.parse()' , function() {
		JSON.parse( sample ) ;
	} ) ;
	
	competitor( 'tree.json.parse()' , function() {
		json.parse( sample ) ;
	} ) ;
} ) ;



benchmark( 'JSON parse(), dummy string one backslashes' , function() {
	
	var sample = '"What a wonderful\\nstring!"' ;
	
	competitor( 'Native JSON.parse()' , function() {
		JSON.parse( sample ) ;
	} ) ;
	
	competitor( 'tree.json.parse()' , function() {
		json.parse( sample ) ;
	} ) ;
} ) ;



benchmark( 'JSON parse(), dummy string many backslashes' , function() {
	
	var sample = '"\\tWhat\\n\\u0061\\u0010wonderful\\t\\u0009string!\\r\\n"' ;
	
	competitor( 'Native JSON.parse()' , function() {
		JSON.parse( sample ) ;
	} ) ;
	
	competitor( 'tree.json.parse()' , function() {
		json.parse( sample ) ;
	} ) ;
} ) ;



benchmark( 'JSON parse(), flat object with big strings' , function() {
	
	var sample = JSON.stringify( require( '../sample/stringFlatObject.js' ) ) ;
	
	competitor( 'Native JSON.parse()' , function() {
		JSON.parse( sample ) ;
	} ) ;
	
	competitor( 'tree.json.parse()' , function() {
		json.parse( sample ) ;
	} ) ;
} ) ;



benchmark( 'JSON parse(), flat object with big strings and full of bad chars' , function() {
	
	var sample = JSON.stringify( require( '../sample/garbageStringObject.js' ) ) ;

	competitor( 'Native JSON.parse()' , function() {
		JSON.parse( sample ) ;
	} ) ;
	
	competitor( 'tree.json.parse()' , function() {
		json.parse( sample ) ;
	} ) ;
} ) ;



benchmark( 'JSON parse(), big flat object' , function() {
	
	var sample = JSON.stringify( require( '../sample/bigFlatObject.js' ) ) ;

	competitor( 'Native JSON.parse()' , function() {
		JSON.parse( sample ) ;
	} ) ;
	
	competitor( 'tree.json.parse()' , function() {
		json.parse( sample ) ;
	} ) ;
} ) ;



benchmark( 'JSON parse(), big deep object' , function() {
	
	var sample = JSON.stringify( require( '../sample/bigDeepObject.js' ) ) ;

	competitor( 'Native JSON.parse()' , function() {
		JSON.parse( sample ) ;
	} ) ;
	
	competitor( 'tree.json.parse()' , function() {
		json.parse( sample ) ;
	} ) ;
} ) ;



