// ボーナスの取得をチェックする
function checkBonus() {
    // ボーナスダイアログが表示されているかどうかチェック
    //   初期状態           : 空のdiv要素
    //   ボーナス取得時     : div要素内にsection要素が現れる
    //   ダイアログ消去時   : div要素のスタイルがdisplay:noneになる
    var bonus = $('#bonus:visible');
    if (bonus.length > 0) {
        var dialog = bonus.find('section.bonus-dialog');
        if (dialog.length > 0) {
            // ボーナス取得時は、通知が許可されていれば通知を表示する
            if (Notification.permission === 'granted') {
                var n = new Notification('SHOWROOM', {
                    body: '番組視聴ボーナスとして無料アイテムをGETしました!',
                    icon: safari.extension.baseURI + 'img/icon80x80.png',
                    tag: 'showroom-bonus-notification'
                });
                // 通知クリック時にタブをアクティブ化する
                // NOTE: Injected Scriptからはタブにアクセスできないため、
                //       一度グローバルページにメッセージを飛ばし、グローバル
                //       ページからタブのアクティブ化を行う
                n.addEventListener('click', function(ev) {
                    safari.self.tab.dispatchMessage('activate');
                    // 通知を閉じる
                    n.close();
                });
            }
        } else {
            // 初期状態の場合は一定時間ごとに再チェック
            setTimeout(checkBonus, 500);
        }
    }
}

// デスクトップ通知が許可または拒否されていなければ許可を取る
if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
}

$(function() {
    // 動画配信画面以外は何もしない
    if ($('#js-room-video').length > 0) {
        // ボーナスの取得チェックを開始
        checkBonus();
    }
});
