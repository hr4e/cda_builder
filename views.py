
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_exempt
#import patient,clinic,cda
import datetime
from forms import *
import cPickle as pickle
import os
#from lxml import etree
#import libxml2
#import libxslt
import sys
import StringIO
import subprocess
import argparse
import random
import shutil


#cda class creation is invoked via add_cda.
#The user should select his or her attributes...
#I need to come up with a solution to the namespace dict...
#The namespace should be added to the tag name...
#Do you want to have the tag be the same as the name?
#Do you want the etree tag to be contained in the namespace dict?
#Save the components as etrees.  When validating and producing
#Concat the etrees together.
#<greenCCD xmlns="AlschulerAssociates::GreenCDA" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:hr4e="hr4e::patientdata" 
#		  xsi:schemaLocation="AlschulerAssociates::GreenCDA green_ccd.xsd">
class cda:
	def __init__(self,namer,namespaces,header_tree,body_tree):
		#These come from the dang JQuery POST of doom.
		self.namer = namer
		self.namespaces = namespaces
		self.header_tree = header_tree
		self.body_tree = body_tree
		#These are auto generated...how nice.
		self.is_valid = False
		self.date_created = datetime.datetime.now()
	#Take all of the sections and compress them into the dictionary etrees
	#The sections will come in via dictionaries
	def save(self,name):
		print "Checking to see if the path exists"
		if not os.path.exists("data/cdas/" + name + "/"):
			print "The path doesn't exist"
			os.mkdir("data/cdas/" + name + "/")
			print "The directory is being made: " + "data/cdas/" + name + "/"
		print "I am now saving"
		pickle.dump(self.__dict__, (file('data/cdas/' + name + '/' + name + '.pkl','wb')))
	#Take all of the etree sections and create the components
	def load(self,path,name):
		if os.path.exists(path):
			if os.path.exists(path + '/' + name + '.pkl'):
				print "I have found the right pickle"
				print path + '/' + name + '.pkl'
				self.__dict__ = pickle.load(file(path + '/' + name + '.pkl','r+b'))
			else:
				self.__dict__ = {}
			print "####################"
		return self
	def remove(self,dirpath):
		if os.path.exists(dirpath):
			shutil.rmtree(dirpath)
	def validate():
		print "Validating Document"
	def getHeaderSections(self):
		sections = []
		for section in self.header_tree:
			sections.append(section['section_title'])
		return sections
	def getBodySections(self):
		sections = []
		for section in self.body_tree:
			sections.append(section['section_title'])
		return sections



class patient:
	def __init__(self,name,photo,desc,model):
		self.name = name
		self.photo = photo
		self.desc = desc
		self.model = model



class clinic:
	def __init__(self,namer,namespaces):
		#These come from the dang JQuery POST of doom.
		self.namer = namer
		self.namespaces = namespaces
		self.stations = []
		#no, this isn't quite right....
		#{station_name: {"section_one":{"widget_name":someRepresentationofWidget}} }
		#stations > 1..* section > 1..* widgets...how are we going to represent widgets?
		self.date_created = datetime.datetime.now()
	#Take all of the sections and compress them into the dictionary etrees
	#The sections will come in via dictionaries
	def save(self,name):
		print "Checking to see if the path exists"
		if not os.path.exists("data/clinics/" + name + "/"):
			print "The path doesn't exist"
			os.mkdir("data/clinics/" + name + "/")
			print "The directory is being made: " + "data/clinics/" + name + "/"
		print "I am now saving"
		pickle.dump(self.__dict__, (file('data/clinics/' + name + '/' + name + '.pkl','wb')))
	#Take all of the etree sections and create the components
	def load(self,path,name):
		if os.path.exists(path):
			if os.path.exists(path + '/' + name + '.pkl'):
				print "I have found the right pickle"
				print path + '/' + name + '.pkl'
				self.__dict__ = pickle.load(file(path + '/' + name + '.pkl','r+b'))
			else:
				self.__dict__ = {}
			print "####################"
		return self
	def remove(self,dirpath):
		if os.path.exists(dirpath):
			shutil.rmtree(dirpath)
	def getHeaderSections(self):
		sections = []
		for section in self.header_tree:
			sections.append(section['section_title'])
		return sections
	def getBodySections(self):
		sections = []
		for section in self.body_tree:
			sections.append(section['section_title'])
		return sections

			

