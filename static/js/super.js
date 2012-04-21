$(function() {

		var namespace_counter = 1;
		var $tab_title_input = $( "#tab_title");
		var $tag_title_input = $( "#tag_title");


		var $header_tab_title_input = $( "#header_tab_title");
		var $header_tag_title_input = $( "#header_tag_title");
		var $body_tab_title_input = $( "#body_tab_title");
		var $body_tag_title_input = $( "#body_tag_title");
		var $doc_name_title_input = $("#doc_name_title");
		var $clinic_name_title_input = $("#clinic_name_title");
		//this list is needed for the header tag adder dialog
		
		//you will have to set this counter each time you come to this page.
		var tab_counter = 0;
		var header_tab_counter = 0;
		var body_tab_counter = 0;
		var $header_tab_selection = $("#header_title_choice");
		var $body_tab_selection = $("#body_title_choice");


		
		
		
		
		//$("#station_title").val(),"station");
		
		//we want this function to return true | false
		//dependent on whether or not the validation passes
		//we take in the type of validation we should do
		//called save_name = { "doc_save" || "section_save" || "tag_save" }
		function isValidSection(text,part)
		{
			//characters must be alpha and have a min of two characters.
			var re = /^[A-Z]{2,}$/i;
			//check to see if it has the name title as all of the other sections...
			//
			var errors = new Array();
			if(!(re.test(text)))
			{
				errors.push("Hey, you need to use a minimum of two alpha characters.");
				errors.push("Just a friendly reminder: No special characters (including spaces)");
			}
			if(part === "station")
			{
				
				if(isSame(text,$(".group h3 a")))
				{
					errors.push("You station title needs to be unique");
				}
			}
			if(part === "tab")
			{
				if(isSame(text,$("#header_tabs ul li a")) || isSame(text,$("#body_tabs ul li a")))
				{
					errors.push("Your section title needs to be unique");
				}
			}
			//you might want to turn this validation part off.
			//what if you have <text> and <text> under different parents...
			//that would be berry bad...
			if(part === "tag")
			{
				$("#header_tabs ul li a").each(function() {
					var possible_matches = collectTags($(this).text());
					for(var i in possible_matches)
					{
						if(text === possible_matches[i]['name'])
						{
							errors.push("Your tag title needs to be unique...thanks");
						}
						
					}
	
					
				});
				$("#body_tabs ul li a").each(function() {
					var possible_matches = collectTags($(this).text());
					for(var i in possible_matches)
					{
						if(text === possible_matches[i]['name'])
						{
							errors.push("Your tag title needs to be unique...thanks");
						}
						
					}
	
					
				});
			}
			return errors;
		}


		//okay you need to collect all of the tags in the header
		//and all of the tags in the body...
		//what are you doing here?
		//okay, you need to go through each tag to check name differences...
		//we have a text vs val() problem here...
		function isSame(texter,lister)
		{
			var the_answer = false;
			lister.each(function() {
				if(texter === ($(this).text()))
				{
					the_answer = true;
				}
			});
			return the_answer;
		}

		
		//create a method that takes in a list of errors and append it into
		//a new errors div.  We need to make it generic for:
		//modals (section,tags) and the basic document information (name,namespace(s)).
		//add_header_section_dialog
		//add_header_tag_dialog
		//add_body_section_dialog
		//add_body_tag_dialog
		function addErrors(area, error_list)
		{
			//remove the old errors div before adding the new one...
			$(".errors").remove().fadeOut();
			area.prepend('<div class = "errors"><ul></ul></div>').fadeIn();
			for(i = 0; i < error_list.length ; i++)
			{
					//var $errors = $(".errors");
					if(!(error_list[i] in error_list))
					{
						$(".errors ul").prepend("<li>" + error_list[i] + "</li>");
					}
			}
		}
		//should I put up a close button that removes the div?
		/*
		*
		*	DIALOG BOXES
		*
		*/
		// modal dialog init: custom buttons and a "close" callback reseting the form inside
		//eventually, you should create a function handler that manages 
		//dialog box creation...this seems a little excessive.
		//there are many simplifications that can be made here...
		var $header_section_dialog = $( "#add_header_section_dialog" ).dialog({
			autoOpen: false,
			modal: true,
			height:400,
			buttons: {
				Add: function() {
					var errors_list = isValidSection($header_tab_title_input.val(),"tab");
					//if we have errors, send errors_list into addErrors(...)
					if(errors_list.length > 0)
					{
						addErrors($(this),errors_list);
					}
					else
					{
						addTab("header");
						$( this ).dialog( "close" );
					}
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			},
			open: function() {
				$header_tab_title_input.focus();
			},
			close: function() {
				$(".errors").remove().fadeOut();
				$header_section_form[ 0 ].reset();
			}
		});

		var $header_tag_dialog = $( "#add_header_tag_dialog" ).dialog({
			autoOpen: false,
			modal: true,
			width: 500,
			height: 500,
			buttons: {
				Add: function() {
					var errors_list = isValidSection($header_tag_title_input.val(),"tag");
					//if we have errors, send errors_list into addErrors(...)
					if(errors_list.length > 0)
					{
						addErrors($(this),errors_list);
					}
					//otherwise we add our tab to the header section
					//and close ze box.
					else
					{
						addTag("header",cleanAttributes($(".header_attributes :input")));
						$( this ).dialog( "close" );
					}
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			},
			open: function() {
				$header_tag_title_input.focus();
			},
			close: function() {
				$(".errors").remove();
				$(this).reset();
			}
		});

		// modal dialog init: custom buttons and a "close" callback reseting the form inside
		var $body_section_dialog = $( "#add_body_section_dialog" ).dialog({
			autoOpen: false,
			modal: true,
			height:400,
			buttons: {
				Add: function() {
					var errors_list = isValidSection($body_tab_title_input.val(),"tab");
					//if we have errors, send errors_list into addErrors(...)
					if(errors_list.length > 0)
					{
						addErrors($(this),errors_list);
					}
					//otherwise we add our tab to the header section
					//and close ze box.
					else
					{
						addTab("body");
						$( this ).dialog( "close" );
					}
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			},
			open: function() {
				$body_tab_title_input.focus();
			},
			close: function() {
				$(".errors").remove();
				$body_section_form[ 0 ].reset();
			}
		});


		//addTag needs to send in {"header || "body"}
		var $body_tag_dialog = $( "#add_body_tag_dialog" ).dialog({
			autoOpen: false,
			modal: true,
			width: 500,
			height: 500,
			buttons: {
				Add: function() {
					var errors_list = isValidSection($body_tag_title_input.val(),"tag");
					//if we have errors, send errors_list into addErrors(...)
					if(errors_list.length > 0)
					{
						addErrors($(this),errors_list);
					}
					//otherwise we add our tab to the header section
					//and close ze box.
					else
					{
						//collect all of the attributes and send em in...
						//to be added to the tag div as a ul
						addTag("body",cleanAttributes($(".body_attributes :input")));
						$( this ).dialog( "close" );
					}
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			},
			open: function() {
				$body_tag_title_input.focus();
			},
			close: function() {
				$(".errors").remove();
				$body_tag_form[ 0 ].reset();
			}
		});


		//Clean up any attributes (This is old).
		function cleanAttributes(attributes)
		{
			var first_cleaned_attributes = new Array();
			attributes.each(function() 
			{
				if(!($(this).val().length == 0) && !($(this).val() == " "))
				{
					first_cleaned_attributes.push($(this).val());
				}
			});
			return byeDuplicates(first_cleaned_attributes);
		}


		//Utility Function to get rid of duplicates in an array
		function byeDuplicates(arrayer) 
		{
			out=[],obj={};
			for (var i=0;i<arrayer.length;i++) 
			{
				obj[arrayer[i]]=0;
			}
			for (i in obj) 
			{
				out.push(i);
			}
			return out;
		}


		/*
		*	LA FIN DU DIALOGE
		*
		*/

		

		// addTab form: calls addTab function on submit and closes the dialog
		var $header_section_form = $( "form", $header_section_dialog ).submit(function() {
			addTab("header");
			$header_section_dialog.dialog( "close" );
			return false;
		});

		// addTab form: calls addTab function on submit and closes the dialog
		var $header_tag_form = $( "form", $header_tag_dialog ).submit(function() {
			addTag("header");
			$header_section_dialog.dialog( "close" );
			return false;
		});


		// addTab form: calls addTab function on submit and closes the dialog
		var $body_section_form = $( "form", $body_section_dialog ).submit(function() {
			addTab("body");
			$body_section_dialog.dialog( "close" );
			return false;
		});

		// addTab form: calls addTab function on submit and closes the dialog
		var $body_tag_form = $( "form", $body_tag_dialog ).submit(function() {
			addTag("body");
			$body_section_dialog.dialog( "close" );
			return false;
		});

		/*
		*	LES CONTROLLERS DES TABS
		*
		*/


		$( "#sections span.ui-icon-close" ).live( "click", function() {
			var index = $( "li", $section_tabs ).index( $( this ).parent() );
			var tab_name = $( "li a", $section_tabs ).text();
			$section_tabs.tabs( "remove", index );
		});

		var $header_tabs = $( "#header_tabs").tabs({
			tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
			add: function( event, ui ) {
				//we need to reconnect the sortable.
				var x = $('<ol></ol>').attr('class', 'sortable');
				$( ui.panel ).append( x );
				$(x).nestedSortable({connectWith:'.sortable'});
			}
		});

		var $body_tabs = $( "#body_tabs").tabs({
			tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
			add: function( event, ui ) {
				//we need to reconnect the sortable.
				var x = $('<ol></ol>').attr('class', 'sortable');
				$( ui.panel ).append( x );
				//connect the nested Sortable with ZE JQUERY.
				$(x).nestedSortable({connectWith:'.sortable'});
				//nestedSortable(connectWith:'ol.sortable');
			}
		});

		/*
		*	LES CONTROLLERS DES TABS
		*
		*/

		//takes in the part (header or body)
		//and add a tab. 
		//you need to address these counters...
		//are they necessary?
		function addTab(part) {
				var tab_title = $header_tab_title_input.val() || $body_tab_title_input.val() || "Tab " + tab_counter;				
				if (part == 'header')
				{
					$header_tabs.tabs( "add", "#tabs-"+ tab_title, tab_title );
					header_tab_counter++;
					
				}
				else
				{
					$body_tabs.tabs( "add", "#tabs-"+ tab_title, tab_title );
					body_tab_counter++;
				}
				$("#add_" + part + "_tag_dialog select").append("<option value= \"" + tab_title + "\">"+ tab_title +"</option>");
			
		}

		//function removeTabOption(part,tab_name)
		function removeTabOption(part,tab_name)
		{
			$("#" + part + "_title_choice option[value=\"" + tab_name +"\"]").remove();
		}


		
		
		//this is saying to use .children()
		//example (#part).find(
		function addTag(part,attributes) {
			var adder = "<ul class = \"attributes\">";
			for (var i in attributes)
			{
				adder = adder + "<li>"+ attributes[i] +"</li>";
			}
			adder = adder + "</ul>";
			//go through the attribute list node and
			//collect all of the inputs...
			//make sure to clear the form each time a close occurs.
			var tag_title = $header_tag_title_input.val() || $body_tag_title_input.val() || "Tag " + tag_counter;
			var x ="<li id= \"list\">"+
				"<div class=\"the_sortables\">"+
				"<h1 class =\"tag_title\">" + tag_title + "</h1>"
				 + adder + "<div class=\"button_holder\">"+
				"<div class='ui-icon ui-icon-close'>Delete</div>"+
				"<div class='ui-icon ui-icon-pencil'>Edit</div>"+
				"</div>"+
				"</div>"+
				"</li>";
			$("#"+ part +"_tabs #tabs-"+ $("#" + part + "_title_choice").val() +" ol.sortable").append(x);
			
		}
		
		


		$( "#add_body_attribute" )
			.button({ icons: { primary: "ui-icon-plusthick" }})
			.click(function() {
				$("#add_body_tag_dialog fieldset ul").append("<li>" +
					"<input type=\"text\" name=\"tab_attribute_name\" id=\"tab_attribute_name\""+
					" value=\"\" class=\"ui-widget-content ui-corner-all\" /\>"+
					"<span class='ui-icon ui-icon-close'>Remove Attribute</span>"+
				"</li>");
			});

		
		$( "#add_namespace" )
			.button({ icons: { primary: "ui-icon-plusthick" }})
			.click(function() {

				var x = "<li>" + 
					"<input type=\"text\" name=\"namespace-" + 
					namespace_counter + "\" id=\"namespace\" value=\"\" class=\"text ui-widget-content ui-corner-all\" /\>"+
					"<span class='ui-icon ui-icon-close'>Remove Namespace</span>"+
					"</li>";
				$( ".namespaces fieldset ul" ).append(x);
				namespace_counter++;
			});


		//fudge yeahs.
		//DELETE NAMESPACE
		//section class = "document_container" > div class = "add_documet" > div class="namespaces" > p
		$( ".namespaces li span.ui-icon-close" ).live( "click", function() {
			$( this ).parent().remove();
		});

		
		function collectAll(part)
		{
			var section_stuff = {};
			//each section needs a dictionary of
			$("#"+ part +"_tabs ul li a").each(function() {
				var texter = $(this).text();
				section_stuff[texter] = collectTags(texter);
				
			});
			return section_stuff;
		}

		//the attributes appear to break everything...
		//the tag name is the tag title
		function collectTags(texter)
		{
			var tags = new Array();
			$("#tabs-"+ texter +" #list h1.tag_title").each(function() {
				//I think this is becoming undefined...
				var atties = new Array();
				//create a value array from the li texts (tag attributes).
				$(this).siblings('ul').children().each(function(){
					atties.push($(this).text());
				});
				tags.push({
					"name":$(this).text(),
					"attributes" : atties || [],
					"parent" : getParent($(this)) || "error"});
			});
			return tags;
		}

		//#list with h1:tag_title of tag_title...
		//find it...and then find its parent of parent (ol > #list)
		//if it exists...mark the parents.
		//if not, mark it as root.
		//send in an ol in #tabs-texter...check to see if it has
		//a parent of parent of #list...if it does...store parent of #list h1.tag_title as the parent.
		//return the parent name.
		function getParent(tag)
		{
			var parent_name = tag.parent('div.the_sortables').parent('li#list').parent('ol').parent('li#list');
			//this means that we have a parent...
			//and return the parent's name (tag_name of sort).
			if (parent_name.length > 0)
			{
				return parent_name.children('div.the_sortables').children(' h1.tag_title').text();
			}
			//return the root node...
			else
			{
				return "root";
			}
		}

		//collect the values from the namespaces input
		function collectNamespaces()
		{
			var namespaces = new Array();
			$(".namespaces fieldset ul li input").each(function() {
				namespaces.push($(this).val());
				
			});
			return namespaces;
		}
		//
		//header_tabs > ul > div.tabs-name > ol.sortable > li#list > div.the_sortables > h1.tag_title > ul.attributes
		//> div.button_holder, you want each li#list and you want the tag title, the attributes and the parent node.
			
		// Save The Document Header
		//doc_name_title
		$( "#save_document" )
			.button({ icons: { primary: "ui-icon-disk" }})
			.click(function() {
				var doc_name_input = $doc_name_title_input.val();
				if(!(isValidSection(doc_name_input)))
				{
					addErrors($("#options"),["Hey! You forgot the document name."]);
				}
				//otherwise we add our tab to the header section
				//and close ze box.
				else
				{
					var arraysss = [1,2,3];
					$.ajax({
					  	type: "POST",
						url: location.href,
						//can you send a dict in a dict?
						data: {
							"save":"yes",
							"document_name":doc_name_input,
							"namespaces": collectNamespaces(),
							"header_sections": collectAll("header"),
							"body_sections": collectAll("body")
						}
					});
					
					//I need to send in the data as json I guess
					alert("Hey, you just saved","Hello (TBChanged)");
				}
		});


		
		// Save The Document Header
		$( "#validate_document" )
			.button({ icons: { primary: "ui-icon-clipboard" }})
			.click(function() {
				alert("This document isn't valid","Hello");
			});
		
		

		//somehow we need to delete the li before the div
		//okay got it...what a hacker.
		$("#list div.ui-icon-close").live("click",function()
		{
			$( this ).parent().parent().remove();
		});

		//somehow we need to delete the li before the div
		//okay got it...what a hacker.
		$("#list div.ui-icon-pencil").live("click",function()
		{
			alert("Hey, hook me up to the edit box...");
		});


		$( "#deletion:ui-dialog" ).dialog( "destroy" );
	
		$( "#deletion-confirm" ).dialog({
			resizable: false,
			height:200,
			autoOpen:false,
			modal: true,
			buttons: {
				"Delete Item": function() {
					$.ajax({
						type: "POST",
						dataType: 'json',
						url: "http://127.0.0.1:8000/cda_builder/all_cda.html",
						data: {"delete_document":document_name}
					});
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		});

		//somehow we need to delete the li before the div
		//okay got it...what a hacker.
		$("p.ui-icon-close").live("click",function()
		{
			var document_name = $(this).parent('td').siblings('td#document_name').text();
			$(this).parent().parent().remove();
			$.ajax({
				type: "POST",
				dataType: 'json',
				url: "http://127.0.0.1:8000/cda_builder/all_cda.html",
				data: {"delete_document":document_name}
			});
			
			
		});

		
		$( "#create-clinic" )
			.button({ icons: { primary: "ui-icon-plusthick" }})
			.click(function() {
				location.href = "http://127.0.0.1:8000/cda_builder/add_clinic.html";
				$.ajax({
					type: "POST",
					url: "http://127.0.0.1:8000/cda_builder/add_clinic.html",
					data: {"add_clinic":"yes"}
					});
		});


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
		

		// close icon: removing the tab on click
		// note: closable tabs gonna be an option in the future - see http://dev.jqueryui.com/ticket/3924
		//you have to remove the tab from the body list options...
		$( "#body_tabs span.ui-icon-close" ).live( "click", function() {
			var index = $( "li", $body_tabs ).index( $( this ).parent() );
			var tab_name = $( "li a", $body_tabs ).text();
			$body_tabs.tabs( "remove", index );
			removeTabOption("body",tab_name);
		});

		
		// close icon: removing the tab on click
		// note: closable tabs gonna be an option in the future - see http://dev.jqueryui.com/ticket/3924
		//aha this is the culprit...this is being called in junction with the other...maybe make it a div.
		$( "#header_tabs span.ui-icon-close" ).live( "click", function() {
			var index = $( "li", $header_tabs ).index( $( this ).parent() );
			var tab_name = $( "li a", $header_tabs ).text();
			$header_tabs.tabs( "remove", index );
			removeTabOption("header",tab_name);
		});
	
		
		



		
		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		$("#station").sortable({
			revert:true
		});

		
		$( ".sortable_widgets" ).sortable();
		$( ".sortable_widgets" ).disableSelection();

		//it appears as if we need a generic sortable

		$(".dragger").draggable();		
	
		$(".dragger").draggable({
			connectToSortable: ".sortable_widgets",
			helper: "clone",
			revert: "invalid"
		});


		$("ul, li").disableSelection();
		//okay, in this instance.
		//you need to expand the widget size or something...
		//maybe display the form for the specific widget...
		//oh gosh that will be hard...how the heck...
		$( ".drop_zone" ).droppable({
			drop: function( event, ui ) {
				$( this )
					.addClass( "ui-state-highlight" )
					.find( "p" )
						.html( "Dropped!" );
			}
		});
		
		//This is for adding new sections to each station...
		$( "#add_section_button" )
			.button({ icons: { primary: "ui-icon-plusthick" }})
			.click(function() {
				$add_section_dialog.dialog( "open" );
		});

		//lets work on adding a station
		// addTab button: just opens the dialog
		$( "#add_station_button" )
			.button({ icons: { primary: "ui-icon-circle-plus" }})
			.click(function() {
				$add_station_dialog.dialog( "open" );
		});


		//when we add a station...we need to connect the panel to the sortable
		function addStation(title) {
				//add in the title to well...create station and then...
				//add in the title //add the #station
				var x = "<div class=\"group\" title =\"station_"+ title +"\"><h3><a href= \"#\">"+ title +"</a></h3><div><p>You need to add some sections!<\/p></div></div>";
				//var $title_name = $('<h3>').append($('<a>').attr('href','#').html(title));
				//var $content = $('<div>').append($('<p>').html("Hello"));
				//add the station name to the section add dialog box
				$("#add_section_dialog select").append("<option value= \"" + title + "\">"+ title +"</option>");
				$("#station").append(x).accordion('destroy')
					.accordion({
						collapsible: true,
						header: "> div > h3"
					})
					.sortable({
						axis: "y",
						handle: "h3",
						stop: function( event, ui ) 
						{
							// IE doesn't register the blur when sorting
							// so trigger focusout handlers to remove .ui-state-focus
							ui.item.children( "h3" ).triggerHandler( "focusout" );
						}
				});
		}
		

		/*
		*
		*	DIALOG BOXES
		*
		*/
		// modal dialog init: custom buttons and a "close" callback reseting the form inside
		//eventually, you should create a function handler that manages 
		//dialog box creation...this seems a little excessive.
		//there are many simplifications that can be made here...
		var $add_station_dialog = $( "#add_station_dialog" ).dialog({
			autoOpen: false,
			modal: true,
			height:400,
			buttons: {
				Add: function() {
					var errors_list = isValidSection($("#station_title").val(),"station");
					//if we have errors, send errors_list into addErrors(...)
					if(errors_list.length > 0)
					{
						addErrors($(this),errors_list);
					}
					else
					{
						
						addStation($("#station_title").val());
						$( this ).dialog( "close" );
					}
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			},
			open: function() {
				$("#station_title").focus();
			},
			close: function() {
				$(".errors").remove().fadeOut();
				$("#station_title").val("");
			}
		});

		var $add_section_dialog = $( "#add_section_dialog" ).dialog({
			autoOpen: false,
			modal: true,
			height:400,
			buttons: {
				Add: function() {
					var errors_list = isValidSection($("#section_title").val(),"section");
					//if we have errors, send errors_list into addErrors(...)
					if(errors_list.length > 0)
					{
						addErrors($(this),errors_list);
					}
					else
					{
						
						addSection($("#section_title").val());
						$( this ).dialog( "close" );
					}
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			},
			open: function() {
				$("#section_title").focus();
			},
			close: function() {
				$(".errors").remove().fadeOut();
				$("#section_title").val("");
			}
		});


		var $section_tabs = $( "#sections").tabs({
			tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
			add: function( event, ui ) {
				//we need to reconnect the sortable.
				var x = $('<div></div>').attr('class', 'sortable_widgets');
				$( ui.panel ).append( x );
				$(x).sortable({connectWith:'.sortable_widgets'});
			}
		});
	
		//add into the correct station...
		//when you add into the correct station, you need to connect to sortable_widgets...
		function addSection(section_title,part)
		{
			$section_tabs.tabs("add","#station-"+ part, section_title);
			
		}

		function addTab(part) {
				var tab_title = $header_tab_title_input.val() || $body_tab_title_input.val() || "Tab " + tab_counter;				
				if (part == 'header')
				{
					$section_tabs.tabs( "add", "#tabs-"+ tab_title, tab_title );
					header_tab_counter++;
					
				}
				else
				{
					$body_tabs.tabs( "add", "#tabs-"+ tab_title, tab_title );
					body_tab_counter++;
				}
				$("#add_" + part + "_tag_dialog select").append("<option value= \"" + tab_title + "\">"+ tab_title +"</option>");
			
		}

		//when you add the widget in...have the sortable be present...
		//but wrap it into a droppable...
		//maybe have a droppable and then when you put the widget it...
		//you add a sortable div...
		//Yup, this looks ambiguous...but this is our delete function...
		//For applied Widgets...
		//you have to be careful though...we don't want this thing to be
		//deleted from within the widget box...
		//check to see what its parent is???
		//maybe only add the trash can once you have dropped it into a thing...
		$( ".dragger span" ).live( "click", function() {
			$(this).parent().remove();
		});

		// actual addTab function: adds new tab using the title input from the form above
		function addStationSection() {
			var tab_title = $tab_title_input.val();
			$tabs.tabs( "add", "#tabs-" + tab_counter, tab_title );
			tab_counter++;
		}

		// addTab button: just opens the dialog
		$( "#add_tab" )
			.button()
			.click(function() {
				$dialog.dialog( "open" );
			});

		// close icon: removing the tab on click
		// note: closable tabs gonna be an option in the future - see http://dev.jqueryui.com/ticket/3924
		$( "#sections span.ui-icon-close" ).live( "click", function() {
			alert("Hey");
			var index = $( "li", $tabs ).index( $( this ).parent() );
			$tabs.tabs( "remove", index );
		});



		$( "#station" )
			.accordion({
				collapsible: true,
				header: "> div > h3"
			})
			.sortable({
				axis: "y",
				handle: "h3",
				stop: function( event, ui ) {
					// IE doesn't register the blur when sorting
					// so trigger focusout handlers to remove .ui-state-focus
					ui.item.children( "h3" ).triggerHandler( "focusout" );
				}
		});


		

		$( "#clinic_save_button" )
			.button({ icons: { primary: "ui-icon-disk" }})
			.click(function() {
				alert("Hello");
		});

		
		

		
		$( "#clinic_load_button" )
			.button({ icons: { primary: "ui-icon-refresh" }})
			.click(function() {
				var clinic_name = $("#clinic_name_title").val() || "default";
				location.href = "http://127.0.0.1:8000/cda_builder/themes/hr4e/index.html?clinic=" + clinic_name;
				$.ajax({
					type: "POST",
					url: "http://127.0.0.1:8000/cda_builder/themes/hr4e/index.html",
					data: {"load_clinic": "yes"}
				});
		});

		$( "#sections" ).tabs();
		
		$( "#minimize_widgets" )
			.button({ icons: { primary: "ui-icon-carat-2-n-s" }})
			.click(function() {
				if ($(".scroll-pane").is(":visible"))
			{
				$('.scroll-pane').hide('slow', function() {
    					
  				});
			}
			else
			{
				$('#slider').show('fast', function() {
    					
  				});
				$('.scroll-pane').show('slow', function() {
    					
  				});
			}
		});

		//scrollpane parts
		var scrollPane = $( ".scroll-pane" ),
			scrollContent = $( ".scroll-content" );
		
		//build slider
		var scrollbar = $( ".scroll-bar" ).slider({
			slide: function( event, ui ) {
				if ( scrollContent.width() > scrollPane.width() ) {
					scrollContent.css( "margin-left", Math.round(
						ui.value / 100 * ( scrollPane.width() - scrollContent.width() )
					) + "px" );
				} else {
					scrollContent.css( "margin-left", 0 );
				}
			}
		});
		
		//append icon to handle
		var handleHelper = scrollbar.find( ".ui-slider-handle" )
		.mousedown(function() {
			scrollbar.width( handleHelper.width() );
		})
		.mouseup(function() {
			scrollbar.width( "100%" );
		})
		.append( "<span class='ui-icon ui-icon-grip-dotted-vertical'></span>" )
		.wrap( "<div class='ui-handle-helper-parent'></div>" ).parent();
		
		//change overflow to hidden now that slider handles the scrolling
		scrollPane.css( "overflow", "hidden" );
		
		//size scrollbar and handle proportionally to scroll distance
		function sizeScrollbar() {
			var remainder = scrollContent.width() - scrollPane.width();
			var proportion = remainder / scrollContent.width();
			var handleSize = scrollPane.width() - ( proportion * scrollPane.width() );
			scrollbar.find( ".ui-slider-handle" ).css({
				width: handleSize,
				"margin-left": -handleSize / 2
			});
			handleHelper.width( "" ).width( scrollbar.width() - handleSize );
		}
		
		//reset slider value based on scroll content position
		function resetValue() {
			var remainder = scrollPane.width() - scrollContent.width();
			var leftVal = scrollContent.css( "margin-left" ) === "auto" ? 0 :
				parseInt( scrollContent.css( "margin-left" ) );
			var percentage = Math.round( leftVal / remainder * 100 );
			scrollbar.slider( "value", percentage );
		}
		
		//if the slider is 100% and window gets larger, reveal content
		function reflowContent() {
				var showing = scrollContent.width() + parseInt( scrollContent.css( "margin-left" ), 10 );
				var gap = scrollPane.width() - showing;
				if ( gap > 0 ) {
					scrollContent.css( "margin-left", parseInt( scrollContent.css( "margin-left" ), 10 ) + gap );
				}
		}
		
		//change handle position on window resize
		$( window ).resize(function() {
			resetValue();
			sizeScrollbar();
			reflowContent();
		});
		//init scrollbar size
		setTimeout( sizeScrollbar, 10 );//safari wants a timeout







	});





	
	

