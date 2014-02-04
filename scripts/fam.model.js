define([
  "require",
  "./require_underscore"
], function (require, _) {

  "use strict";

  /**
   * Provides an ORM interface for a FAM resource. Can use Reliable Data Transport to associate model with remote resource.
   * @class FAMModel
   * @constructor
   * @param {Object.<string, *>} [options] passes options to the constructor.
   * @param {FAMRDT} [options.rdt] If using FAM Reliable Data Transport (FAMRDT) as the data source, pass the instantiated rdt object here.
   * @param {string} [options.resource] Absolute path from host root to resource location. (i.e. "users/2"). If RDT provided does not have a hostURL associated, you will have to provide the full URL including host (i.e. "https://somehost.com/users/2").
   * @param {string} [options.resourceId] Unique identifier for the resource in the server.
   * 
   * @example
   *
   *     // No Data Source; Generic Model
   *
   *     var modelOptions = {},
   *         user = new FAMModel(modelOptions);
   *
   *     user.get("firstName"); // null
   *     user.set("firstName", 'Bob');
   *     user..get("firstName"); // 'Bob'
   *
   *     user.set("postalCode") = '90210';
   *     user.get("postalCode"); // '90210'
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
   *           resource: 'users/2',
   *           jsonRoot: 'user'
   *         },
   *         user = new FAMModel(modelOptions);
   *
   *     user.firstName; // returns null, as the data has not yet been fetched.
   *
   *     user.fetch(dataReady);
   *     function dataReady(error, data) {
   *       if(error){ throw error; return; }
   *
   *       user.get("firstName"); // returns "John", as the data has now been fetched and is available.
   *
   *       user.set("firstName") = 'Bob';
   *
   *       user.save(afterSave);
   *       function afterSave (error, data) {
   *         if(error){ throw error; return; }
   *         
   *         // User was saved with new firstName as 'Bob'
   *       }
   *     }
   */
  var FamModel = function (resourceName, options) {

    /**
     * Referencing copy of the options passed to the constructor, made public so that options can be changed after instantiation.
     * @property options
     * @type {object.<string, *>}
     */
    options = options || {};
    var rdt = options.rdt;
    var resource = options.resource;
    var resourceId = options.id;
    var attributes = {};
    var resourcePath = options.resourcePath || this.resourcePath;
    var jsonRoot = options.jsonRoot || this.jsonRoot;

    this.save = save;
    this.destroy = destroy;
    this.fetch = fetch;
    this.set = set;
    this.get = get;
    this.resourceUrl = resourceUrl;
    this.initialize = initialize;

    /**
     * Fetch model data from data source
     * @method fetch
     * @param {Function(error, data)} [callback] nodejs-style callback. Called when data has completed fetching from the data source.
     */

    function fetch(callback) {
      checkRequirements();
      rdt.get(resourceUrl(), function (response){
                          var aux_attributes = JSON.parse(response)[jsonRoot];
                          for(var attr in aux_attributes)
                          {
                            if(aux_attributes.hasOwnProperty(attr))
                            {
                              set(attr, aux_attributes[attr]);
                            }
                          }
                          callback(response);
                        });
    }

    /**
     * Save changes on the model to the server.
     * @method save
     * @param  {Function(error, data)} [callback] nodejs-style callback. Called when data has completed saving on the server.
     */
    function save(callback) {
      checkRequirements();
      rdt.post(resourceUrl(), {}, callback);
    }

    /**
     * Returns the URL for the resource based on either the resource or the resourcePath and resourceId
     * @method resourceUrl
     */
    function resourceUrl(){
      if(resource != null){
        return resource;
      }else if(resourceId != null && resourcePath != null){
        return this.resourcePath + "/" + resourceId;
      }else{
        return null;
      }
    }

    /**
     * Delete a single resource from the server.
     * @method  delete
     * @param  {Function(error, data)} [callback] nodejs-style callback. Called when data has completed deleting on the server.
     */
    function destroy(callback) {
      checkRequirements();
      rdt.destroy(resourceUrl(), callback);
    }

    function initialize(){
    
    }

    function set(attr, value){
      attributes[attr] = value;
    }

    function get(attr){
      return attributes[attr];
    }
    
    function checkRequirements(){
      if(rdt == null || resourceUrl() == null){
        throw new Error("Model cannot make changes to the server without an RDT, and a Resource path. See documentation for details.");
      }
    }
  };

  FamModel.extend = function(protoProps, staticProps){
    var parent = this;
    var child;

    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ 
        var args = Array.prototype.slice.call(arguments);
        args.unshift(protoProps.name);
        return parent.apply(this, args); 
      };
    }
    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  return FamModel;

});