class settings:
	def __init__(self,organization_name,location,thumb_location,medications,vaccinations):
		#These come from the dang JQuery POST of doom.
		self.organization_name = organization_name
		self.location = location
		self.thumb_location = thumb_location
		self.medications = medications
		#These are auto generated...how nice.
		self.vaccinations = vaccinations
	def save(self,name):
		print "Checking to see if the path exists"
		if not os.path.exists("data/settings/"):
			print "The path doesn't exist"
			os.mkdir("data/settings/")
			print "The directory is being made: " + "data/settings/"
		print "I am now saving"
		pickle.dump(self.__dict__, (file('data/settings/settings.pkl','wb')))
	#Take all of the etree sections and create the components
	def load(self):
		if os.path.exists(path):
			if os.path.exists('data/settings/settings.pkl'):
				print "I have found the right pickle"
				self.__dict__ = pickle.load(file('data/settings/settings.pkl','r+b'))
			else:
				print "I couldn't find the right pickle..."
				self.__dict__ = {}
			print "####################"
		return self

def loadAllClinics(path):
	list_of_clinics = []
	for directs in [x[0] for x in os.walk(path)]:
		#reset the object through each loop...silly
		global_clinic = clinic("default",[],[])
		#Avoids the root node...
		if(directs == path):
			pass
		else:
			global_clinic.load(directs,directs.split("/")[2])
			list_of_clinics.append(global_clinic)
	return list_of_clinics

def loadAllCDA(path):
	list_of_cdas = []
	for directs in [x[0] for x in os.walk(path)]:
		#reset the object through each loop...silly
		global_cda = cda("default",[],[],[])
		#Avoids the root node...
		if(directs == path):
			pass
		else:
			global_cda.load(directs,directs.split("/")[2])
			list_of_cdas.append(global_cda)
	return list_of_cdas

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


#Pages Section
def load_clinic(request):
	hello = "Hello Alex, this is your index page"
	now = datetime.datetime.now()
	return render_to_response('themes/hr4e/index.html',locals())


#Pages Section
def index(request):
	hello = "Hello Alex, this is your index page"
	now = datetime.datetime.now()
	return render_to_response('index.html',locals())


#go through "/data/clinics/* and get
#/data/clinics/**/document.pickle
#load all of the pickles into objects
#and create that document list
#okay, so each 
def all_clinics(request):
	hello = "Hello Alex, this is your clinics page"
	now = datetime.datetime.now()
	return render_to_response('all_clinics.html',locals())


#This is where we define how we handle our requests
#from the add clinic page...
#We take in a request and do some stuff with it:
#We can save a clinic and then load a clinic
#Lastly, we return 'add_clinic.html'
#Along with any local django variables to be displayed
#On the HTML Page
def add_clinic(request):
	hello = "CDA Creation Page"
	now = datetime.datetime.now()
	global_clinic = clinic("default",[])
	#we are getting a request to load the document...
	if ('save' in request.POST):
		if('namespaces[]' in request.POST):
			the_namespaces = request.POST.getlist(u'namespaces[]')
		#set a default namespace list
		else:
			print "I didn't find a namespace"
			the_namespaces = ['xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"']
		namer = str(request.POST[u'clinic_name'])
		the_clinic = clinic(namer,the_namespaces,setTree(request.POST,u'header_sections'),setTree(request.POST,u'body_sections'))
		clinic.save(the_clinic,str(namer))
	return render_to_response('add_clinic.html',locals())


#Load up the clinic for editing...
#Basically the same as add clinic, but it loads up
#an existing clinic using request.get
def edit_clinic(request):
	global_clinic = clinic("default",[])
	if(request.GET.get('clinic','')):
		name = request.GET.get(u'clinic','')
		theMaster = global_clinic.load("data/clinics/" + name,name)
	if ('save' in request.POST):
		if('namespaces[]' in request.POST):
			the_namespaces = request.POST.getlist(u'namespaces[]')
		#set a default namespace list
		else:
			print "I didn't find a namespace"
			the_namespaces = ['xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"']
		namer = str(request.POST[u'clinic_name'])
		the_clinic = clinic(namer,the_namespaces,setTree(request.POST,u'header_sections'),setTree(request.POST,u'body_sections'))
		clinic.save(the_clinic,str(namer))
	return render_to_response('edit_cda.html',locals())






###################################Admin Settings #####################################################
def admin_settings(request):
	hello = "Hello Alex, this is your settings page"
	now = datetime.datetime.now()
	return render_to_response('admin_settings.html',locals())


def theme_settings(request):
	hello = "Hello Alex, this is your theme settings page"
	now = datetime.datetime.now()
	return render_to_response('theme_settings.html',locals())





