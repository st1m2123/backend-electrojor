import jwt from "jsonwebtoken"
import { validationResult } from "express-validator";
import UserModel from "../models/User.js"
import bcrypt from "bcrypt"


export const register = async (req, res) =>{ 
    try{
        const errors = validationResult(req); // Вытаскиваем ошибки, если они есть из валидации
    if (!errors.isEmpty()) { // проверка есть ли ошибки 
        return res.status(400).json(errors.array());   // Если есть ошибки, то вернется массив ошибок и код ошибки 400
    }
    
    const password = req.body.password; //Вытаскиваем пароль из данных пользователя и сохраняем в переменную
    
    const salt = await bcrypt.genSalt(10);
    
    const hash = await bcrypt.hash(password, salt); //шифруем пароль с помощью бкрипт
    
    const doc = new UserModel({  //создаем документ
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash
    });
    
    const user = await doc.save();

    const token = jwt.sign({
        _id: user._id,
    }, 
        "secret111",{
            expiresIn: "30d"
        }
    )
    
const {passwordHash, ...userData} = user._doc;

    res.json({...userData, token}) //Возвращаем информацию на фронт 
    } catch (err){
        res.status(500).json({
            message: "не удалось зарегестрироваться",
        })
        console.log(err);
    }
}

export const login = async (req, res) => {
    try{
        const user = await UserModel.findOne({
            email: req.body.email
        })
        if (!user){
            return res.status(404).json({
                message: "Пользователь не найден"
            })
        };
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)  //Проверка валидности пароля
            if (!isValidPass){
                return res.status(404).json({
                    message: "Неверный логин или пароль"
                })
            }
        
            const token = jwt.sign({
                _id: user._id,
            }, 
                "secret111",{
                    expiresIn: "30d"
                }
            )

            const {passwordHash, ...userData} = user._doc;

            res.json({...userData, token}) //Возвращаем информацию на фронт 

    } 
    catch (err){
        res.status(500).json({
            message: "Ошибка авторизации"
        })
       console.log("СОСИ ХУЙ");
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user){
           return res.status(404).json({
                message: "Пользователь не найден"
            })
        }
        const {passwordHash, ...userData} = user._doc;

        res.json({...userData})
    } catch(err) {
        res.status(500).json({
            message: "нет доступа",
        })
        console.log(err);
    }
}