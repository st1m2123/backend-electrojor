import PostModel from "../models/Post.js"

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec(); //Вернуть все почты .populate('user').exec() - вместе с информацией о пользователе
    // const littlePosts = posts.map((e) => {
    //   return {
    //     title: e.title,
    //     text: e.text,
    //     _id: e._id,
    //     tags: e.tags,
    //     createdAt: e.createdAt,
    //     viewsCount: e.viewsCount,
    //     user: {
    //       _id: e.user._id,
    //       fullName : e.user.fullName
    //     }
    //   }
    // })
    res.json(posts)
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "не удалось получить посты"
    })
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const getOnePost = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },

    ).then((doc, err) => {
        if(err){
         return res.status(404).json({
            message: 'Не удалось найти статью',
          })
        }
        if(!doc){
          return res.status(404).json({
            message: "Статья была удалена или не существут"
          })
        }
        return res.status(200).json(doc)
      },)
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статью',
    });
  }
};


export const remove = async (req, res) => {
  try{
    const postId = req.params.id;

    await PostModel.findOneAndDelete(
      {
        _id: postId,
      },).then((doc, err) => {
        if(err){
          return res.status(404).json({
            message: 'Не удалось найти статью',
          })
        }
        res.status(200).json({
          message: "Статья удалена", 
          doc
        })
      })
  } catch {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статью',
    });
  }
}

export const update = async (req, res) => {
  try{
    const postId = req.params.id;

    await PostModel.updateOne({
      _id: postId,
    },{
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    }).then((doc, err) => {
      res.json({
        message: "Данные успешно изменены",
      })
    })

    
  } catch(err){
    console.log(err);
    res.status(500).json({
      message: 'Не удалось изменить данные',
    });
  }
}