#####################################NO GO ZONE NO GO ZONE############################################
#Do not touch these until you have the builder done...then work on search and print only...
def patient_manager(request):
	#As a test, create three patients
	patient1 = patient("Rob Reyen","photo.jpg","This is a nice flower head.","HR4E Green CCD")
	patient2 = patient("Roberto Phhhhh","photo.jpg","This is a nice flower head.","HR4E Green CCD")
	patient3 = patient("Rob Rasdfasdfn","photo.jpg","This is a nice flower head.","HR4E Green CCD")
	patients = [patient1,patient2,patient3]
	hello = "Hello Alex, this is your patient manager page"
	now = datetime.datetime.now()
	return render_to_response('patient_manager.html',locals())

#This isn't really being used just yet...
def patient_search(request):
	#As a test, create three patients
	patient1 = patient("Rob Reyen","photo.jpg","This is a nice flower head.","HR4E Green CCD")
	patient2 = patient("Roberto Phhhhh","photo.jpg","This is a nice flower head.","HR4E Green CCD")
	patient3 = patient("Rob Rasdfasdfn","photo.jpg","This is a nice flower head.","HR4E Green CCD")
	patients = [patient1,patient2,patient3,patient4,patient5,patient6,patient7,patient8,patient9]
	hello = "Hello Alex, this is your patient manager page"
	now = datetime.datetime.now()
	return render_to_response('patient_search.html',locals())
#######################################################################################################
#######################################################################################################





####################THE CODE BELOW IS USED FOR PREVIOUS VERSION OF THE SOFTWARE... #############################

#I need to create a generic view for builders...
#I might need to pass in a cda object into the view...
#Can I do this through a post when I click a link?
#Should I do this with Jquery?


#Okay, so here go... I need to set components to a tree...
#header_section[section_name][tag_number][tag_name]
#ex: header_sections[personsInformation][6][name] : state
#ex  header_sections[personsInformation][6][name] : 
#ex: u'header_sections[personsInformation][6][attributes][]
#ex: u'header_sections[personsInformation][6][parent]': [u'personAddress']
#Is it possible to count all of the keys with u'header_sections'?
@csrf_exempt
def add_cda(request):
	hello = "CDA Creation Page"
	now = datetime.datetime.now()
	global_cda = cda("default",[],[],[])
	#we are getting a request to load the document...
	if ('save' in request.POST):
		if('namespaces[]' in request.POST):
			the_namespaces = request.POST.getlist(u'namespaces[]')
		#set a default namespace list
		else:
			print "I didn't find a namespace"
			the_namespaces = ['xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"']
		namer = str(request.POST[u'document_name'])
		derp = cda(namer,the_namespaces,setTree(request.POST,u'header_sections'),setTree(request.POST,u'body_sections'))
		cda.save(derp,str(namer))
	return render_to_response('add_cda.html',locals())

@csrf_exempt
def edit_cda(request):
	global_cda = cda("default",[],[],[])
	if(request.GET.get('document','')):
		name = request.GET.get(u'document','')
		theMaster = global_cda.load("data/cdas/" + name,name)
	if ('save' in request.POST):
		if('namespaces[]' in request.POST):
			the_namespaces = request.POST.getlist(u'namespaces[]')
		#set a default namespace list
		else:
			print "I didn't find a namespace"
			the_namespaces = ['xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"']
		namer = str(request.POST[u'document_name'])
		derp = cda(namer,the_namespaces,setTree(request.POST,u'header_sections'),setTree(request.POST,u'body_sections'))
		cda.save(derp,str(namer))
	return render_to_response('edit_cda.html',locals())

#Okay, count each header_sections...take out each [tag name]
#and store it into an array and delete any duplicates...
#count how many there are of each tag_name
#that will be your max value for header_sections[section][#oftags]
#well, what the heck do I want to do with these values...
#if we have a dictionary call header_sections...each key could
#be a section...and its value would be an array of tag dictionaries?
#do we want to have depth from the UI, or create it ourselves...?
# [{"tag-name":"","tag-attributes":[],"tag-parent":"some-tag-name"},{...}]
#for each section:
#for tag name with parent:of "root" to have depth 0
#else set the depth to be find(rootedParent,depth):
#for each tag with rootedParent.name as parent:node set depth to depth+1
#base case root: else 


