const { cryptr, bcrypt } = require('../config/common');
require('dotenv').config()

const CommonHelper = {
    encode: (obj)=>{
        var json = JSON.stringify(obj);
        return cryptr.encrypt(json);
    },
    decode: (str)=>{
        var obj = cryptr.decrypt(str);
        return JSON.parse(obj);
    },
    cryptoCrypt: (str)=>{
        let iv = crypto.randomBytes(Number(process.env.IV_LENGTH));
        let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer.from(process.env.ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(str);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    },
    cryptoDecrypt: (hash)=>{
        let textParts = hash.split(':');
        let iv = new Buffer.from(textParts.shift(), 'hex');
        let encryptedText = new Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer.from(process.env.ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    },
    bjEncrypt: (txt)=>{
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync("admin", salt);
        return hash;
    }
} 

module.exports = CommonHelper;