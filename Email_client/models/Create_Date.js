
var gotMonthNames = [
    "Jan", "Feb", "Mar",
    "April", "May", "June", "July",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
];

var date = new Date();
var gotDate = date.getDate();
var gotUpdatingDate = gotDate <= 9 ? 0 + '' + gotDate : gotDate;
var gotMonthIndex = date.getMonth();
var gotYear = date.getFullYear();

var create_Date = gotMonthNames[gotMonthIndex] + ' ' + gotUpdatingDate + ' ' + gotYear 
module.exports = { create_Date: create_Date };