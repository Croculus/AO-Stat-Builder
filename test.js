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

function updateStats(index, e) {
    var newStats = stats
    newStats.set('vitality', sliders[0].valueAsNumber);
    newStats.set('magic', sliders[1].valueAsNumber);
    newStats.set('weapons', sliders[2].valueAsNumber);
    newStats.set('strength', sliders[3].valueAsNumber);
    if (!limitCheck(newStats, statpoints))
        stats = newStats;
    console.log(stats);
}
function load(){
    for( let i = 0; i < sliders.length; i++){
        sliders[i].oninput = updateStats(i, this);
    }
}