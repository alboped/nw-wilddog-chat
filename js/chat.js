var chatHandle = (function(){
	var chatListRef;

	/* 显示接收消息 */
	var chat_add = function(data){
		var $list = $('.msg-list');

		$list.append($('<li class="msg-item ' + (data.user == userHandle.getUser().name ? 'msg-right' : '') + '">' +
			'<i class="icon"></i>' + 
			'<p class="username">' + data.user.filter() + 
				'（' + new Date(data.date).toLocaleTimeString('en-GB') + '）' + 
			'</p>' +
			'<p class="msg-text"><i class="arrows"></i>' + data.msg.replace(/\n/g, '</br>').filter() + '</p>' +
		'</li>')).scrollTop($list[0].scrollHeight);
	}

	/* 发送消息 */
	var send_msg = function(){
		var val = $('.chat-text').val();
		if($.trim(val) !== ''){
			$('.chat-text').val('');
			chatListRef.update({
				"chatMsg": {
					"user": userHandle.getUser().name,
					"date": Date.now(),
					"msg": val
				}
			}, function(err){
				if(err){
					
				}
			});
		}
	}

	$(function(){
		$('.send-btn').click(send_msg);

		$('.chat-text').keydown(function(e){
			if(e.keyCode === 13 && !e.shiftKey && !e.ctrlKey){
				e.preventDefault();
				send_msg();
				return false;
			}
		});
	})

	var chatEvent = function(){
		chatListRef = wilddog.sync().ref('chatData');

		chatListRef.on('child_changed', function(snapshot, prev){
			chat_add(snapshot.val());
		});
	}

	return {
		chatEvent: chatEvent
	}
})();