const cfg = require("./config");

function consumoMensalKwh(aparelho) {
  return (aparelho.potenciaW * aparelho.horasDia * aparelho.diasMes) / 1000;
}

function custoEnergia(kwh) {
  return kwh * cfg.TARIFA_KWH;
}

function adicionalBandeira(kwh) {
  return (kwh / 100) * cfg.VALORES_BANDEIRA[cfg.BANDEIRA];
}

function paineisNecessarios(kwh) {
  const geracao =
    (cfg.POTENCIA_PAINEL_W / 1000) * cfg.HSP * 30 * cfg.EFICIENCIA;
  return Math.ceil(kwh / geracao);
}

function simular(aparelhos) {
  let consumoTotal = 0;
  let detalhes = [];

  aparelhos.forEach(function (aparelho) {
    let kwh = consumoMensalKwh(aparelho);
    let custo = custoEnergia(kwh);
    let percentual = 0;

    consumoTotal = consumoTotal + kwh;

    detalhes.push({
      nome: aparelho.nome,
      kwhMes: kwh,
      custo: custo,
      percentual: percentual,
    });
  });

  detalhes.forEach(function (aparelho) {
    aparelho.percentual = (aparelho.kwhMes / consumoTotal) * 100;
  });

  let energia = custoEnergia(consumoTotal);
  let bandeira = adicionalBandeira(consumoTotal);
  let total = energia + bandeira;
  let paineis = paineisNecessarios(consumoTotal);

  let aparelhoMaisCaro = detalhes[0];

  detalhes.forEach(function (aparelho) {
    if (aparelho.custo > aparelhoMaisCaro.custo) {
      aparelhoMaisCaro = aparelho;
    }
  });

  return {
    consumoKwhMes: Math.round(consumoTotal * 100) / 100,
    custoEnergia: Math.round(energia * 100) / 100,
    adicionalBandeira: Math.round(bandeira * 100) / 100,
    totalMes: Math.round(total * 100) / 100,
    paineisNecessarios: paineis,
    aparelhoMaisCaro: {
      nome: aparelhoMaisCaro.nome,
      custo: Math.round(aparelhoMaisCaro.custo * 100) / 100,
    },
    detalhes: detalhes.map(function (aparelho) {
      return {
        nome: aparelho.nome,
        kwhMes: Math.round(aparelho.kwhMes * 100) / 100,
        custo: Math.round(aparelho.custo * 100) / 100,
        percentual: Math.round(aparelho.percentual * 100) / 100,
      };
    }),
  };
}

module.exports = {
  consumoMensalKwh,
  custoEnergia,
  adicionalBandeira,
  paineisNecessarios,
  simular,
};
