$(function () {
  //公共头部
  $(".header").load("./../../common/header.html", function () {
    let sc = document.createElement("script");
    sc.src = "./../common/js/header.js"
    document.body.append(sc)
  })
  // 公共底部
  $(".footer").load("./../../common/footer.html", function () {
    let sc = document.createElement("script");
    sc.src = "./../common/js/footer.js";
    document.body.append(sc);
  })
})