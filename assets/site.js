(function(){
  var r=document.documentElement;
  var lb=document.getElementById("lang-btn");
  var tb=document.getElementById("theme-btn");

  function paintLang(){
    var zh = r.dataset.lang==="zh";
    lb.textContent = zh ? "EN" : "中文";
    lb.setAttribute("aria-label", zh ? "Switch to English" : "切换到中文");
    r.lang = zh ? "zh-Hans" : "en";
    // 标题由各页在 <html> 上用 data-title-en / data-title-zh 声明，缺省回落到站名
    document.title = zh ? (r.dataset.titleZh || "李学昭 Xuezhao Li")
                        : (r.dataset.titleEn || "Xuezhao Li");
  }
  if(!lb||!tb) return;
  lb.addEventListener("click",function(){
    r.dataset.lang = r.dataset.lang==="zh" ? "en" : "zh";
    try{localStorage.setItem("xl-lang",r.dataset.lang)}catch(e){}
    paintLang();
  });
  paintLang();

  tb.addEventListener("click",function(){
    var dark;
    if(r.dataset.theme){ dark = r.dataset.theme==="dark"; }
    else { dark = window.matchMedia("(prefers-color-scheme: dark)").matches; }
    r.dataset.theme = dark ? "light" : "dark";
    try{localStorage.setItem("xl-theme",r.dataset.theme)}catch(e){}
  });

  // 分区级「全部展开 / 全部收起」
  document.querySelectorAll('.expand-all').forEach(function(btn){
    var cards = btn.closest('section').querySelectorAll('.proj > details, .cv-group > details, .runs > li > details');
    if(!cards.length) return;
    function sync(){
      var allOpen = Array.prototype.every.call(cards, function(d){ return d.open; });
      btn.setAttribute('aria-expanded', allOpen ? 'true' : 'false');
    }
    btn.addEventListener('click', function(){
      var open = btn.getAttribute('aria-expanded') !== 'true';
      Array.prototype.forEach.call(cards, function(d){ d.open = open; });
      sync();
    });
    Array.prototype.forEach.call(cards, function(d){ d.addEventListener('toggle', sync); });
    sync();
  });

  // 打印/导出 PDF 时展开全部折叠项，打印后还原
  var _reopen=[];
  window.addEventListener('beforeprint',function(){
    _reopen=[];
    document.querySelectorAll('details:not([open])').forEach(function(d){_reopen.push(d);d.open=true;});
  });
  window.addEventListener('afterprint',function(){_reopen.forEach(function(d){d.open=false;});_reopen=[];});
  document.querySelectorAll('.topnav a, .mark').forEach(function(a){
    a.addEventListener("click",function(e){
      var h=a.getAttribute("href");
      // 文章页的导航指回 ../index.html#x，那是真跳转，不能拦
      if(!h || h.charAt(0)!=="#") return;
      var t=document.querySelector(h);
      if(!t)return;
      e.preventDefault();
      t.scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block:"start"});
    });
  });
})();
