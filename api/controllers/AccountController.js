/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAccountOfUser : async (req,res) => {
    try {
      const id = req.params.id;
      const allAccountsOfUser = await Account.find({owner:id});
      console.log(allAccountsOfUser);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  editAccount : async(req,res)=>{
    try {
      const id = req.params.id;
      const {emailAddress,fullname} = req.body;

      const updatedAccount = await Account.update({id}).set({emailAddress,fullname}).fetch();
      console.log(updatedAccount);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  deleteAccount : async(req,res)=>{
    try {
      const id = req.params.id;
      const deletedAccount = await Account.delete({id}).fetch();
      console.log(deletedAccount);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  createNewAccount : async (req,res)=>{
    try {
      const user = req.user;
      const accountName = req.body.accountName?req.body.accountName:`${user.fullName}'s Account`;
      const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
      const checkForSameName = await Account.findOne({owner:user.id, accountName});

      if (checkForSameName) {
        return res.send({Message:'Name alredy taken!'});
      }

      const createAccount = await Account.create({accountNumber,owner:user.id,accountName}).fetch();
      user.accounts.push(createAccount.id);
      User.update({owner:user.id}).set(user);
      return res.view('pages/expance/account',{expances:[],pandingPatner:[],AcceptPatner:[]});
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },getAccountPage:async (req,res)=>{
    try {
      const user = req.user;
      const accountId = req.params.id;
      const expances = await Expance.find({accountId:accountId.id}).fetch();
      const allRequest = await Patner.find({accountId:accountId.id}).fetch();
      const AcceptPatner = allRequest.filter((request)=>{
        return request.isAccept === true;
      });
      const pandingPatner = allRequest.filter((request)=>{
        return request.isAccept !== true;
      });
      //set isPatner in front for patner tranjection.
      return res.render('pages/expance/expanceAccount',{expances,pandingPatner,AcceptPatner});
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },shareAccount :async (req,res)=>{
    //share by deff collection.
  },getAccountView:async (req,res)=>{
    res.render('pages/expance/expanceAccount');
  }

};

