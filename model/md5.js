var crypto = require("crypto");
module.exports = function md5(mingma) {
    var md5 = crypto.createHash("md5");
    var password = md5.update(mingma).digest("base64");
    return password;
}