#!/usr/bin/python

import sys, os, json
from modules import *

if __name__ == '__main__':
	f = open('demo.json', 'r')
	jsonstr = f.read()
	cfg = json.loads(jsonstr)
	Hadoop.install(cfg)
