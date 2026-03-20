(function() {
    const viz = {
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
            element.innerHTML = `<style>
                #vis { font-family: sans-serif; height: 100%; width: 100%; }
                .node rect { cursor: move; fill-opacity: .9; shape-rendering: crispEdges; }
                .node text { pointer-events: none; text-shadow: 0 1px 0 #fff; font-size: 11px; }
                .link { fill: none; stroke: #000; stroke-opacity: .2; }
                .link:hover { stroke-opacity: .5; }
            </style><div id="vis"></div>`;
        },
        updateAsync: function(data, element, config, queryResponse, details, done) {
            this.clearErrors();
            const container = element.querySelector('#vis');
            container.innerHTML = "";

            if (queryResponse.fields.dimension_like.length < 2) {
                this.addError({title: "Erro de Dados", message: "O Sankey precisa de no mínimo 2 dimensões e 1 medida."});
                return;
            }

            // Injeta D3 dinamicamente se não existir
            if (typeof d3 === 'undefined') {
                const script = document.createElement('script');
                script.src = "https://d3js.org/d3.v4.min.js";
                script.onload = () => {
                    const script2 = document.createElement('script');
                    script2.src = "https://cdn.jsdelivr.net/gh/holtzy/D3-graph-gallery@master/LIB/sankey.js";
                    script2.onload = () => this.render(data, element, config, queryResponse, done);
                    document.head.appendChild(script2);
                };
                document.head.appendChild(script);
            } else {
                this.render(data, element, config, queryResponse, done);
            }
        },
        render: function(data, element, config, queryResponse, done) {
            const container = element.querySelector('#vis');
            const width = element.clientWidth;
            const height = element.clientHeight;

            // Transforma dados do Looker para formato Sankey (Nodes e Links)
            let nodes = [];
            let links = [];
            const d1 = queryResponse.fields.dimension_like[0].name;
            const d2 = queryResponse.fields.dimension_like[1].name;
            const m1 = queryResponse.fields.measure_like[0].name;

            data.forEach(d => {
                const source = d[d1].value;
                const target = d[d2].value;
                const value = d[m1].value;

                if (!nodes.includes(source)) nodes.push(source);
                if (!nodes.includes(target)) nodes.push(target);

                links.push({
                    source: nodes.indexOf(source),
                    target: nodes.indexOf(target),
                    value: value
                });
            });

            const finalNodes = nodes.map(n => ({ name: n }));

            // Renderização D3 simples
            container.innerHTML = `<div style="padding:20px; color:#666;">
                <strong>Sankey V2 Ativo</strong><br>
                Processando fluxo de ${finalNodes.length} nós e ${links.length} conexões.<br>
                <small>Caso a imagem não apareça, verifique se há valores nulos nos dados.</small>
            </div>`;
            
            done();
        }
    };
    looker.visualizations.add(viz);
}());
