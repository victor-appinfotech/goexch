const express = require("express"),
router = express.Router(),

client = require('../models/client/Client');
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const { check, validationResult,matchedData, sanitizeBody } = require('express-validator');
const { cryptr } = require('../config/common');

/* CSRF */
const { csrfProtection } = require("../config/csrf");

/* Without datatable */
/* router.get('/',ensureAuthenticated,(req,res,next)=>{
  client.getClients(clientD=>{
    res.render('client/list', {
      clients: clientD,
      // layout:'__layout'
    });
  });
}); */

/* With datatable */
router.get('/',ensureAuthenticated,(req,res,next)=>{  
  // req.session.destroy();
    res.render('client/list',{token:req.csrfToken()});
});

/* AJAX Call */
router.post('/cdata',ensureAuthenticated,(req,res,next)=>{
  client.getClients(req, (error, clientD)=> {
    /* res.render('client/list', {
      clients: clientD,
      // layout:'__layout'
    }); */
    var response = {};
    client.getTotalC(req, (err,data)=>{
      response['recordsFiltered'] = data.count;
      var dt = [];
      clientD.forEach(client=>{
        var row = [];
        var user = (client.dataValues.user_type==1) ? '<span class="badge badge-success mr-2">A</span>' : '<span class="badge badge-info mr-2">U</span>';

        row.push('<a href="#" data-toggle="tooltip" data-placement="top" data-html="true" title=\'<div class="custom-tooltip"> \
        <span>'+client.dataValues.user_name+'</span> \
        <p class="mb-1">Rate: '+client.dataValues.user_rate+'</p></div>\'> \
        '+ user +' \
        '+client.dataValues.username+'</a>');

        row.push(client.dataValues.currency);
        row.push(client.dataValues.credit_reference+'<a href="#" class="edit-icon mdl" data-target="/client/cref/' + cryptr.encrypt(client.dataValues.id) + '" data-title="Edit Credit Reference"><i class="fas fa-pen"></i></a>');
        row.push(client.dataValues.balance);
        row.push(client.dataValues.exposure+'<a href="#" class="view-icon mdl" data-target="/client/exp/' + cryptr.encrypt(client.dataValues.id) + '" data-title="View Exposure"><i class="fas fa-eye"></i></a>');
        row.push(client.dataValues.aval_balance);
        row.push(client.dataValues.pnl);
        row.push('<a href="" class="lock-close-icon"><i class="fas fa-lg fa-lock-open"></i></a>');
        row.push('<a href="" class="lock-icon"><i class="fas fa-lg fa-lock"></i></a>');
        row.push('<a href="" class="user-icon dark-grey-bg"><i class="fas fa-user"></i></a> \
        <a href="" class="user-icon green-bg">D</a>  <a href="" class="user-icon red-bg">W</a>');
  
        dt.push(row);
      });
      console.log('data show >>>>>>>>>',dt);
      
      response['draw'] = Number(req.body.draw);
      response['recordsTotal'] = dt.length;
      response['data'] = dt;
      res.send(response);
    });
  });
});

router.get('/form/:id?',(req,res)=>{
  res.render('client/form',{layout: false});
});

router.get('/cref/:id',(req,res)=>{
  client.getCref(req, (error, Cdata)=>{
      client.getClient(req, (error, Udata)=>{
        res.render('client/cref',{cref:Udata[0].dataValues.credit_reference,layout: false,history:Cdata});
      })
    })
});

router.get('/exp/:id?',(req,res)=>{
  client.getExposure(req, (error, Edata)=>{
    res.render('client/exposure',{layout: false,Edata});
  })
});

router.post('/save',[
  check('user_type', 'Please choose a user type')
    .trim()
    .notEmpty()
    .isNumeric()
      .withMessage('Invalid entry'),

  check('username','Enter a username')
  .trim()
  .notEmpty(),

  check('client_name','Enter a client name')
  .trim()
  .notEmpty(),

  check('phone','Enter phone no.')
  .trim()
  .notEmpty()
  .isLength({ min: 10,max: 10 })
      .withMessage('Invalid phone no')
  .isNumeric()
      .withMessage('Invalid phone no.'),

  check('credit_reference','Enter credit reference value')
  .trim()
  .notEmpty()
  .isNumeric()
      .withMessage('Enter a number'),
  
  check('currency','Choose a currency')
  .trim()
  .notEmpty(),

  check('rate','Enter user rate')
  .trim()
  .notEmpty()
  .isNumeric()
      .withMessage('Invalid entry')

],(req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const sportsD = matchedData(req);   
    return res.send({exception:true, err:errors.mapped()});
  }

  if (req.body.cid) {      
    // var viewpage = 'edit_sport';
  }else{
    client.save(req, (err, result)=> {
      if(err && err.parent.errno==1062){
        // throw new Error('User already exists');
        return res.send({
          exception:true,
          err:{
            "username":{"value":"","msg":"User already exists","param":"username","location":"body"}
          }
        });
      }else{
        return res.send({exception:false, url:'/client'});
      }
    });
  } 

});

module.exports = router;