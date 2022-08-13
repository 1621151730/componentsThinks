// 为了更好的移植性选择js
//右拉的弹性效果是怎么实现的
let swipeAllNode = document.querySelectorAll(".swipe");
swipeAllNode.forEach(item =>{
  item.addEventListener("touchmove",touchMoveFuc,false)
  item.addEventListener("touchend",touchEndFuc,false)
  let swipeContainer = item.querySelector(".container");
  swipeContainer.addEventListener("touchstart",touchContainerStartFuc,false);
  let btnRightNode = item.querySelectorAll(".btn-right .btn");
  let startX = 0; //初始用户点击的位置
  let scrollDistance = 0; //用户滑动的距离
  let scrollBtn = [];
  let btnBlockTotalWidth = 0;
  let swipeState = false;//false是没有滑动
  let swipeContainerTimeId = null;
  btnRightNode.forEach(itemNode =>{
    // 节点 + 上几个节点的宽度
    scrollBtn.push([itemNode,btnBlockTotalWidth])
    btnBlockTotalWidth += itemNode.clientWidth;
  })

  function touchContainerStartFuc(e){
    startX = e.changedTouches[0].clientX;
    item.style.transitionDuration = "0s"; 
    swipeContainerTimeId = setTimeout(()=>{
      if(swipeState){
        item.style.transitionDuration = "0.25s"; // 添加返回的动画时间
        item.style.transform  = `translateX(0px)`;
        scrollDistance = 0;
        clearTimeout(swipeContainerTimeId);
      }
    },500)
  }
  
  function touchMoveFuc(e) {
    // 持续触摸中
    clearTimeout(swipeContainerTimeId);
    scrollDistance = startX - e.changedTouches[0].clientX;
    if(!swipeState){
      //正常拉出
      if( scrollDistance>0){
        //填充动态拉动效果
        if(scrollDistance - btnBlockTotalWidth < 0){
          // 拉出在正常范围内部
          item.style.transform = `translateX(-${scrollDistance}px)`
           // width是上一个块的，产生叠加的效果
           // 使其同时结束，则width1+width2与width2走出了相同时间，width1+width2的长度与scrollDistance一样
  
           for (let i = 0; i < scrollBtn.length - 1; i++) {
              //记录这个btn前面的宽度，scrollDistance滑行到了btnBlockTotalWidt总宽，那么就是left前面宽度那么远
              // 简单说，这个是百分比滑动的策略
              scrollBtn[i+1][0].style.left = `${ (scrollDistance*scrollBtn[i+1][1])/btnBlockTotalWidth}px`
           }
        }else if(scrollDistance - btnBlockTotalWidth < 50){
          // 多拉出一点，产生布局一种弹性效果
          item.style.transform = `translateX(-${scrollDistance}px)`
          btnRightNode.forEach(itemNode =>{
            itemNode.style.paddingRight = `${20 + 50}px`
           })
          for (let i = 0; i < scrollBtn.length - 1; i++) {
            scrollBtn[i+1][0].style.left = `${ (scrollDistance*scrollBtn[i+1][1])/(btnBlockTotalWidth+25)}px`
          }
        }
      }
    }else{
      //来回拉动
      scrollDistance = startX - e.changedTouches[0].clientX;
      //滑出来的距离是 btnBlockTotalWidth
      if(btnBlockTotalWidth + scrollDistance > 0){
        if(scrollDistance < 0){
          item.style.transform = `translateX(${-(btnBlockTotalWidth+scrollDistance)}px)`
          for (let i = 0; i < scrollBtn.length - 1; i++) {
            scrollBtn[i+1][0].style.left = `${((btnBlockTotalWidth+scrollDistance)*scrollBtn[i+1][1])/(btnBlockTotalWidth)}px`
          }
        }else if(scrollDistance < 50){
          // 多拉出一点，产生布局一种弹性效果
          item.style.transform = `translateX(-${scrollDistance+btnBlockTotalWidth}px)`
          btnRightNode.forEach(itemNode =>{
            itemNode.style.paddingRight = `${20 + 50}px`
           })
          for (let i = 0; i < scrollBtn.length - 1; i++) {
            scrollBtn[i+1][0].style.left = `${((btnBlockTotalWidth+scrollDistance)*scrollBtn[i+1][1])/(btnBlockTotalWidth+25)}px`
          }
        }
      
      }
    }
  }
  
  function touchEndFuc(e){
    // 触摸结束
    item.style.transitionDuration = "0.25s"; // 添加返回的动画时间
    // 滑动一半以上,
    // 还要swipeState = false
    // 滑动的距离还要大于10,因为避免一开始触摸就松开,导致一些问题
    if(btnBlockTotalWidth < scrollDistance*3 && !swipeState && scrollDistance>10){
      console.log("触摸结束，已经滑出");
      swipeState = true; //判定已经划出去了
      item.style.transform  = `translateX(${-btnBlockTotalWidth}px)`;
      //展开,展开的距离就是离定位点的距离
      for (let i = 0; i < scrollBtn.length - 1; i++) {
        scrollBtn[i+1][0].style.left = `${(scrollBtn[i+1][1])}px`
      }
    }else{
      // 不符合标准,就初始化,重新开始吧
      swipeState = false;
      item.style.transform  = `translateX(0px)`;
      scrollDistance = 0;
    }
  }
})



