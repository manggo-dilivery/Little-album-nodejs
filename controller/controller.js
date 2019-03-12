var db = require('../model/db.js');
var formidable = require('formidable');
var md5 = require('../model/md5.js');
var path = require('path');
var fs = require('fs');
var gm = require('gm');
var multiparty = require('multiparty');//大文件上传中间件
var moment = require('moment');//时间格式化中间件
var ObjectId = require('mongodb').ObjectID;


//提供数据查询接口
exports.showVue = function(req,res){
    res.render('vue');
};
exports.getShopCarList = function(req,res){
    var id =req.params.id.split(',');
    var goodsInfo = [];
    (function itarator(i) {
        var n = parseInt(id[i]);
        var index = parseInt(id.length);
        if( i==index ){
            res.send(goodsInfo);
            return
        }
        db.find('vue_goodsInfo',{goodsId:n},function(err,result){
            if(err){
                console.log('getShopCarList出错：'+err)
            }
            // var arr = [];
            // arr[i] = {
            //     goods_image: result[0].goods_image,
            //     goods_intruduction: result[0].goods_intruduction
            // };
            goodsInfo.push(result[0]);
            itarator(i+1);
            // var index = parseInt(id.length-1);
            // console.log(index);
            // if(i==index){
            //
            // }
        });
    })(0);
};
exports.providegoodsDetailInfo = function(req,res){
    var id = parseInt(req.query.id);
    db.find('vue_goodsInfo',{'goodsId':id},function (err,result) {
        if(err){
            return console.log('goodsDetailInfo出错：'+err)
        }
        res.send(result);
    })
};
exports.provideGoodsInfo = function(req,res){
    var page = req.query.page;
    db.find('vue_goodsInfo',{},{'pageamount':6,'page':page},function(err,result){
        res.json(result);
    })
};
exports.provideCategoryList = function(req,res){
    var id = req.query.id;
    let page = req.query.page;
    db.find('vue_category_list',{'id':id},function (err,result) {
        res.send(result);
    })
};
exports.provideCategory = function(req,res){
    db.find('vue_category',{},function (err,result) {
        if(err){
            return console.log('vue_catagory错误：'+err)
        }
        res.send(result);
    })
};
exports.setCategory = function(req,res){
    db.find('vue_category',{},function (err,result) {
        if(err){
            res.send('-1');
            return console.log('setcategory_find出错：'+err)
        }
        var id = result.length;
        var category = req.query.category;
        db.insertOne('vue_category',{id:id,category:category},function (err,result2) {
            if(err){
                res.send('-1');
                return console.log('setcategory_insert出错：'+err)
            }
            res.send('1');
        })
    })
};
exports.findArticle = function(req,res){
    var _id = ObjectId(req.query._id);
    db.find('vue_article',{'_id':_id},function (err,result) {
        if(err){
            console.log('findArticle出错：'+err);
        }
        res.send(result);
    })
};
exports.provideArticle = function(req,res){
    var avatar = 'moren.jpg';
    db.find('vue_article',{},function (err,result2) {
        if(err){
            return console.log('provideArticle出错'+err)
        }
        var arr = [avatar,result2];
        res.send(arr);
    })

};
exports.provideLunbo = function(req,res){
    var username = req.session.username;
    db.find('vue_lunbo',{},function (err,result) {
        if(err){
            return console.log('provideLunbo出错'+err)
        }
        res.send(result);
    })
};
//vue项目后台控制器
exports.goodsInfo = function(req,res){
    var form =new multiparty.Form({uploadDir:'public/images/goodsImage/'});
    form.parse(req,function (err,fields,files){
        if(err){
            return console.log('goodsInfo出错:'+err)
        }
        var imageFile = (files.imageData)[0];
        var uploadedPath = imageFile.path;
        var imageName = moment(Date.now()).format("YYYY年MM月DD日HH时mm分ss秒") + imageFile.originalFilename;
        var dstPath = 'public/images/goodsImage/' + imageName;
        fs.rename(uploadedPath, dstPath, function (err) {
            if(err){
                return;
            }
            var goods_image = 'http://localhost:80/images/goodsImage/' + imageName;
            db.find('vue_goodsInfo',{},function (err,result) {
                var goodsId = result.length;
                var goods_price1 = fields.goods_price1[0];
                var goods_price2 = fields.goods_price2[0];
                var goods_number = fields.goods_number[0];
                var goods_left = fields.goods_left[0];
                var goods_intruduction = fields.goods_intruduction[0];
                var goods_name = fields.goods_name[0];
                db.insertOne('vue_goodsInfo',{
                    'goodsId':goodsId,'goods_image':goods_image,
                    'goods_price1':goods_price1,'goods_price2':goods_price2,
                    'goods_number':goods_number,'goods_left':goods_left,
                    'goods_left':goods_left,'goods_intruduction':goods_intruduction,
                    'goods_name':goods_name
                },function(err,result2){
                    if(err){
                        console.log('goodsInfo在Insert时出错：'+err);
                    }
                    res.redirect('/vue/goods');
                })
            });
        });
    })
};
exports.showgoods = function(req,res){
    res.render('goods');
};
exports.uploadCategory = function(req,res){
    var id = req.query.id;
    var form = new multiparty.Form({uploadDir: 'public/images/category_image/'});
    form.parse(req,function (err,fields,files) {
        if(err){
            return console.log('parse error: ' + err);
        }
        var imageFile = (files.imageData)[0];
        var uploadedPath = imageFile.path;
        var imageName = moment(Date.now()).format("YYYY年MM月DD日HH时mm分ss秒") + imageFile.originalFilename;
        var dstPath = 'public/images/category_image/' + imageName;
        fs.rename(uploadedPath, dstPath, function (err) {
            if(err){
                return;
            }
            var category_image = 'http://localhost:80/images/category_image/' + imageName;
            var categoryContent = fields.categoryContent[0];
            db.insertOne('vue_category_list',{'id':id,'category_image':category_image,'categoryContent':categoryContent},function (err,result1) {
                res.redirect('/vue/shareImage?id='+id)
            })
        });
    })

};
exports.setCategoryContent = function(req,res){
    var id=req.query.id;
    db.find('vue_category_list',{'id':id},function (err,result) {
        if(err){
            return console.log('vue_category_list出错:'+err)
        }
        res.render('setCategoryContent',{
            id:id,
            result:result
        })
    })

};
exports.showShareImage = function(req,res){
    db.find('vue_category',{},function (err,result){
        res.render('shareImage',{
            result:result
        })
    });
};
exports.vue_deleteContent = function(req,res){
    var _id = ObjectId(req.query.index);
    db.deleteMany('vue_article',{'_id':_id},function(err,result) {
        if(err){
            res.send('-1')
        }
        res.redirect("/vue/houtai");
    });

};
exports.makeupStr2 = function(req,res){
    var username = req.session.username;
    var form = new formidable.IncomingForm();
    // 设置上传文件夹
    form.parse(req, function(err, fields, files) {
        db.insertOne('vue_article',{username:username,content:fields.markupStr,title:fields.title,introduction:fields.introduction,time:new Date()},function (err,result) {
            if(err){
                res.send('-1');
                return console.log('inertErr'+err)
            }
            res.send('1');
        });
    });
};
exports.uploadstr = function(req,res){
    var form = new multiparty.Form({uploadDir: 'public/images/reportImages/'});
    form.parse(req,function (err,fields,files) {
        if(err){
            return console.log('parse error: ' + err);
        }
        var username = req.session.username;
        var imageFile = (files.imageData)[0];
        var uploadedPath = imageFile.path;
        var imageName = moment(Date.now()).format("YYYY年MM月DD日HH时mm分ss秒") + imageFile.originalFilename;
        var dstPath = 'public/images/reportImages2/' + imageName;
        fs.rename(uploadedPath, dstPath, function (err) {
            if(err){
                return;
            }
            var result = {};
            result.status = "success";
            result.imageUrl = "http://localhost:80/images/reportImages2/" + imageName;
            res.status(200).send(result);
            res.end();
        });
    })
};
exports.delete_lunbo = function(req,res){
    var _id = ObjectId(req.query._id);
    db.deleteMany('vue_lunbo',{'_id':_id},function (err,result) {
        res.redirect('/vue/form');
    })
};
exports.showHoutai = function (req,res) {
    var username = req.session.username;
    db.find('users',{'username':username},function (err,result) {
        db.find('vue_article',{'username':username},function (err,result2) {
            res.render("houtai",{
                login : req.session.login,
                username : req.session.username,
                avatar : result[0].avatar,
                result : result2
            })
        })
    })
};
exports.showform = function (req,res) {
    var username = req.session.username;
    db.find('vue_lunbo',{'username':username},function (err,result) {
        if(err){
            return console.log('showform出错：'+err);
        }
        res.render('form',{
            result:result
        });
    })

};
exports.postimage = function (req,res) {
    var form = new multiparty.Form({uploadDir: 'public/images/reportImages2/'});
    var username = req.session.username;
    form.parse(req,function (err,fields,files) {
        if(err){
            return console.log('parse error: ' + err);
        }
        var imageFile = (files.imageData)[0];
        var uploadedPath = imageFile.path;
        var imageName = moment(Date.now()).format("YYYY年MM月DD日HH时mm分ss秒") + imageFile.originalFilename;
        var dstPath = 'public/images/reportImages2/' + imageName;
        var lunboUrl = '/images/reportImages2/' + imageName;
        fs.rename(uploadedPath, dstPath, function (err) {
            if(err){
                return;
            }
            var result = {};
            result.status = "success";
            result.imageUrl = "/images/reportImages/" + imageName;
            db.insertOne('vue_lunbo',{'username':username,'lunboUrl':lunboUrl},function (err,result1) {
                res.redirect('/vue/form')
            })
            // res.status(200).send(result);
            // res.end();
        });
    })
}

