function search() {
    return Array.prototype.map.call(
        document.getElementsByClassName("a-feed"),
        function(feed){
            var replies = feed.getElementsByClassName("feed-replies")[0]
            if (replies){
                var sofa = null
                if (sofa = replies.querySelector(".a-reply")) {
                   var sofa_name = sofa.querySelector(".reply-info a").textContent
                   var lz_name = feed.querySelector(".feed-user-info a").textContent
                   return {
                       sofa: sofa_name,
                       lz: lz_name,
                       position: position(feed)
                   }; //sofa：沙发名，lz：楼主名，position：状态在页面中的绝对坐标
                }
            }
        }).filter(function(n){return !!n;})
}

function position(feed) {
    var x = feed.offsetLeft,
        y = feed.offsetTop
            while (feed = feed.offsetParent) {
                x += feed.offsetLeft
                    y += feed.offsetTop
            }
    return {
        x: x,
        y: y
    }
}

//----------------main----------------------
console.log("沙发监听器启动")
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.message) {
    case "sofas":
        sendResponse({
            result: search()
        })
        break
    case "focus":
       //尽量保证窗口滚动后横坐标不变，除非窗口太靠右导致新鲜事左边无法显示
       var scrollX = request.position.x < window.scrollX ? request.position.x : window.scrollX
       window.scrollTo(scrollX, request.position.y - paddingTop)
       break
    default:
       sendResponse({
           result: "不告诉你"
       })
    }
})

//-----------------全局变量-------------------
var paddingTop = 50 //状态的CSS里找到的属性
