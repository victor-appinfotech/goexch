const express = require("express"),
  router = express.Router(),

  gmsUsers = require('../models/gmsUsers/gmsUsers');
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const { check, validationResult, matchedData, oneOf } = require('express-validator');

const { cryptr } = require('../config/common');

/* CSRF */
const { csrfProtection } = require("../config/csrf");

/* With datatable */
router.get('/', ensureAuthenticated, (req, res, next) => {
  res.render('gmsUsers/list', { token: req.csrfToken() });
});

/* AJAX Call */
router.post('/cdata', ensureAuthenticated, (req, res, next) => {
  gmsUsers.getClients(req, (error, clientD) => {
    var response = {};
    gmsUsers.getTotalC(req, (err, data) => {
      response['recordsFiltered'] = data.count;
      var dt = [];
      var counter=1;
      clientD.forEach(client => {
        var row = [];
        var id = cryptr.encrypt(client.dataValues.id);
        var updateButton = '<span class="badge badge-info mr-2 mdl" data-target="gmsUsers/form/' + id + '" data-title="Edit Account">U</span><span class="badge badge-info mr-2 trash-mdl" data-target="gmsUsers/trash" data-val="' + id + '">D</span>';

        var user_type = '';
        if (client.dataValues.user_type == 1) {
          user_type = 'Admin';
        }
        else if (client.dataValues.user_type == 2) {
          user_type = 'User';
        }
        row.push(counter);
        row.push(user_type);
        row.push(client.dataValues.username);
        row.push(updateButton);
        dt.push(row);
        counter++;
      });

      response['draw'] = Number(req.body.draw);
      response['recordsTotal'] = dt.length;
      response['data'] = dt;
      res.send(response);
    });
  });
});

router.get('/form/:id?', (req, res) => {
  if (req.params.id) {
    gmsUsers.getClient(req, (err, resp) => {
      var resourceId = cryptr.encrypt(resp.id);
      resp['resourceId'] = resourceId;
      res.render('gmsUsers/formedit', { layout: false, gmsUserDetail: resp });
    });
  }
  else {
    res.render('gmsUsers/form', { layout: false });
  }

});

router.post('/trash', ensureAuthenticated, (req, res) => {
  gmsUsers.delete(req, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      return res.send({ exception: false, url: '/gmsUsers' });
    }
  })
});

/* router.get('/cref/:id',(req,res)=>{
  client.getCref(req, (error, Cdata)=>{
      client.getClient(req, (error, Udata)=>{
        res.render('client/cref',{cref:Udata[0].dataValues.credit_reference,layout: false,history:Cdata});
      })
    })
}); */

/* router.get('/exp/:id?',(req,res)=>{
  client.getExposure(req, (error, Edata)=>{
    res.render('client/exposure',{layout: false,Edata});
  })
}); */

router.post('/save',
  oneOf([
    //   check('user_type', 'Please choose a user type')
    //     .trim()
    //     .notEmpty()
    //     .isNumeric()
    //       .withMessage('Invalid entry'),

    //   check('username','Enter a username')
    //   .trim()
    //   .notEmpty(),

    //   check('password', 'Enter a password')
    //     .trim()
    //     .notEmpty()

    // ],
    [
      check('user_type', 'Please choose a user type').notEmpty(),
      check('username', 'Enter a username').notEmpty(),
      check('password', 'Enter a password').notEmpty()
    ],

  ]), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const sportsD = matchedData(req);
      return res.send({ exception: true, err: errors.mapped() });
    }
    gmsUsers.save(req, (err, result) => {
      // console.log('Moto----', err);
      if (err && err.parent.code == 23505) {
        // throw new Error('User already exists');
        return res.send({
          exception: true,
          err: {
            // "username": { "value": "", "msg": "User already exists", "param": "username", "location": "body" }
            _error: {
              msg: "User already exists",
              nestedErrors: [{
                msg: "User already exists",
                param: "username"              
              }]
            }
          }          
        });
      } else {
        return res.send({ exception: false, url: '/gmsUsers' });
      }
    });


  });

module.exports = router;