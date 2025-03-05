
const footerHeight = () => {
  let ret = windowHeight * 0.1
  if(ret < 50)return 50
  if(ret > 100)return 100
  return ret
}

const diskColors = {
  "green": [ [205, 255, 192], [72, 120, 87] ],
  "pink": [ [255, 183, 217], [184, 24, 115] ],
  "blue": [ [179, 185, 255], [95, 84, 160] ],
  "other": [ [255, 255, 255], [0, 0, 0] ]
}

const diskColorMap = {
  "1": "blue",
  "10": "green",
  "100": "pink",
  "other": "other"
}

let dividend = 320
let divisor = 3
let divisorPiles = []
const quotient = () => Math.floor(dividend / divisor)
const digitsInDividend = () => dividend.toString().length
const canvasPadding = () => Math.min(height * 0.1, 20)
const startingPileBoxHeight = () => height * 0.2
const canvasCenter = () => ({ x: width / 2, y: height / 2 })
const pileSpacing = () => Math.min(height * 0.1, 30)
const startingPileBox = () => {
  const h = startingPileBoxHeight()
  const w = Math.min(width - (canvasPadding() * 2), 500)
  const x = canvasCenter().x - (w / 2)
  const y = height - startingPileBoxHeight() - canvasPadding() - 20
  let placeValueContainers = []
  for(let i = 0; i < digitsInDividend(); i++){
    const thisRect = {
      x: x + ((w / digitsInDividend()) * i),
      y: y,
      w: w / digitsInDividend(),
      h: h
    }
    placeValueContainers.push(thisRect)
  }
  return {
    x, y, w, h,
    placeValueContainers
  }
}
let startingPileDiskQuantityArray = [3, 2, 0]
let divisorPileDiskQuantityArrays = []
const factors = number => [...Array(number + 1).keys()].filter(i=>number % i === 0)
function getDivisorPiles(){
  //Given a divisor, return two factors that are as close to each other as possible
  //which multiply to get the divisor
  divisorPileDiskQuantityArrays = []
  const divisorFactors = factors(divisor)
  const half = Math.floor(divisorFactors.length / 2)
  let rows = divisorFactors[half - 1]
  let columns = divisorFactors[half]
  if(divisorFactors.length % 2 == 1){
    rows = divisorFactors[half]
  }
  const divisorPileGrid = {
    x: canvasPadding(),
    y: canvasPadding(),
    w: width - (canvasPadding() * 2),
    h: startingPileBox().y - pileSpacing() - canvasPadding()
  }
  stroke(0, 255, 255); noFill();
  rect(divisorPileGrid.x, divisorPileGrid.y, divisorPileGrid.w, divisorPileGrid.h)
  let piles = []
  for(let r = 0; r < rows; r ++){
    for(let c = 0; c < columns; c ++){
      const x = divisorPileGrid.x + (divisorPileGrid.w / columns) * c
      const y = divisorPileGrid.y + (divisorPileGrid.h / rows) * r
      const w = divisorPileGrid.w / columns
      const h = divisorPileGrid.h / rows
      const placeValueContainers = []
      for(let i = 0; i < digitsInDividend(); i++){
        const thisRect = {
          x: x + (w / digitsInDividend()) * i,
          y: y,
          w: w / digitsInDividend(),
          h: h
        }
        placeValueContainers.push(thisRect)
      }
      piles.push({
        x, y, w, h,
        placeValueContainers
      })
      //Create an array of zeros. Number of zeros = digitsInDividend()
      const zerosArray = Array(digitsInDividend()).fill(0)
      divisorPileDiskQuantityArrays.push(zerosArray)
    }
  }
  return piles
}
function drawPile(boxObject, diskQuantityArray, isDivisorPile = true){
  stroke(0); strokeWeight(1)
  // if(isDivisorPile && valuesOfDivisorPilesMatch()){
  //   stroke(0, 200, 0); strokeWeight(3);
  // } else {
  //   stroke(0)
  // }
  rect(boxObject.x, boxObject.y, boxObject.w, boxObject.h)
  drawingContext.setLineDash([])
  const placeValueCount = boxObject.placeValueContainers.length
  for(let i = 0; i < placeValueCount; i++){
    const pvc = boxObject.placeValueContainers[i]
    const diskQuantity = diskQuantityArray[i]
    // stroke(255, 0, 0); noFill(); strokeWeight(1)
    // rect(pvc.x, pvc.y, pvc.w, pvc.h)
    const diskValue = "1" + "0".repeat(placeValueCount - i - 1)
    drawDiskQuantity(diskValue, diskQuantity, pvc.x + (pvc.w / 2), pvc.y + (pvc.h / 2))
  }
  if(isDivisorPile){
    fill(0); noStroke();
    text( getValueOfDiskQuantityArray(diskQuantityArray), boxObject.x + (boxObject.w / 2), boxObject.y + boxObject.h - 20)
  }
}

