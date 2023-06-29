//Storing minutes and seconds in data array and save them in a Json file, the name of the file is the date and time
//And after saving the array is cleared
let DateToday = "current date";
let data = [];
// let dataTrack

let splitString;

function initiateIntervals() {
  setInterval(timer, 60000); //to save the file every x milliseconds, 60000=60seconds
  // setInterval(splitData(), 2000); // to update the array with current time every second, 1000=1second
}

//its beeing used for the JSON name, so it can be a unique every 1 second
function currentdate() {
  let currentdate = year()+ "" + month() + "" + day() + "_" + hour() + "" + minute() + "" + second();//here the name is formed
  return currentdate;
}

//seperate data according to number of servo and store them in array
function splitData() {
  splitString = split(latestData, ":");
  let dataTrack ={ //create this object with the following 3 propertiew
      group: splitString[0],
      lightValue: splitString[1],
      rotationValue: splitString[2],
      time: hour()+":" +minute()+":" +second() 
  };
  console.log (splitString[1]);
  // drawbackground(dataTrack);
  // GlobaldataTrack = dataTrack; //Store the dataTrack object in a global variable
  data.push(dataTrack);
  return dataTrack;
}

//when its called the procedure of saving is trigered
function timer() {
  console.log("saving...");
  DateToday = currentdate();
  console.log(DateToday);
  saveDatatoFile();
  cleararray();
}

//when its called the data array is been saved in the JSON file
function saveDatatoFile() {
  saveJSON(data, DateToday);
  console.log('Data saved to file.');
}

//clear the array when the export finish
function cleararray(){
  data.length = 0; 
  if (data.length==0){
    console.log("Array cleared");
  }else{
    console.error("Array failled to clear");
  }
}







////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////