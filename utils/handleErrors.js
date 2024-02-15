import { validationResult } from "express-validator";

export default (req, res, next) =>  {
    const errors = validationResult(req); // Вытаскиваем ошибки, если они есть из валидации
    if (!errors.isEmpty()) { // проверка есть ли ошибки 
        return res.status(400).json(errors.array());   // Если есть ошибки, то вернется массив ошибок и код ошибки 400
    }
    next();
} 