(function() {
  looker.visualizations.add({
    id: "custom_sankey_v2",
    label: "Sankey V2 (Familhão)",
    options: {
      color_range: {
        type: "array",
        label: "Cores do Fluxo",
        display: "colors",
        default: ["#3EB0D5", "#B1399E", "#C2DD67", "#592EC2", "#4276BE", "#FFD954", "#9673FF"]
      }
    },
    create: function(element, config) {
      element.innerHTML = `
        <style>
          #vis-container { font-family: 'Open Sans', Helvetica, Arial, sans-serif; height: 100%; width: 100%; }
          .node rect { cursor: move; fill-opacity: .9; shape-rendering: crispEdges; }
          .node text { pointer-events: none; text-shadow: 0 1px 0 #fff; font-size: 11px; }
          .link { fill: none; stroke: #000; stroke-opacity: .12; }
          .link:hover { stroke-opacity: .4; }
        </style>
        <div id="vis-container"></div>`;
    },
    updateAsync: function(data, element, config, queryResponse, details, done) {
      this.clearErrors();
      const container = element.querySelector('#vis-container');
      container.innerHTML = "";

      if (queryResponse.fields.dimension_like.length < 2 || queryResponse.fields.measure_like.length < 1) {
        this.addError({title: "Erro de Configuração", message: "Este gráfico exige pelo menos 2 Dimensões e 1 Medida."});
        return;
      }

      // Função para carregar bibliotecas necessárias
      const loadScript = (url) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = url;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      // Carregamento sequencial para garantir que o D3 esteja disponível antes do plugin Sankey
      Promise.all([
        loadScript("https://d3js.org/d3.v4.min.js")
      ]).then(() => {
        return loadScript("https://cdn.jsdelivr.net/gh/holtzy/D3-graph-gallery@master/LIB/sankey.js");
      }).then(() => {
        this.render(data, element, config, queryResponse, done);
      }).catch((err) => {
        container.innerHTML = `<div style="padding:20px; color:red;">Erro ao carregar bibliotecas gráficas. Verifique a ligação à internet ou as permissões de CSP.</div>`;
        console.error("Erro Looker Viz:", err);
      });
    },
    render: function(data, element, config, queryResponse, done) {
      const container = element.querySelector('#vis-container');
      const width = element.clientWidth;
      const height = element.clientHeight;

      const svg = d3.select(container).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");

      const sankey = d3.sankey()
        .nodeWidth(20)
        .nodePadding(15)
        .extent([[1, 1], [width - 1, height - 5]]);

      let nodes = [];
      let links = [];
      const d1 = queryResponse.fields.dimension_like[0].name;
      const d2 = queryResponse.fields.dimension_like[1].name;
      const m1 = queryResponse.fields.measure_like[0].name;

      data.forEach(d => {
        const s = d[d1].value || "Nulo";
        const t = d[d2].value || "Nulo";
        const v = d[m1].value || 0;

        if (!nodes.includes(s)) nodes.push(s);
        if (!nodes.includes(t)) nodes.push(t);

        links.push({
          source: nodes.indexOf(s),
          target: nodes.indexOf(t),
          value: v
        });
      });

      const graph = {
        nodes: nodes.map(n => ({ name: n })),
        links: links
      };

      sankey(graph);

      const color = d3.scaleOrdinal(config.color_range || d3.schemeCategory10);

      // Links
      svg.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.sankeyLinkHorizontal())
        .style("stroke-width", d => Math.max(1, d.width));

      // Nós
      const node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node");

      node.append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .style("fill", d => color(d.name))
        .style("stroke", "#000")
        .style("stroke-opacity", 0.1);

      node.append("text")
        .attr("x", d => d.x0 - 6)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(d => d.name)
        .filter(d => d.x0 < width / 2)
        .attr("x", d => d.x1 + 6)
        .attr("text-anchor", "start");

      done();
    }
  });
}());
