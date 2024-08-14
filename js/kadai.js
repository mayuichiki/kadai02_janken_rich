// 地域名を入力して検索ボタンを押したら検索結果が表示される
// alert("11111");

// 検索関数
searchWord = function(){
  // 変数を決める
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
 
      // 検索対象となるリストに入力された文字列が存在するかどうかを判断
      if (targetText.indexOf(searchText) != -1) {
        // 存在する場合はそのリストのテキストを用意した配列に格納
        searchResult.push(targetText);
      }
    });
 
    // 検索結果をポップアップに表示
    for (let i = 0; i < searchResult.length; i ++) {
      $('<li>').text(searchResult[i]).appendTo('.area-result');
    }

  }
};
 
// searchWordの実行
$('#search').on('input', searchWord);