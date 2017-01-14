'use strict';

var fs = require('fs');
var path = require('path');

var pkg = require('../package.json');
var constants = require('./constants');
var ignored = require('./ignored');
var walker = require('./walker');

var minimatch = require('minimatch');
var gherkin = require('scribal-gherkin');

function getVersion() {
  return pkg.version;
}

function readSpecSourceSync(specPath) {
  var ignoredFiles = ignored.getIgnoredSync(specPath);
  return walker.walkPathSync(specPath, ignoredFilesFilter(ignoredFiles));
}

function readSpecSource(specPath, cb) {
  ignored.getIgnored(specPath, function(err, ignoredFiles) {
    if (err) {
      return cb(err);
    };
    walker.walkPath(specPath, ignoredFilesFilter(ignoredFiles), function(ex, structure) {
      if (ex) {
        return cb(ex);
      };
      cb(null, structure);
    });
  });
}

function readMetadataSync(specPath) {
  var source = path.join(specPath, constants.SCRIBAL_METADATA_FILE);
  try {
    fs.statSync(source);
    return JSON.parse(fs.readFileSync(source, constants.DEFAULT_FILE_ENCODING));
  } catch(err) {
    return null;
  }
}

function readMetadata(specPath, cb) {
  var source = path.join(specPath, constants.SCRIBAL_METADATA_FILE);

  fs.stat(source, function(err) {
    if (err) {
      return cb(null, null);
    } else {
      fs.readFile(source, constants.DEFAULT_FILE_ENCODING, function (ex, fileContents) {
        if (ex) {
          return cb(err);
        } else {
          return cb(null, JSON.parse(fileContents));
        }
      });
    }
  });
}

function readFeatureSync(source) {
  return gherkin.parse(fs.readFileSync(source, constants.DEFAULT_FILE_ENCODING));
}

function readFeature(source, cb) {
  fs.readFile(source, constants.DEFAULT_FILE_ENCODING, function(err, contents) {
    if (err) {
      return cb(err);
    }
    try {
      return cb(null, gherkin.parse(contents));
    } catch(ex) {
      return cb(ex);
    }
  });
}

function readSummarySync(repoPath) {
  var summaryFile = path.join(repoPath, constants.SCRIBAL_SUMMARY_FILE);

  if (fs.existsSync(summaryFile)) {
    return fs.readFileSync(summaryFile, constants.DEFAULT_FILE_ENCODING);
  }

  return null;
}

function readSummary(repoPath, cb) {
  var summaryFile = path.join(repoPath, constants.SCRIBAL_SUMMARY_FILE);

  fs.stat(summaryFile, function(err) {
    if (err) {
      return cb(null, null);
    } else {
      fs.readFile(summaryFile, constants.DEFAULT_FILE_ENCODING, function(err, summary) {
        if (err) {
          return cb(err);
        } else {
          return cb(null, summary);
        }
      });
    }
  });
}

function ignoredFilesFilter(files) {
  return function(dir, file) {
    var fullPath = path.join(dir, file);
    for (var i = 0; i < files.length; i++) {
      var pattern = files[i];
      if (minimatch(fullPath, pattern) || minimatch(file, pattern)) {
        return false;
      };
    };
    return true;
  };
}

module.exports = {
  getVersion: getVersion,
  readSpecSourceSync: readSpecSourceSync,
  readSpecSource: readSpecSource,
  readMetadataSync: readMetadataSync,
  readMetadata: readMetadata,
  readFeatureSync: readFeatureSync,
  readFeature: readFeature,
  readSummarySync: readSummarySync,
  readSummary: readSummary,
  NODE_FILE: constants.WALKER_NODE_FILE,
  NODE_DIRECTORY: constants.WALKER_NODE_DIRECTORY
}
