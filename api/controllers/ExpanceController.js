/**
 * ExpanceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAllExpanceOfAccount : async (req,res)=>{
    try {
      // const user = req.user;
      const accountId = req.params.id;
      const expances = await Expance.find({accountId}).select('amount isDebited isPatner accountId owner');
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
      const expances = await Expance.find({owner:owner.id,accountId}).select('amount isDebited isPatner accountId owner');
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
      const expances = await Expance.find({isPatner:true,owner:owner.id,patnerId}).select('amount isDebited isPatner patnerId accountId owner');
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
      let owner = req.user;
      let patnerId;
      const accountId = req.params.id;
      const {isDebit,amount} = req.body;
      const isShared = req.body.isShared?req.body.isShared:undefined;
      if (isShared) {
        patnerId = owner.id;
        owner = await Account.findOne({id:req.params.id}).select('owner -_id');
      }
      const expance = await Expance.create({amount,isDebit,isShared,patnerId,accountId,owner:owner.id}).fetch();
      console.log(expance);
      // res.view('')
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  editUser : async(req,res)=>{
    try {
      const owner = req.user;
      const id = req.params.id;
      const {isDebit,amount} = req.body;
      const isShared = req.body.isShared?req.body.isShared:undefined;
      let {accountId,patnerId} = await Expance.findOne({id:req.params.id}).select('accountId patnerId -id');
      if (isShared) {
        patnerId = owner.id;
        owner = await Account.findOne({id:req.params.id}).select('owner -_id');
      }
      const updatedUser = await Expance.update({id}).set({amount,isDebit,isShared,patnerId,accountId,owner:owner.id}).fetch();
      console.log(updatedUser);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  deleteUser : async(req,res)=>{
    try {
      const id = req.params.id;
      const deletedUser = await Expance.delete({id}).fetch();
      console.log(deletedUser);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

};

