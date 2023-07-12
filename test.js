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

function updateStats() {
    var newStats = new Map(stats);
    newStats.set(this.id, this.valueAsNumber);
    if (!limitCheck(newStats, statpoints))
        stats = newStats;
    else
        this.valueAsNumber = stats.get(this.id);
    document.getElementById(this.id+'-text').value = this.value;
    console.log(stats);
}
function load(){
    for( let i = 0; i < sliders.length; i++){
        sliders[i].oninput = updateStats;
    }
}