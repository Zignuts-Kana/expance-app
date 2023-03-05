/**
 * ExpanceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getExpanceCreatePage : async (req,res)=>{
    try {
      const expanceId = req.params.expanceId;
      if(!expanceId){
        return res.view('pages/expance/createExpance');
      }
      const expance = await Expance.findOne({id:expanceId});
      return res.view('pages/expance/editExpance',{expance});
    } catch (error) {
      console.log(error);
      return res.status(500).send({Error:error});
    }
  },
  getAllExpanceOfAccount : async (req,res)=>{
    try {
      // const user = req.user;
      const accountId = req.params.id;
      const expances = await Expance.find({accountId});
      console.log(expances);
      let credit=0; let debit=0;
      expances.forEach(expance => {
        if (expance.isDebited) {
          debit = debit+expance.amount;
        }else{
          credit = credit+expance.amount;
        }
      });
      console.log(credit , ' <-> ' , debit);
      // res.view('')
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },getAllExpanceOfUser : async (req,res)=>{
    try {
      const owner = req.user;
      const accountId = req.params.id;
      const expances = await Expance.find({owner:owner.id,accountId});
      console.log(expances);
      let credit=0; let debit=0;
      expances.forEach(expance => {
        if (expance.isDebited) {
          debit = debit+expance.amount;
        }else{
          credit = credit+expance.amount;
        }
      });
      console.log(credit , ' <-> ' , debit);
      // res.view('')
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },getAllExpanceOfPatner : async (req,res)=>{
    try {
      const owner = req.user;
      const patnerId = req.params.id;
      const expances = await Expance.find({isPatner:true,owner:owner.id,patnerId});
      console.log(expances);
      let credit=0; let debit=0;
      expances.forEach(expance => {
        if (expance.isDebited) {
          debit = debit+expance.amount;
        }else{
          credit = credit+expance.amount;
        }
      });
      console.log(credit , ' <-> ' , debit);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  createExpance:async(req,res)=>{
    try {
      let user = req.user;
      let isPatner;
      const accountId = req.params.accountId;
      const {isDebited,amount} = req.body;
      const account = await Account.findOne({id:accountId});
      if (!account) {
        return res.status(400).send({Message:'Account not found!'});
      }
      if (account.owner != user.id) {
        isPatner='true';
      }
      const expance = await Expance.create({amount,isDebited:isDebited == 'on'?true:false,isPatner:isPatner?true:undefined,patnerId:isPatner?user.id:undefined,accountId,owner:account.owner,patnerEmail:isPatner?user.emailAddress:undefined}).fetch();
      return res.status(201).json(expance);
      // res.view('')
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  editExpance : async(req,res)=>{
    try {
      const user = req.user;
      const expanceId = req.params.expanceId;
      const expance = await Expance.findOne({id:expanceId});
      if (!expance) {
        return res.status(400).send({Message:'Record not found!'});
      }
      const accountId = req.params.accountId;
      const {isDebited,amount} = req.body;
      let isPatner;
      const account = await Account.findOne({id:accountId});
      if (!account) {
        return res.status(400).send({Message:'Account not Found!'});
      }
      if (account.owner != user.id) {
        isPatner:true;
      }
      const expanceUpdated = await Expance.create({amount,isDebited:isDebited == 'on'?true:false,isPatner:isPatner?true:undefined,patnerId:isPatner?user.id:undefined,accountId,owner:account.owner,patnerEmail:isPatner?user.emailAddress:undefined}).fetch();
      return res.status(201).json(expanceUpdated);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  deleteExpance : async(req,res)=>{
    try {
      const id = req.params.expanceId;
      const accountId = req.params.accountId ? req.params.accountId : undefined;
      const deletedExpance = await Expance.destroy({id}).fetch();
      console.log(deletedExpance);
      return res.redirect(`http://localhost:1337/account/${accountId}`);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

};

