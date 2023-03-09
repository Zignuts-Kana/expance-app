/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
  // 'GET /welcome': 'UserController.getwelcomePage',
  'GET /': 'UserController.getwelcomePage',
  // 'GET /': {view:'pages/expance/sendPatnerRequest'},
  // 'GET /account':{view:'pages/expance/account'},
  // 'GET /account':'AccountController.getAccountView',
  // 'GET /account/:accountId/edit/:expanceId':'',//edit expance expanceController view

  // 'GET /user/:userId/account/:accountId/patners'
  'GET /user/:id':'UserController.getUserPage',
  // 'GET /account/:id':{action:'account/getaccountofuser'},
  'GET /account/:id':'AccountController.getAccountOfUser',
  'GET /user/:userId/account/:id':'AccountController.getAccountOfUser',//patner page
  'GET /ragister':{view:'pages/ragister'},
  'GET /login':{view:'pages/login'},
  'GET /user/logOut':'UserController.logOut',
  'GET /user/:userId/patner/create':'PatnerController.getPatnerPage',
  'GET /user/:userId/account/:accountId/expance/create': 'ExpanceController.getExpanceCreatePage',
  'GET /account/:accountId/edit/:expanceId': 'ExpanceController.getExpanceCreatePage',
  'GET /user/:userId/account/create': 'AccountController.getAccountPage',
  'GET /user/:userId/accounts':'AccountController.getAllAccountOfSelectUser',//get list of accountName and id
  'GET /account/:accountId/patner/accept/:patnerId': 'PatnerController.reqAccept',//Accept req. database -> true
  'GET /user/:userId/patner/accept/:patnerId': 'PatnerController.reqAccept',//Accept req. of user from user -> true
  'GET /user/:userId/account/edit/:accountId':'AccountController.getAccountPage',//get page
  'GET /user/:userId/account/:accountId/expance/list':'AccountController.getAllExpanceList',//list of expance

  'POST /login': 'UserController.loginUser',
  'POST /ragister': 'UserController.ragisterUser',
  'POST /user/:userId/account/create': 'AccountController.createNewAccount',//create account
  'POST /user/:userId/account/patner/create':'PatnerController.addNewPatnerReq',//create patner
  'POST /user/:userId/account/:accountId/expance/create':'ExpanceController.createExpance',//create Expance
  'POST /user/:userId/account/:accountId/expance/edit/:expanceId':'ExpanceController.editExpance',//edit expance
  'POST /account/:accountId/edit/:expanceId': 'ExpanceController.editExpance',//edit expance 
  'POST /user/:userId/account/edit/:accountId':'AccountController/editAccount',//update account

  //DELETE
  'GET /account/:accountId/delete/:expanceId':{action:'expance/deleteexpance'},//Delete expance
  'GET /account/:accountId/patner/delete/:patnerId':{action:'patner/onrejectreq'},//Delete patner of account -> reject
  'GET /user/:userId/patner/delete/:patnerId':{action:'patner/onrejectreq'},//Delete patner
  'GET /user/:userId/account/:accountId/delete':{action:'account/deleteAccount'},//Delete Account

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