//主页路由控制器
exports.showIndex = function (req,res) {
    res.render("index",{
        login : req.session.login,
        username : req.session.username
    });

};
exports.getArticlePage = function(req,res){
    db.getAllCount('article',function (count) {
        var count = count.toString();
        res.send(count);
    })
};
exports.getAllArticle = function(req,res){
    var page = req.query.page;
    db.find('article',{},{'pageamount':'5','page':page},function (err,result) {
        if(err){
            res.send('1')
        }
        res.json(result);
    })
};
exports.getuserinfo = function(req,res){
    var username = req.query.username;
    db.find('users',{'username':username},function (err,result) {
        if(err){
            res.send('-1')
        }
        var avatar = result[0].avatar;
        res.send(avatar);
    })
};
exports.deleteContent = function(req,res){
    var _id = ObjectId(req.query.index);
    var username = req.session.username;
    db.deleteMany('article',{'_id':_id},function(err,result) {
        if(err){
            res.send('-1')
        }
        res.redirect("/person");
    });

};
exports.showContent = function(req,res){
    var _id = ObjectId(req.query.index);
    db.find('article',{"_id":_id},function (err,result) {
        var username = result[0].username;
        var content = result[0].content;
        var title = result[0].title;
        var introduction = result[0].introduction;
        db.find('users',{'username':username},function (err,result2) {
            if(err){
                return console.log('showcontent err:'+err)
            }
            var avatar = result2[0].avatar;
            res.render('content',{
                avatar : avatar,
                title : title,
                introduction : introduction,
                content : content
            });
        })

    })

};
exports.searchArticle = function(req,res){
    var username = req.session.username;
    db.find('article',{'username':username},function (err,result) {
        res.json(result);

    })
};
exports.markupStr = function(req,res){
    var username = req.session.username;
    var form = new formidable.IncomingForm();
    // 设置上传文件夹
    form.parse(req, function(err, fields, files) {
       // db.updateMany('users',{username:username},{$addToSet:{content:fields.markupStr,title:fields.title,introduction:fields.introduction}},function (err,result) {
       //     if(err){
       //         res.send('-1');
       //         return console.log('updateErr'+err)
       //     }
       db.insertOne('article',{username:username,content:fields.markupStr,title:fields.title,introduction:fields.introduction},function (err,result) {
           if(err){
               res.send('-1');
               return console.log('inertErr'+err)
           }
           res.send('1');
       });
       // })
    });
};
//summernote富文本编辑器上传图片的操作
exports.uploadimg = function(req,res){
    var form = new multiparty.Form({uploadDir: 'public/images/reportImages/'});
    form.parse(req,function (err,fields,files) {
        if(err){
            return console.log('parse error: ' + err);
        }
        var username = req.session.username;
        // var date=new Date;
        // var time = date.getTime().toString();
        // var username = req.session.username;
        // var oldname = files.wangeditor_upload.path;
        // var newname = path.normalize(__dirname + "/../wangeditorImg")+'/'+username+time+'.jpg';
        var imageFile = (files.imageData)[0];
        var uploadedPath = imageFile.path;
        var imageName = moment(Date.now()).format("YYYY年MM月DD日HH时mm分ss秒") + imageFile.originalFilename;
        var dstPath = 'public/images/reportImages/' + imageName;
        fs.rename(uploadedPath, dstPath, function (err) {
            if(err){
                return;
            }
            var result = {};
            result.status = "success";
            result.imageUrl = "/images/reportImages/" + imageName;
            res.status(200).send(result);
            res.end();
        });
    })
};
//显示切图页面
exports.showcut = function(req,res){
  res.render('cut',{
      avatar : req.session.avatar
  });
};
//执行切图
exports.docut = function (req,res) {
    var filename = req.session.avatar;
    var w = req.query.w;
    var h = req.query.h;
    var x = req.query.x;
    var y = req.query.y;
    gm("./avatar/" + filename)
        .crop(w, h, x, y)
        .resize(100,100,"!")
        .write("./avatar/" + filename, function (err) {
            if (err) {
                res.send("-1");
                return;
            }
            db.updateMany("users",{"username":req.session.username},
                {$set : {"avatar":req.session.avatar}},function(err,result) {
                    res.send("1");
                })
        })
};
//接受传送的图片
exports.doavatar = function(req,res){
            var form = new formidable.IncomingForm();
            // 设置上传文件夹
            form.uploadDir = path.normalize(__dirname + "/../avatar");
            form.parse(req, function(err, fields, files) {
                var oldname = files.touxiang.path;
                var newname = path.normalize(__dirname + "/../avatar")+'/'+req.session.username+'.jpg';
                fs.rename(oldname,newname,function (err) {
                    if(err){
                        return;
                    }
                    req.session.avatar = req.session.username + ".jpg";
                    // 跳转到切的业务
                    res.redirect("/cut")
                })
            });
        };
