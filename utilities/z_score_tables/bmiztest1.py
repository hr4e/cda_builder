#!/usr/bin/env python
# encoding: utf-8
"""
bmiztest1.py

Created by Philip Strong on 2011-08-31.
Copyright (c) 2011 Health Records For Everyone. All rights reserved.
"""

import sys
import os

"""
From WHO bmi-for-age (bfa) z-score table for boys 5 years and under, 
generate male_table, a global two-dimensional (numeric) array simulated by a list
"""
male_file = open('bfa_boys_z_exp.txt','r')
line_no=0
male_table=[]
for line in male_file:
	if line_no>0:
		line_array=[]
		line_list=line.split()
		line_array.append(int(line_list[0]))
		for i in range(1,10):
			line_array.append(float(line_list[i]))
		male_table.append(line_array)
	line_no=line_no+1
male_file.close()

"""
From WHO bmi-for-age (bfa) z-score table for girls 5 years and under,
generate female_table, a global two-dimensional (numeric) array simulated by a list
"""
female_file = open('bfa_girls_z_exp.txt','r')
line_no=0
female_table=[]
for line in female_file:
	if line_no>0:
		line_array=[]
		line_list=line.split()
		line_array.append(int(line_list[0]))
		for i in range(1,10):
			line_array.append(float(line_list[i]))			
		female_table.append(line_array)
	line_no=line_no+1
female_file.close()

"""
Generate z-score cutoffs (no fractional z-scores!)
"""
z_label=[]; z_label.append("Age out of range")
z_label.append("-4SD"); z_label.append("-3SD"); z_label.append("-2SD")
z_label.append("-1SD"); z_label.append("0SD"); z_label.append("+1SD")
z_label.append("+2SD"); z_label.append("+3SD"); z_label.append("+4SD")

"""
Surprisingly subtle routine to compute bmi (trivial) and z-score (from WHO tables).
Subtle because:
(1) there are no fractional z-scores
(2) you decrement z as you move away down from 0SD, but increment z as you move up from 0SD
(which is the midpoint of the male/female_table entries for age-in-days; index is 6)

Expects age as a list; age[0] is number of years; age[1] is number of additional months.
Expects gender to be a string, either "male" (or anything else, treated as female).
Expect height_m to be height in meters; weight_kg to be weight in kilograms.
Returns a list; first element is bmi; second lement is string that indicates closest z.
"""
def bmiz(age, gender, height_m, weight_kg):
	bmi = weight_kg/(height_m**2)
	age_mo = (age[0] * 12) + age[1]
	age_d = int(age_mo * 30.4375) # clever constant to convert age in months to age in days
	i=0
	if age_d<1857:
		# code for male
		if gender=='male':
			if bmi>male_table[age_d][9]: i=10
			else:
				for i in range(1,10):
#					print "bmi=",bmi,", male_table[",age_d,"][",i,"]=", male_table[age_d][i]
					if i<6:
						if bmi<=male_table[age_d][i]: 
							i=i+1
							break
					else:
						if bmi<=male_table[age_d][i]: break
		# code for female
		else: 
			if bmi>female_table[age_d][9]: i=10
			else:
				for i in range(1,10):
#					print "bmi=",bmi,", female_table[",age_d,"][",i,"]=", female_table[age_d][i]
					if i<6:
						if bmi<=female_table[age_d][i]: 
							i=i+1
							break
					else:
						if bmi<=female_table[age_d][i]: break	
#	print "age_mo=",age_mo, ", age_d=",age_d
#	if gender=='male':
#		print "bfr_boys_z_exp.txt line[",age_d,"]=",male_table[age_d]
#	else:
#		print "bfr_girls_z_exp.txt line[",age_d,"]=",female_table[age_d]
#	print "z_label=",z_label
	if i>1: z = z_label[i-1]
	else: z = z_label[0]
	return [bmi,z]

def main():
	yr = 4
	mo = 6
	age = [yr,mo]
	gender = 'female'
	height_m = 1.2
	weight_kg = 20
	print yr," year + ",mo," month old ",gender
	print "height(m) = ",height_m," weight(kg) = ",weight_kg
	print "bmi/z = ",bmiz(age, gender, height_m, weight_kg)
	raw_input('Press Enter to exit: ')

if __name__ == '__main__':
	main()