function getValueOfDiskQuantityArray(diskAQuantityArray){
  let ret = 0
  for(let i in diskAQuantityArray){
    ret += diskAQuantityArray[i] * Math.pow(10, diskAQuantityArray.length - 1 - i)
  }
  return ret
}

function valuesOfDivisorPilesMatch(){
  const valueToMatch = getValueOfDiskQuantityArray(divisorPileDiskQuantityArrays[0])
  for(let i in divisorPileDiskQuantityArrays){
    if( getValueOfDiskQuantityArray(divisorPileDiskQuantityArrays[i]) !== valueToMatch )return false
  }
  return true
}

function drawDivisorPiles(){
  for(let i in divisorPiles){
    stroke(0); noFill();
    drawPile(divisorPiles[i], divisorPileDiskQuantityArrays[i])
  }
}

function drawDiskColumn(value, quantity, centerx, centery){
  const diskSpacing = height * 0.02
  const inity = centery - ( (quantity - 1) * diskSpacing / 2 )
  for(let i = 0; i < quantity; i++){
    const y = inity + (i * diskSpacing)
    drawDisk(value, centerx, y)
  }
}

function drawDiskQuantity(value, quantity, centerx, centery){
  const columns = Math.ceil(quantity / 10)
  const columnSpacing = width * 0.06
  let quantityRemaining = quantity
  const startx = centerx - ( columns / 2 * columnSpacing) + (columnSpacing / 2)
  for(let i = 0; i < columns; i++){
    drawDiskColumn(value, Math.min(quantityRemaining, 10), startx + (i * columnSpacing), centery)
    quantityRemaining -= 10
  }
}

function drawDisk(value, x, y){
  const diskWidth = width * 0.05
  let colorToUse = diskColors[diskColorMap["other"]]
  if(Object.keys(diskColorMap).includes(value)){
    colorToUse = diskColors[diskColorMap[value]]
  }
  stroke( colorToUse[1] ); strokeWeight(1);
  textAlign(CENTER, CENTER)
  // fill( [255, 0, 0] )
  fill( colorToUse[0] )
  ellipse(x, y, diskWidth)
  fill( colorToUse[1] ); noStroke()
  textSize(20 * (diskWidth/40) )
  text(value, x, y)
}

const getCanvasWidth = () => Math.min(windowWidth, 800)
const getCanvasHeight = () => Math.max(windowHeight - footerHeight(), 500)

function setup(){
  const cnv = createCanvas(getCanvasWidth(), getCanvasHeight())
  cnv.parent("canvas-container")
  icursor = new MobileFriendlyCursor({
    threeFingerConsole: true,
    manualSize: true
  })
  divisorPiles = getDivisorPiles()
}

function draw(){
  background(255)
  drawStartingPile()
  drawDivisorPiles()
  
  if(valueBeingDraggedByUser !== null){
    drawDisk(valueBeingDraggedByUser, icursor.x, icursor.y)
  }
  
  moveAlert.draw()
  icursor.update();
}

