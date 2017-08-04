<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<script src="/js/libs/jquery/1.8.0/jquery.min.js"></script>
</head>
<body>
	<input type="text" data-max="10" data-min="20">
	<input type="text">
	<script>
		 $.fn.onlyNumber = function(options) {
		 	'use strict';
		 	var ops = $.fn.extend({
		 			debug:false,
		 			max:'',
		 			min:'',
		 			fixed: 0, //精确几位小数
		 			negative: false //是否输入负数
		 		}, options),
		 		log = function(){
		 			if(ops.debug===true){
		 				console.log.apply(this,arguments)
		 			}
		 		},
		 		notNumber = function(str) {
		 			var $this = $(this),
		 				index = 0,
		 				max = parseFloat($this.data('max')||ops.max),
		 				min = parseFloat($this.data('min')||ops.min),
		 				rs = (ops.negative ?
		 					str.replace(/[^0-9.-]/ig, '') :
		 					str.replace(/[^0-9.]/ig, '')).replace(/\.?$/ig, '').replace(/^\.?/ig, '');
		 			rs = parseFloat(rs);
		 			index = rs.toString().indexOf('.');
		 			if (index !== -1 && ops.fixed && ops.fixed > 0) {
		 				rs = +rs.toFixed(ops.fixed);
		 			}
		 			rs = isNaN(rs) ? '' : rs;
		 			if (!isNaN(max)) {
		 				if (rs > max) {
		 					log('大于最大值');
		 					rs = max;
		 				}
		 			}
		 			if (!isNaN(min)) {
		 				if (rs < min) {
		 					log('小于最小值');
		 					rs = min;
		 				}
		 			}
		 			if(!isNaN(max)&&!isNaN(min)){
		 				if(min>max){
		 					log('最小值不能大于最大值');
		 					rs ='';
		 				}
		 			}

		 			return rs;
		 		},
		 		onlyNumber = function(ev, val) { //只能是数字
		 			var $this = $(this),
		 				keyCode = ev.which,

		 				index = val.indexOf('.'),
		 				arr = [8, 9, 27, 37, 38, 39, 40, 13, 190, 110],
		 				numberLeft = keyCode >= 96 && keyCode <= 105,
		 				numberRight = keyCode >= 48 && keyCode <= 57,
		 				negative = 109;

		 			if (229 === keyCode) {
		 				ev.preventDefault();
		 				return;;
		 			}
		 			if ((190 === keyCode || 110 === keyCode)) {

		 				if (!val.length) {
		 					ev.preventDefault();
		 				} else if (val.length && val.indexOf('.') !== -1) {
		 					ev.preventDefault();
		 				}

		 			}
		 			if ($.inArray(keyCode, arr) < 0 && !(numberLeft || numberRight)) {
		 				if (ops.negative && !val.length) {

		 				} else {
		 					ev.preventDefault();
		 				}
		 				return;
		 			}
		 			if (ops.fixed && ops.fixed > 0 && 8 !== keyCode) {
		 				if (val.slice(index, -1).length >= ops.fixed) {
		 					ev.preventDefault();
		 				}
		 			}
		 		};

		 	return this.each(function() {

		 		if ($(this).data('lock')) {
		 			return;
		 		}
		 		$(this).data('lock', true);
		 		$(this)
		 			.blur(function() {
		 				$(this).val(notNumber.call(this, $(this).val()))
		 			})
		 			.keydown(function(ev) {
		 				onlyNumber(ev, $(this).val());
		 			});
		 	});
		 };

		 $('input').onlyNumber({
		 	max:10,
		 	min:8,
		 	fixed: 1
		 });
	</script>
</body>
</html>
