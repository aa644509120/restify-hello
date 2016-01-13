'use strict';

const fs = require('fs');
const winston=require('winston');

let logger = winston;


// 如果有／log目录，说明在docker环境下
if (fs.existsSync('/log')){
    logger=new (winston.Logger)({
	  transports: [
	    new (winston.transports.File)({
	      name: 'all',
	      filename: '/log/all.log',
	      level: 'info'
	    }),
	    new (winston.transports.File)({
	      name: 'error',
	      filename: '/log/error.log',
	      level: 'error'
	    })
	  ]
	});

	logger.handleExceptions(new winston.transports.File({ filename: '/log/crash.log'
	}));
}

module.exports=logger;