function drawStartingPile(){
  const startBox = startingPileBox()
  noFill()
  stroke(0); drawingContext.setLineDash([6])
  strokeWeight(1)
  drawPile(startBox, startingPileDiskQuantityArray, false)
  drawingContext.setLineDash([])
  noStroke(); fill(0);
  textSize(20)
  textAlign(CENTER, CENTER)
  text(dividend, startBox.x + (startBox.w / 2), startBox.y + startBox.h + 20)
  
  //If user is dragging a disk grabbed from a place value container in the starting pile,
  //draw a highlight the next place value container in the starting pile
  if(renamingIsAllowed && renamingIsNecessary() && valueBeingDraggedByUser !== null &&
     placeValueContainerAtCursorPressStart.pileType == "startingPile"){
    const nextPlaceValueIndex = Number(placeValueContainerAtCursorPressStart.placeValueIndex) + 1
    if(nextPlaceValueIndex < startingPileDiskQuantityArray.length){
      const pvc = startBox.placeValueContainers[nextPlaceValueIndex]
      const value = "1" + "0".repeat(startingPileDiskQuantityArray.length - 1 - nextPlaceValueIndex)
      
      let colorOfValue = diskColors[diskColorMap["other"]][1]
      if(Object.keys(diskColorMap).includes(value)){
        colorOfValue = diskColors[diskColorMap[value]][1]
      }
      stroke( colorOfValue ); noFill(); strokeWeight(3)
      rect(pvc.x, pvc.y, pvc.w, pvc.h)
      noStroke(); fill( colorOfValue );
      text("Rename as ten " + value + "s", pvc.x + (pvc.w / 2), pvc.y - 15)
    }
    
  }
}

function windowResized(){
  resizeCanvas(getCanvasWidth(), getCanvasHeight())
  divisorPiles = getDivisorPiles();
  startingPileDiskQuantityArray = dividend.toString().split("").map(digit => Number(digit))
}

function confirmTextInput(){
  let newDivisor = document.getElementById("divisorInput").value
  let newDividend = document.getElementById("dividendInput").value
  if(valueIsValid(newDivisor) && valueIsValid(newDividend)){
    divisor = Number(newDivisor)
    dividend = Number(newDividend)
    startingPileDiskQuantityArray = dividend.toString().split("").map(digit => Number(digit))
    divisorPiles = getDivisorPiles()
  } else {
    alert("Make sure the numbers you enter are whole numbers.")
  }
}

function valueIsValid(string){
  if( !stringIsInteger(string) )return false
  const value = Number(string)
  if(value > 0)return true
  return false
}

function stringIsInteger(string){
  if(isNaN(string))return false
  return Number.isInteger( Number(string) )
}

function keyPressed(){
  if(keyCode === ENTER){
    confirmTextInput()
  }
}

let valueBeingDraggedByUser = null
let placeValueContainerAtCursorPressStart = null
let placeValueContainerAtCursorPressEnd = null
let renamingIsAllowed = true

function cursorPressStart( buttonPressed ){
  if(buttonPressed == "left"){
    placeValueContainerAtCursorPressStart = getPlaceValueContainerCollidingWithCursor()
    let pvcacps = placeValueContainerAtCursorPressStart
    if(pvcacps == null)return
    
    if(pvcacps.pileType == "startingPile"){
      if(startingPileDiskQuantityArray[pvcacps.placeValueIndex] > 0){
        startingPileDiskQuantityArray[pvcacps.placeValueIndex] -= 1
        valueBeingDraggedByUser = "1" + "0".repeat(startingPileDiskQuantityArray.length - 1 - pvcacps.placeValueIndex)
      }
    }
    if(pvcacps.pileType == "divisor"){
      if(divisorPileDiskQuantityArrays[pvcacps.pileIndex][pvcacps.placeValueIndex] > 0){
        divisorPileDiskQuantityArrays[pvcacps.pileIndex][pvcacps.placeValueIndex] -= 1
        valueBeingDraggedByUser = "1" + "0".repeat(divisorPiles[ pvcacps.pileIndex ].placeValueContainers.length - 1 - pvcacps.placeValueIndex)
      }
    }
  }
}

function getPlaceValueContainerCollidingWithCursor(){
  const startingBox = startingPileBox()
  for(let i in startingBox.placeValueContainers){
    const pvc = startingBox.placeValueContainers[i]
    if( collidePointRect(icursor.x, icursor.y, pvc.x, pvc.y, pvc.w, pvc.h) ){
      return {
        pileType: "startingPile",
        placeValueIndex: i
      }
    }
  }
  for(let i in divisorPiles){
    for(let j in divisorPiles[i].placeValueContainers){
      const pvc = divisorPiles[i].placeValueContainers[j]
      if( collidePointRect(icursor.x, icursor.y, pvc.x, pvc.y, pvc.w, pvc.h) ){
        return {
          pileType: "divisor",
          pileIndex: i,
          placeValueIndex: j
        }
      }
    }
  }
  return null
}

