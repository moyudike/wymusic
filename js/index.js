$(function () {
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
        // console.log(currentItem);
        $(".header").removeClass().addClass("header " + currentItem)
    })

    // 公共区域
    // 1.获取svg路径长度
    let length = $("#refreshLogo")[0].getTotalLength();
    // 2.默认隐藏路径
    $("#refreshLogo").css({"stroke-dasharray": length})
    $("#refreshLogo").css({"stroke-dashoffset": length})
    // 3.创建iscroll
    let myScroll = new IScroll('.main', {
        mouseWheel: false,
        scrollbars: false,
        probeType: 3
        // 需要使用 iscroll-probe.js才能生效
        // probeType ：1  滚动不繁忙的时候触发
        // probeType ：2  滚动时每隔一定时间触发
        // probeType ：3  每滚动一像素触发一次
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
    let mySwiper = new Swiper ('.swiper-container', {
        autoplay: {
            delay: 1000
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
    HomeApis.getHomeBanner ()
        .then (function (data) {
            // console.log(data);
            let html = template('bannerSlide', data);
            $('.swiper-wrapper').html(html);
            myScroll.refresh();
        })
        .catch (function (err) {
            console.log(err)
        })
    /* 创建首页导航 */
    // let data = new Date();
    // console.log(data.getDate());
    $(".nav i").html(new Date().getDate())
    HomeApis.getHomeRecommend ()
        .then (function (data) {
            // console.log(data);
            let html = template('recommendItem', data);
            $(".recommend-bottom").html(html);
             /* 创建推荐歌单 */
            $(".recommend-title").forEach(function (ele) {
                $clamp($("ele")[0], {clamp: 2});
            })
            myScroll.refresh();
        })
        .catch (function (err) {
            console.log(err);
        })
})