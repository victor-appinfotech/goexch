const { Op } = require("sequelize");
const { Sequelize, connection } = require('../../config/db');
const { cryptr } = require('../../config/common');
const credit = require('./CreditHistory');

const cObj = connection.define('ge_clients',{
    parent_id:{
        type:Sequelize.INTEGER
    },
    user_type:{
        type:Sequelize.INTEGER
    },
    create_permission	:{
        type:Sequelize.INTEGER,
        default:0
    },
    user_name:{
        type:Sequelize.STRING(100)
    },
    username:{
        type:Sequelize.STRING(100)
    },
    password:{
        type:Sequelize.STRING(100)
    },
    user_rate:{
        type:Sequelize.INTEGER
    },
    currency:{
        type:Sequelize.STRING(5)
    },
    credit_reference:{
        type:Sequelize.INTEGER
    },
    balance:{
        type:Sequelize.INTEGER
    },
    exposure:{
        type:Sequelize.INTEGER
    },
    aval_balance:{
        type:Sequelize.INTEGER
    },
    pnl:{
        type:Sequelize.INTEGER
    },
    status:{
        type:Sequelize.INTEGER
    }
    
},{ timestamps: false });

const Client = {
    getClients:(req,cb)=>{
        var cols = ['username','currency','credit_reference'];
        var body = req.body;
        
        var clause = {            
            id: {
                [Op.ne]: req.session.user.id
            },
            username: {
                [Op.ne]: req.session.user.username
            },
            parent_id:req.session.user.id
        };

        if(body['search[value]']!=''){

            var or = {
                [Op.or] : [                    
                    {
                        username : {
                            [Op.substring]: body['search[value]']
                        }
                    },
                    {
                        currency : {
                            [Op.substring]: body['search[value]']
                        }
                    },
                    {
                        credit_reference : {
                            [Op.substring]: body['search[value]']
                        }
                    }
                ]
            }

            clause = Object.assign(clause,or);
        }        

        connection.sync()
            .then(function(){
                cObj.findAll({
                    where:clause,
                    attributes: {},
                    offset: Number(body.start), limit: Number(body.length),
                    order: [
                        [cols[body['order[0][column]']], body['order[0][dir]']]
                    ]
                })
                .then((results)=>{
                    return cb(null, results);                    
                })
                .catch((err)=>{
                    return cb(err, null);
                });
            })
            .catch(function(err){
                console.log(err);
            })
    },
    getClient:(req,cb)=>{
        connection.sync()
            .then(function(){
                cObj.findAll({
                    where:{
                        id:cryptr.decrypt(req.params.id)
                    },
                })
                .then((results)=>{
                    return cb(null, results);                    
                })
                .catch((err)=>{
                    return cb(err, null);
                });
            })
            .catch(function(err){
                console.log(err);
            })
    },
    getTotalC:(req,cb)=>{
        connection.sync()
            .then(function(){
                cObj.findAndCountAll({
                        where:{
                            parent_id:req.session.user.id
                        }
                    })
                    .then((results)=>{
                        return cb(null,results);
                    })
                    .catch(err=>console.log(err))
                })
            .catch(function(err){
                console.log(err);
            })
    },
    save:(req,cb)=>{
        connection.sync()
            .then(function(){
            if(req.body.cid){
                sportModel.update({
                    sport_name: req.body.sport_name
                },{
                    where: {
                    id: req.body.sid
                }}).then((results) => {
                    return cb(null, results);
                }).catch((err) => {
                    return cb(err, null);
                });
            }else{
                cObj.create({
                    parent_id: req.session.user.id,
                    user_type:req.body.user_type,
                    create_permission:req.body.can ? req.body.can : 0,
                    user_name:req.body.client_name,
                    username:req.body.username,
                    user_rate:req.body.rate,
                    currency:req.body.currency,
                    credit_reference:req.body.credit_reference,
                    status:req.body.status,
                }).then((results) => {
                    return cb(null, results);
                }).catch((err) => {
                    return cb(err, null);
                });
            }
        })
    },
    getExposure:(req,cb)=>{
        connection.sync()
            .then(function(){
                return cb(null, [{date:"2020-02-11 12:55",oldvalue:"10000",newvalue:"50000"},{date:"2020-02-15 09:01",oldvalue:"50000",newvalue:"67000"}]);
            })
    },
    getCref:(req,cb)=>{
        connection.sync()
            .then(function(){
                credit.getByClient(req,(err,data)=>{
                    // console.log(data);
                    return cb(null,data);
                })                
            })
            .catch(function(err){
                console.log(err);
        }) 
        /* credit.getByClient(req,(err,data)=>{
            return data;
        }) */        
    }
}

module.exports = Client;