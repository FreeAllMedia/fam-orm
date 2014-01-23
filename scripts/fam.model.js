define([
  "require"
], function (require) {

  "use strict";

  /**
   * Provides an ORM interface for a FAM resource. Can use Reliable Data Transport to associate model with remote resource.
   * @class FAMModel
   * @constructor
   * @param {Object.<string, *>} [options] passes options to the constructor.
   * @param {FAMRDT} [options.rdt] If using FAM Reliable Data Transport (FAMRDT) as the data source, pass the instantiated rdt object here.
   * @param {string} [options.resource] Absolute path from host root to resource location. (i.e. "users/2"). If RDT provided does not have a hostURL associated, you will have to provide the full URL including host (i.e. "https://somehost.com/users/2").
   * 
   * @example
   *
   *     // No Data Source; Generic Model
   *
   *     var modelOptions = {},
   *         user = new FAMModel(modelOptions);
   *
   *     user.firstName; // null
   *     user.firstName = 'Bob';
   *     user.firstName; // 'Bob'
   *
   *     user.postalCode = '90210';
   *     user.postalCode; // '90210'
   *
   *     user.fetch(); // raises Error('Model cannot fetch without an RDT, and a Resource Path. See documentation for details.');
   *
   *     user.save(); // raises Error('Model cannot save without an RDT, and a Resource Path. See documentation for details.');
   *
   * @example
   *
   *     // With Reliable Data Transport
   * 
   *     var modelOptions = {
   *           rdt: serverRDT // Can use hostURL or not. This example has "https://somehost.com" set as the hostURL.
   *           resource: 'users/2'
   *         },
   *         user = new FAMModel(modelOptions);
   *
   *     user.firstName; // returns null, as the data has not yet been fetched.
   *
   *     user.fetch(dataReady);
   *     function dataReady(error, data) {
   *       if(error){ throw error; return; }
   *
   *       user.firstName; // returns "John", as the data has now been fetched and is available.
   *
   *       user.firstName = 'Bob';
   *
   *       user.save(afterSave);
   *       function afterSave (error, data) {
   *         if(error){ throw error; return; }
   *         
   *         // User was saved with new firstName as 'Bob'
   *       }
   *     }
   */
  return function FAMModel(resourceName, options) {

    /**
     * Referencing copy of the options passed to the constructor, made public so that options can be changed after instantiation.
     * @property options
     * @type {object.<string, *>}
     */
    options = options || {};
    var rdt = options.rdt;
    var resource = options.resource;

    this.save = save;
    this.destroy = destroy;
    this.fetch = fetch;

    /**
     * Fetch model data from data source
     * @method fetch
     * @param {Function(error, data)} [callback] nodejs-style callback. Called when data has completed fetching from the data source.
     */
    
    function checkRequirements(){
      if(rdt == null || resource == null){
        throw new Error("Model cannot make changes to the server without an RDT, and a Resource path. See documentation for details.");
      }
    }

    function fetch(callback) {
      checkRequirements();
      rdt.get(resource, callback);
    }

    /**
     * Save changes on the model to the server.
     * @method save
     * @param  {Function(error, data)} [callback] nodejs-style callback. Called when data has completed saving on the server.
     */
    function save(callback) {
      checkRequirements();
      rdt.post(resource, {}, callback);
    }

    /**
     * Delete a single resource from the server.
     * @method  delete
     * @param  {Function(error, data)} [callback] nodejs-style callback. Called when data has completed deleting on the server.
     */
    function destroy(callback) {
      checkRequirements();
      rdt.destroy(resource, callback);
    }

  };

});
