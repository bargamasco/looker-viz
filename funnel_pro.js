looker.visualizations.add({
  id: "custom_funnel_pro",
  label: "Funnel Pro",
  updateAsync: function(data, element, config, queryResponse, details, done) {
    this.clearErrors();
    const rows = data.map(d => {
      return `<div style="background:#eee; margin:5px; padding:10px; border-radius:4px; width:80%; text-align:center;">
        ${d[queryResponse.fields.dimension_like[0].name].value}
      </div>`;
    }).join("");

    element.innerHTML = `
      <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif;">
        <h4 style="margin-bottom:15px;">Funil de Conversão</h4>
        ${rows}
      </div>`;
    done();
  }
});
