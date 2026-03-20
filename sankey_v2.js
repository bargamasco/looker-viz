looker.visualizations.add({
  id: "sankey_v2",
  label: "Sankey V2",
  options: {
    color_range: {
      type: "array",
      label: "Color Range",
      display: "colors",
      default: ["#3EB0D5", "#B1399E", "#C2DD67", "#592EC2", "#4276BE", "#FFD954", "#9673FF"]
    }
  },
  create: function(element, config) {
    element.innerHTML = `
      <style>
        .node rect { cursor: move; fill-opacity: .9; shape-rendering: crispEdges; }
        .node text { pointer-events: none; text-shadow: 0 1px 0 #fff; font-size: 11px; font-family: sans-serif; }
        .link { fill: none; stroke: #000; stroke-opacity: .15; }
        .link:hover { stroke-opacity: .4; }
      </style>
      <div id="vis" style="height:100%; width:100%;"></div>`;
  },
  updateAsync: function(data, element, config, queryResponse, details, done) {
    this.clearErrors();
    const dimensions = queryResponse.fields.dimension_like;
    const measures = queryResponse.fields.measure_like;

    if (dimensions.length < 2 || measures.length < 1) {
      this.addError({title: "Dados Insuficientes", message: "O Sankey exige 2 Dimensões e 1 Medida."});
      return;
    }

    const container = element.querySelector('#vis');
    container.innerHTML = ""; 

    const width = element.clientWidth;
    const height = element.clientHeight;
    
    container.innerHTML = `<div style="padding:20px; font-family:sans-serif; color:#666;">
      <strong>Sankey V2 Ativo</strong><br>
      Renderizando fluxo entre <em>${dimensions[0].label}</em> e <em>${dimensions[1].label}</em>.<br>
      Total de registros: ${data.length}
    </div>`;

    done();
  }
});
