const Cryptr = require('cryptr');
const c = new Cryptr('anewquickfoxjumsoverthelazydog');

const bc = require('bcryptjs');
const csurf = require('csurf');

module.exports = {
    cryptr : c,
    bcrypt : bc,
    csrfProtection:csurf()
};