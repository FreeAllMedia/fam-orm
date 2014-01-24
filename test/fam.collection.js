define(['../scripts/fam.collection.js'], function(FamCollection){

  describe('FamCollecion', function(){

    var fam_collection;

    describe('destroy', function(){
        
      var models;

      beforeEach(function(){
        models = [{destroy: function(){}},{destroy: function(){}}];
        fam_collection = new FamCollection({models: models});
      });

      it('should call destroy on each of it\'s models ', function(){
        mocks = [];
        for(var i = 0; i < models.length; i++) {
          mock = sinon.mock(models[i]);
          mock.expects("destroy");
          mocks.push(mock);
        }
        fam_collection.destroy();
        for(i = 0; i < mocks.length; i++) {
          mocks[i].verify();
        }
      });
    });


    describe('save', function(){
        
      var models;

      beforeEach(function(){
        models = [{save: function(){}},{save: function(){}}];
        fam_collection = new FamCollection({models: models});
      });

      it('should call fetch on each of it\'s models ', function(){
        mocks = [];
        for(var i = 0; i < models.length; i++) {
          mock = sinon.mock(models[i]);
          mock.expects("save");
          mocks.push(mock);
        }
        fam_collection.save();
        for(i = 0; i < mocks.length; i++) {
          mocks[i].verify();
        }
      });
    });

    describe('fetch', function(){
        
      var models;

      beforeEach(function(){
        models = [{fetch: function(){}},{fetch: function(){}}];
        fam_collection = new FamCollection({models: models});
      });

      it('should call fetch on each of it\'s models ', function(){
        mocks = [];
        for(var i = 0; i < models.length; i++) {
          mock = sinon.mock(models[i]);
          mock.expects("fetch");
          mocks.push(mock);
        }
        fam_collection.fetch();
        for(i = 0; i < mocks.length; i++) {
          mocks[i].verify();
        }
      });
    });
  });
});
