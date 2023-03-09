/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAccountPage:async(req,res)=>{
    try {
      const accountId = req.params.accountId;
      if (!accountId) {
        return res.view('pages/expance/createAccount');
      }
      const account = await Account.findOne({id:accountId});
      return res.view('pages/expance/updateAccount',{account});
    } catch (error) {
      console.log(error);
      return res.status(500).send({Error:error});
    }
  },
  getAllAccountOfSelectUser:async (req,res)=>{
    try {
      const userId = req.params.userId;
      const accounts = await Account.find({owner:userId});
      return res.status(200).json(accounts);
    } catch (error) {
      console.log(error);
      return res.status(500).send({Error:error});
    }
  },
  getAccountOfUser : async (req,res) => {
    try {
      const id= req.params.id;
      const userId = req.params.userId ? req.params.userId:undefined;
      let patner;
      if (userId) {
        patner = await User.findOne({id:userId});
      }
      const account = await Account.findOne({id});
      if (!account) {
        return res.status(400).send({Message:'Account Not Found!'});
      }
      //check for owner and give access
      const user = await User.findOne({id:account.owner});
      let expances = await Expance.find({accountId:id}).sort('createdAt DESC');
      let credit=0; let debit=0;
      if (patner) {
        expances = expances.filter((expance)=>expance.patnerId == userId);
      }
      expances.forEach(expance => {
        if (expance.isDebited) {
          debit = debit+expance.amount;
        }else{
          credit = credit+expance.amount;
        }
      });
      expnaces  = expances.slice(0,10);
      const allRequest = await Patner.find({accountId:id});
      const acceptPatner = allRequest.filter((request)=>{
        return request.isAccept == true;
      });
      const pandingPatner = allRequest.filter((request)=>{
        return request.isAccept != true && (request.owner == account.owner) && (id == request.accountId);
      });
      //set isPatner in front for patner tranjection.
      return res.view('pages/expance/account',{user,storeUserAndToken:patner?patner:user,account,expances,pandingPatner,patnerWiths:acceptPatner,patner:patner?patner:undefined,debit,credit});
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  editAccount : async(req,res)=>{
    try {
      const id = req.params.accountId;
      const {accountName} = req.body;

      const updatedAccount = await Account.update({id}).set({accountName}).fetch();
      res.status(200).json(updatedAccount);
      console.log(updatedAccount);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  deleteAccount : async(req,res)=>{
    try {
      const id = req.params.id;
      const deletedAccount = await Account.destroy({id}).fetch();
      console.log(deletedAccount);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  createNewAccount : async (req,res)=>{
    try {
      const user = req.user ? req.user :req.params.userId?req.params.userId:undefined;
      const accountName = req.body.accountName?req.body.accountName:`${user.fullName}'s Account`;
      const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
      const checkForSameName = await Account.findOne({owner:user.id, accountName});

      if (checkForSameName) {
        return res.status(400).send({Message:'Name alredy taken!'});
      }

      const createAccount = await Account.create({accountNumber,owner:user.id,accountName}).fetch();
      if(user.accounts && user.accounts.length){
        user.accounts.push(createAccount.id);
      }else{
        user.accounts = [createAccount.id];
      }
      await User.update({id:user.id}).set(user);
      // return res.view('pages/expance/account',{expances:[],pandingPatner:[],AcceptPatner:[]});
      return res.redirect(`/account/${createAccount.id}`);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },getAllExpanceList:async(req,res)=>{
    try {
      const userId = req.params.userId;
      const user = await User.findOne({id:userId});
      const accountId = req.params.accountId;
      const account = await Account.findOne({id:accountId});
      let patner;
      if (account.owner !== userId) {
        patner = user;
      }
      let expances = await Expance.find({accountId}).sort('createdAt DESC');
      let credit=0; let debit=0;
      if (patner) {
        expances = expances.filter((expance)=>expance.patnerId == userId);
      }
      expances.forEach(expance => {
        if (expance.isDebited) {
          debit = debit+expance.amount;
        }else{
          credit = credit+expance.amount;
        }
      });
      return res.view('pages/expance/expanceList',{account,user,expances,patner,debit,credit});
    } catch (error) {
      console.log(error);
      return res.status(500).send({Error:error});
    }
  },
  // getAccountPage:async (req,res)=>{
  //   try {
  //     const user = req.user;
  //     const accountId = req.params.id;
  //     const expances = await Expance.find({accountId:accountId.id}).fetch();
  //     const allRequest = await Patner.find({accountId:accountId.id}).fetch();
  //     const AcceptPatner = allRequest.filter((request)=>{
  //       return request.isAccept === true;
  //     });
  //     const pandingPatner = allRequest.filter((request)=>{
  //       return request.isAccept !== true;
  //     });
  //     //set isPatner in front for patner tranjection.
  //     return res.view('pages/expance/account',{expances,pandingPatner,AcceptPatner});
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).send(error);
  //   }
  // },

};

