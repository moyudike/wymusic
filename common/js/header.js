$(function () {
  $(".header-center-box>input").focus(function () {
        $(".header-in").addClass("active");
        $(".header-container").show();
        $(".history-bottom>li").remove();
        let historyArray = getHistory();
        if (historyArray.length === 0) {
          $(".search-history").hide()
        } else {
          $(".search-history").show()
          historyArray.forEach(function (item) {
            let oLi = $("<li>"+ item +"</li>")
            $(".history-bottom").append(oLi)
          })
          $(".history-bottom>li").click(function () {
            window.location.href = "./../searchDetail/index.html?keyword=" + $(this).text()
          })
        }
        searchScroll.refresh()
    });
    $(".header-cancle").click(function () {
        $(".header-in").removeClass("active");
        $(".header-container").hide();
        $(".header-center-box>input")[0].oninput()
    });
    $(".header-switch>span").click(function () {
        $(this).addClass("active").siblings().removeClass("active")
        $(".header-switch>i").animate({left: this.offsetLeft},100)
    })
    // 搜索区域
    $(".search-ad>span").click(function () {
      $(".search-ad").remove();
    })
    
    $(".header-center-box>input").blur(function () {
      // console.log('hello')
      if (this.value.length === 0) {
        return;
      }
      setHistory(this.value);
      this.value = "";
    })
    function getHistory() {
      let historyArray = localStorage.getItem("history");
      if (!historyArray) {
        historyArray = []
      } else {
        historyArray = JSON.parse(historyArray)
      }
      return historyArray;
    }
    $(".history-top>img").click(function () {
      localStorage.removeItem("history");
      $(".search-history").hide()
    })
    function setHistory(value) {
      let historyArray = getHistory();
      if (!historyArray.includes(value)) {
        historyArray.unshift(value);
        localStorage.setItem("history", JSON.stringify(historyArray))
      }
    }
    // 搜索数据
    HomeApis.getSearch()
      .then(function (data) {
        // console.log(data);
        let html = template('hot-Detail', data);
        $(".hot-bottom").html(html);
        searchScroll.refresh()
      })
      .catch(function (err) {
        console.log(err);
      })
      // 创建滚动
      let searchScroll = new IScroll('.header-container', {
        mouseWheel: false,
        scrollbars: false,
        probeType: 3,
        // 需要使用 iscroll-probe.js才能生效
        // probeType ：1  滚动不繁忙的时候触发
        // probeType ：2  滚动时每隔一定时间触发
        // probeType ：3  每滚动 一像素触发一次
    });
    $(".header-center-box>input")[0].oninput = throttle(function () {
      if (this.value === 0) {
        $(".search-ad").show()
        // $(".search-history").show()
        $(".search-hot").show()
        $(".search-current").hide()
      }else {
        $(".search-ad").hide()
        $(".search-history").hide()
        $(".search-hot").hide()
        $(".search-current").show()
        HomeApis.getHomeSearchSuggest(this.value)
          .then(function (data) {
            console.log(data)
            $(".current-bottom>li").remove()
            data.result.allMatch.forEach(function (obj) {
              let oLi = $(`
              <li>
                <img src="images/topbar-search.png" alt="">
                <p>${obj.keyword}</p>
              </li>
              `)
              $(".current-bottom").append(oLi)
            })
            $(".history-bottom>li").click(function () {
              window.location.href = "./../searchDetail/index.html?keyword=" + $(this).text()
            })
            searchScroll.refresh();
          })
          .catch(function (err) {
            console.log(err);
          })
      }
      $(".current-top").text(`搜索"${this.value}"`)

      searchScroll.refresh()
    }, 1000)
})