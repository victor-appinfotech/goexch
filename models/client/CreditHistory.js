const { Sequelize, connection } = require('../../config/db');

const chObj = connection.define('ge_credit_transaction',{
    client_id:{
        type:Sequelize.INTEGER
    },
    old_value:{
        type:Sequelize.INTEGER
    },
    new_value:{
        type:Sequelize.INTEGER
    }
})

const History = {
    getByClient:(req,cb)=>{
        connection.sync()
            .then(function(){
                chObj.findAll({
                    attributes: ['old_value','new_value', [Sequelize.fn('date_format', Sequelize.col('createdAt'), '%Y-%m-%d %H:%i'), 'createdAt']],
                    where:{
                        client_id:req.session.user.id
                    }
                })
                .then((results)=>{
                    return cb(null, results);                    
                })
                .catch((err)=>{
                    return cb(err, null);
                })                
            })
            .catch(function(err){
                console.log(err);
            })
        }
    };

module.exports = History;