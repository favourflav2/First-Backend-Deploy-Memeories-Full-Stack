import mongoose from "mongoose";

const tourSchema = mongoose.Schema({
    title: String,
    desc: String,
    name: String,
    creator: String,
    tags: [String],
    imageFile: String,
    likes:{
        type:[],
        default: []
    }
},{timestamps: true})

const Tour = mongoose.model("tourPost",tourSchema)

export default Tour