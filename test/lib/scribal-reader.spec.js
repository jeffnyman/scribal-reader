'use strict';

var chai = require('chai');
var expect = chai.expect;
var EOL = require('os').EOL;

var scribalReader = require('./../../lib/scribal-reader.js');

describe('scribal-reader', function() {
  it('will provide the version', function() {
    expect(scribalReader.getVersion()).to.equal(require('./../../package.json').version);
  });

  it('exposes node constants', function() {
    expect(scribalReader.NODE_FILE).to.equal('file');
    expect(scribalReader.NODE_DIRECTORY).to.equal('directory');
  });

  describe('reading the spec path', function() {
    describe('synchronously', function() {
      it('provides the spec path as an object', function() {
        var structure = scribalReader.readSpecSourceSync('test/resources/specs');
        expectStructure(structure);
      });
    });

    describe('asynchronously', function() {
      it('provides the spec path as an object', function(done) {
        scribalReader.readSpecSource('test/resources/specs', function (err, structure) {
          expect(err).to.be.null;
          expectStructure(structure);
          done();
        });
      });
    });
  });

  describe('reading the metadata', function() {
    describe('synchronously', function() {
      it('returns nothing if there is no scribal metadata', function() {
        var source = scribalReader.readMetadataSync('test/resources/features');
        expect(source).to.be.null;
      });

      it('returns metadata when scribal metadata is present', function() {
        var source = scribalReader.readMetadataSync('test/resources/specs');
        expect(source).to.deep.equal({title: 'Test Specification', product: 'Veilus Sample App'});
      });
    });

    describe('asynchronously', function() {
      it('returns nothing if there is no scribal metadata', function(done) {
        scribalReader.readMetadata('test/resources/features', function(err, metadata) {
          expect(err).to.be.null;
          expect(metadata).to.be.null;
          done();
        });
      });

      it('returns metadata when scribal metadata is present', function(done) {
        scribalReader.readMetadata('test/resources/specs', function(err, metadata) {
          expect(metadata).to.deep.equal({title: 'Test Specification', product: 'Veilus Sample App'});
          done();
        });
      });
    });
  });

  describe('reading a feature', function() {
    describe('synchronously', function() {
      it('returns the feature object for any valid feature file', function() {
        var feature = scribalReader.readFeatureSync('test/resources/features/triangles.feature');
        expectFeatureStructure(feature);
      });

      it('will not parse an invalid feature file', function() {
        expect(function() {
          scribalReader.readFeatureSync('test/resources/features/invalid.feature');
        }).to.throw();
      });

      it('will indicate an error for absent feature files', function() {
        expect(function() {
          scribalReader.readFeatureSync('non-existent.feature');
        }).to.throw(Error);
      });
    });

    describe('asynchronously', function() {
      it('returns the feature object for any valid feature file', function(done) {
        scribalReader.readFeature('test/resources/features/triangles.feature', function(err, feature) {
          expect(err).to.not.exist;
          expectFeatureStructure(feature);
          done();
        });
      });

      it('will not parse an invalid feature file', function(done) {
        scribalReader.readFeature('test/resources/features/invalid.feature', function(err) {
          expect(err).to.exist;
          done();
        });
      });

      it('will indicate an error for absent feature files', function(done) {
        scribalReader.readFeature('non-existent.feature', function(err) {
          expect(err).to.exist;
          done();
        });
      });
    });
  });

  describe('reading the summary file', function() {
    describe('synchronously', function() {
      it('returns nothing if there is no summary file', function() {
        var summary = scribalReader.readSummarySync('NoSummary');
        expect(summary).to.be.null;
      });

      it('returns the contents of the summary file', function() {
        var summary = scribalReader.readSummarySync('test/resources/specs');
        expect(summary).to.equal('# Test Specification' + EOL);
      });
    });

    describe('asynchronously', function() {
      it('returns nothing if there is no summary file', function(done) {
        scribalReader.readSummary('NoSummary', function(err, summary) {
          expect(err).to.be.null;
          expect(summary).to.be.null;
          done();
        });
      });

      it('returns the contents of the summary file', function(done) {
        scribalReader.readSummary('test/resources/specs', function(err, summary) {
          expect(err).to.be.null;
          expect(summary).to.equal('# Test Specification' + EOL);
          done();
        });
      });
    });
  });

  function expectStructure(structure) {
    expect(structure).to.deep.equal({
      "path": ".",
      "name": "specs",
      "displayName": "Specs",
      "type": "directory",
      "children": [
        {
          "path": 'test.feature',
          "name": 'test.feature',
          "displayName": 'Test',
          "type": 'file'
        }
      ]
    });
  };

  function expectFeatureStructure(structure) {
    expect(structure.feature.type).to.equal('Feature');
    expect(structure.feature.name).to.equal('Triangle Calculation');
    expect(structure.feature.keyword).to.equal('Feature');

    expect(structure.feature.children).to.have.deep.property('[0].type', 'Scenario');
    expect(structure.feature.children).to.have.deep.property('[0].name', 'Scalene');
    expect(structure.feature.children).to.have.deep.property('[0].keyword', 'Scenario');

    expect(structure.feature.children).to.have.deep.property('[0].steps[0].type', 'Step');
    expect(structure.feature.children).to.have.deep.property('[0].steps[0].keyword', 'Given ');
    expect(structure.feature.children).to.have.deep.property('[0].steps[0].text', 'the length values 10, 8, 3');

    expect(structure.feature.children).to.have.deep.property('[0].steps[1].type', 'Step');
    expect(structure.feature.children).to.have.deep.property('[0].steps[1].keyword', 'When ');
    expect(structure.feature.children).to.have.deep.property('[0].steps[1].text', 'the triangle is calculated');

    expect(structure.feature.children).to.have.deep.property('[0].steps[2].type', 'Step');
    expect(structure.feature.children).to.have.deep.property('[0].steps[2].keyword', 'Then ');
    expect(structure.feature.children).to.have.deep.property('[0].steps[2].text', 'the triangle type is "scalene"');
  };
});
