/**
 * PatnerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getPatnerPage: async (req, res) => {
    try {
      const userId = req.params.userId;
      let users = await User.find();
      users = users.filter((user) => user.id != userId);
      return res.view('pages/expance/sendPatnerRequest', { user: users });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ Error: error });
    }
  },
  addNewPatnerReq: async (req, res) => {
    try {
      const user = req.user;
      const ownerId = req.body.ownerId;
      const owner = await User.findOne({id:ownerId});
      const accountId = req.body.accountId;
      const account = await Account.findOne({ id: accountId });
      const patnerReq = await Patner.create({ accountId, owner: ownerId, patnerEmail: user.emailAddress, isAccept: false, accountName: account.accountName, accountNumber: account.accountNumber }).fetch();

      //send mail
      sails.helpers.emailSender.with({
        to: owner.emailAddress,
        subject: `partner request for ${account.accountNumber} by ${user.emailAddress}`,
        template: 'email-patnerReq-mail',
        layout: false,
        templateData: {
          from: user.emailAddress,
          to:owner.fullName,
          for:account.accountName,
          number:account.accountNumber,
          token:user.authToken,
        }
      });

      return res.status(201).json(patnerReq);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }, reqAccept: async (req, res) => {
    try {
      const patnerId = req.params.patnerId;
      const patnerReq = await Patner.findOne({ id: patnerId });
      patnerReq.isAccept = true;
      const updatePatner = await Patner.update({ id: patnerId }).set(patnerReq);
      return res.status(200).json(updatePatner);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }, onRejectReq: async (req, res) => {
    try {
      const id = req.params.patnerId;
      const userId = req.params.userId ? req.params.userId : undefined;
      const accountId = req.params.accountId ? req.params.accountId : undefined;
      const deletePatner = await Patner.destroy({ id });
      console.log(deletePatner);
      if (accountId) {
        return res.redirect(`http://localhost:1337/account/${accountId}`);
      } else {
        return res.redirect(`http://localhost:1337/user/${userId}`);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }
};

