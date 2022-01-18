const crypto = require("crypto");

module.exports = (email, password) => {

    let salz = '';
    for (let k = 0; k < 5; k++) {
        for (let i = 0; i < email.length; i++)
            salz += email[i] + 'NOGWFR7rjGlDYhkyrDZE37ZY' + password[i]+'eXzBatoGgIeh';
    }

    let sha512 = crypto.createHash("sha512");
    sha512.update(password, "utf8");
    let result = sha512.digest("base64");

    sha512 = crypto.createHash("sha512");
    sha512.update(salz, "utf8");
    let result1 = sha512.digest("base64");

    sha512 = crypto.createHash("sha512");
    sha512.update(result + result1, "utf8");
    let kashPassword = sha512.digest("base64");

    return kashPassword;
}
