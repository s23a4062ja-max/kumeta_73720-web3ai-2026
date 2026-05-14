document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('simulator-form');
    const resultArea = document.getElementById('result-area');
    const waitTimeEl = document.getElementById('wait-time');
    const congestionLevelEl = document.getElementById('congestion-level');
    const adviceTextEl = document.getElementById('advice-text');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 入力値の取得
        const customers = parseInt(document.getElementById('customers').value, 10);
        const hours = parseFloat(document.getElementById('hours').value);
        const staff = parseInt(document.getElementById('staff').value, 10);
        const weight = parseFloat(document.getElementById('order-type').value);

        if (customers <= 0 || hours <= 0 || staff <= 0) {
            alert('正の数値を入力してください。');
            return;
        }

        // 待ち時間の計算
        // 基本時間: 1客あたり3分
        // 1時間あたりの平均来店客数 = customers / hours
        // 予想待ち時間 = (1時間あたりの客数 × 基本3分 × 注文の重さ) / スタッフ数
        const customersPerHour = customers / hours;
        let waitTime = Math.round((customersPerHour * 3 * weight) / staff);

        // 最低待ち時間は0分、最大は適当に丸める
        if (waitTime < 0) waitTime = 0;

        // 混雑度の判定とアドバイス生成
        let levelText = '';
        let levelClass = '';
        let advice = '';

        if (waitTime <= 5) {
            levelText = '余裕あり';
            levelClass = 'status-good';
            advice = '現在のスタッフ数で十分に対応可能です。お客様に丁寧な接客を心がけましょう。';
        } else if (waitTime <= 15) {
            levelText = '普通';
            levelClass = 'status-normal';
            advice = '適度な混雑具合です。このペースを維持しつつ、バッシング（テーブル片付け）もこまめに行いましょう。';
        } else if (waitTime <= 30) {
            levelText = '混雑';
            levelClass = 'status-busy';
            advice = '少し混雑しています。お客様に「少々お時間をいただきます」とお声がけするとクレーム防止になります。';
            
            // 注文の重さによる追加アドバイス
            if (weight >= 2.0) {
                advice += ' 手間のかかる注文が多いため、製造（バー）とレジの役割分担を明確にすることをおすすめします。';
            }
        } else {
            levelText = 'かなり混雑';
            levelClass = 'status-very-busy';
            advice = 'ピーク状態です！スタッフの増員が必要です。';
            
            if (staff < 3) {
                advice += ' 最低でも3人以上のスタッフ体制にシフトを変更することをおすすめします。';
            } else if (weight >= 2.0) {
                advice += ' フードやフラペチーノ専用のサポートスタッフを1名配置すると回転率が上がります。';
            } else {
                advice += ' 列の整理や、事前のオーダー取り（メニュー配布）を行って待ち時間のストレスを軽減しましょう。';
            }
        }

        // 結果の反映
        waitTimeEl.textContent = waitTime;
        
        congestionLevelEl.textContent = levelText;
        congestionLevelEl.className = `badge ${levelClass}`;
        
        adviceTextEl.textContent = advice;

        // 結果エリアの表示（アニメーション付き）
        resultArea.classList.remove('hidden');
        resultArea.classList.remove('animate-in');
        // 少し遅延を入れてアニメーションを再トリガーする
        void resultArea.offsetWidth; 
        resultArea.classList.add('animate-in');
    });
});
