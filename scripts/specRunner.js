require.config({
  baseUrl:'',
  urlArgs: "v="+(new Date()).getTime()
});

// Require libraries
require(['require', 'node_modules/mocha/mocha', 'node_modules/sinon/pkg/sinon', 'node_modules/chai/chai'], function(require, _, _, chai){

  // Mocha
  mocha.setup('bdd');
  expect = chai.expect;

  // Require base tests before starting
  require(['test/fam.model', 'test/fam.collection'], function(fam_model){
    if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
    else { mocha.run(); }
  });

});
