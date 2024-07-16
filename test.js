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

var tables = [];

class Table{
    constructor(type){
        this.type = type;
        this.index = document.getElementsByClassName(type+"Table").length;
        this.selection = null;
        
        this.tableID = type+this.index;

    }
    buildTable(){
        if (this.type === "magic"){
            this.numRows = 4; 
            this.numCols = 5;
            this.arr_type = magics;

        }
        else if (this.type === "fstyle"){
            this.numRows = 2; 
            this.numCols = 3;
            this.arr_type = fstyles;
        }
        let div = document.getElementById("tables");
        let tableElement = document.createElement("table");
        tableElement.setAttribute("class", this.type+"Table");
        tableElement.setAttribute("id", this.tableID);
        let tbody = document.createElement("tbody");

        for (let i = 0; i < this.numRows+0; i++) {
            // Create a table row element
            let row = document.createElement("tr");
        
            for (let j = 0; j < this.numCols; j++) {
                let element = this.arr_type[(i*this.numCols)+j]; //refers to magics array
                if (element == undefined){
                    continue
                }
                // Create a table cell element (td)
                let cell = document.createElement("td"); 
                cell.setAttribute("id", element.name+this.index);
                cell.addEventListener('click', ()=> 
                {this.select(element.name, this.tableID)}
            )
                let image = document.createElement("img");
                image.setAttribute("src", "images/"+this.type+"s/"+element.name+".png");
                image.setAttribute("width", "48px");
                cell.appendChild(image);
                // Append the cell to the row
                row.appendChild(cell);
            }
        
            // Append the row to the table body
            tbody.appendChild(row);
            }
        tableElement.appendChild(tbody);
        div.appendChild(tableElement);
    }

    select(element, table){
        //unselect oldskill
        if(this.selection != null){
            let old_skill = document.getElementById(this.selection+this.index).style;
            old_skill.backgroundColor = "#666869";
            old_skill.cursor = "pointer";
        }
    
        //selecting new figure
        let new_skill =  document.getElementById(element+this.index).style;
        new_skill.backgroundColor = "#16181a";
        new_skill.cursor = "default";
        this.selection = element;
        console.log(tables.map(x => x.selection));
        }
    
    
}

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
    } 
    catch (error) {
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
    if (isNaN(int)){ 
        this.value = 0;
        return}
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
    build = buildData[text];
    color = build.color;
    document.getElementById('build').innerHTML = text;
    document.getElementById('build').style.color = color;
    deleteTabs();
    for(let i = 0; i < build.tabs.length; i++){
        generateTable(build.tabs[i]);
    }
}

 function deleteTabs(){
    deletetables = document.getElementById("tables").innerHTML = "";
    table_selection = {}; //reset table selection

}

async function generateTable(skill){
    if (skill === "Weapons" || skill === "Vitality" || skill === "Choice"){
        return undefined;
    }
    if (skill === "magic"){
        var numRows = 4; 
        var numCols = 5;
        var arr_type = magics;
    }
    else if (skill === "fstyle"){
        var numRows = 2; 
        var numCols = 3;
        var arr_type = fstyles;
    }

    // need to add class interpretation here
    
    //var tableIndex = document.getElementsByClassName(skill+"Table").length;
    let tableClass = new Table(skill);
    tableClass.buildTable();
    tables.push(tableClass);
    //var tableID = skill+tableIndex;
    /*
    let div = document.getElementById("tables");
    let table = document.createElement("table");
    table.setAttribute("class", skill+"Table");
    table.setAttribute("id", tableID);
    let tbody = document.createElement("tbody");

    for (let i = 0; i < numRows+0; i++) {
        // Create a table row element
        let row = document.createElement("tr");
    
        for (let j = 0; j < numCols; j++) {
            let element = arr_type[(i*numCols)+j]; //refers to magics array
            if (element == undefined){
                continue
            }
            // Create a table cell element (td)
            let cell = document.createElement("td"); 
            cell.setAttribute("id", element.name+tableIndex);
            cell.addEventListener('click', function() 
            {select(element.name, tableID)}
        )
            let image = document.createElement("img");
            image.setAttribute("src", "images/"+skill+"s/"+element.name+".png");
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
    */
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

async function select(magic_fs, table){
    //unselect oldskill
    index=table.slice(-1); //gets index of table from the tableid from last character
    if(table_selection[table] != undefined){
        //resetting old element
        old_skill = document.getElementById(table_selection[table]+index).style;
        old_skill.backgroundColor = "#666869";
        old_skill.cursor = "pointer";
    }

    //selecting new element
    new_skill =  document.getElementById(magic_fs+index).style;
    new_skill.backgroundColor = "#16181a";
    new_skill.cursor = "default";
    table_selection[table] = magic_fs;
    console.log(table_selection);
    }
