define(['../scripts/fam.model.js'], function(FamModel){

  describe('FamModel', function(){

    var fam_model;
    beforeEach(function() {
      fam_model = new FamModel();
    });

    describe('set/get', function(){
      it('should set the attribute', function(){
        expect(fam_model.get('firstName')).to.be.undefined;
        fam_model.set('firstName', 'test');
        expect(fam_model.get('firstName')).to.eql('test');
      });

    });

    describe('destroy', function(){

      describe('with rdt defined', function(){
        var mock;
        var rdt = { destroy: function(url, callback){ callback(); } };

        beforeEach(function() {
          fam_model = new FamModel("user", {resource: 'users/2', rdt: rdt});
        });

        it('should send a destroy request', function(){
          mock = sinon.mock(rdt);
          mock.expects("destroy");
          fam_model.destroy();
          mock.verify();
        });

        it('should process the callback', function(){
          callback = sinon.spy();
          fam_model.destroy(callback);
          expect(callback.called).to.eql(true);
        });
      });

      it('should raise an error', function(){
        expect(fam_model.destroy).to.throw(Error,"Model cannot make changes to the server without an RDT, and a Resource path. See documentation for details.");
      });

    });

    describe('save', function(){
      describe('with rdt defined', function(){
        var mock;
        var rdt = { post: function(resource, attributes, callback){ callback(); } };

        beforeEach(function() {
          fam_model = new FamModel("user", {resource: 'users/2', rdt: rdt});
        });

        it('should send a post request', function(){
          mock = sinon.mock(rdt);
          mock.expects("post");
          fam_model.save();
          mock.verify();
        });

        it('should process the callback', function(){
          callback = sinon.spy();
          fam_model.save(callback);
          expect(callback.called).to.eql(true);
        });
      });

      it('should raise an error', function(){
        expect(fam_model.save).to.throw(Error,"Model cannot make changes to the server without an RDT, and a Resource path. See documentation for details.");
      });
    });


    describe('fetch', function(){
      describe('with rdt defined', function(){
        var mock;
        var rdt = { get: function(url, callback){ callback('{"user":{"firstName":"test","lastName":"spec"}}'); } };

        beforeEach(function() {
          fam_model = new FamModel("user", {jsonRoot:'user', resource: 'users/2', rdt: rdt});
        });

        it('should send a get request', function(){
          mock = sinon.mock(rdt);
          mock.expects("get");
          fam_model.fetch();
          mock.verify();
        });

        it('should process the callback', function(){
          callback = sinon.spy();
          fam_model.fetch(callback);
          expect(callback.called).to.eql(true);
        });

        it('should set the attributes', function(){
          fam_model.fetch(function(){});
          expect(fam_model.get('firstName')).to.eql('test');
          expect(fam_model.get('lastName')).to.eql('spec');
        });
      });

      it('should raise an error', function(){
        expect(fam_model.fetch).to.throw(Error,"Model cannot make changes to the server without an RDT, and a Resource path. See documentation for details.");
      });
    });

  });
});
