// 地域名を入力して検索ボタンを押したら検索結果が表示される
// alert("11111");

// 都道府県名+対象URLのオブジェクトを宣言
const cityUrls = {
  // 北海道・東北
  "北海道": "hokkaido.html",
  "青森県": "aomori.html",
  "岩手県": "iwate.html",
  "宮城県": "miyagi.html",
  "秋田県": "akita.html",
  "山形県": "yamagata.html",
  "福島県": "fukushima.html",
  // 関東
  "茨城県": "ibaraki.html",
  "栃木県": "tochigi.html",
  "群馬県": "gunma.html",
  "埼玉県": "saitama.html",
  "千葉県": "chiba.html",
  "東京都": "tokyo.html",
  "神奈川県": "kanagawa.html",
  // 北陸
  "新潟県": "niigata.html",
  "富山県": "toyama.html",
  "石川県": "ishikawa.html",
  "福井県": "fukui.html",
  // 中部
  "山梨県": "yamanashi.html",
  "長野県": "nagano.html",
  "岐阜県": "gifu.html",
  "静岡県": "shizuoka.html",
  "愛知県": "aichi.html",
  // 関西
  "三重県": "mie.html",
  "滋賀県": "shiga.html",
  "京都府": "kyoto.html",
  "大阪府": "oosaka.html",
  "兵庫県": "hyogo.html",
  "奈良県": "nara.html",
  "和歌山県": "wakayama.html",
  // 中国
  "鳥取県": "tottori.html",
  "島根県": "shimane.html",
  "岡山県": "okayama.html",
  "広島県": "hiroshima.html",
  "山口県": "yamaguchi.html",
  // 四国
  "徳島県": "tokushima.html",
  "香川県": "kagawa.html",
  "愛媛県": "ehime.html",
  "高知県": "kochi.html",
  // 九州・沖縄
  "福岡県": "fukuoka.html",
  "佐賀県": "saga.html",
  "長崎県": "nagasaki.html",
  "熊本県": "kumamoto.html",
  "大分県": "ooita.html",
  "宮崎県": "miyazaki.html",
  "鹿児島県": "kagoshima.html",
  "沖縄県": "okinawa.html",
};

// 検索関数
searchWord = function(){
  // 変数を決める
  $(".area-result").empty();
  let searchResult, 
      searchText = $(this).val(), // 検索ボックスに入力された値
      targetText,
      hitNum;
 
  // 検索結果を格納するための配列を用意
  searchResult = [];
 
  // 検索ボックスに値が入力された場合
  if (searchText != '') {
      $('.area-name-2').each(function() {
      targetText = $(this).text();
      console.log(targetText);
      // 検索対象となるリストに入力された文字列が存在するかどうかを判断
      if (targetText.indexOf(searchText) != -1) {
        // 存在する場合はそのリストのテキストを用意した配列に格納
        searchResult.push(targetText);
      }
    });
 
    // 検索結果をポップアップに表示
    for (let i = 0; i < searchResult.length; i ++) {
      $('<li>')
        .append($('<a>').attr('href', cityUrls[searchResult[i]]).text(searchResult[i]))
        .appendTo('.area-result');
    }

  }
};
 
// searchWordの実行
$('#search').on('input', searchWord);



// 変数の定義
let sanimap;
let marker =[];
let infoWindow = [];
let activeWindow;

// スプレッドシートからデータを取得する関数
const fetchSheetData = () => {
  const sheetId = '1QJiuJregE-59t2OzHYWkKtiosoG33oPU5Xjf8Anwvhk';  // スプレッドシートのID
  const apiKey = 'YOUR_API_KEY';  // Google Sheets APIキー
  const range = '配布一覧!A2:C';  // データの範囲
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
  
  return $.get(url)  // jQueryでスプレッドシートのデータを取得
    .then((response) => {
      // スプレッドシートからのデータを整形
      const rows = response.values;
      return rows.map((row) => ({
        latitude: parseFloat(row[0]),  // A列の緯度
        longitude: parseFloat(row[1]), // B列の経度
        content: row[2],  // C列の吹き出し内容
      }));
    })
    .catch((error) => {
      console.error('スプレッドシートからデータを取得できませんでした:', error);
      return [];
    });
};

// マップを初期化
const initMap = () => {
  let sanimap;
  // マップを表示させるHTMLの箱
  const $maparea = $("#sanimap");
  console.log("map area:", $maparea[0]); // デバッグ用メッセージ

　// マップの中心位置
  const center = {
    lat: 35.717754,
    lng: 139.772598,
  };

  //マップ作成
  sanimap = new google.maps.Map($maparea[0], {
    center: center,
    zoom: 17,
  });

  // スプレッドシートからマーカーのデータを取得し、地図に反映
  fetchSheetData().then((markerData) => {
    for (let i = 0; i < markerData.length; i++) {
      const markerLatLng = new google.maps.LatLng({
        lat: markerData[i].latitude,
        lng: markerData[i].longitude
      });

      // マーカーの追加
      marker[i] = new google.maps.Marker({
        position: markerLatLng,
        map: sanimap,
        icon: {
          url: '/img/hanadeza-illust8.png',
          scaledSize: new google.maps.Size(50, 50),
        }
      });

      // 吹き出しの追加
      infoWindow[i] = new google.maps.InfoWindow({
        content: markerData[i].content
      });

      // マーカークリック時に吹き出しを表示するイベントを設定
      markerEvent(i);
    }
  });
}
// マーカークリック時に吹き出しを表示する
function markerEvent(i) {
  marker[i].addListener('click', function () {
    // 既に開いている吹き出しを閉じる
    if (activeWindow) {
      activeWindow.close();
    }
    // 新しい吹き出しを開く
    infoWindow[i].open(sanimap, marker[i]);
    activeWindow = infoWindow[i]; // 開いている吹き出しを記憶
  });
}

// ページが読み込まれてからinitMapを呼び出す
$(document).ready(function () {
  initMap();
});