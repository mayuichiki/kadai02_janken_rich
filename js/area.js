// 都道府県ページのアコーディオン実行
$(function(){
    //.accordionの中の.accordion-headerがクリックされたら
    $('.section .accordion .accordion-header').click(function(){
      //クリックされた.accordionの中の.accordion-headerに隣接する.accordion-innerが開いたり閉じたりする。
      $(this).next('.accordion-inner').slideToggle();
      $(this).toggleClass("open");
    });
  });