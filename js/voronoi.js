var voronoi = new Voronoi();
var sites = [];
var diagram = null;
var bbox = {
  xl: 0,
  xr: 100,
  yt: 0,
  yb: 600
};
var spotColor = new Color('red');
var mousePos = view.center;
var selected = false;
var oldSize = view.size;
var canvas = document.getElementById('myCanvas');




function onMouseMove(event) {
    mousePos = event.point;
    if (event.count == 0)
    sites.push(event.point);
    sites[sites.length - 1] = mousePos;
    diagram = voronoi.compute(sites, bbox);
    render();
};

function onMouseDown(event) {
  sites.push(event.point);
  diagram = voronoi.compute(sites, bbox);
  render();
};



function render() {
 project.activeLayer.removeChildren(); 
  var diagram = voronoi.compute(sites, bbox);
  if (diagram) {
    for (var i = 0, l = sites.length; i < l; i++) {
      var cell = diagram.cells[sites[i].voronoiId];
      if (cell) {
        var halfedges = cell.halfedges,
          length = halfedges.length;
        if (length > 2) {
          var points = [];
          for (var j = 0; j < length; j++) {
            var v = halfedges[j].getEndpoint();
            points.push(new Point(v));
          }
          createPath(points, sites[i]);
        }
      }
    }
  }
};

function createPath(points, center) {

  var path = new Path();
  path.strokeColor = '#000000';
  var segments = path.segments;git
  path.strokeWidth = 5;
  path.closed = true;
  path.fillColor = 'white';

  for (var i = 0, l = points.length; i < l; i++) {
    var point = points[i];
    var next = points[(i + 1) == points.length ? 0 : i + 1];

    path.add({
      point: point,

    });
  }
  //console.log(segments);
  var vert = [];
  for (var i = 0; i < segments.length; i++) {
    var myCircle = new Path.Circle(new Point(segments[i].point.x, segments[i].point.y), 10);
    myCircle.fillColor = 'black';
    vert.push({
      x: segments[i].point.x,
      y: segments[i].point.y
    })
  }
  
  for (var i = 0; i < sites.length; i++) {
    var myCircle = new Path.Circle(new Point(sites[i].x, sites[i].y), 3);
    myCircle.fillColor = 'blue';
  }
  //console.log(vert);
  var dist = [];
  var slope =[];
  for (var i = 0; i < vert.length; i++) {
    if (i === vert.length - 1) {
      var dx = vert[vert.length - 1].x - vert[0].x;
      var dy = vert[vert.length - 1].y - vert[0].y;
      dist.push(Math.sqrt(dx * dx + dy * dy));
      slope.push(dy/dx);
    } else {
      var dx = vert[i].x - vert[i + 1].x;
      var dy = vert[i].y - vert[i + 1].y;
      dist.push(Math.sqrt(dx * dx + dy * dy));
      slope.push(dy/dx);
    }
  }
  console.log(slope);
  var valid = true 
  $('#myCanvas').css('pointer-events', 'auto');
  for (var i = 0; i < dist.length; i++) {
    if (dist[i] < 20) {
        valid = false;  
    } 
  }
  
 if (valid == false ){
     path.strokeColor = 'red';
     $('.canvasWrapper').css('pointer-events', 'none');
     
 }
  return path;


};


function onResize() {
  var margin = 20;
  bbox = {
    xl: margin,
    xr: view.bounds.width - margin,
    yt: margin,
    yb: view.bounds.height - margin
  };
  for (var i = 0, l = sites.length; i < l; i++) {
    sites[i] = sites[i] * view.size / oldSize;
  }
  oldSize = view.size;
  render();
}

$('.stepBack').click(function(event){
    sites.pop();
    diagram = voronoi.compute(sites, bbox);
    render();
    paper.view.update()
});

$('.clear').click(function(event){
    sites =[];
    diagram = voronoi.compute(sites, bbox);
    render();
    paper.view.update()
});

$('.canvasWrapper').on('mouseleave', function() {
    console.log('fuck this');
    sites.pop();
    diagram = voronoi.compute(sites, bbox);
    render();
    paper.view.update()
});

