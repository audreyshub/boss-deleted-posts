!(function (t, n) {
  function o(n) {
    var o = t.getElementsByTagName('script')[0],
      i = t.createElement('script')
    ;(i.src = n), (i.crossOrigin = ''), o.parentNode.insertBefore(i, o)
  }
  if (!n.isLoyaltyLion) {
    ;(window.loyaltylion = n),
      void 0 === window.lion && (window.lion = n),
      (n.version = 2),
      (n.isLoyaltyLion = !0)
    var i = new Date(),
      e = i.getFullYear().toString() + i.getMonth().toString() + i.getDate().toString()
    o('https://sdk.loyaltylion.net/static/2/loader.js?t=' + e)
    var r = !1
    n.init = function (t) {
      if (r) throw new Error('Cannot call loyaltylion.init more than once')
      r = !0
      var a = (n._token = t.token)
      if (!a) throw new Error('Token must be supplied to loyaltylion.init')
      for (
        var l = [],
          s = '_push configure bootstrap shutdown on removeListener authenticateCustomer'.split(
            ' '
          ),
          c = 0;
        c < s.length;
        c += 1
      )
        !(function (t, n) {
          t[n] = function () {
            l.push([n, Array.prototype.slice.call(arguments, 0)])
          }
        })(n, s[c])
      o('https://sdk.loyaltylion.net/sdk/start/' + a + '.js?t=' + e + i.getHours().toString()),
        (n._initData = t),
        (n._buffer = l)
    }
  }
})(document, window.loyaltylion || [])
