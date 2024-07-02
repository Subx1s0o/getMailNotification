import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import { config } from "dotenv";
import path from "path";
import hbs from "nodemailer-express-handlebars";
config();
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index");
});
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(PORT, () => {
  console.log("server running on port: ", PORT);
});
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: "subx1s0o@gmail.com",
    pass: process.env.PASS,
  },
});

const handlebarOpts = {
  viewEngine: {
    extName: ".html",
    partialsDir: path.resolve("./views"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./views"),
  extName: ".handlebars",
};

transporter.use("compile", hbs(handlebarOpts));

app.post("/sendmail", (req, res) => {
  const { text, email } = req.body;
  const mailOptions = {
    from: "subx1s0o@gmail.com",
    to: email,
    subject: "Hello From ME! :)",
    template: "mail",
    context: {
      message: text,
    },
  };
  transporter
    .sendMail(mailOptions)
    .then((info) => {
      console.log(info);
      res.send(
        "Sended, check your email box. If you dont see, check spam folder"
      );
    })
    .catch((err) => {
      console.log(err);
      res.send("error while sending");
    });
});
