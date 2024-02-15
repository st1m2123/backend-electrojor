import {body} from "express-validator"

export const registerValidaton = [
    body("email", "не верный формат почты").isEmail(),  //Проверка является ли Email имэйлом .isEmail() вторым сиволом указываем сообщение ошибки
    body("password", "пароль должен содержать 5 и более символов").isLength({min: 5}), //Поврка на длинну символов
    body("fullName", "Имя не может быть короче двух символов").isLength({min: 3}),
    body("avatarUrl", "не верная ссылка на аватар").optional().isURL(),
]

export const loginValidaton = [
    body("email", "не верный формат почты").isEmail(),  //Проверка является ли Email имэйлом .isEmail() вторым сиволом указываем сообщение ошибки
    body("password", "пароль должен содержать 5 и более символов").isLength({min: 5}), //Поврка на длинну символов
]

export const postCreateValidation = [
    body("title", "Введите заголовок статьи").isLength({min: 3}).isString(),  //Проверка является ли Email имэйлом .isEmail() вторым сиволом указываем сообщение ошибки
    body("text", "Введите текст статьи").isLength({min: 10}).isString(), //Поврка на длинну символов
    body("tags", "Не выерный формат тегов(Укажите массив)").optional().isString(),
    body("imageUrl", "не верная ссылка на изображение").optional().isString(),
]