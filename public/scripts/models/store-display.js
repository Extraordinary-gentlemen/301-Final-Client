let populateStoresList = () => {

  let gallonsbuying = app.setup.myCar.gallons
  let mpg = app.setup.myCar.mpg.avg

  allStores.map(storeArray => {
    let usedFuel = storeArray.distance / mpg;
    let travelcost = storeArray.fuelcost * usedFuel;
    let buyingcost = storeArray.fuelcost * gallonsbuying;
    let totalcost = buyingcost + travelcost;
  })

  let format = Handlebars.compile($("#store-display-template").text);

  $("#store-list").append(format(data))

}
