const controller = require('../controllers/user.controllers');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');

module.exports = app => {
  const router = require('express').Router();
  

  // router.get

  router.get('/me', isLoggedIn, controller.getMe);

  router.get('/users', isLoggedIn, isAdmin, controller.getAll);

  router.get('/sellers', isLoggedIn, isAdmin, controller.getSellers);

  router.get('/managersAndAdmins', isLoggedIn, isAdmin, controller.getManagersAndAdmins);

  router.get('/managerRequests', isLoggedIn, isAdmin, controller.getAspiringManagers);

  router.get('/:id', isLoggedIn, controller.getById);

  router.get('/:id/details', isLoggedIn, isAdmin, controller.getUserDetails);


  // router.post 

  router.post('/login', controller.login);

  router.post('/', controller.create);

  router.post('/forgotPassword', controller.forgotPassword);

  router.post('/resetPassword/:resetToken', controller.resetPassword);


  // router.patch

  router.patch('/:id/role', isLoggedIn, isAdmin, controller.toggleRole);

  router.patch('/:id/manager', isLoggedIn, isAdmin, controller.updateUserRoleToManager);

  router.patch('/:id/deleteManagerRequest', isLoggedIn, isAdmin, controller.deleteAspiringManager);

  router.patch('/:id/email', isLoggedIn, isAdmin, controller.updateEmail);

  router.patch('/:id/lastName', isLoggedIn, isAdmin, controller.updateLastName);

  router.patch('/:id/firstName', isLoggedIn, isAdmin, controller.updateFirstName);

  router.patch('/:id/telephone', isLoggedIn, isAdmin, controller.updateTelephone);

  router.patch('/:id/adresse', isLoggedIn, isAdmin, controller.updateAdresse);

  router.patch('/:id/password', isLoggedIn, isAdmin, controller.updatePassword);

  router.patch('/password', isLoggedIn, controller.verifyCurrentPassword);

  router.delete('/:id', isLoggedIn, isAdmin, controller.deleteUser);

  app.use('/user', router);
};
