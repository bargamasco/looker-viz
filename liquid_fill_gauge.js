looker.visualizations.add({
  id: "custom_liquid_fill",
  label: "Liquid Fill Gauge",
  updateAsync: function(data, element, config, queryResponse, details, done) {
    this.clearErrors();
    const val = data[0][queryResponse.fields.measure_like[0].name].value;
    const pct = (val * 100).toFixed(1);
    
    element.innerHTML = `
      <div style="height:100%; display:flex; align-items:center; justify-content:center; flex-direction:column; font-family:sans-serif;">
        <div style="width:150px; height:150px; border-radius:50%; border:5px solid #3EB0D5; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden;">
          <div style="position:absolute; bottom:0; width:100%; height:${pct}%; background:#3EB0D5; opacity:0.6;"></div>
          <span style="font-size:28px; font-weight:bold; z-index:1;">${pct}%</span>
        </div>
        <div style="margin-top:10px; font-weight:bold; color:#3EB0D5;">Meta Atingida</div>
      </div>`;
    done();
  }
});
