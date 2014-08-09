var context;

var points = new Meteor.Collection('pointsCollection');
var colors = new Meteor.Collection('pointsColors');
var brushSizes = new Meteor.Collection('brishSizes');
var clickDrags = new Meteor.Collection('clickDrags');

var paint = false;

var curColor = "#cb1594";
var curSize = "normal";

var convasWidth = 960;
var canvasHeight = 960;

var markPoint = function(x, y, dragging) {
  var offset = $('#canvasDiv').offset();
  points.insert({
    x: x,
    y: y });
  clickDrags.insert({
    enabled: dragging
  });
  colors.insert({
    color: curColor
  });
  brushSizes.insert({
    size: curSize
  });
}

Deps.autorun( function () {
  Meteor.subscribe('pointsSubscription');
  Meteor.subscribe('sizesSubscription');
  Meteor.subscribe('colorsSubscription');
  Meteor.subscribe('clickDragSubscription');
});

Meteor.startup( function() {
  var canvasDiv = document.getElementById('canvasDiv');

  canvas = document.createElement('canvas');
  canvas.setAttribute('width', convasWidth);
  canvas.setAttribute('height', canvasHeight);
  canvas.setAttribute('id', 'canvas');
  canvasDiv.appendChild(canvas);
  if(typeof G_vmlCanvasManager != 'undefined') {
	  canvas = G_vmlCanvasManager.initElement(canvas);
  }
  context = canvas.getContext("2d");

  Deps.autorun( function() {
    pointData = points.find({}).fetch();
    colorData = colors.find({}).fetch();
    sizeData = brushSizes.find({}).fetch();
    clickDragData = clickDrags.find({}).fetch();

    $('h2').hide();

    if (context) {
      context.lineJoin = "round";

      for(var i = 0; i < pointData.length; i++) {
        context.beginPath();

        if (clickDragData[i].enabled && i) {
          context.moveTo(pointData[i-1].x, pointData[i-1].y);
        } else {
          context.moveTo(pointData[i].x - 1, pointData[i].y);
        }
        context.lineTo(pointData[i].x, pointData[i].y);
        context.closePath();
        context.strokeStyle = colorData[i].color;
        context.lineWidth = sizeData[i].size;
        context.stroke();
      }
      context.globalAlpha = 1;
    }
  });
});

Template.drawingSurface.title = function () {
  return 'Draw with Myo!';
}

Template.drawingSurface.events({
  'click input': function (event) {
    Meteor.call('clear', function() {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    });
  }
})

Template.canvas.events({
  'mousedown': function (event) {
    var offset = $('#canvasDiv').offset();
    var mouseX = event.pageX - offset.left;
    var mouseY = event.pageY - offset.top;

    paint = true;
    markPoint(mouseX, mouseY, false);
  },
  'mousemove': function (event) {
    if (paint) {
      var offset = $('#canvasDiv').offset();
      var mouseX = event.pageX - offset.left;
      var mouseY = event.pageY - offset.top;

      markPoint(mouseX, mouseY, true);
    }
  },
  'mouseup': function (event) {
    paint = false;
  },
  'mouseleave': function (event) {
    paint = false;
  }
});
