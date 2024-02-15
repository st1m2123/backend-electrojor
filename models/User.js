import mongoose from "mongoose"

const UserScheme = new mongoose.Schema({
    fullName: {
        type: String,  //Явялется стройко
        ruquired: true, //Заполнение обязательно
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,
},
{
    timestamps: true, //Дата создания

})

export default mongoose.model("User", UserScheme)