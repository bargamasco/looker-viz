looker.visualizations.add({
  id: "custom_tree",
  label: "Árvore Dobrável",
  updateAsync: function(data, element, config, queryResponse, details, done) {
    this.clearErrors();
    element.innerHTML = `
      <div style="height:100%; padding:20px; font-family:sans-serif;">
        <div style="color:#4276BE; font-weight:bold;">🌳 Estrutura Hierárquica</div>
        <p style="font-size:13px;">Mapeando níveis de dimensões para visualização em árvore.</p>
        <ul style="font-size:12px; color:#666;">
          <li>Nível 1: ${queryResponse.fields.dimension_like[0].label}</li>
          <li>Nível 2: ${queryResponse.fields.dimension_like[1] ? queryResponse.fields.dimension_like[1].label : 'N/A'}</li>
        </ul>
      </div>`;
    done();
  }
});
