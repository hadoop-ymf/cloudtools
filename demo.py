#!/usr/bin/python

import sys, os, json, uuid
from modules import *

import pdb

if __name__ == '__main__':
	pdb.set_trace()
	f = open('demo.json', 'r')
	jsonstr = f.read()
	cfg = json.loads(jsonstr)
	uu = str(uuid.uuid1())
	Hadoop.install(cfg, uu)
