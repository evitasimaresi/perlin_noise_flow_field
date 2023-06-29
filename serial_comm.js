// serial communication between a microcontroller with a switch on pin 2
// arduino code can be found here : https://gist.github.com/shfitz/7fd206b7db4e0e6416a443d61c8c988e

let serial; // variable for the serial object
let latestData = "waiting for data"; // variable to hold the data

function setup() {
  createCanvas(800, 800);
  background(255, 255, 255);
  // serial constructor
  serial = new p5.SerialPort();
  // get a list of all connected serial devices
  serial.list();
  // serial port to use - you'll need to change this
  serial.open("COM3");
  // callback for when the sketchs connects to the server
  serial.on("connected", serverConnected);
  // callback to print the list of serial devices
  serial.on("list", gotList);
  // what to do when we get serial data
  serial.on("data", gotData);
  // what to do when there's an error
  serial.on("error", gotError);
  // when to do when the serial port opens
  serial.on("open", gotOpen);
  // what to do when the port closes
  serial.on("close", gotClose);
  initiateIntervals(); //initiate the intervalls for date and saving
}

function serverConnected() {
  console.log("Connected to Server");
}

// list the ports
function gotList(thelist) {
  console.log("List of Serial Ports:");

  for (let i = 0; i < thelist.length; i++) {
    console.log(i + " " + thelist[i]);
  }
}

function gotOpen() {
  console.log("Serial Port is Open");
}

function gotClose() {
  console.log("Serial Port is Closed");
  latestData = "Serial Port is Closed";
}

function gotError(theerror) {
  console.log(theerror);
}

// when data is received in the serial buffer

function gotData() {
  let currentString = serial.readLine(); // store the data in a variable
  trim(currentString); // get rid of whitespace
  if (!currentString) return; // if there's nothing in there, ignore it
  console.log(currentString); // print it out
  latestData = currentString; // save it to the global variable
  splitData();
}