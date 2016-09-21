(function(){
	var gui = require('nw.gui');
	var win = gui.Window.get();
	
	var config = {
		syncDomain: '1257chat.wilddogio.com',
		syncURL: 'https://1257chat.wilddogio.com'
	}

	wilddog.initializeApp(config);

	userHandle.userEvent();
	chatHandle.chatEvent();

	$(function(){
		$('.window-min').click(function(){
			win.minimize();
		});

		$('body').append(
			'<div class="loading-dialog">' +
				'<img src="img/loading2.gif" alt="" class="loading-gif" />' +
			'</div>'
		);
	});
})();

String.prototype.filter = function(){
	return this.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
}