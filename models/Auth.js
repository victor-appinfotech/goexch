const bcrypt = require('bcryptjs'),
{ Sequelize, connection } = require('../config/db');

const authM = connection.define(
  "ge_clients",
  {
    user_name: {
      //type: Sequelize.STRING(100)
      type: Sequelize.CHAR(100)
    },
    username: {
      type: Sequelize.CHAR(100)
    },
    password: {
      type: Sequelize.CHAR(100)
    },
    status: {
      type: Sequelize.INTEGER
    }
  },
  { timestamps: false }
);

module.exports = {
    check:function(req,cb){
      req.body.username;
        connection.sync()
        .then(function() {
          authM
            .findOne({
              where: {
                username: req.body.username,
                status:1
              }
            })
            .then(user => {
                bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                    if (err) console.log(err);
                    if (isMatch) {
                      // TODO `req.session.user` variable holds all the details of the user 
                      req.session.isLogin = true;
                      req.session.user = user.dataValues;
                      // console.log(req.session);
                      // return;
                      return cb(null, user.dataValues);
                    }else{
                        req.flash("error_msg", "Incorrect Password !");
                        return cb(true, null);
                    }
                });
            })
            .catch(err => {
                return cb(err,null);
            });
        });
    }
};
