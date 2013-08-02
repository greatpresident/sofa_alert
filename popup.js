function init() {
	contentDiv = document.createElement("div")
	contentDiv.id = "contentDiv"
	document.body.appendChild(contentDiv)
	noResultDiv = document.createElement("div")
	noResultDiv.textContent = "暂未检测到有人抢沙发"
	contentDiv.appendChild(noResultDiv)
}

function go() {
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			message: "sofas"
		}, function(response) {
			for (var i = 0, pair; pair = response.result[i]; i++) {
				var result = document.createElement("p")
				var lz = pair.lz
				var sofa = pair.sofa
				var position = pair.position
				if (!sofaFilter(sofa, lz)) continue

				hideNoResult()
				result.innerHTML = "<strong>" + sofa + "</strong> 抢了 <strong>" + lz + "</strong> 的沙发！"
				result.position = position
				result.onclick = function(e) {
					// console.log("我被点了！" + JSON.stringify(position))
					var resultDiv = this
					chrome.tabs.query({
						active: true,
						currentWindow: true
					}, function(tabs) {
						chrome.tabs.sendMessage(tabs[0].id, {
							message: "focus",
							position: resultDiv.position
						}, null)
					})
				}
				contentDiv.appendChild(result)
			}
		})
	})
}

//返回值为false便需要滤掉

function sofaFilter(sofa, lz) {
	if (lz == sofa) {
		lz = "自己"
		return false //抢自己沙发的都不显示，因为很可能是对分享的评论
	}

	if (sofa == target_sofa) {
		return true
	} else {
		// return false
	}

	return true
}

//将缺省无结果页面隐藏

function hideNoResult() {
	noResultDiv.style.display = "none"
}

//-----------------全局变量-------------------
var target_sofa = "张夏挺"
var contentDiv //内容块
var noResultDiv

//----------------main----------------------
init()
go()