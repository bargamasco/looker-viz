looker.visualizations.add({
  id: "custom_funnel_pro",
  label: "Funnel Pro (Custom)",
  updateAsync: function(data, element, config, queryResponse, details, done) {
    element.innerHTML = "Visualização de Funil Ativa";
    done();
  }
});