#This method takes the JQUERY ajax post dictionary
#and sets the header tree and the body tree
#for the custom python object 'cda'
#set the object value to setTrees(dictionary)
#header_or_body must take: {u'header_sections' || u'body_sections'
#It returns an array called tree...
def setTree(dictionary,header_or_body):
	#what did I just make...
	section_titles = []
	tree = []
	header_array = []
	for key,value in dictionary.iteritems():
		if header_or_body in key:
			#if the section_title is not found in section_titles
			if not key[key.find('[')+1:key.find(']')] in section_titles:
				section_titles.append(key[key.find('[')+1:key.find(']')])
	for section_title in section_titles:
		max_valued = getMaxTagNumber(dictionary,section_title,header_or_body)
		tree.append({"section_title":str(section_title),"tags": getTags(section_title,max_valued,dictionary,header_or_body)})
	return tree

#This method takes the JQUERY ajax post dictionary,
#A section title name and a header or body key prefix
#For finding the max number of tags in each given section.
#header_or_body must take: {u'header_sections' || u'body_sections'
#Example: u'header_sections[sectionTitle][0][name]': [u'IRTAG'],
def getMaxTagNumber(dictionary, section_title,header_or_body):
	max_number = 0
	desiredString = header_or_body + '[' + str(section_title) + ']'
	for key,value in dictionary.iteritems():
		if desiredString in key:
			#this will give us back the number in [0]
			if max_number < int(key[len(desiredString)+1]):
				max_number = int(key[len(desiredString)+1])
	return max_number

def attributesPresent(dictionary,header_or_body,section_title,i):
	for key,value in dictionary.iteritems():
		if key == u''+ header_or_body + '[' + section_title +']' + '['+ str(i) + ']' + '[attributes][]':
			return True
	return False


#section_title is a string...
#max is an int
#dictionary is the jquery.post dictionary...
def getTags(section_title,max_value,dictionary,header_or_body):
	tags = []
	for i in range(0,max_value+1):
		new_dict = {}
		#So, when there are no attributes...we run into a little problem...do we really have to traverse the dict...?
		#dictionary[u''+ header_or_body + '[' + section_title +']' + '['+ str(i) + ']' + '[attributes][]']: old check...
		if attributesPresent(dictionary,header_or_body,section_title,i):
			#I am making assignments here for readability.  Doing a .append(dict stuff) was too unsightly.
			new_dict["tag-name"] = dictionary[u''+ header_or_body + '[' + section_title +']' + '['+ str(i) + ']' + '[name]']
			new_dict["tag-parent"] = dictionary[u''+ header_or_body + '[' + section_title +']' + '['+ str(i) + ']' + '[parent]']
			new_dict["tag-attributes"] = dictionary[u''+ header_or_body + '[' + section_title +']' + '['+ str(i) + ']' + '[attributes][]']
			tags.append(new_dict)
			print "I just appended a nice tag (atties too): " + dictionary[u''+ header_or_body + '[' + section_title +']' + '['+ str(i) + ']' + '[name]']
		else:
			print "I couldn't find attributes for this tag..."
			new_dict["tag-name"] = dictionary[u''+ header_or_body + '[' + section_title +']' + '['+ str(i) + ']' + '[name]']
			new_dict["tag-parent"] = dictionary[u''+ header_or_body + '[' + section_title +']' + '['+ str(i) + ']' + '[parent]']
			tags.append(new_dict)
			print "I just appended a nice tag (no atties): " + dictionary[u''+ header_or_body + '[' + section_title +']' + '['+ str(i) + ']' + '[name]']
	return tags
	

#CDA Builder View Pages
#go through "/data/cdas/* and get
#/data/cdas/**/document.pickle
#load all of the pickles into objects
#and create that document list
#okay, so each 
@csrf_exempt
def all_cda(request):
	cdas = loadAllCDA("data/cdas/")
	print cdas
	global_cda = cda("default",[],[],[])
	if ('delete_document' in request.POST):
		print "I am deleting a document!"
		print request.POST
		global_cda.remove("data/cdas/" + str(request.POST[u'delete_document']))
	hello = "Hello Alex, this is your builder page"
	now = datetime.datetime.now()
	return render_to_response('all_cda.html',locals())


###################################Utility Pages for testing various things...######################################################
def fun(request):
	hello = "Hello Alex, this is your settings page"
	now = datetime.datetime.now()
	return render_to_response('fun.html',locals())

@csrf_exempt
def non(request):
	if request.POST:
		print request.POST
	hello = "Hello Alex, this is your builder page"
	now = datetime.datetime.now()
	return render_to_response('non.html',locals())
########################################################################################################




