const controller = require('../controllers/saleSession.controllers');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');

module.exports = app => {
  const router = require('express').Router();

  // Routes GET
  router.get('/sessions', isLoggedIn, controller.getAllSessions);
  router.get('/activeSession', controller.getActiveSession);
  router.get('/:id', controller.getSessionById);

  // Routes POST
  router.post('/', isLoggedIn, isAdmin, controller.createSession);

  // Routes PATCH
  router.patch('/:id', isLoggedIn, isAdmin, controller.updateSession);

  // Route DELETE
  router.delete('/:id', isLoggedIn, isAdmin, controller.deactivateSession);
  router.delete('/upcoming/:id', isLoggedIn, isAdmin, controller.deleteUpcomingSession);

  app.use('/saleSession', router);
};
