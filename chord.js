looker.visualizations.add({
  id: "custom_chord",
  label: "Chord Diagram (Custom)",
  create: function(element, config) {
    element.innerHTML = "<div style='height:100%; display:flex; align-items:center; justify-content:center;'>Pronto para Chord</div>";
  },
  updateAsync: function(data, element, config, queryResponse, details, done) {
    done();
  }
});
