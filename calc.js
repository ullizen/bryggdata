console.log("Total ", data.length);

console.log("Left brewer ", data.filter(d => d.BrewerId == 1).length);
console.log("Right brewer ", data.filter(d => d.BrewerId == 2).length);