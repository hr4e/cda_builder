'''
Created on Apr 27, 2011

    Simple python script to invoke saxon to apply XSLT stylesheet to remove hr4e namespace
    from an hr4e patient data record.  
    
    The input to this script is an instance of an hr4e patient data xml document that 
    was generated from hr4e_patient_template.xml.
    
    Two files are output.  The first can be validated against the green_ccd.xsd. The green_ccd.xsd 
    also includes green_cda_narrative.xsd, so you will need to have both files present in the
    current directory.
    
    The second file is produced by the green_ccd.xslt file and produces a CDA-compliant document.
    
    The python module libxslt does include an xslt processor, however, it only seems to support
    xslt 1.0.  The green_ccd.xslt file is xslt 2.0.  Therefore, we have to use some other
    xslt processor.
    
    This script assumes that the saxon jar is in a subdirectory called saxon. saxon can be 
    downloaded from here: http://saxon.sourceforge.net/#F9.3HE
    
    After you extract the jar file, you invoke saxon as follows:
    java -jar saxon9he.jar -s:<data file>.xml -xsl:<xslt file>.xslt
    More information on the command line options can be found here:
    http://www.saxonica.com/documentation/using-xsl/commandline.xml

@author: torkroth
'''

import libxml2
import libxslt


import StringIO, sys
import subprocess
import argparse
    
 #
 # Parse the command line
 #
 # -i <input file>: patient data file from which to remove elements from the hr4e namespace
 #    The default is hr4e_patient_template.xml in current directory
 #
 # -o <output file>: the name to give to the created file, which will be an xml file
 #    with elements from hr4e namespace removed
 #    The default is green_patient_template.xml
 #
 # -xsl <xslt file>: the name of the XSLT stylesheet to apply to remove elements from
 #    the hr4e namespace.
 #    The default is hr4e_patient_to_ccd.xslt
 #
 # Examples:
 #    hr4e_patient_to_ccd will apply style sheet hr4e_patient_to_ccd.xslt in the current
 #    directory to input file to hr4e_patient_template.xml to produce file 
 #    green_patient_template.xml in the current directory.
 #
 #    hr4e_patient_to_ccd -i hr4e_patient_1.xml -o green_patient_1.xml will apply style 
 #    sheet hr4e_patient_to_ccd.xslt in the current directory to input file to 
 #    hr4e_patient_1.xml to produce file green_patient_1.xml in the current directory.
 #       
parser = argparse.ArgumentParser()
parser.add_argument('-i', metavar='in-file', type=str, default="hr4e_patient_template.xml")
parser.add_argument('-g', metavar='green-out-file', type=str, default="green_patient_template.xml")
parser.add_argument('-c', metavar='cda-out-file', type=str, default="cda_patient_template.xml")
parser.add_argument('-hxslt', metavar='hr4e-xslt-file', type=str, default="hr4e_patient_to_ccd.xslt")
parser.add_argument('-gxslt', metavar='green-xslt-file', type=str, default="green_ccd.xslt")

try:
    results = parser.parse_args()
    input = results.i
    green_output = results.g
    cda_output = results.c
    hr4e_xslt = results.hxslt
    green_xslt = results.gxslt
    print 'Input file:', input
    print 'Green Output file:', green_output
    print 'CDA Output file:', cda_output
    print 'XSLT file to transform HR4E format to green CCD formta:', hr4e_xslt
    print 'XSLT file to transform green CCD to CDA:', green_xslt
except IOError, msg:
    parser.error(str(msg))
   
#
# Build the command line to remove hr4e elements from options to this script
#
print "Transforming HR4E patient data in file " + input + "..."     
command = "java -jar saxon/saxon9he.jar " + " -s:" + input + " -xsl:" + hr4e_xslt + " > " + green_output
print command

# 
# Fire off a process to invoke java and run the HR4E stylesheet
#       
p = subprocess.Popen(command, shell=True)
retval = p.wait()
print "Complete. green CCD patient data file " + green_output + " generated with hr4e namespace elements removed."

#
# Now built the command line to transform to CDA document
#
print "Transforming green patient data in file " + green_output + "..."     
command = "java -jar saxon/saxon9he.jar " + " -s:" + green_output + " -xsl:" + green_xslt + " > " + cda_output
print command

# 
# Fire off a process to invoke java and run the the green CCD stylesheet
#       
p = subprocess.Popen(command, shell=True)
retval = p.wait()
print "Complete. CDA patient data file " + cda_output + " generated."

##############################################################
##  This is how we would do it if libxslt supported xslt2.0
##  It doesn't, and the green_ccd.xslt file is 2.0
##############################################################
# parser = argparse.ArgumentParser()
# parser.add_argument('-i', metavar='in-file', type=str, default="hr4e_patient_template.xml")
# parser.add_argument('-g', metavar='green-out-file', type=str, default="green_patient_template.xml")
# parser.add_argument('-c', metavar='cda-out-file', type=str, default="cda_patient_template.xml")
# parser.add_argument('-hxslt', metavar='hr4e-xslt-file', type=str, default="hr4e_patient_to_ccd.xslt")
# parser.add_argument('-gxslt', metavar='green-xslt-file', type=str, default="green_ccd.xslt")
# parser.add_argument('-ccd', metavar='green-ccd-file', type=str, default="green_ccd.xsd")

# try:
#     results = parser.parse_args()
#     input = results.i
#     green_output = results.g
#     cda_output = results.c
#     hr4e_xslt = results.hxslt
#     green_xslt = results.gxslt
#     ccdput = results.ccd
#     print 'Input file:', input
#    print 'Green Output file:', green_output
#    print 'CDA Output file:', cda_output
#     print 'XSLT file to transform HR4E format to green CCD formta:', hr4e_xslt
#     print 'XSLT file to transform green CCD to CDA:', green_xslt
#     print 'Green CCD XML Schema file', ccdput
# except IOError, msg:
#    parser.error(str(msg))
    
#
# First transform the HR4E patient format to a green CCD patient format.
#
# print "Transforming HR4E patient data in file " + input + "..."
# styledoc = libxml2.parseFile(hr4e_xslt)
# style = libxslt.parseStylesheetDoc(styledoc)
# green_doc = libxml2.parseFile(input)

# result = style.applyStylesheet(green_doc, None)
# style.saveResultToFilename(green_output, result, 0)
# print "Complete. green CCD patient file " + green_output + " generated with hr4e namespace elements removed."

#
# Now transform the green patient format to CDA patient format.
#
# print "Transforming green CCD patient data in file " + input + "..." + green_xslt
# styledoc = libxml2.parseFile(green_xslt)
# style = libxslt.parseStylesheetDoc(styledoc)
# cda_doc = libxml2.parseFile(green_output)

# result = style.applyStylesheet(cda_doc, None)
# style.saveResultToFilename(cda_output, result, 0)
# style.freeStylesheet()
# doc.freeDoc()
# result.freeDoc()


