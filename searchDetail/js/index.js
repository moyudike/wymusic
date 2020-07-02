$(function () {
  // 自定义管理每一个界面
  class Views{
    constructor (params) {
      params = params || {offset: 0, limit: 30}
      this.offset = params.offset;
      this.limit = params.limit;
    }
  }
  class Composite extends Views{
    constructor (params) {
      super(params);
      this.name = "composite"
      this.type = 1018
    }
    initDate () {
      // 初始化综合界面
      SearchApis.getDetailSearch(keyword, this.offset, this.limit, this.type)
      .then(function (res) {
        console.log(res);
        // 1.创建所有分区
        let html = template('compositeItem', res.result);
        $(".main-in>.composite").html(html);
        // 2.填充分区的数据
        res.result.order.forEach(function (name) {
          let currentDate = res.result[name]
          // console.log(currentDate);
          if (name === "song") {
            currentDate.songs.forEach(function (obj) {
              obj.artists = obj.ar;
              obj.album = obj.al;
            })
          }else if (name === "playList") {
            currentDate.playlists = currentDate.playLists;
            currentDate.playlists.forEach(function (obj) {
              obj.playCount = formartNum(obj.playCount)
            })
          }else if (name === "video") {
            currentDate.videos.forEach(function (obj) {
              obj.playCount = formartNum(obj.playTime);
              let res = formartTime(obj.durationms);
              obj.time = res.minute + ":" + res.second;
            })
          }
          let currentHtml = template(name + 'Item', currentDate);
          $(".composite>."+name+">.list").html(currentHtml);
        })

        // 填充分区的底部点击
        $(".composite-bottom").click(function () {
          console.log(this.dataset.name);
          $(".nav>ul>."+ this.dataset.name).click()
        })
      })
      .catch(function (err) {
        console.log(err);
      })
    }
  }
  class Song extends Views{
    constructor (myScroll, params) {
      super(params);
      this.myScroll = myScroll;
      this.name = "song";
      this.type = 1;
      // 公共内容区
      $(".multiple-select").click(function () {
        $(".main-in>.song>.top").addClass("active");
        $(".main-in>.song>.list").addClass("active");
      })
      $(".complete-select").click(function () {
        $(".main-in>.song>.top").removeClass("active");
        $(".main-in>.song>.list").removeClass("active");
      })
      //监听全选按钮点击
      $(".check-all").click(function () {
        $(this).toggleClass("active");
        $(".main-in>.song>.list>li").toggleClass("active");
      })
      // 处理单曲界面的头部
      this.myScroll.on("scroll", function () {
        // console.log(this.y);
        if (this.y < 0) {
          $(".main-in>.song>.top").css({top: -this.y})
        }else {
          $(".main-in>.song>.top").css({top: 0})
        }
        // console.log(this.y, myScroll.maxScrollY);
        
        if (this.y <= myScroll.maxScrollY) {
          // console.log('看到加载更多了');
          $(".pull-up>p>span").html("松手加载更多");
          isPullUp = true;
        }
      });
    }
    // 初始化单曲界面
    initData(keyword) {
      let that = this;
    // 搜索单曲数据
    SearchApis.getDetailSearch(keyword, this.offset, this.limit, this.type)
        .then(function (res) {
          // console.log(res.result);
          let html = template('songItem', res.result);
          $(".main-in>.song>.list").html(html);
          myScroll.refresh();
        })
        .catch(function (err) {
          console.log(err);
        })
    }
  }
  class Video extends Views{
    constructor (params) {
      super(params);
      this.name = "video";
      this.type = 1014;
    }
    // 初始化视频界面 
    initData(keyword) {
    // 搜索单曲数据
    SearchApis.getDetailSearch(keyword, this.offset, this.limit, this.type)
    .then(function (res) {
      // console.log(res.result);
      res.result.videos.forEach(function (obj) {
        obj.playCount = formartNum(obj.playTime);
        let res = formartTime(obj.durationms);
        obj.time = res.minute + ":" + res.second;
      })
      let html = template('videoItem', res.result);
      $(".main-in>.video>.list").html(html);
      $(".video .video-title").forEach(function (ele) {
        $clamp(ele, {clamp: 2});
      })
      $(".video .video-info").forEach(function (ele) {
        $clamp(ele, {clamp: 1});
      })
      myScroll.refresh();
    })
    .catch(function (err) {
      console.log(err);
    })
    }
  }
  class Artist extends Views{
    constructor(params) {
      super(params);
      this.name = "artist";
      this.type = 100;
    }
    //初始化歌手界面
    initData(keyword) {
      SearchApis.getDetailSearch(keyword, this.offset, this.limit, this.type)
      .then(function (res) {
        // console.log(res);
        let html = template('artistItem', res.result);
        $(".main-in>.artist>.list").html(html);
        myScroll.refresh();
      })
      .catch(function (err) {
        console.log(err);
      })
    }
  }
  class Album extends Views{
    constructor(params) {
      super(params);
      this.name = "album";
      this.type = 10;
    }
    //初始化专辑界面
    initData(keyword) {
      SearchApis.getDetailSearch(keyword, this.offset, this.limit, this.type)
      .then(function (res) {
        // console.log(res);
        res.result.albums.forEach(function (obj) {
          obj.formartTime = dateFormart("yyyy-MM-dd", new Date(obj.publishTime));
        });
        let html = template('albumItem', res.result);
        $(".main-in>.album>.list").html(html);
        myScroll.refresh();
      })
      .catch(function (err) {
        console.log(err);
      })
    }
  }
  class PlayList extends Views{
      constructor(params) {
        super(params);
        this.name = "playList";
        this.type = 1000;
      }
      // 初始化歌单界面
      initData(keyword) {
        SearchApis.getDetailSearch(keyword, this.offset, this.limit, this.type)
        .then(function (res) {
          // console.log(res);
          res.result.playlists.forEach(function (obj) {
            obj.playCount = formartNum(obj.playCount)
          })
          let html = template('playListItem', res.result);
          $(".main-in>.playList>.list").html(html);
          myScroll.refresh();
        })
        .catch(function (err) {
          console.log(err);
        })
      }
  }
  class DjRadio extends Views{
      constructor(params){
          super(params);
          this.name = "djRadio";
          this.type = 1009;
      }
      //初始化主播电台界面
      initData(keyword) {
      SearchApis.getDetailSearch(keyword, this.offset, this.limit, this.type)
      .then(function (res) {
        // console.log(res);
        let html = template('djRadioItem', res.result);
        $(".main-in>.djRadios>.list").html(html);
        myScroll.refresh();
      })
      .catch(function (err) {
        console.log(err);
      })
    }
  }
  class User extends Views{
      constructor(params){
          super(params);
          this.name = "user";
          this.type = 1002;
      }
      initData(keyword) {
          // 加载用户界面默认数据
          SearchApis.getDetailSearch(keyword, this.offset, this.limit, this.type)
              .then(function (res) {
                  // console.log(data);
                  let html = template('userItem', res.result);
                  $(".main-in>.user>.list").html(html);
                  myScroll.refresh();
              })
              .catch(function (err) {
                  console.log(err);
              });
      }
  }
  class Lyric extends Views{
    constructor(params) {
      super(params);
      this.name = "lyric";
      this.type = 1006;
    }
    //初始化歌词界面
    initData(keyword) {
      SearchApis.getDetailSearch(keyword, this.offset, this.limit, this.type)
      .then(function (res) {
        console.log(res);
        let html = template('lyricItem', res.result);
        $(".main-in>.lyric>.list").html(html);
        myScroll.refresh();
      })
      .catch(function (err) {
        console.log(err);
      })
    }
  }

  // 公共头部
  let keyword = initHeader()
  function initHeader() {
    // 获取传递的数据
    let keyword = window.location.href.substring(window.location.href.lastIndexOf("keyword=") + "keyword=".length);
    // console.log(keyword);
    keyword = decodeURIComponent(keyword).trim();
    // 给头部输入框设置数据
    $(".header input").attr("value", keyword)

    $(".back").click(function () {
      window.history.back();
    })
    $(".clear-text").click(function () {
      window.history.back();
    })
    return keyword;
  }

  // 初始化上拉加载更多
  let isRefresh = true;
  let isPullUp = false;
  let index = 0;
  let myScroll = initScroll()
  function initScroll() {
    // 搜索滚动
    let myScroll = new IScroll(".main", {
      mouseWheel: false,
      scrollbars: false,
      probeType: 3
    })
    // let isRefresh = false;
    // 头部上拉固定
    myScroll.on("scroll", function () {
      // console.log(this.y, myScroll.maxScrollY);
      if (this.y <= myScroll.maxScrollY) {
        console.log('看到加载更多了');
        $(".pull-up>p>span").html("松手加载更多");
        isPullUp = true;
      }
    });
    myScroll.on("scrollEnd", function () {
      if (isPullUp && !isRefresh) {
        $(".pull-up>p>span").html("正在加载...")
        isRefresh = true;
        refreshUp();
      }
    })
    return myScroll;
  }

  //初始化导航宽度
  let views = [new Composite(), new Song(myScroll), new Video(), new Artist(), new Album(), new PlayList(), new Lyric(), new DjRadio(), new User()];
  
  initNav()
  function initNav() {
    let oUlWidth = 0;
    $(".nav>ul>li").forEach(function (oli) {
      oUlWidth += oli.offsetWidth;
    })
    let navpaddingRight = parseFloat(getComputedStyle($(".nav")[0]).paddingRight);
    // console.log(navpaddingRight);
    $(".nav>ul").css({width: oUlWidth + navpaddingRight});
    let navScroll = new IScroll(".nav", {
      // hScroll: true,
      mouseWheel: false,
      scrollbars: false,
      scrollX: true
    })
    
    $(".nav>ul>span").css({width: $(".nav>ul>li")[0].offsetWidth})
    $(".nav>ul>li").click(function () {
      // 计算偏移位
      let offsetX = $(".nav").width()/2 - this.offsetLeft - this.offsetWidth /2;
      // console.log(offsetX);
      // console.log(navScroll.x);
      // console.log(navScroll.maxScrollX);
      if (offsetX > 0) {
        offsetX = 0;
      } else if(offsetX < navScroll.maxScrollX) {
        offsetX = navScroll.maxScrollX;
      }
      // 导航条滚动
      navScroll.scrollTo(offsetX, 0, 500)
      //设置选中改变颜色
      $(this).addClass("active").siblings().removeClass("active");
      $(".nav>ul>span").animate({left: this.offsetLeft, width: this.offsetWidth}, 200);
      $(".main-in>div").removeClass('active').eq($(this).index()).addClass("active");
      myScroll.refresh();

      // 控制上拉加载更多显示和隐藏
      index = $(this).index();
      // console.log(index);
      if (index === 0) {
        $(".pull-up").hide()
        isRefresh = true;
      }else {
        $(".pull-up").show()
        isRefresh = false;
      }

      let curViewObj = views[index];
      if (curViewObj.initData) {
        curViewObj.initData(keyword);
        delete curViewObj.initData;
        // console.log(curViewObj);
      }
    })
  }

  // 公共底部
  $(".footer").load("./../../common/footer.html", function () {
    let sc = document.createElement("script");
    sc.src = "./../common/js/footer.js";
    document.body.append(sc);
  })

  function refreshUp() {
    let curViewObj = views[index];
    curViewObj.offset += curViewObj.limit;
    SearchApis.getDetailSearch(keyword, curViewObj.offset, curViewObj.limit, curViewObj.type)
      .then(function (res) {
        // console.log(res);
        let name = undefined;
        if (curViewObj.name === "user") {
          name = "userprofileCount"
        }else {
          name = curViewObj.name.toLowerCase() + "Count";
        }
        let count = res.result[name];

        // console.log(res.result[curViewObj.name.toLowerCase() + "Count"]);
        if (count !== undefined && count > 0) {
          let html = template(curViewObj.name + 'Item', res.result);
          $(".main-in>."+curViewObj.name+">.list").append(html);
          isRefresh = false;
          myScroll.refresh();
        }else {
          $(".pull-up").hide();
          isRefresh = true;
        }
        isPullUp = false;
      })
      .catch(function (err) {
        console.log(err);
      })
  }

   
  // initComposite()
  // function initComposite() {
    
  //   /*
  //   // 3.填充单曲数据
  //   let songData = res.result.song;
  //   songData.songs.forEach(function (obj) {
  //     obj.artists = obj.ar;
  //     obj.album = obj.al;
  //   })
  //   let songHtml = template('songItem', songData);
  //   $(".composite>.song>.list").html(songHtml);
  //   // 3.填充歌单数据
  //   let playListData = res.result.playList;
  //   playListData.playlists = playListData.playLists;
  //   playListData.playlists.forEach(function (obj) {
  //     obj.playCount = formartNum(obj.playCount)
  //   })
  //   let playListhtml = template('playListItem', playListData);
  //   $(".composite>.playlist>.list").html(playListhtml);
  //   myScroll.refresh();
  //   */

  // }


  let cp = new Composite();
  cp.initDate(keyword)

})
