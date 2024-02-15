import express from "express"
import mongoose from "mongoose"
import { registerValidaton, loginValidaton, postCreateValidation } from "./validations.js"
import checkAuth from "./utils/checkAuth.js";
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostContoller.js';
import multer from "multer";
import handleValidationErrors from "./utils/handleErrors.js"
import cors from 'cors'

const app = express();

const storage = multer.diskStorage({
    destination: (_,__, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})



mongoose.connect("mongodb+srv://st1m2123:112233445566@cluster0.epkjpik.mongodb.net/adminPanel?retryWrites=true&w=majority").then(() => {
    console.log("DB ok");
}).catch((err) => {
    console.log("Not connect ", err);
})

const upload = multer({storage})


app.use(express.json()) //Объясняем приложению, что мы используем json
app.use(cors());
app.use('/uploads', express.static('uploads')) // Говорим экспрессу проверять по роуту аплоадс , есть ли там такой файл

app.post("/auth/login" , loginValidaton ,handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidaton, handleValidationErrors, UserController.register)
app.get("/auth/me" , checkAuth, UserController.getMe)
app.post("/posts", checkAuth, postCreateValidation , PostController.create);
app.get("/posts" , PostController.getAll)
app.get('/posts/:id', PostController.getOne);
app.delete("/posts/:id" , checkAuth, PostController.remove);
app.patch("/posts/:id" , checkAuth, postCreateValidation, handleValidationErrors, PostController.update)
app.post('/uploads', checkAuth,  upload.single("image"), (req,res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})



//Запустить приложение на определенном порте
app.listen(4000, (err) => {
    if (err) {
        return console.log("Не запускается сервер: ", err);
    }
    console.log("Server OK");
    })

    // const errors = validationResult(req); // Вытаскиваем ошибки, если они есть из валидации
    // if (!errors.isEmpty()) { // проверка есть ли ошибки 
    //     return res.status(400).json(errors.array());   // Если есть ошибки, то вернется массив ошибок и код ошибки 400
    // }
    
    // const password = req.body.password; //Вытаскиваем пароль из данных пользователя и сохраняем в переменную
    
    // const salt = await bcrypt.genSalt(10);
    
    // const passwordHash = await bcrypt.hash(password, salt); //шифруем пароль с помощью бкрипт
    
    // const doc = new UserModel({  //модель пользователя
    //     email: req.body.email,
    //     fullName: req.body.fullName,
    //     avatarUrl: req.body.avatarUrl,
    //     passwordHash
    // })
    
    // const user = await doc.save();
    
    // res.json(user) //Возвращаем информацию на фронт 
