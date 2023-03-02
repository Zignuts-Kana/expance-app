/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const bcryptjs = require('bcryptjs');
module.exports = {
  getAllUser : async (req,res)=>{
    try {
      const user = await User.find().select('emailAddress fullname patnerOfAccounts');
      console.log(user);
      // res.view('')
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  editUser : async(req,res)=>{
    try {
      const id = req.params.id;
      const {emailAddress,fullname} = req.body;

      const updatedUser = await User.update({id}).set({emailAddress,fullname}).fatch();
      console.log(updatedUser);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  deleteUser : async(req,res)=>{
    try {
      const id = req.params.id;
      const deletedUser = await User.delete({id}).fatch();
      console.log(deletedUser);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },ragisterUser:async (req,res)=>{
    try {
      const {createNewAccount} = require('./AccountController');

      const {name,email,password,conformPassword} = req.body;
      if (password !== conformPassword) {
        return res.send({Message:'password and conformPassword is miss match!'});
      }
      const hashPassword = bcryptjs.hashSync(password, 8);
      const user = await User.create({fullName:name,emailAddress:email,password:hashPassword});
      const token = sails.helpers.jwtTokenGenerater(user);
      //send Welcome mail
      sails.helpers.emailSender.with({
        to: user.emailAddress,
        subject: 'Welcome to Expance Management Group,Makes easy your life with Money Management',
        template: 'email-welcome-mail',
        layout: false,
        templateData: {
          fullName: user.fullName,
          token:token.token,
        }
      });
      req.user = user;
      return await createNewAccount(req,res);
      // const updateUser = User.update({owner:user.id}).set(user);
      // const allAccounts = await User.find({owner:user.id}).fatch();
      // const allRequest = await Patner.find({patnerEmail:user.emailAddress});
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },loginUser:async (req,res)=>{
    try {
      const {email,password}= req.body;
      let user = await User.findOne({ emailAddress:email });

      if (!user || !user.password) {
        return res.status(400).render('500.ejs', { error: 'User Not Found!' });
      }

      const matchPassword = bcryptjs.compareSync(password, user.password);

      if (!matchPassword) {
        return res.status(401).render('500.ejs', { error: 'Credencials Miss Mach!' });
      }

      const token = sails.helpers.jwtTokenGenerater({ _id: user._id });
      res.render('/',{user,token});
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },getwelcomePage:async (req,res)=>{
    res.view('pages/welcome');
  }

};

