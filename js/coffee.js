var d3 = require("d3"), _ = require("underscore"), fs = require("fs");
eval(fs.readFileSync('js/mapper.js').toString());

var inputFile = 'data/coffee.csv';
var matrixOut = 'data/coffee-matrix.json';
var mapOut = 'data/coffee-map.json';

//****************************************************
//  READ IN DATA - USE D3 TO PARSE CSV
//****************************************************
fs.readFile(inputFile, 'utf8', function (err, file) {
  var data = d3.csv.parse(file);

  //****************************************************
  //  CREATE MATRIX AND MAP
  //****************************************************
  var mpr = chordMpr(data);

  mpr.addValuesToMap('state', 'state')
    .addValuesToMap('entity', 'company')
    .setFilter(function (row, a, b) {
      return (row.entity === a.name && row.state === b.name) ||
             (row.entity === b.name && row.state === a.name);
    })
    .setAccessor(function (recs, a, b) {
      if (!recs[0]) return 0;
      return recs.length;
    });

  //****************************************************
  //  SAVE MATRIX AND MAP TO FILE (JSON)
  //****************************************************
  fs.writeFile(matrixOut, JSON.stringify(mpr.getMatrix()), function(err) {
    if(err) { 
      console.log(err); 
    } else {
      console.log(matrixOut + " saved");
    }
  });

  fs.writeFile(mapOut, JSON.stringify(mpr.getMap()), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log(mapOut + " saved");
    }
  });
});