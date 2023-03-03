/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,
  'welocome':'is-logged-in',
  AccountController:{
    '*': 'is-logged-in',
  },
  ExpanceController:{
    '*':'is-logged-in',
  },
  PatnerController:{
    '*':'is-logged-in',
  },
  UserController:{
    '*':'is-logged-in',
    'ragisterUser':true,
    'loginUser':true,
    "getwelcomePage":true,
  }

};
