function rolarDados() {
    const input = document.getElementById('inputDado').value.toLowerCase().trim();
    const display = document.getElementById('resultado');
    const regex = /^(dv|dd|[0-9]*)d?([0-9]+)(?:([+-])([0-9]+))?$/;
    const match = input.match(regex);

    if (!match) {
        display.innerHTML = "<span style='color:#5b0000; font-family: \"Rosarivo\", cursive; font-weight: 700'>Formato inválido! Tente: XdY, ddY ou dvY</span>";
        return;
    }

    let [_, prefix, lados, sinal, mod] = match;
    lados = parseInt(lados);
    mod = mod ? parseInt(mod) : 0;
    if (sinal === '-') mod = -mod;

    let resultadoBase = 0;
    let descricao = "";

    // Lógica para Vantagem / Desvantagem (dvY ou ddY)
    if (prefix === 'dv' || prefix === 'dd') {
        const d1 = Math.floor(Math.random() * lados) + 1;
        const d2 = Math.floor(Math.random() * lados) + 1;
        
        if (prefix === 'dv') {
            resultadoBase = Math.max(d1, d2);
            descricao = `Vantagem (Maior entre ${d1}, ${d2})`;
        } else {
            resultadoBase = Math.min(d1, d2);
            descricao = `Desvantagem (Menor entre ${d1}, ${d2})`;
        }
    } 
    // Lógica para Dados Normais (XdY ou dY)
    else {
        const qtd = (prefix === "" || prefix === undefined) ? 1 : parseInt(prefix);
        let rolagens = [];
        for (let i = 0; i < qtd; i++) {
            rolagens.push(Math.floor(Math.random() * lados) + 1);
        }
        resultadoBase = rolagens.reduce((a, b) => a + b, 0);
        descricao = qtd > 1 ? `Dados: (${rolagens.join(' + ')})` : `Dado: ${resultadoBase}`;
    }

    const totalFinal = resultadoBase + mod;
    const infoMod = mod !== 0 ? ` [Mod: ${sinal}${Math.abs(mod)}]` : "";

    display.innerHTML = `
        <div class="total">${totalFinal}</div>
        <div class="detail" style='color:black; font-family: \"Rosarivo\", cursive; font-weight: 700'>${descricao}${infoMod}</div>
    `;
}

function calcularNivel() {
    let xp = parseInt(document.getElementById('inputExp').value);
    const displayNivel = document.getElementById('nivelFinal');
    const displaySobrando = document.getElementById('xpSobrando');

    if (isNaN(xp) || xp < 0) {
        alert("Por favor, insira uma quantidade válida de XP.");
        return;
    }

    let nivel = 1;
    const faixas = [
        { max: 10, custo: 500 },
        { max: 20, custo: 1000 },
        { max: 30, custo: 1500 },
        { max: 40, custo: 2000 },
        { max: 50, custo: 2500 }
    ];

    for (let faixa of faixas) {
        while (nivel < faixa.max && xp >= faixa.custo) {
            xp -= faixa.custo;
            nivel++;
        }
    }

    if (nivel >= 50 || (nivel === 49 && xp >= 2500)) {
        if (nivel === 49 && xp >= 2500) {
            nivel = 50;
            xp -= 2500;
        }
        
        displayNivel.innerText = "50";
        displaySobrando.innerText = "Você alcançou o nível máximo!";
        displaySobrando.style.color = "#4a0000";
        displaySobrando.style.fontWeight = "bold";
        displaySobrando.style.fontFamily = "\"Rosarivo\", cursive";
    } else {
        displayNivel.innerText = nivel;
        displaySobrando.innerText = `XP Restante para o próximo nível: ${xp}`;
        displaySobrando.style.color = "black"; // Volta para a cor padrão
        displaySobrando.style.fontWeight = "normal";
        displaySobrando.style.fontFamily = "\"Rosarivo\", cursive";
    }
}