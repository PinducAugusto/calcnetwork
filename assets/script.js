//verifica se o ip está no padrão usando expressões regulares (adquirido do site StackOverFlow)
function verifyIP(ip){ 
    if (/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/.test(ip)) {  
        return true;
    }  
    return false;
}

//retorna o IP colocado no input, fazendo sua verificação
function getIP(){
    if (verifyIP(document.querySelector("#ip").value)) { 
        return document.querySelector("#ip").value; 
    }
    return false;
}

//retorna o IP colocado no input, fazendo sua verificação
function getNetMask(){ 
    if (verifyIP(document.querySelector("#netMask").value)) { 
        return document.querySelector("#netMask").value; 
    }
    return false;
}

//retorna a classe colocada no input radio (por padrão, retornará a classe A, pois no html está definida com o atributo checked)
function getClass(){
    let classIP = document.getElementsByName("class");
    if(classIP[1].checked){return "B";}
    if(classIP[2].checked){return "C";}
    return "A";
}

//tranforma um número qualquer em um binário
function toBinary(number){ 
    number = number.toString(2)
    return number
}

//tranforma um número binário menor que 256, em uma base de octeto (para as verificações proximas esses zeros são importantes), e retorna-o
function toOctat(binary){ 
    let arrayBinary = [...binary];
    while(arrayBinary.length<8){
        arrayBinary.unshift("0");
    }
    let stringBinary = arrayBinary.toString().replaceAll("," , "")
    return stringBinary;
}

//retorna um array contendo os números do input de ip ou máscara de rede (uso bem especifico desse site e importante para os cálculos)
function separateIP(input){ 
    if(input === undefined){
        return false;
    }
    else{
        input += "." //resolver o problema do ultimo octeto, pois com o código a baixo, ele só adiciona o número quando encontra um ponto (".") (gambiarra)
        let arrayInput = [...input];
        let numbers = [];
        let numero = "";
        arrayInput.forEach(element => {
            if(element === "."){
                numbers.push(Number(numero));
                numero="";
            }else{
                numero += element;
            }
        });
        return numbers;
    }
}

//tranforma um endereço ip em base decimal, em base binaria, retornado um array com cada valor
function IptoBinaryIp(arrayNumbers){ 
    let arrayBinary = [];
    arrayNumbers.forEach(element => {
        arrayBinary.push(toOctat(toBinary(element)));
    });
    return arrayBinary;
}

//recebe dois arrays (um é o ip, e o outro e a mascara da rede) e retorna um endereço de rede, fazendo a comparação necessária
function getNetAdressBinary(arrayIP, arrayNetMask){ 
    let netAdress = [];
    for (let i = 0; i < 4; i++) {
        let ip = arrayIP[i].split("");
        let netMask = arrayNetMask[i].split("");
        let octet = "";
        for (let ii = 0; ii < 8; ii++) {
            if(ip[ii] === "1" && netMask[ii] === "1"){
                octet += "1"
            }
            else{
                octet += "0"
            }
        }
        netAdress.push(octet);  
    }
    return netAdress;
}

//tranforma uma string binaria em um numero decimal
function toDecimal(number){ 
    return parseInt(number, 2);
}

//tranforma um endereço de rede binario (um array no caso), em um endereço decimal, implementando sua identação correta com ponto (".")
function netAdressBinaryToDecimal(arrayNetAdress){
    let netAdressDecimal = "";
    let i = 0;
    arrayNetAdress.forEach(element => {
        i++;
        netAdressDecimal += toDecimal(element);
        if(i<4){
            netAdressDecimal += "."
        }

    });
    return netAdressDecimal
}

//filtra um array contendo os binarios de uma máscara de rede, retornando um array filtrado de acordo com sua classe
function filterNetMaskByClass(netMask, classType){ 
    let netMaskClass = [];
    if(classType === "A"){
        netMaskClass.push(netMask[1]); //isso é gambiarra, mas fiquei com preguiça
        netMaskClass.push(netMask[2]);
        netMaskClass.push(netMask[3]);
        return netMaskClass;

    }else if(classType === "B"){
        netMaskClass.push(netMask[2]);
        netMaskClass.push(netMask[3]);
        return netMaskClass;
    }
    netMaskClass.push(netMask[3]);
    return netMaskClass;
}

//calcula a quantidade de zeros (0) em uma string
function numberOfZeros(numberStr){
    let nZeros = 0;
    numberStr = [...numberStr];
    numberStr.forEach(element => {
        if(element === "0"){
            nZeros++;
        }
    });
    return nZeros;
}

//calcula a quantidade de ums (1) em uma string
function numberOfOnes(numberStr){
    let nOnes = 0;
    numberStr = [...numberStr];
    numberStr.forEach(element => {
        if(element === "1"){
            nOnes++;
        }
    });
    return nOnes;
}

//recebe um array já filtrado, e calcula o número de hosts possíveis naquela rede
function calcNumHosts(netMaskFiltered){ 
    let numHosts = 0;
    netMaskFiltered.forEach(element => {
        numHosts += numberOfZeros(element);
    });
    numHosts = (Math.pow(2, numHosts)) - 2; //menos 2 por causa do broadcast, e da propia rede
    return numHosts;
}

//recebe um array já filtrado, e calcula o número de sub redes disponíveis
function calcNumSubNetworks(netMaskFiltered){ 
    let numSubNet = 0;
    netMaskFiltered.forEach(element => {
        numSubNet += numberOfOnes(element);
    });
    numSubNet = (Math.pow(2, numSubNet));
    return numSubNet;
}

document.querySelector("#btnSubmit").addEventListener("click", function(){
    const results = document.querySelector("#results");
    if(!getIP() || !getNetMask()){
        results.style.padding = "10px";
        results.style.marginBottom = "20px";
        results.style.backgroundColor = "rgb(255, 0, 0, 0.8)";
        if(!getIP()){
            results.innerHTML = "IP errado!";
        }
        else if(!getNetMask()){
            results.innerHTML = "Máscara de Rede errada!";
        }
    }
    else{
        results.style.padding = "10px";
        results.style.marginBottom = "20px";
        results.style.backgroundColor = "rgb(0, 128, 0, 0.8)";

        let ip = IptoBinaryIp(separateIP(getIP())); //resgata o ip, separa em ele em números, e tranforma esses números em binario

        let netMask = IptoBinaryIp(separateIP(getNetMask())); //faz o mesmo procedimento de cima, entretanto com com a máscara de rede

        let netAdress = netAdressBinaryToDecimal(getNetAdressBinary(ip, netMask)); //utilizando o ip e a netMask, calcula o Endereço de Rede do IP informado, de acordo com a máscara

        results.innerHTML = `Endereço de Rede: ${netAdress} <br>`;

        let numHosts = calcNumHosts(filterNetMaskByClass(netMask, getClass())); //retorna o número de hosts, filtrando primeiro a máscara de rede, de acordo com sua classe

        let numSubNet = calcNumSubNetworks(filterNetMaskByClass(netMask, getClass())); //retorna o número de sub redes, filtrando primeiro a máscara de rede, de acordo com sua classe

        

        results.innerHTML += `Número de Hosts: ${numHosts} <br>`;
        results.innerHTML += `Número de SubRedes: ${numSubNet}`;



    }
    


})

// 255.255.248.0
// 10.3.39.7