function cursorPressEnd( buttonPressed ){
  if(buttonPressed == "left"){
    if( valueBeingDraggedByUser == null )return
    placeValueContainerAtCursorPressEnd = getPlaceValueContainerCollidingWithCursor()
    resolveDragAndDrop()
    placeValueContainerAtCursorPressStart = null
    valueBeingDraggedByUser = null
  }
}

function resolveDragAndDrop(){
  const atStart = placeValueContainerAtCursorPressStart
  const atEnd = placeValueContainerAtCursorPressEnd
  let moveIsValid = true
  if(atStart == null || atEnd == null)moveIsValid = false;
  else if(atStart.pileType == "startingPile"){
    if(atEnd.pileType == "divisor"){
      //The user has dragged a disk from the starting pile to a divisor pile
      moveIsValid = true
      divisorPileDiskQuantityArrays[atEnd.pileIndex][atStart.placeValueIndex] += 1
    }
    if(atEnd.pileType == "startingPile"){
      if(renamingIsAllowed && renamingIsNecessary() && Number(atEnd.placeValueIndex) == Number(atStart.placeValueIndex) + 1){
        //The user has successfully renamed
        startingPileDiskQuantityArray[atEnd.placeValueIndex] += 10
        moveIsValid = true
        moveAlert.trigger(icursor.x, icursor.y, "Renamed!")
      } else {
        startingPileDiskQuantityArray[atStart.placeValueIndex] += 1
      }
    }
  }
  else if(atStart.pileType == "divisor"){
    if(atEnd.pileType == "divisor"){
      //The user has dragged a disk from one divisor pile to another.
      //This is always allowed no matter what
      divisorPileDiskQuantityArrays[atEnd.pileIndex][atStart.placeValueIndex] += 1
      moveIsValid = true
    }
    if(atEnd.pileType == "startingPile"){
      //The user has dragged a disk from a divisor pile to the starting pile
      //This is always allowed no matter what
      startingPileDiskQuantityArray[atStart.placeValueIndex] += 1
      moveIsValid = true
    }
  }
  if(!moveIsValid){
    //The user has made an invalid move.
    //Return the dragged disk to its original location
    if(atStart.pileType == "startingPile"){
      startingPileDiskQuantityArray[atStart.placeValueIndex] += 1
    }
    if(atStart.pileType == "divisor"){
      divisorPileDiskQuantityArrays[atStart.pileIndex][atStart.placeValueIndex] += 1
    }
    moveAlert.trigger(icursor.x, icursor.y, "Can't\nmove\nhere")
  }
}

let moveAlert = {
  x: null,
  y: null,
  alpha: 0,
  message: "Can't\nmove\nhere",
  draw: function(){
    if(this.alpha > 0){
      this.alpha -= 5
      fill(0, 0, 255, this.alpha)
      noStroke()
      text(this.message, this.x, this.y)
    }
  },
  trigger(x, y, message){
    this.x = x
    this.y = y
    this.alpha = 400
    if(message)this.message = message
  }
}

function onEnableRenamingCheckboxChange(checkboxElement){
  renamingIsAllowed = checkboxElement.checked
}

function renamingIsNecessary(){
  
  if(placeValueContainerAtCursorPressStart == null)return false
  if(placeValueContainerAtCursorPressStart.pileType != "startingPile")return false
  //pileType is startingPile
  const quantityOfDisksInPlaceValueContainer = (startingPileDiskQuantityArray[placeValueContainerAtCursorPressStart.placeValueIndex] + 1) //Add one to include the one being dragged
  const allOtherDisksOfThisQuantityAreEvenlyDistributed = () => {
    const quantityToMatch = divisorPileDiskQuantityArrays[0][placeValueContainerAtCursorPressStart.placeValueIndex]
    
    for(let i in divisorPileDiskQuantityArrays){
      if(divisorPileDiskQuantityArrays[i][placeValueContainerAtCursorPressStart.placeValueIndex] !== quantityToMatch){
        return false
      }
    }
    return true
  }
  // console.log( allOtherDisksOfThisQuantityAreEvenlyDistributed() )
  return allOtherDisksOfThisQuantityAreEvenlyDistributed() && (quantityOfDisksInPlaceValueContainer < divisor)
}