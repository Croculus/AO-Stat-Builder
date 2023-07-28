const maxLevel = 125;

var statpoints = maxLevel*2;


var stats = new Map([['vitality', 0], ['magic', 0], ['weapons', 0], ['strength', 0]]);

var sliders = document.getElementsByClassName('slider');

var basehp = 968+(2*stats.get('vitality'));



function limitCheck(map, limit){
    var sum = 0;
    map.forEach(element => {
        sum+= element
    });
    
    return (sum > limit);

}

function sliderUpdate() {
    var newStats = new Map(stats);
    newStats.set(this.id, this.valueAsNumber);
    if (!limitCheck(newStats, statpoints))
        stats = newStats;
    else
        this.valueAsNumber = stats.get(this.id);
    document.getElementById(this.id+'-text').value = this.value;
    console.log(stats);
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
    }
    else
        this.value = String(stats.get(id));
    console.log(stats);
    build_calc();
    
}

function build_calc(){
    //implement build math
    if (stats.get('vitality') > (statpoints*0.6))
        build("Warden");
    else if (stats.get('magic') > (statpoints*0.6))
        build("Warden");
    else if (stats.get('weapons') > (statpoints*0.6))
        build("Warden");
    else if (stats.get('strength') > (statpoints*0.6))
        build("Warden");

    else if (stats.get('vitality') >= (statpoints*0.4) && stats.get('magic') >= (statpoints*0.4))
        document.getElementById('build').innerHTML = "Paladin";    
    else if (stats.get('vitality') >= (statpoints*0.4) && stats.get('weapons') >= (statpoints*0.4))
        document.getElementById('build').innerHTML = "Knight";
    else if (stats.get('vitality') >= (statpoints*0.4) && stats.get('strength') >= (statpoints*0.4))
        document.getElementById('build').innerHTML = "Juggernaut";
        
    else if (stats.get('magic') >= (statpoints*0.4) && stats.get('weapons') >= (statpoints*0.4))
        document.getElementById('build').innerHTML = "Conjurer";
    else if (stats.get('magic') >= (statpoints*0.4) && stats.get('strength') >= (statpoints*0.4))
        document.getElementById('build').innerHTML = "Warlock";      

    else if (stats.get('weapons') >= (statpoints*0.4) && stats.get('strength') >= (statpoints*0.4))
        document.getElementById('build').innerHTML = "Warlord"; 
    else
        document.getElementById('build').innerHTML = "Savant"; 
}

function build(text){
    const builds = JSON.parse(fetch("./builds.json"));
    color = builds[text].color;
    document.getElementById('build').innerHTML = text;
    document.getElementById('build').style.color = color;
}
function load(){
    for( let i = 0; i < sliders.length; i++){
        sliders[i].oninput = sliderUpdate;
        document.getElementsByClassName('input-text')[i].oninput = textUpdate;
    }

}