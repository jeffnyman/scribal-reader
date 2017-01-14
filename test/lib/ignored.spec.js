'use strict';

var chai = require('chai');
var expect = chai.expect;

var ignored = require('../../lib/ignored');

describe('get ignored files', function() {
  describe('asynchronously', function() {
    it('returns default ignored paths and files', function(done) {
      ignored.getIgnored('test/resources/features', function(err, ignoreList) {
        expect(err).to.be.null;
        expect(ignoreList).to.deep.equal([
          ".scribalignore",
          "SUMMARY.md",
          "scribal.json",
          "woven",
          "materials",
          ".git"
        ]);
        done();
      });
    });

    it('returns specified ignored paths and files', function() {
      ignored.getIgnored('test/resources/specs', function(err, ignoreList) {
        expect(err).to.be.null;
        expect(ignoreList).to.deep.equal([
          ".scribalignore",
          "SUMMARY.md",
          "scribal.json",
          "woven",
          "materials",
          ".git",
          "*.rb"
        ]);
        done();
      });
    });
  });

  describe('synchronously', function() {
    it('returns default ignored paths and files', function() {
      var ignoreList = ignored.getIgnoredSync('test/resources/features');
      expect(ignoreList).to.deep.equal([
        ".scribalignore",
        "SUMMARY.md",
        "scribal.json",
        "woven",
        "materials",
        ".git"
      ]);
    });

    it('returns specified ignored paths and files', function() {
      var ignoreList = ignored.getIgnoredSync('test/resources/specs');
      expect(ignoreList).to.deep.equal([
        ".scribalignore",
        "SUMMARY.md",
        "scribal.json",
        "woven",
        "materials",
        ".git",
        "*.rb"
      ]);
    });
  });
});
