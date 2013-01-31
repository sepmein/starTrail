#Star Trail
###by Spencer

使用Raphaeljs模拟星空长曝光的情景。下载该repo，双击index.html在浏览器中查看该效果。

配置星空效果：

打开scripts.js，找到一下片段，对该变量作的任何修改能改变star trails在浏览器中的表现。

```
var preference = {
		P: [640, 400],
		//中心位置
		ALPHA: 0,
		//星轨的初始角度
		MAXRANGE: 1000,
		//最远的星轨到中心的距离，越大分布越稀疏
		NUMOFTRAILS: 100,
		//星轨条数，数目增大严重影响性能，3000左右能模拟真实自然界场景
		MAGNITUDE: {
			NUM: [10, 23, 67, 229, 738, 2420],
			//模拟自然界中星等，分别为一等星、二等星。。。
			LIGHT: [1, 1 / 1.35, 1 / 1.35 / 1.35, 1 / 1.35 / 1.35 / 1.35, 1 / 1.35 / 1.35 / 1.35 / 1.35, 1 / 1.35 / 1.35 / 1.35 / 1.35 / 1.35, 1 / 1.35 / 1.35 / 1.35 / 1.35 / 1.35 / 1.35] //各星等间亮度差异
		},
		speed: 120000,
		//星轨运行速度，完成一圈所需要的ms
		step: 360 //步进，星轨完成动画总共运行的角度
	};
```

[前往](http://spencer.kokiya.com 'kokiya')Spencer的博客查看关于starTrail的博文
contact [sepmein@gmail.com](mailto:sepmein@gmail.com 'send me an email')

ps:branch bigbang is also good, check it out
另：bigbang分支也不错，有空玩玩儿

check doc/ for more docs
