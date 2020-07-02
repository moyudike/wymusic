$(function () {
   // 底部选项卡
  let pageArray = ["home", "video", "me", "friend", "account"]
  $(".footer-in>ul>li").click(function () {
      $(this).addClass("active").siblings().removeClass("active")
      let url = $(this).find("img").attr("src")
      // console.log(url);
      url = url.replace("normal", "selected")
      $(this).find("img").attr("src", url)
      $(this).siblings().find("img").forEach(itemImg => itemImg.src = itemImg.src.replace("selected", "normal"));
      
      let currentItem = pageArray[$(this).index()];
      $(".header").removeClass().addClass("header-in " + currentItem);

      // window.location.href = "./../" + currentItem + "/index.html#" + currentItem;
  })

  let hashStr = window.location.hash.substr(1);
  // console.log(hashStr.length);
  
  if (hashStr.length === 4) {
    $(".home").click()
  } else {
   $("." + hashStr).click()
  }
})