// 显示用户页面
exports.showperson = function (req,res) {
    var username = req.session.username;
    db.find('users',{username:username},function (err,result) {
        if(err){
            return;
        }
        if( result.length==0 ){
            var avatar = 'moren.jpg';
        }else{
            var avatar = result[0].avatar
        }
        db.find('article',{username:username},function (err,result2) {
            res.render("person",{
                login : req.session.login,
                username : req.session.username,
                avatar : avatar,
                result : result2
            })
        })
    })
};
exports.showLogin = function (req,res) {
    res.render("login",{
        login : req.session.login ,
        username : req.session.username
    });
};
// 执行登录页面信息
exports.dologin = function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req,function (err,fields,files) {
        var username = fields.username;
        var password = fields.password;
        var pswdmd5 = md5( md5(password) + 'lqx' );
        db.find('users',{ username:username },function (err,result) {
            if(err){
                res.send('-3');
                return;
            }
            if( result.length == 0){
                res.send('-4');
                return;
            }
            if( pswdmd5 == result[0].password ){
                req.session.login = '1';
                req.session.username = username;
                res.send('1');
                return;
            }else{
                res.send('-2');
                return;
            }
        })
    })
};
// 显示注册页面
exports.showRegister = function (req,res,next) {

        res.render("register",{
            login : req.session.login,
            username : req.session.username
        })


};
//存储用户注册信息
exports.doRegist = function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req,function (err,fields,files) {
        var username = fields.username;
        var password = fields.password;
        db.find('users',{ username:username},function (err,result) {
            if(err){
                res.send('-3');  //服务器错误
                return ;
            }
            if(result.length!=0){
                res.send('-1');  //检测到相同的用户名
                return;
            }
            password = md5( md5(password) + 'lqx' );
            db.insertOne( 'users',{ username:username,password:password,avatar:'moren.jpg'},
                function (err,result) {
                    if(err){
                        res.send("-3");
                        return;
                    }
                    req.session.login='1';
                    req.session.username = username;
                    res.send('1')
                })
        })
    });


};