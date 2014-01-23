define([
  "require"
], function (require) {

  "use strict";

  /**
   * Provides an interface for interacting with an array of FAMModels.
   * @class FAMCollection
   * @constructor
   * @param {Object.<string, *>} [options] passes options to the constructor.
   * @param {FAMModel[]} [options.models] List of FAMModels
   * 
   * @example
   *     var modelOptions = {
   *           rdt: serverRDT // Can use hostURL or not. This example has "https://somehost.com" set as the hostURL.
   *           resource: 'users/2'
   *         },
   *         user = new FAMModel(modelOptions);
   *     var collectionOptions = { 
   *           models: [user]
   *         }
   *     var users = new FAMCollection(collectionOptions)
   *
   *     users.save();
   *
   *     //Calls Save on each FAMModel
   * @example
   *
   *     var modelOptions = {
   *           rdt: serverRDT // Can use hostURL or not. This example has "https://somehost.com" set as the hostURL.
   *           resource: 'users/2'
   *         },
   *         user = new FAMModel(modelOptions);
   *     var collectionOptions = { 
   *           models: [user]
   *         }
   *     var users = new FAMCollection(collectionOptions)
   *
   *     users.destroy();
   *
   *     //Calls Save on each FAMModel
   * 
   * @example
   *
   *     var modelOptions = {
   *           rdt: serverRDT // Can use hostURL or not. This example has "https://somehost.com" set as the hostURL.
   *           resource: 'users/2'
   *         },
   *         user = new FAMModel(modelOptions);
   *     var collectionOptions = { 
   *           models: [user] 
   *         }
   *     var users = new FAMCollection(collectionOptions)
   *
   *     users.fetch();
   *
   *     //Calls Fetch on each FAMModel
   * 
   */
  return function FAMCollection(options) {

    options = options || {};
    this.save = save;
    this.destroy = destroy;
    this.fetch = fetch;

    /**
     * Fetch models from the server
     * @method  fetch 
     * @param  {Function(error, data)} [callback] nodejs-style callback. Called when all models have been fetched from the server.
     */
    function fetch(callback) {
    }

    /**
     * Save changes on the models to the server.
     * @method save
     * @param  {Function(error, data)} [callback] nodejs-style callback. Called when all models have been saved to the server.
     */
    function save(callback) {
    }

    /**
     * Destroys the modeles from the server
     * @method  destroy
     * @param  {Function(error, data)} [callback] nodejs-style callback. Called when all models have been destroyed from the server
     */
    function destroy(callback) {
    }

  };

});
