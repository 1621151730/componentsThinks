// 为了更好的移植性选择js
let pullRefreshNode = document.querySelector(".pull-refresh-info");
let loadingNode = document.querySelector(".loading");
let startY = 0; //初始用户点击的位置
let scrollDistance = 0; //用户滑动的距离
let loadingStart = false; //加载中的状态，true时就不让用户在下拉了
let pullTimerId = null; //pull给定时设置id，结束就清除掉，这是一个好习惯
let listTimerId = null; //list给定时设置id，结束就清除掉，这是一个好习惯
pullRefreshNode.addEventListener("touchstart",touchStartFuc,false)
pullRefreshNode.addEventListener("touchmove",touchMoveFuc,false)
pullRefreshNode.addEventListener("touchend",touchEndFuc,false)

function touchStartFuc(e) {
  // 触摸开始
  if(!loadingStart){
    startY = e.changedTouches[0].clientY;
    loadingNode.innerText = "下拉刷新";
    pullRefreshNode.style.transitionDuration = "0s"; 
  }
}

function touchMoveFuc(e) {
  // 持续触摸中
  let scrollTop = window.pageYOffset  || document.body.scrollTop || document.documentElement.scrollTop;
  if(scrollTop == 0 && !loadingStart){
    scrollDistance = e.changedTouches[0].clientY - startY;
    // 距离大于 0px 小于 100px 才会有效果
    if(scrollDistance < 100 && scrollDistance > 0){
      if(scrollDistance > 70){
        //我们在下面加载的信息是距离大于70px,才更新动画,距离大于70px就可以提示了
        loadingNode.innerText = "释放即可刷新";
      }
      pullRefreshNode.style.transform = `translateY(${scrollDistance}px)`
    }
  }
}

function touchEndFuc(e){
  // 触摸结束--开始刷新数据--如果使用框架，封装成组件，发射监听函数，父组件捕捉到，去请求接口即可
  pullRefreshNode.style.transitionDuration = "0.25s"; // 添加返回的动画时间
  if(scrollDistance > 70){
    loadingStart = true; //不准用户再次加载中下拉
      loadingNode.innerHTML = `
      <div class="loading-info">
          <span class="loading-animation">加载动画</span>
          <span class="loading-text">加载中<dot>...</dot></span>
      </div>
    `;
    pullRefreshNode.style.transform = `translateY(50px)`; //返回70px,剩下的距离可以展示内容
    // 什么时候请求接口结束，返回一个boolean的状态，去修改一下的这个初始化就行
    //setTimeout的设置，就是为了模仿一下，异步请求
    pullTimerId = setTimeout(()=>{
      //数据更新时间
      loadingNode.innerHTML = "";
      pullRefreshNode.style.transform = `translateY(0px)`;
      scrollDistance = 0 ; // 距离清0，恢复初始化
      loadingStart = false; // 初始化下拉
      clearTimeout(pullTimerId);
    },3000)
  }else{
    pullRefreshNode.style.transform = `translateY(0px)`;
    loadingNode.innerText = "";
  }
}
/*--------------------------------上滑加载------------------------------ */
// 一般不会到了触底才去请求函数 300px 150px 只有就可以请求数据了
let wListNode = document.querySelector(".w-list");
let listLoadingNode = document.querySelector(".w-list .list-loading");
// 视口高度
let clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
//记录上一次的scrollTop
let perScrollTopList = 0;
window.addEventListener("scroll",scrollListFuc,false);
// 文档高度小于视口高度 wListNode.clientHeight
scrollListFuc();
function scrollListFuc(){
  // 文档的总高度
  let scrollHeight =  document.body.scrollHeight || document.documentElement.scrollHeight;
  // 滚动条的高度
  let scrollTop = window.pageYOffset  || document.body.scrollTop || document.documentElement.scrollTop;
  console.log(wListNode.clientHeight,clientHeight);
  if(wListNode.clientHeight < clientHeight || scrollHeight - scrollTop - clientHeight <= 30 && perScrollTopList < scrollTop){
    //加载中先移除组件
    window.removeEventListener("scroll",scrollListFuc,false);
    console.log("触底了准备请求，加入数据");
    listLoadingNode.style.height = "50px";
    listLoadingNode.innerHTML = `
      <div class="loading-info">
          <span class="loading-animation">加载动画</span>
          <span class="loading-text">加载中<dot>...</dot></span>
      </div>
    `;
    listTimerId = setTimeout(()=>{
      //数据更新时间，更新数据长度是多少
      //我自己假设一下，加载几个就不让加载了，使用框架就直接传递数据是否为空判断就好了
      let dataList = wListNode.children.length > 6? [] : ["不为空"];
      if(dataList.length == 0){
        listLoadingNode.innerText="没有更多了"
        perScrollTopList = Infinity; //防止加载完成继续加载 ，设置最大值，在加载完毕没有数据加载了，上滑在30px区间内部不会触发加载
      }else{
        listLoadingNode.innerHTML = "";
        listLoadingNode.style.height = "0px";
        // 下面是创建节点 你们存成在框架里，直接在对象中积累添加数据就行
        let newNode = document.createElement("div")
        newNode.className = "block";
        newNode.innerText = "内容";
        wListNode.insertBefore(newNode,listLoadingNode);
        window.addEventListener("scroll",scrollListFuc,false); // 放里面，就不需要考虑加载结束，滑动继续加载问题
      }
      console.log("加载结束");
      //window.addEventListener("scroll",scrollListFuc,false); //放外面，重新滑倒底部有会请求一次
      clearTimeout(listTimerId);
      if(wListNode.clientHeight < clientHeight){
        scrollListFuc();
      }
    },1500)
  }
  perScrollTopList = scrollTop;
}

/**注意销毁组件了，记得把你写的监听window移除掉 */