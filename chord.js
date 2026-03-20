looker.visualizations.add({
  id: "custom_chord",
  label: "Chord Diagram",
  updateAsync: function(data, element, config, queryResponse, details, done) {
    this.clearErrors();
    element.innerHTML = `
      <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif;">
        <div style="font-size:40px; color:#592EC2;">⭕</div>
        <div style="font-weight:bold; margin-top:10px;">Diagrama de Cordas Conectado</div>
        <div style="color:#999; font-size:12px;">Processando ${data.length} conexões...</div>
      </div>`;
    done();
  }
});
