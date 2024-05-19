const maxLevel = 136;

var statpoints = maxLevel*2;
var remaining_points = statpoints;

var stats = new Map([['vitality', 0], ['magic', 0], ['weapons', 0], ['strength', 0]]);

var sliders = document.getElementsByClassName('slider');

var basehp = 968+(2*stats.get('vitality'));

var magicData = null;
var magics = [];
var fstyleData = null;
var fstyles = [];
var buildData = null;

var table_selection = [];

class Magic {
    constructor(name){
        this.name = name
        //this.damage = magicData[this.name].damage
        //this.speed = magicData[this.name].speed
        //this.size = magicData[this.name].size
        //this.effect = magicData[this.name].effect
    }



    toString() {
        return this.name //+ " Damage: "+this.damage+" Speed: "+this.speed+" Size: "+this.size;
    }
}


class Fstyle {
    constructor(name){
        this.name = name
        //this.damage = fstyleData[this.name].damage
        //this.speed = fstyleData[this.name].speed
        //this.size = fstyleData[this.name].size
        //this.effect = fstylData[this.name].effect
    }
}

function limitCheck(map, limit){
    var sum = 0;
    map.forEach(element => {
        sum+= element
        
    });
    remaining_points = statpoints-sum;
    return (sum > limit);

}
async function loadData() {
    if (magicData === null) {
        magicData = await fetchJSONData("./magics.json");
        let iter = Object.keys(magicData)
        for(let i = 0; i < iter.length; i++){
             magics.push(new Magic(iter[i]))   
        }

    }
    if (fstyleData === null) {
        fstyleData = await fetchJSONData("./fstyles.json");
        let iter = Object.keys(fstyleData)
        for(let i = 0; i < iter.length; i++){
             fstyles.push(new Fstyle(iter[i]))   
        }
    }
    if (buildData === null) {
        buildData = await fetchJSONData("./builds.json");
    }
    
    return undefined;
}

async function fetchJSONData(url) {
    try {
      const response = await fetch(url);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error("Error fetching JSON:", error);
    }
  }

function sliderUpdate() {
    var newStats = new Map(stats);
    newStats.set(this.id, this.valueAsNumber);
    if (!limitCheck(newStats, statpoints)){
        stats = newStats;
        document.getElementById("remaining").innerHTML = "Remaining: "+remaining_points
    }
    else
        this.valueAsNumber = stats.get(this.id);
    document.getElementById(this.id+'-text').value = this.value;
    build_calc();
}

function textUpdate() {
    const int = Math.abs(parseInt(this.value));
    const id = this.id.replace('-text', '')
    var newStats = new Map(stats);

    newStats.set(id, int);
    if (!limitCheck(newStats, statpoints)){
        stats = newStats;
        document.getElementById(id).value = int;
        document.getElementById("remaining").innerHTML = "Remaining: "+remaining_points
    }
    else
        this.value = String(stats.get(id));
    build_calc();
}

function build_calc(){
    if (stats.get('vitality') > (statpoints*0.6))
        loadBuild("Warden");
    else if (stats.get('magic') > (statpoints*0.6))
        loadBuild("Mage");
    else if (stats.get('weapons') > (statpoints*0.6))
        loadBuild("Warrior");
    else if (stats.get('strength') > (statpoints*0.6))
        loadBuild("Bezerker");

    else if (stats.get('vitality') >= (statpoints*0.4) && stats.get('magic') >= (statpoints*0.4))
        loadBuild("Paladin")   
    else if (stats.get('vitality') >= (statpoints*0.4) && stats.get('weapons') >= (statpoints*0.4))
        loadBuild("Knight");
    else if (stats.get('vitality') >= (statpoints*0.4) && stats.get('strength') >= (statpoints*0.4))
        loadBuild("Juggernaut");
        
    else if (stats.get('magic') >= (statpoints*0.4) && stats.get('weapons') >= (statpoints*0.4))
        loadBuild("Conjurer");
    else if (stats.get('magic') >= (statpoints*0.4) && stats.get('strength') >= (statpoints*0.4))
        loadBuild("Warlock");      

    else if (stats.get('weapons') >= (statpoints*0.4) && stats.get('strength') >= (statpoints*0.4))
        loadBuild("Warlord"); 
    else
        loadBuild("Savant"); 
}

async function loadBuild(text){
    build = buildData[text]
    color = build.color;
    document.getElementById('build').innerHTML = text;
    document.getElementById('build').style.color = color;
    for(let i = 0; i < build.tabs.length; i++){
        generateTab(build.tabs[i])
    }
}

async function generateTab(text){
    if (text === "Weapons" || text === "Vitality"){
        return undefined;
    }
    if (text === "magic"){
        var numRows = 4; 
        var numCols = 5;
        var arr_type = magics;
    }
    else if (text === "fstyle"){
        var numRows = 2; 
        var numCols = 3;
        var arr_type = fstyles;
    }
    let div = document.getElementById("tables");
    let table = document.createElement("table");
    table.setAttribute("class", text+"Table");
    let tbody = document.createElement("tbody");

    for (let i = 0; i < numRows+0; i++) {
        // Create a table row element
        let row = document.createElement("tr");
    
        for (let j = 0; j < numCols; j++) {
            let element = arr_type[(i*numCols)+j]; //refers to magics array

            // Create a table cell element (td)
            let cell = document.createElement("td"); 
            cell.setAttribute("id", element.name);

            let image = document.createElement("img");
            image.setAttribute("src", "images/"+text+"s/"+element.name+".png");
            image.setAttribute("width", "48px");
            cell.appendChild(image);
            // Append the cell to the row
            row.appendChild(cell);
        }
    
        // Append the row to the table body
        tbody.appendChild(row);
        }
    table.appendChild(tbody);
    div.appendChild(table);
}




async function update(){
    for( let i = 0; i < sliders.length; i++){
        sliders[i].oninput = sliderUpdate;
        document.getElementsByClassName('input-text')[i].oninput = textUpdate;
    }
}

async function load(){
    document.getElementById('remaining').innerHTML = "Remaining: "+String(remaining_points);
    for( let i = 0; i < sliders.length; i++){
        sliders[i].setAttribute('max', statpoints); 
    }
    await update();
    await loadData();
}

