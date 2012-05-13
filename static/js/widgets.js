$(function() {	
	function Widget(the_name,fields,station,section)
	{
		this.the_name = the_name;
		this.fields = fields;
		this.station = station;
		this.section = section;
	};

	function field(name,entryType,inherited,XMLBind)
	{
		this.the_name = "Name";
		this.entryType = "Drop Down";
		this.inherited = "Pointer to other field in global list";
		this.XMLBind = "{ournamespace}/...";
	};
	
});
