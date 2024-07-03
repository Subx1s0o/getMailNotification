import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import { config } from "dotenv";
import path from "path";
import hbs from "nodemailer-express-handlebars";
import { fileURLToPath } from "url";

config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(bodyParser.urlencoded({ extended: false }));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "subx1s0o@gmail.com",
    pass: process.env.PASS,
  },
});

const handlebarOpts = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.join(__dirname, "../views"),
    defaultLayout: false,
  },
  viewPath: path.join(__dirname, "../views"),
  extName: ".handlebars",
};

transporter.use("compile", hbs(handlebarOpts));

app.post("/sendmail", (req, res, next) => {
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
      console.log("Email sent: ", info);
      res.send(
        "Sent, check your email box. If you don't see it, check the spam folder."
      );
    })
    .catch((err) => {
      console.error("Error while sending email: ", err);
      next(err);
    });
});

app.listen(PORT, () => {
  console.log("Server running on port: ", PORT);
});

export default app;
