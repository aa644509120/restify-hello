'use strict';

const fs = require('fs');
const winston=require('winston');
const moment = require('moment');
const stackTrace = require('stack-trace');

const dateFormat=function() {
	return moment().format('YYYY-MM-DD HH:mm:ss:SSS');
};	

// 开发阶段使用的logger
let logger = new (winston.Logger)({
    transports: [
    	new winston.transports.Console({
			timestamp:dateFormat
		})
    ]
});


// 如果有／log目录，说明在docker环境下，创建基于文件的logger
if (fs.existsSync('/log')){
	const allLoggerTransport=new (winston.transports.File)({
      name: 'all',
      filename: '/log/all.log',
      timestamp:dateFormat,
      level: 'info'
    });
    const errorTransport=new (winston.transports.File)({
      name: 'error',
      filename: '/log/error.log',
      timestamp:dateFormat,
      level: 'error'
    });
    logger=new (winston.Logger)({
	  transports: [
	    allLoggerTransport,
	    errorTransport
	  ]
	});

    // 崩溃日志
	const crachLogger= new (winston.Logger)({
    	transports: [
	      	new (winston.transports.File)({
		      name: 'error',
		      filename: '/log/crash.log',
		      level: 'error',
		      handleExceptions: true,
      		  timestamp:dateFormat,
      		  humanReadableUnhandledException: true,
      		  json: false      		
		    })
	    ]
	});

	logger.sharedTransports=[allLoggerTransport,errorTransport];
}

// 代理logger.error方法，加入文件路径和行号信息
let originalMethod=logger.error;
logger.error=function(){
	let cellSite=stackTrace.get()[1];
	originalMethod.apply(logger,[arguments[0]+'\n',{filePath:cellSite.getFileName(),lineNumber:cellSite.getLineNumber()}]);
}

module.exports=logger;
