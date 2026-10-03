// Small SVG circuit figures. Lines and text use currentColor, so they follow the page design.
window.EENG = window.EENG || {};

(function (E) {
  var MINUS = "&#8722;";
  function sign(s) { return s === "+" ? "+" : MINUS; }
  function svg(w, h, label, body) {
    return '<svg class="fig" viewBox="0 0 ' + w + " " + h + '" width="' + w + '" role="img" aria-label="' + label + '">' + body + "</svg>";
  }
  function arrowH(x, y, dir) { // horizontal arrowhead centred at x
    var p = dir === "left"
      ? (x + 7) + "," + (y - 7) + " " + (x + 7) + "," + (y + 7) + " " + (x - 8) + "," + y
      : (x - 7) + "," + (y - 7) + " " + (x - 7) + "," + (y + 7) + " " + (x + 8) + "," + y;
    return '<polygon points="' + p + '" fill="currentColor"/>';
  }
  function arrowV(x, y, dir) { // vertical arrowhead centred at y
    var p = dir === "up"
      ? (x - 7) + "," + (y + 7) + " " + (x + 7) + "," + (y + 7) + " " + x + "," + (y - 8)
      : (x - 7) + "," + (y - 7) + " " + (x + 7) + "," + (y - 7) + " " + x + "," + (y + 8);
    return '<polygon points="' + p + '" fill="currentColor"/>';
  }
  // "v_A" → italic v with subscript A
  function sym(base, sub) {
    return '<tspan font-style="italic">' + base + "</tspan>" + (sub ? '<tspan font-size="70%" dy="5" font-style="italic">' + sub + "</tspan>" : "");
  }

  E.fig = {
    // One element between terminals a (left) and b (right).
    //   left, right: "+" or "−" polarity marks (omit for none)
    //   v: voltage label, e.g. "−12 V" (optional)
    //   arrow: { side: "left"|"right", dir: "left"|"right", label: "−3 A" } (optional)
    hElement: function (o) {
      var y = 70, body = '<g stroke="currentColor" stroke-width="2.5" fill="none">' +
        '<line x1="30" y1="' + y + '" x2="130" y2="' + y + '"/><line x1="230" y1="' + y + '" x2="330" y2="' + y + '"/>' +
        '<rect x="130" y="50" width="100" height="40"/></g>' +
        '<circle cx="30" cy="' + y + '" r="5" fill="currentColor"/><circle cx="330" cy="' + y + '" r="5" fill="currentColor"/>' +
        '<g fill="currentColor" font-size="20">' +
        '<text x="12" y="' + (y + 7) + '" font-style="italic" font-size="22">a</text>' +
        '<text x="340" y="' + (y + 7) + '" font-style="italic" font-size="22">b</text>' +
        (o.left ? '<text x="118" y="40" text-anchor="middle" font-size="24" font-weight="700">' + sign(o.left) + "</text>" : "") +
        (o.right ? '<text x="242" y="40" text-anchor="middle" font-size="24" font-weight="700">' + sign(o.right) + "</text>" : "") +
        (o.v ? '<text x="180" y="28" text-anchor="middle">' + sym("v") + " = " + o.v + "</text>" : "");
      var label = "Element between terminals a and b";
      if (o.left) label += ", " + o.left + " mark at a, " + o.right + " mark at b";
      if (o.v) label += ", v = " + o.v;
      if (o.arrow) {
        var x = o.arrow.side === "right" ? 280 : 80;
        body += "</g>" + arrowH(x, y, o.arrow.dir) +
          '<g fill="currentColor" font-size="20"><text x="' + x + '" y="112" text-anchor="middle">' + sym("i") + " = " + o.arrow.label + "</text>";
        label += ", current arrow on the " + o.arrow.side + " wire pointing " + o.arrow.dir + ", i = " + o.arrow.label;
      }
      return svg(360, 125, label + ".", body + "</g>");
    },

    // Elements in parallel between two rails.
    //   els: [{ name: "A", top: "+"|"−", arrow: "down"|"up" }]
    parallel: function (els) {
      var top = 30, bot = 230, x0 = 80, dx = 125;
      var xl = x0 + dx * (els.length - 1);
      var g = '<g stroke="currentColor" stroke-width="2.5" fill="none">' +
        '<line x1="' + x0 + '" y1="' + top + '" x2="' + xl + '" y2="' + top + '"/>' +
        '<line x1="' + x0 + '" y1="' + bot + '" x2="' + xl + '" y2="' + bot + '"/>';
      var t = '<g fill="currentColor" font-size="20">', heads = "", desc = [];
      els.forEach(function (e, k) {
        var x = x0 + dx * k;
        g += '<line x1="' + x + '" y1="' + top + '" x2="' + x + '" y2="100"/><line x1="' + x + '" y1="160" x2="' + x + '" y2="' + bot + '"/>' +
          '<rect x="' + (x - 18) + '" y="100" width="36" height="60"/>';
        heads += arrowV(x, 62, e.arrow);
        t += '<text x="' + x + '" y="137" text-anchor="middle" font-weight="700">' + e.name + "</text>" +
          '<text x="' + (x + 10) + '" y="58">' + sym("i", e.name) + "</text>" +
          '<text x="' + (x - 34) + '" y="94" text-anchor="middle" font-size="24" font-weight="700">' + sign(e.top) + "</text>" +
          '<text x="' + (x - 34) + '" y="182" text-anchor="middle" font-size="24" font-weight="700">' + sign(e.top === "+" ? "−" : "+") + "</text>" +
          '<text x="' + (x - 24) + '" y="137" text-anchor="end">' + sym("v", e.name) + "</text>";
        desc.push(e.name + ": " + e.top + " mark at the top, current arrow pointing " + e.arrow);
      });
      return svg(xl + 60, 250, "Elements in parallel. " + desc.join("; ") + ".", g + "</g>" + heads + t + "</g>");
    },

    // Piecewise-linear graph.
    //   o: { xMax, yMax, xLabel, yLabel, yTicks: [..], pts: [[x, y], ...] }
    graph: function (o) {
      var L = 60, R = 400, T = 30, B = 220;
      var sx = function (x) { return L + (R - L) * x / o.xMax; };
      var sy = function (y) { return B - (B - T) * y / o.yMax; };
      var g = '<g stroke="currentColor" stroke-opacity=".35" stroke-dasharray="2 4">';
      for (var x = 1; x <= o.xMax; x++) g += '<line x1="' + sx(x) + '" y1="' + T + '" x2="' + sx(x) + '" y2="' + B + '"/>';
      o.yTicks.forEach(function (y) { if (y) g += '<line x1="' + L + '" y1="' + sy(y) + '" x2="' + R + '" y2="' + sy(y) + '"/>'; });
      g += "</g>";
      g += '<g stroke="currentColor" stroke-width="2" fill="none"><line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + B + '"/>' +
        '<line x1="' + L + '" y1="' + B + '" x2="' + R + '" y2="' + B + '"/>' +
        '<polyline stroke-width="3" points="' + o.pts.map(function (p) { return sx(p[0]) + "," + sy(p[1]); }).join(" ") + '"/></g>';
      g += '<g fill="currentColor" font-size="16" text-anchor="middle">';
      for (x = 0; x <= o.xMax; x++) g += '<text x="' + sx(x) + '" y="' + (B + 20) + '">' + x + "</text>";
      o.yTicks.forEach(function (y) { g += '<text x="' + (L - 14) + '" y="' + (sy(y) + 5) + '">' + y + "</text>"; });
      g += '<text x="' + ((L + R) / 2) + '" y="' + (B + 42) + '">' + o.xLabel + "</text>" +
        '<text transform="translate(18 ' + ((T + B) / 2) + ') rotate(-90)">' + o.yLabel + "</text></g>";
      var label = "Graph of " + o.yLabel + " against " + o.xLabel + " through the points " +
        o.pts.map(function (p) { return "(" + p[0] + ", " + p[1] + ")"; }).join(", ") + ".";
      return svg(420, 270, label, g);
    }
  };
})(window.EENG);
