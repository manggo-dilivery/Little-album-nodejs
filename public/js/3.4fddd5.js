webpackJsonp([3],{210:function(t,n,a){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=a(219),e=a(248),i=!1;var r=function(t){i||a(246)},c=a(7)(o.a,e.a,!1,r,"data-v-9a9fb8ce",null);c.options.__file="src\\components\\home\\shareImage.vue",n.default=c.exports},219:function(t,n,a){"use strict";n.a={data:function(){return{category:[],categoryList:[],allLoaded:!1,autoFill:!1}},created:function(){var t=this;this.$axios.get("/provide/category").then(function(n){t.category=n.data}).catch(function(t){console.log(t)}),this.changeCategory(0)},methods:{changeCategory:function(t){var n=this;this.$axios.get("/provide/categoryList?id="+t+"&page=0").then(function(t){n.categoryList=t.data,n.$refs.loadMore.onBottomLoaded()}).catch(function(t){console.log(t)})},loadBottom:function(){this.loadConcat()}}}},246:function(t,n,a){var o=a(247);"string"==typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);a(6)("1ba5639f",o,!1,{})},247:function(t,n,a){(t.exports=a(5)(!1)).push([t.i,"\n.photo-list[data-v-9a9fb8ce]{\n    margin-bottom:52px;\n}\n.photo-header li[data-v-9a9fb8ce] {\n    list-style: none;\n    display: inline-block;\n    margin-left: 10px;\n    height: 30px;\n}\n.photo-header ul[data-v-9a9fb8ce] {\n    /*强制不换行*/\n    white-space: nowrap;\n    overflow-x: auto;\n    padding-left: 0px;\n    margin: 5px;\n}\n\n\n/*下面的图片*/\n.photo-list li[data-v-9a9fb8ce] {\n    list-style: none;\n    position: relative;\n}\n.photo-list li img[data-v-9a9fb8ce] {\n    width: 100%;\n    height: 230px;\n    vertical-align: top;\n}\n.photo-list ul[data-v-9a9fb8ce] {\n    padding-left: 0px;\n    margin: 0;\n}\n.photo-list p[data-v-9a9fb8ce] {\n    position: absolute;\n    bottom: 0px;\n    color: white;\n    background-color: rgba(0, 0, 0, 0.3);\n    margin-bottom: 0px;\n}\n.photo-list p span[data-v-9a9fb8ce]:nth-child(1) {\n    font-weight: bold;\n    font-size: 16px;\n}\n\n/*图片懒加载的样式*/\nimage[lazy=loading][data-v-9a9fb8ce] {\n    width: 40px;\n    height: 300px;\n    margin: auto;\n}\n.imageLoadMore[data-v-9a9fb8ce]{\n    height: 500px;\n    overflow: scroll;\n}\n",""])},248:function(t,n,a){"use strict";var o=function(){var t=this,n=t.$createElement,a=t._self._c||n;return a("div",[a("navBar",{attrs:{title:"图文分享"}}),t._v(" "),a("div",{staticClass:"photo-header"},[a("ul",t._l(t.category,function(n){return a("li",{key:n.id},[a("a",{attrs:{href:"javascript:;"},on:{click:function(a){t.changeCategory(n.id)}}},[a("p",[t._v(t._s(n.category))])])])}))]),t._v(" "),a("div",{staticClass:"photo-list"},[a("ul",{staticClass:"imageLoadMore"},t._l(t.categoryList,function(n,o){return a("li",{key:o},[a("img",{attrs:{src:n.category_image}}),t._v(" "),a("p",[a("span",{domProps:{textContent:t._s(n.categoryContent)}})])])}))])],1)};o._withStripped=!0;var e={render:o,staticRenderFns:[]};n.a=e}});