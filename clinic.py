#A clinic is a set of formsets
#A Formset is a set of forms.
#We need to bind document attributes to form data.
#formsets are django formsets, they can be stored in a dict
#formsets = {"formset_name":formset(attributes),"formset_name":"formset(attributes)"}
#How do I represent bindings?
#Each form field needs to have a binding or not...
#Create an extra attribute in the forms for lxml binding.
#Namespace will be important here 
#.set vs .text...
class clinic:
	def __init__(self,name,date_created):
		self.name = name
		self.date_created = date_created
