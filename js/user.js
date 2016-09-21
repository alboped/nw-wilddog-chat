var userHandle = (function(){
	var userMap, /* 所有用户数据 */
		userMapRef, /* 用户数据实例 */
		userRef, /* 当前用户数据实例 */
		ip, /* 本地IP */
		ipKey; /* 本地IP转化为对象属性名 */

	/* 获取本机IP地址 */
	var getIPAdress = function(){
		var interfaces = require('os').networkInterfaces();
		for(var devName in interfaces){
			var devArray = interfaces[devName];
			for(var i = 0; i < devArray.length; i++){
				var dev = devArray[i];
				if(dev.family == 'IPv4' && dev.address != '127.0.0.1' && !dev.internal){
					return dev.address;
				}
			}
		}
		return null;
	}

	/* 刷新用户列表 */
	var renderUList = function() {
		var $list = $('.u-list');
		$list.empty();
		for(var userKey in userMap){
			var user = userMap[userKey];
			var isMy = userKey == ipKey;
			$list.append(
				'<li class="user-item ' + (isMy ? 'my-user' : '') + '">' +
					'<span class="online-state ' + (user.state ? 'on' : 'off') + '"></span>' +
					'<span class="user-name text-overflow" title="' + user.name.filter() + '">' + user.name.filter() + '</span>' +
					(isMy ? '<i class="icon-edit"></i>' : '') +
				'</li>'
			);
		}

		if($('.loading-dialog').size()){
			setTimeout(function(){
				$('.loading-dialog').fadeOut(600, function(){
					this.remove();
				});
			}, 2000);
		}
	}


	/* 监听用户数据 */
	var userEvent = function(){
		ip = getIPAdress();
		// ip = "127.1.3.101";
		ipKey = ip.replace(/\./g, '-');
		userMapRef = wilddog.sync().ref('user');
		userMapRef.on('value', function(snapshot, prev){
			if(snapshot != null){
				userMap = snapshot.val();
				renderUList();
				if(snapshot.hasChild(ipKey)){
					userRef = userMapRef.child(ipKey);
					userRef.update({
						"state": true
					});
				} else {
					var setUser = {};
					setUser[ipKey] = "";
					userMapRef.update(setUser);
					userRef = userMapRef.child(ipKey);
					userRef.update({
						"state": true,
						"name": ip
					});
				}
			}
		});

		/* 用户下线 */
		userMapRef.child(ipKey).onDisconnect().update({
			"state": false
		});
	}

	/* 获取当前用户信息 */
	var getUser = function(){
		return userMap[ipKey];
	}

	/* 修改昵称窗口 */
	var openEditName = function(){
		$('body').append(
			$('<div class="edit-dialog">' +
				'<div class="edit-body">' +
					'<input type="text" class="edit-text" placeholder="请输入新昵称" maxlength="10" />' +
					'<div class="edit-bar">' +
						'<a href="javascript:;" class="edit-confirm left">确定</a>' +
						'<a href="javascript:;" class="edit-cancal right">取消</a>' +
					'</div>' +
				'</div>' +
			'</div>')
		);

		$('.edit-text').focus();
	}

	/* 修改昵称 */
	var editName = function(){
		var name = $('.edit-text').val();
		if($.trim(name) != ''){
			userRef.update({
				"name": name
			}).then(function(){
				$('.edit-dialog').remove();
			});
		}
	}

	$(function(){
		$(document).on({
			click: openEditName
		}, '.icon-edit');

		$(document).on({
			click: function(){
				$('.edit-dialog').remove();
			}
		}, '.edit-cancal');

		$(document).on({
			click: editName
		}, '.edit-confirm');

		$(document).on({
			keydown: function(e){
				if(e.keyCode == 13){
					editName();
				}
			}
		}, '.edit-text');
	});

	return {
		userEvent: userEvent,
		getUser: getUser
	}
})();