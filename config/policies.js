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
  AccountController:{
    '*': 'is-logged-in',
    'getAccountOfUser':true,
    'getAccountPage':true,
    'getAllExpanceList':true,
  },
  ExpanceController:{
    '*':'is-logged-in',
    'getExpanceCreatePage':true,
  },
  PatnerController:{
    '*':'is-logged-in',
    'getPatnerPage':true,
  },
  UserController:{
    '*':'is-logged-in',
    'ragisterUser':true,
    'loginUser':true,
    'getUserPage':true,
    // "getwelcomePage":true,
  },
  // 'expance/*':'is-logged-in',

};
