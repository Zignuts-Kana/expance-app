/**
 * PatnerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  addNewPatnerReq : async (req,res)=>{
    try {
      const owner = req.user;
      const patnerEmail = req.body.email;
      const accountId = req.params.id;
      const patnerReq = await Patner.create({accountId,owner:owner.id,patnerEmail}).fetch();
      console.log(patnerReq);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },reqAccept : async (req,res)=>{
    try {
      const expanceId = req.params.id;
      const expanceReq = await Patner.findOne({id:expanceId}).fetch();
      expanceReq.isAccept = true;
      const updateExpance = await Patner.update({id:expanceId}).set(expanceReq);
      console.log(updateExpance);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },onRejectReq : async (req,res)=>{
    try {
      const expanceId = req.params.id;
      const deleteExpance = await Patner.delete({id:expanceId});
      console.log(deleteExpance);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }
};

