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
      const user = await User.find();
      console.log(user);
      // res.view('')
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },getUserPage:async(req,res)=>{
    try {
      const id = req.params.id;
      const user = await User.findOne({id:id});
      if (!user) {
        return res.status(400).send({Message:'Error to fatch data relogin!'})
      }
      const accounts = await Account.find({owner:id});
      const patners = await Patner.find({owner:id});
      const patnerWiths = await Patner.find({patnerEmail:user.emailAddress,isAccept:true});
      const newReq = patners.filter((patner)=> patner.isAccept == false);
      
      res.view('pages/expance/welcome',{user,accounts,storeUserAndToken:user,patnerWiths,newReq});
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  editUser : async(req,res)=>{
    try {
      const id = req.params.id;
      const {emailAddress,fullname} = req.body;

      const updatedUser = await User.update({id}).set({emailAddress,fullname}).fetch();
      console.log(updatedUser);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  deleteUser : async(req,res)=>{
    try {
      const id = req.params.id;
      const deletedUser = await User.destroy({id}).fetch();
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
      let user = await User.create({fullName:name,emailAddress:email,password:hashPassword}).fetch();
      const token = sails.helpers.jwtTokenGenerater(user.id);
      user = await User.update({id:user.id}).set({authToken:token.token}).fetch();
      //send Welcome mail
      sails.helpers.emailSender.with({
        to: user[0].emailAddress,
        subject: 'Welcome to Expance Management Group,Makes easy your life with Money Management',
        template: 'email-welcome-mail',
        layout: false,
        templateData: {
          fullName: user[0].fullName,
          token:token.token,
        }
      });
      req.user = user[0];
      return await createNewAccount(req,res);
      // const updateUser = User.update({owner:user.id}).set(user);
      // const allAccounts = await User.find({owner:user.id}).fetch();
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
        return res.status(400).view('500.ejs', { error: 'User Not Found!' });
      }

      const matchPassword = bcryptjs.compareSync(password, user.password);

      if (!matchPassword) {
        return res.status(401).view('500.ejs', { error: 'Credencials Miss Mach!' });
      }

      const token = sails.helpers.jwtTokenGenerater(user.id);
      user = await User.update({id:user.id}).set({authToken:token.token}).fetch();
      user = user[0];
      return res.redirect(`/user/${user.id}`);
      // return res.view('pages/expance/welcome',{user,token});
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },getwelcomePage:async (req,res)=>{
    console.log(req.user);
    res.view('pages/expance/welcome');
  },logOut:async(req,res)=>{
    try {
      const user = req.user;
      await User.update({id:user.id}).set({authToken:''}).fetch();
      return res.status(200).json('User logout Successfully!')
    } catch (error) {
      console.log(error);
      return res.status(500).send({Error:error});
    }
  }

};

