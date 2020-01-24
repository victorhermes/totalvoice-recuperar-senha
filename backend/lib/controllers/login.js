const TotalVoice = require("totalvoice-node");
const Base64 = require("js-base64").Base64;
const userDb = require("../db/user");

class LoginController {
  emailLogin(req, res) {
    const totalvoiceClient = new TotalVoice("81b488b24c3958bb17616a607889cfec");

    const email = req.body.email;
    const password = req.body.password;
    const userInDatabase = userDb.getByLogin(email, password);

    if (userInDatabase == undefined) {
      res.status(404).json({ message: "Nada encontrado" });
    }

    const token = {
      type: "2fa-sent",
      userId: userInDatabase.id,
      email: userInDatabase.email,
      sign: "123456789"
    };

    //false envia por sms, true envia por tts (converte texto para audio)
    totalvoiceClient.verificacao
      .enviar(userInDatabase.phone, "App da Moom", 5, false)
      .then(data => {
        token.twoFactorVerificationId = data.dados.id;
        const base64Token = Base64.encode(JSON.stringify(token));

        res.json({
          message: "Sucesso, esperando 2FA auth",
          token: base64Token
        });
      })
      .catch(error => {
        res.status(500).json({ message: "Erro interno" });
      });
  }

  verify2FA(req, res) {
    const totalvoiceClient = new TotalVoice("81b488b24c3958bb17616a607889cfec");
    const authoriztionHeader = req.header("Authorization");
    const token = JSON.parse(Base64.decode(authoriztionHeader));
    const userInDatabase = userDb.getById(token.userId);

    totalvoiceClient.verificacao
      .buscar(token.twoFactorVerificationId, req.body.pin)
      .then(data => {
        const permanentToken = {
          type: "permanent",
          userId: userInDatabase.id,
          email: userInDatabase.email,
          sign: "123456789"
        };

        const base64Token = Base64.encode(JSON.stringify(permanentToken));

        res
          .status(201)
          .json({ message: "Logado com sucesso", permanentToken: base64Token });
      });
  }
}

module.exports = new LoginController();
