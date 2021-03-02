const { Op } = require("sequelize");
const { Sequelize, connection } = require('../../config/db');
const { cryptr } = require('../../config/common');
const Helper = require('../../helper/often');
//const credit = require('./CreditHistory');

const cObj = connection.define('gmsUsers',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true
    },
    user_type:{
        type:Sequelize.INTEGER
    },
    username:{
        type:Sequelize.STRING(100)
    },
    password:{
        type:Sequelize.STRING(100)
    },
    status:{
        type:Sequelize.INTEGER
    }
    
},{ 
    timestamps: false
    //force:true
});

const gmsUsers = {
    getClients:(req,cb)=>{
        var cols = ['username'];
        var body = req.body;
        
        var clause = {            
            id: {
                [Op.ne]: req.session.user.id
            },
            username: {
                [Op.ne]: req.session.user.username
            },
            status:1
        };
        if(body['search[value]']!=''){
            var or = {
                [Op.or] : [                    
                    {
                        username : {
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
                cObj.findOne({
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
                            id:req.session.user.id
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
                if (req.body.resourceId){
                cObj.update({
                    user_type: req.body.user_type,
                    username: req.body.username
                },{
                    where: {
                        id: cryptr.decrypt(req.body.resourceId)
                }}).then((results) => {
                    return cb(null, results);
                }).catch((err) => {
                    return cb(err, null);
                });
            }else{
                cObj.create({
                    user_type:req.body.user_type,
                    username:req.body.username,
                    password:req.body.pasasword,
                    status:1,
                }).then((results) => {
                    return cb(null, results);
                }).catch((err) => {
                    return cb(err, null);
                });
            }
        })
    },
    delete: (req, cb) => {
        cObj.update({
            status: 0
        }, {
            where: {
                id: Helper.decode(req.body.resource_id)
            }
        })
        .then(result => {
            return cb(null, result);
        })
        .catch(err => {
            console.log("Error !!!!!!!!!", err);
            return cb(err, null);
        });
    }
}

module.exports = gmsUsers;