(function(){
  function q(a){return document.querySelector(a);}
  function qa(a){return Array.prototype.slice.call(document.querySelectorAll(a));}

  var b = window.APP_DATA || {start_date:"2025-10-02"};

  function c(d){
    var e = d.split("-");
    return new Date(Number(e[0]), Number(e[1]) - 1, Number(e[2]), 12, 0, 0);
  }

  function pad2(x){
    var s = String(x);
    if (s.length < 2){ s = "0" + s; }
    return s;
  }

  function fmtDate(dt){
    // YYYY-MM-DD
    return String(dt.getFullYear()) + "-" + pad2(dt.getMonth() + 1) + "-" + pad2(dt.getDate());
  }

  function daysTogether(){
    var start = c(b.start_date);
    var now = new Date();
    var i = Math.floor((now.getTime() - start.getTime()) / 86400000);
    if (i < 0) { i = 0; }
    var el = q("#daysTogether");
    if (el){ el.textContent = String(i) + " days together"; }
  }

  function nextMonthiversary(){
    // Next occurrence of day=2 at noon (local)
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth(); // 0-based
    var target = new Date(year, month, 2, 12, 0, 0);

    if (now.getTime() > target.getTime()){
      // go to next month
      target = new Date(year, month + 1, 2, 12, 0, 0);
    }
    return target;
  }

  function oneYearDate(){
    var start = c(b.start_date);
    return new Date(start.getFullYear() + 1, start.getMonth(), start.getDate(), 12, 0, 0);
  }

  function countdownTo(target, ids){
    var t = target.getTime();
    var now = new Date().getTime();
    var ms = Math.max(0, t - now);

    var d = Math.floor(ms / 86400000);
    var h = Math.floor((ms % 86400000) / 3600000);
    var m = Math.floor((ms % 3600000) / 60000);
    var s = Math.floor((ms % 60000) / 1000);

    var elD = q(ids.d);
    var elH = q(ids.h);
    var elM = q(ids.m);
    var elS = q(ids.s);

    if (elD){ elD.textContent = String(d); }
    if (elH){ elH.textContent = String(h); }
    if (elM){ elM.textContent = String(m); }
    if (elS){ elS.textContent = String(s); }
  }

  function tick(){
    var nm = nextMonthiversary();
    var oy = oneYearDate();

    var mt = q("#monthText");
    var yt = q("#yearText");
    if (mt){ mt.textContent = fmtDate(nm); }
    if (yt){ yt.textContent = fmtDate(oy); }

    countdownTo(nm, {d:"#mD", h:"#mH", m:"#mM", s:"#mS"});
    countdownTo(oy, {d:"#yD", h:"#yH", m:"#yM", s:"#yS"});
  }

  function show(sel){
    var el = q(sel);
    if (el){ el.classList.add("show"); el.setAttribute("aria-hidden", "false"); }
  }
  function hide(sel){
    var el = q(sel);
    if (el){ el.classList.remove("show"); el.setAttribute("aria-hidden", "true"); }
  }

  // Love letter modal
  var openLetter = q("#openLetter");
  var closeLetter = q("#closeLetter");
  if (openLetter){ openLetter.addEventListener("click", function(){ show("#letterModal"); }); }
  if (closeLetter){ closeLetter.addEventListener("click", function(){ hide("#letterModal"); }); }
  var letterModal = q("#letterModal");
  if (letterModal){
    letterModal.addEventListener("click", function(e){
      if (e.target === letterModal){ hide("#letterModal"); }
    });
  }

  // Photo modal
  var closePhoto = q("#closePhoto");
  if (closePhoto){ closePhoto.addEventListener("click", function(){ hide("#photoModal"); }); }
  var photoModal = q("#photoModal");
  if (photoModal){
    photoModal.addEventListener("click", function(e){
      if (e.target === photoModal){ hide("#photoModal"); }
    });
  }

  qa(".g-item").forEach(function(btn){
    btn.addEventListener("click", function(){
      var src = btn.getAttribute("data-src");
      var view = q("#photoView");
      if (view){ view.src = src; }
      show("#photoModal");
    });
  });

  // Confetti
  function confetti(){
    var i = 0;
    var timer = setInterval(function(){
      i += 1;
      var d = document.createElement("div");
      d.style.position = "fixed";
      d.style.left = String(Math.random() * 100) + "vw";
      d.style.top = "-20px";
      d.style.width = "10px";
      d.style.height = "10px";
      d.style.borderRadius = "3px";
      d.style.background = (Math.random() > 0.5) ? "rgba(255,90,165,1)" : "rgba(124,92,255,1)";
      d.style.zIndex = "60";
      d.style.opacity = "0.95";
      document.body.appendChild(d);

      var j = 0;
      var fall = setInterval(function(){
        j += 1;
        d.style.transform = "translateY(" + String(j * 6) + "px) rotate(" + String(j * 7) + "deg)";
        d.style.opacity = String(Math.max(0, 0.95 - j * 0.01));
        if (j > 120){
          clearInterval(fall);
          if (d && d.parentNode){ d.parentNode.removeChild(d); }
        }
      }, 16);

      if (i > 28){
        clearInterval(timer);
      }
    }, 40);
  }
  var confBtn = q("#confettiBtn");
  if (confBtn){ confBtn.addEventListener("click", confetti); }

  daysTogether();
  tick();
  setInterval(tick, 1000);
})();
