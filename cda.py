#cda class creation is invoked via add_cda.
#The user should select his or her attributes...
#I need to come up with a solution to the namespace dict...
#The namespace should be added to the tag name...
#Do you want to have the tag be the same as the name?
#Do you want the etree tag to be contained in the namespace dict?
#Save the components as etrees.  When validating and producing
#Concat the etrees together.
class cda:
	def __init__(self,name,namespace,is_valid,date_created,components):
		self.name = "HR4E"
		#namespace attributes will need to be added to root as etree attributes
		#self.tag
		self.components = {"header": {"head1":"header1"}, "body":{"section1":"sectionOne"}}
		self.namespace = {}
		self.is_valid = False
		self.date_created = datetime.datetime.now()
	#Take all of the sections and compress them into the dictionary etrees
	def save():
		print "Hello Saving Document"
	#Take all of the etree sections and create the components
	def load():
		print "Loading Document"
	def create():
		print "Creating Document"
	def validate():
		print "Validating Document"
