$(function() {	
	function log( message ) {
		$( "<div/\>" ).text( message ).prependTo( "#patient_results" );
		$( "#log" ).scrollTop( 0 );
	}

	//Yup this is my list of searchable patients for JQuery.
	//The team running the patient search will need to remedy this...
	//Sorry everyone!
	var availableTags = [
		"Alex Gainer",
		"Phil Strong",
		"Mary Roth",
		"James Davis",
		"Anthony Masuda",
		"Bob Bobbers",
		"Ryan Ryaners",
		"Paul Paulers",
		"George Georgers",
		"Eric Ericson"
	];

	//Basic autocomplete functionality...
	//the data source is the array above.
	$( ".demo #patients" ).autocomplete({
		source: availableTags,
		minLength: 2,
		select: function( event, ui ) {
			log( ui.item ?
				"Selected: " + ui.item.value :
				"Nothing selected, input was " + this.value );
		}
	});
});
