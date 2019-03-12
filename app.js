var controller = require("./controller/controller.js");
var express = require("express");
var app = express();
var path = require('path');
var session = require('express-session');


app.set("view engine","ejs");
app.use(express.static("./public"));
app.use("/avatar",express.static("./avatar"));


//使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

//vue设置请求头
app.use("*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    if (req.method === 'OPTIONS') {
        res.send(200)
    } else {
        next()
    }
});
// 路由表r
app.get('/index',controller.showIndex);   //首页路由
app.get('/register',controller.showRegister);   //显示注册页面
app.post('/doregist',controller.doRegist);  //执行注册信息
app.get("/login",controller.showLogin);     //显示登录页面
app.post('/dologin',controller.dologin);    //执行登录信息
app.get('/person',controller.showperson);    //显示个人页面
app.get('/cut',controller.showcut);        //裁切头像页面
app.get('/docut',controller.docut);          //执行切图
app.post('/doavatar',controller.doavatar);
app.post('/report/uploadImage',controller.uploadimg);
app.post('/report/markupStr',controller.markupStr);
app.get('/search/article',controller.searchArticle);
app.get('/content',controller.showContent);
app.get('/deleteContent',controller.deleteContent);
app.get('/getuserinfo',controller.getuserinfo);
app.get('/getAllArticle',controller.getAllArticle);
app.get('/getpage',controller.getArticlePage);

//vue后台路由表
app.get('/vue/houtai',controller.showHoutai);     //
app.get('/vue/form',controller.showform);           //轮播图
app.post('/vue/postimage',controller.postimage); //上传轮播图
app.get('/vue/delete_lunbo',controller.delete_lunbo); //删除轮播图
app.post('/vue/uploadstr',controller.uploadstr);   //上传富文本编辑器的内容
app.post('/vue/makeupStr2',controller.makeupStr2);   //上传富文本编辑器的内容
app.get('/vue/deleteContent',controller.vue_deleteContent);  //删除提交的内容
app.get('/vue/shareImage',controller.showShareImage);    //显示图文分享
app.get('/vue/setCategory',controller.setCategory);    //设置分类信息接口
app.get('/vue/setCategoryContent',controller.setCategoryContent);    //设置分类信息接口
app.post('/vue/uploadCategory',controller.uploadCategory);    //上传分类信息接口
app.get('/vue/goods',controller.showgoods);    //商品列表接口
app.post('/vue/goodsInfo',controller.goodsInfo);    //提交商品信息存入数据库接口
//vue页面提供数据接口
app.get('/vue/provide/lunbo',controller.provideLunbo);
app.get('/vue/provide/article',controller.provideArticle);
app.get('/vue/provide/findArticle',controller.findArticle);
app.get('/vue/provide/category',controller.provideCategory);  //分类查询接口（有哪些分类）
app.get('/vue/provide/categoryList',controller.provideCategoryList);  //查询分类详细信息接口
app.get('/vue/provide/goodsInfo',controller.provideGoodsInfo);  //查询分类详细信息接口
app.get('/vue/provide/goodsDetailInfo',controller.providegoodsDetailInfo);  //查询详细页面分类详细信息接口
app.get('/vue/provide/getShopCarList/:id',controller.getShopCarList);  //查询详细页面分类详细信息接口

app.get('/vue',controller.showVue);

app.listen(80);

