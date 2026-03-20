looker.visualizations.add({
  id: "custom_tree",
  label: "Árvore Dobrável (Custom)",
  updateAsync: function(data, element, config, queryResponse, details, done) {
    element.innerHTML = "Estrutura de Árvore Ativa";
    done();
  }
});
