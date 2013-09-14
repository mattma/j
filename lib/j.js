#!/usr/bin/env node
/*
 * commander
 * https://github.com/mma/j
 *
 * Copyright (c) 2013 Matt Ma
 * Licensed under the MIT license.
 */

'use strict';

var program = require('commander'),
	pkg = require('../package.json'),
	path = require('path'),
	spawn = require('child_process').spawn;

var output, outputStdout;

outputStdout = function(data) {
	console.log(data.toString('utf8').trim());
};

output = function(proc) {
	proc.stdout.on('data', function(data) {
		return outputStdout(data);
	});
	proc.stderr.on('data', function(data) {
		return outputStdout(data);
	});
};

program
	.version(pkg.version)
	.option('-s, --selenium [mode]', 'kick start selenium server [standalone|hub]')
	.option('-j, --jenkins', 'kick start selenium server')
	.option('-m, --mongo [mode]', 'kick start mongo command [shell|server]');

// must be before .parse() since node's emit() is immediate
program.on('--help', function(){
	console.log('  Examples:');
	console.log('');
	console.log('    $ j -s [hub] 	   # By default, it will use standalone server');
	console.log('    $ j -j  		   # Launch a local jenkins server');
	console.log('    $ j -m [shell] 	   # By default, it will use mongo server');
	console.log('');
});

program.parse(process.argv);

if(program.selenium) {
	var mode = program.selenium || 'standalone',
		seleniumPath = path.join( __dirname, '..', 'files/selenium-server-standalone-2.35.0.jar');

	if ( mode === 'hub' ) {
		return output(spawn('java', ['-jar', seleniumPath, '-role', 'hub' ]));
	} else {
		return output(spawn('java', ['-jar', seleniumPath ]));
	}
}

if(program.jenkins) {
	var mode = program.jenkins || 'standalone',
		jenkinsPath = path.join( __dirname, '..', 'files/jenkins.war');

	return output(spawn('java', ['-jar', jenkinsPath ]));
}

if(program.mongo) {
	var mode = program.mongo || 'server';
	if ( mode === 'shell' ) {
		return output( spawn('mongo') );
	} else {
 		return output( spawn('mongod') );
	}
}
