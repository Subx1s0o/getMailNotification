import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import { config } from "dotenv";
import path from "path";
import hbs from "nodemailer-express-handlebars";
import { fileURLToPath } from "url";

config();

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

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
    pass: process.env.PASS, // Ensure PASS is set in your Vercel environment variables
  },
});

const handlebarOpts = {
  viewEngine: {
    extName: ".handlebars", // Assuming your templates have the .handlebars extension
    partialsDir: path.join(__dirname, "../views"),
    defaultLayout: false,
  },
  viewPath: path.join(__dirname, "../views"),
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
      console.log("Email sent: ", info);
      res.send(
        "Sended, check your email box. If you don't see it, check the spam folder."
      );
    })
    .catch((err) => {
      console.error("Error while sending email: ", err);
      res.status(500).send(`Error while sending: ${err.message}`);
    });
});

export default app;
