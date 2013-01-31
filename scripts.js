// ## Stat Trail - simulating star trails on the sky with Raphealjs
// ### 使用RaphaelJS作为库，模拟星空长曝光轨迹
// ### 简单易用，设置选项丰富
(function() {
	// 画布的dom容器，可以使用任何能想得到的方法指向dom元素，例如：
	//
	// 	document.getElementById(‘holder’);  
	// 	$('#holder')[0]
	// 	
	// 等等...
	var holder = document.getElementById('holder');
	//画布对象，所有RaphaelJS的svg对象都包含在此画布中
	//
	//(holder, 1280, 800)，第一个参数为dom容器，后两个参数分别代表画布大小，可随意修改
	var paper = Raphael(holder, 1280, 800);
	//**主配置**，类型：对象
	var preference = {
		//中心位置，北极点的位置
		P: [640, 400],
		//星轨的初始角度，0代表一个点（没有角度）
		ALPHA: 0,
		//最远的星轨到中心的距离，越大分布越稀疏，getCoords算法会在最大范围内随机分配星星到中心的距离
		MAXRANGE: 1000,
		//星轨条数，数目增大严重影响性能，3000左右能模拟真实自然界场景
		NUMOFTRACE: 100,
		//星等参数，包含星等的数量及亮度信息
		MAGNITUDE: {
			//模拟自然界中星等，分别为一、二、三、四、五、六等星的数量
			NUM: [10, 23, 67, 229, 738, 2420],
			//各星等间亮度差异，越大亮暗差异越大，似乎过于复杂；元信息只有1.35，todo:修改算法
			LIGHT: [1, 1 / 1.35, 1 / 1.35 / 1.35, 1 / 1.35 / 1.35 / 1.35, 1 / 1.35 / 1.35 / 1.35 / 1.35, 1 / 1.35 / 1.35 / 1.35 / 1.35 / 1.35, 1 / 1.35 / 1.35 / 1.35 / 1.35 / 1.35 / 1.35] 
		},
		//星轨运行速度，完成一圈所需要的ms数
		speed: 120000,
		//步进，星轨完成动画总共运行的角度
		step: 360
	};
	//星空轨迹的配置
	//
	//@argument preference 对象 
	function starTrail(P) {
		//计算svg path elliptical arc算法的customAttributes函数
		paper.customAttributes.arc = function(origin, degree, distance, alpha) {
			// coords: 坐标
			var coords = getCoords(origin, degree, distance, alpha);
			// a: elliptical arc算法中标识弧度是否为大弧度（超过180~360）的量。就是因为这个量没搞明白，所以导致了[bigbang bug](http://spencer.kokiya.com/bigbang)。
			// 
			// q:第二个参数的区间算法需要改进，0～180,180～360,360～540。。。
			// 
			// a:alpha相对180的倍数，再mod 2，这样就能划分区间
			var a = Math.floor(alpha / 180) % 2;
			// 核心参数，
			// 访问[raphaeljs.com](http://raphaeljs.com '查看文档')
			// 
			// M代表move，该点是由getCoords方法随机计算出来的
			// 
			// a代表elliptical arc，最后两个参数是弧线两个端点之间的坐标差值，由getCoords函数动态计算得出
			var path = 'M' + coords[0][0] + ' ' + coords[0][1] + 'a' + distance + ' ' + distance + ' ' + 0 + ' ' + a + ' ' + 1 + ' ' + (coords[1][0] - coords[0][0]) + ' ' + (coords[1][1] - coords[0][1]);
			// 返回 path string
			return {
				path: path
			};
		};

		//星轨星等的变量，由magnitude()函数随机计算
		paper.customAttributes.magnitude = function() {
			var m = magnitude();
			return {
				stroke: "white",
				"stroke-width": m.strokeWidth,
				opacity: m.opacity
			}
		};
		// getCoords方法，输入参数
		// 
		// 	o,origin: 原点
		// 	d,degree: 角度
		// 	dis,distance: 到原点的距离
		// 	al,alpha: 不透明度，用来差别画显示各星星亮度
		function getCoords(o, d, dis, al) {
			var coords = [
				[],
				[]
			];
			var radians = (d / 180) * Math.PI,
				alpha = al % 360,
				radiansPlus = ((d + alpha) / 180) * Math.PI;
			coords[0][0] = 640 + Math.cos(radians) * dis;
			coords[0][1] = 400 + Math.sin(radians) * dis;
			coords[1][0] = 640 + Math.cos(radiansPlus) * dis;
			coords[1][1] = 400 + Math.sin(radiansPlus) * dis;
			return coords;
		}

		function magnitude() {
			var m = {};
			var grade = function() {
					var g;
					if (preference.MAGNITUDE.NUM[0]) {
						g = preference.MAGNITUDE.LIGHT[0];
						preference.MAGNITUDE.NUM[0]--;
					} else if (preference.MAGNITUDE.NUM[1]) {
						g = preference.MAGNITUDE.LIGHT[1];
						preference.MAGNITUDE.NUM[1]--;
					} else if (preference.MAGNITUDE.NUM[2]) {
						g = preference.MAGNITUDE.LIGHT[2];
						preference.MAGNITUDE.NUM[2]--;
					} else if (preference.MAGNITUDE.NUM[3]) {
						g = preference.MAGNITUDE.LIGHT[3];
						preference.MAGNITUDE.NUM[3]--;
					} else if (preference.MAGNITUDE.NUM[4]) {
						g = preference.MAGNITUDE.LIGHT[4];
						preference.MAGNITUDE.NUM[4]--;
					} else if (preference.MAGNITUDE.NUM[5]) {
						g = preference.MAGNITUDE.LIGHT[5];
						preference.MAGNITUDE.NUM[5]--;
					}
					return g;
				}();
			m.opacity = grade;
			m.strokeWidth = grade * 2;
			return m;
		}

		var set = paper.set();

		for (var i = P.NUMOFTRACE; i--; i > 0) {
			var distance = Math.random() * P.MAXRANGE,
				degree = Math.random() * 360,
				al = P.ALPHA;
			set.push(paper.path().attr({
				magnitude: []
			}).attr({
				arc: [P.P, degree, distance, al]
			}));
		}

		(function() {
			set.forEach(function(el) {
				var d = el.attrs.arc[1],
					dis = el.attrs.arc[2],
					al = el.attrs.arc[3];
				el.animate({
					arc: [
						[640, 400], d, dis, (al + P.step)]
				}, P.speed, 'linear');
			});
		})();

	}

	starTrail(preference);	
	// var st = new StarTrail(preference).init();
})();