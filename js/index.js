$(function () {
      $(".header-center-box>input").focus(function () {
        $(".header").addClass("active");
    });
    $(".header-cancle").click(function () {
        $(".header").removeClass("active");
    });
    $(".header-switch>span").click(function () {
        $(this).addClass("active").siblings().removeClass("active")
        $(".header-switch>i").animate({left: this.offsetLeft},100)
    })
    let pageArray = ["home", "video", "me", "friend", "account"]
    $(".footer>ul>li").click(function () {
        $(this).addClass("active").siblings().removeClass("active")
        let url = $(this).find("img").attr("src")
        // console.log(url);
        url = url.replace("normal", "selected")
        $(this).find("img").attr("src", url)
        $(this).siblings().find("img").forEach(itemImg => itemImg.src = itemImg.src.replace("selected", "normal"));
        let currentItem = pageArray[$(this).index()];
        $(".header").removeClass().addClass("header " + currentItem)
    })

    // 公共区域
    // 1.获取svg路径长度
    let length = $("#refreshLogo")[0].getTotalLength();
    // console.log(length);
    // 2.默认隐藏路径
    $("#refreshLogo").css({"stroke-dasharray": length})
    $("#refreshLogo").css({"stroke-dashoffset": length})
    // 3.创建iscroll
    let myScroll = new IScroll('.main', {
        mouseWheel: false,
        scrollbars: false,
        probeType: 3,
        // 需要使用 iscroll-probe.js才能生效
        // probeType ：1  滚动不繁忙的时候触发
        // probeType ：2  滚动时每隔一定时间触发
        // probeType ：3  每滚动 一像素触发一次
    });
    // 3.开始滚动
    let logoHeight = $(".pull-down").height();
    let isPullDown = false;
    let isRefresh = false;
 
    myScroll.on("scroll", function () {
        // console.log('滚动中', this.y)
        if (this.y >= logoHeight) {
            if ((this.y - logoHeight) * 3 <= length) {
                $("#refreshLogo").css({"stroke-dashoffset": length - (this.y - logoHeight) * 3})
            }else {
                // console.log('画完了')
                // 自己添加的代码
                this.minScrollY = 170;
                isPullDown = true
            }
        }
        // console.log(this.y, this.maxScrollY, maxOffsetY, bottomHeight);
    })
    myScroll.on("scrollEnd", function () {
        if (isPullDown && !isRefresh) {
            isRefresh = true
            refreshDown();
        }
    })
    function refreshDown() {
        setTimeout(function () {
            console.log('数据刷新完毕');
            isPullDown = false;
            isRefresh = false
            myScroll.minScrollY = 0;
            myScroll.scrollTo(0, 0);
            $("#refreshLogo").css({"stroke-dashoffset": length})
        }, 3000)
    }

    // 创建首页轮播    
    
    HomeApis.getHomeBanner ()
        .then (function (data) {
            // console.log(data);
            let html = template('bannerSlide', data);
            $('.swiper-wrapper').html(html);
            let mySwiper = new Swiper ('.swiper-container', {
              autoplay: {
                  delay: 1000,
                  disableOnInteraction: false
              },
              loop: true, // 循环模式选项
              // 如果需要分页器
              pagination: {
                  el: '.swiper-pagination',
                  bulletClass : 'my-bullet',
                  bulletActiveClass: 'my-bullet-active',
              },
              observer: true,
              observerParents: true,
              observerSlideChildren: true, 
          })
            myScroll.refresh();
        })
        .catch (function (err) {
            console.log(err)
        })
    /* 创建首页导航 */
    // let data = new Date();
    // console.log(data.getDate());
    $(".nav i").html(new Date().getDate())
    // 推荐歌单
    HomeApis.getHomeRecommend ()
        .then (function (data) {
            // console.log(data);
            data.title = "推荐歌单";
            data.subTitle = "歌单广场";
            if (!data.result){
              return;
            }
            data.result.forEach(function (obj) {
                obj.width = 216/100;
                obj.playCount = formartNum(obj.playCount)
            })
            let html = template('category', data);
            $(".recommend").html(html);
            $(".recommend .category-title").forEach(function (ele) {
                $clamp(ele, {clamp: 2})
            })
            myScroll.refresh();
        })
        .catch (function (err) {
            console.log(err);
        })
    // 创建独家放送
    HomeApis.getHomeExclusive ()
      .then(function (data) {
          data.title = "独家放送";
          data.subTitle = "网易出品";
          if (!data.result) {
            return;
          }
          data.result.forEach(function (obj, index) {
              obj.width = 334/100;
            if (index === 2) {
              obj.width = 690/100
            }
          })
          let html = template('category', data);
          $(".exclusive").html(html);
          $(".exclusive .category-title").forEach(function (ele) {
              $clamp(ele, {clamp: 2})
          })
          myScroll.refresh();
      })
      .catch(function (err) {
        console.log(err);
      })
      //创建新碟新歌区
      HomeApis.getHomeAlbum()
      .then(function (data) {
          data.title = "新碟新歌";
          data.subTitle = "更多新歌";
          if (!data.result) {
            return;
          }
          data.result = data["album"];
          data.result.forEach(function (obj) {
            data.artistName = data.artist.name;
            obj.width = 216/100;
          })
          let html = template('category', data);
          $(".album").html(html);
          $(".album .category-title").forEach(function (ele) {
              $clamp(ele, {clamp: 2})
          })
          $(".album .category-singer").forEach(function (ele) {
            $clamp(ele, {clamp: 1})
        })
        myScroll.refresh();
      })
      .catch(function (err) {
        console.log(err);
      })
      //创建mv
      HomeApis.getHomeMv()
      .then(function (data) {
          data.title = "推荐MV";
          data.subTitle = "更多MV";
          data.result.forEach(function (obj) {
            obj.width = 334/100;
          })
          let html = template('category', data);
          $(".mv").html(html);
          $(".mv .category-title").forEach(function (ele) {
              $clamp(ele, {clamp: 1})
          })
          $(".mv .category-singer").forEach(function (ele) {
              $clamp(ele, {clamp: 1})
          })
          myScroll.refresh();
      })
      .catch(function (err) {
        console.log(err);
      })
      HomeApis.getHomeDj()
      .then(function (data) {
          data.title = "主播电台";
          data.subTitle = "更多主播";
          data.result.forEach(function (obj) {
            obj.width = 216/100;
          })
          let html = template('category', data);
          $(".dj").html(html);
          $(".dj .category-title").forEach(function (ele) {
              $clamp(ele, {clamp: 2})
          })
          myScroll.refresh();
      })
      .catch(function (err) {
        console.log(err)
      })

      function formartNum(num) {
          let res = 0;
          if (num / 100000000 > 1) {
              let temp = num / 100000000 + "";
              if (temp.indexOf(".") === -1) {
                res = num / 100000000 + '亿';
              }else {
                res = (num / 100000000).toFixed(1) + '亿';
              }
          }else if (num / 10000 > 1) {
              let temp = num / 10000 + "";
              if (temp.indexOf(".") === -1) {
                res = num / 10000 + '万';
              }else {
                res = (num / 10000).toFixed(1) + '万';
              }
          }else {
            res = num;
          }
          return res;
      }
      // setTimeout(function () {
      //   console.log(myScroll.maxScrollY);
      //   myScroll.refresh();
      //   console.log(myScroll.maxScrollY);
      // }, 5000)
})