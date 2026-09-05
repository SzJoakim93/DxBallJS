function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue;
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  function saveData(key, value) {
    if (window.localStorage) {
      localStorage.setItem(key, value);
    } else {
      setCookie(key, value);
    }
  }

  function loadData(key) {
    if (window.localStorage) {
      return localStorage.getItem(key);
    } else {
      if (window.console) {
        console.log(getCookie(key));
      }
      return getCookie(key);
    }
  }