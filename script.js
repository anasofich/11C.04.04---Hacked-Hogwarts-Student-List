"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

const Student = {
  firstName: "",
  middleName: "",
  nickName: "",
  lastName: "",
  image: "",
  house: "",
  prefect: false,
  expelled: false,
  bloodStatus: "",
  InqSquad: false,
};

const settings = {
  filterBy: "all",
  sortBy: "firstName",
  sortDir: "asc",
};

let searchTerm = "";

function start() {
  console.log("ready");

  registerButtons();
  loadJSON();
  loadJSONFamilies();
}

function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
  document.querySelector("#searchBar").addEventListener("keyup", selectSearch);
  document.querySelector(".sortingHat").addEventListener("click", clickOnHat);
}

//Used before adding families.json, then had to change it to an async function for list to show up
/* function loadJSON() {
  fetch("students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareStudents(jsonData);
    });
} */

async function loadJSON() {
  const response = await fetch("students.json");
  const jsonData = await response.json();

  //when loaded, prepare objects
  prepareStudents(jsonData);
}

function loadJSONFamilies() {
  //console.log("loadJSONFamilies()");
  fetch("https://petlatkea.dk/2021/hogwarts/families.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareFamilies(jsonData);
    });
}

//Getting json data and "cleaning names"

function prepareStudents(jsonData) {
  jsonData.forEach((jsonObject) => {
    // console.log("prepareStudents: ");
    // console.log(jsonObject);
    const student = Object.create(Student);
    student.firstName = getFirstName(jsonObject.fullname.trim());
    student.middleName = getMiddleName(jsonObject.fullname.trim());
    student.nickName = getNickName(jsonObject.fullname.trim());
    student.lastName = getLastName(jsonObject.fullname.trim());
    student.image = getImage(student.lastName, student.firstName);
    student.house = getHouseName(jsonObject.house.trim());
    student.gender = jsonObject.gender;
    student.expelled = false;

    allStudents.push(student);
  });
  //console.table(allStudents);

  //once names have been cleaned; call a function to display them on the list
  displayList(allStudents);
}

function getFirstName(fullname) {
  //console.log(getFirstName);
  if (fullname.includes(" ") == true) {
    const firstName = fullname.slice(0, fullname.indexOf(" "));
    const cleanFirstName = cleanName(firstName);
    return cleanFirstName;
  } else {
    const cleanFirstName = cleanName(fullname);
    return cleanFirstName;
  }
}

function getLastName(fullname) {
  //console.log(getLastName);
  if (fullname.includes(" ") == true) {
    const lastName = fullname.slice(fullname.lastIndexOf(" ") + 1);
    const cleanLastName = cleanName(lastName);
    return cleanLastName;
  }
  return "";
}

function getMiddleName(fullname) {
  //console.log(getMiddleName);
  if (fullname.includes(" ") == true) {
    const middleSpace = fullname.slice(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "));
    const firstCharacter = middleSpace.slice(0, 1);
    if (firstCharacter !== '"') {
      const cleanMiddleName = cleanName(middleSpace);
      return cleanMiddleName;
    }
  }
  return "";
}

function getNickName(fullname) {
  //console.log(getNickName);
  const middleSpace = fullname.slice(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "));
  const firstCharacter = middleSpace.slice(0, 1);
  if (firstCharacter === '"') {
    const length = middleSpace.length;
    const nickNameWithoutQuotes = middleSpace.slice(1, length - 1);
    const cleanNickName = cleanName(nickNameWithoutQuotes);
    return cleanNickName;
  }
  return "";
}

function getHouseName(house) {
  //console.log(getHouseName);
  const cleanHouse = cleanName(house);
  return cleanHouse;
}

function getImage(lastname, firstname) {
  //console.log(getImage);
  if (lastname !== undefined) {
    const smallLastName = lastname.toLowerCase();
    const smallFirstName = firstname.toLowerCase();
    const firstLetterOfFirstName = firstname.slice(0, 1).toLowerCase();
    if (lastname == "Patil") {
      const imageSrc = `${smallLastName}_${smallFirstName}.png`;
      return imageSrc;
    } else if (lastname.includes("-") == true) {
      const partOfLastNameAfterHyphen = lastname.slice(lastname.indexOf("-") + 1);
      const imageSrc = `${partOfLastNameAfterHyphen}_${firstLetterOfFirstName}.png`;
      return imageSrc;
    } else {
      const imageSrc = `${smallLastName}_${firstLetterOfFirstName}.png`;
      return imageSrc;
    }
  }
}

function cleanName(name) {
  const firstLetter = name.slice(0, 1).toUpperCase();
  const restOfName = name.slice(1).toLowerCase();
  const cleanName = firstLetter + restOfName;
  return cleanName;
}

//Filtering and sorting functions

//FILTER
function selectFilter(event) {
  const filter = event.target.dataset.filter;
  //console.log(`User selected ${filter}`);

  //filterList(filter);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  //let filteredList = allStudents;

  if (settings.filterBy === "gryffindor") {
    filteredList = allStudents.filter(showGryffindor);
  } else if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(showSlytherin);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(showHufflepuff);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(showRavenclaw);
  } else if (settings.filterBy === "nonExpelled") {
    filteredList = allStudents.filter(showNonExpelled);
  } else if (settings.filterBy === "expelled") {
    filteredList = allStudents.filter(showExpelled);
  } else if (settings.filterBy === "pure") {
    filteredList = allStudents.filter(showPure);
  } else if (settings.filterBy === "half") {
    filteredList = allStudents.filter(showHalf);
  } else if (settings.filterBy === "muggle") {
    filteredList = allStudents.filter(showMuggle);
  }

  return filteredList;
}

function showGryffindor(student) {
  return student.house === "Gryffindor";
}

function showSlytherin(student) {
  return student.house === "Slytherin";
}

function showHufflepuff(student) {
  return student.house === "Hufflepuff";
}

function showRavenclaw(student) {
  return student.house === "Ravenclaw";
}

function showNonExpelled(student) {
  return student.expelled === false;
}

function showExpelled(student) {
  return student.expelled === true;
}

function showPure(student) {
  return student.bloodStatus === "Pure-blood";
}

function showHalf(student) {
  return student.bloodStatus === "Half-blood";
}

function showMuggle(student) {
  return student.bloodStatus === "Muggle-born";
}

//SORTING
function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //find "old" sortby element, and remove .sortBy
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortBy");

  //indicate active sort
  event.target.classList.add("sortBy");

  //toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  //console.log(`User selected ${sortBy} - ${sortDir}`);

  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  //console.log(`sortBy is ${sortBy}`);
  //let sortedList = allStudents;
  let direction = 1;

  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    //console.log(`sortBy is ${sortBy}`);
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}

//Search function
function selectSearch(e) {
  searchTerm = e.target.value;
  setSearch();
}

function setSearch(term) {
  buildList();
}

function searchList(list) {
  let searchedList = [];

  list.forEach((student) => {
    const findFirstName = student.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1;
    const findMiddleName = student.middleName.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1;
    const findLastName = student.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1;

    if (findFirstName || findMiddleName || findLastName) {
      searchedList.push(student);
    }
  });

  return searchedList;
}

//Building new list after adding features
function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  const searchedList = searchList(sortedList);

  displayList(searchedList);
}

//Displaying the student list

function displayList(students) {
  //console.log(students);
  //console.log("displayList()");
  //clear the list
  document.querySelector(".studentList tbody").innerHTML = "";

  //build new list
  students.forEach(displayStudent);

  const numOfExpelled = allStudents.filter((student) => student.expelled).length;

  //finding number of students not expelled
  document.querySelector(".numberStudents span").textContent = allStudents.length - numOfExpelled;

  //finding the number of students displayed
  document.querySelector(".studentsDisplayed span").textContent = students.length;

  //finding the number of students in each house
  document.querySelector(".gryffindorDisplay span").textContent = students.filter((number) => number.house === "Gryffindor").length;
  document.querySelector(".slytherinDisplay span").textContent = students.filter((number) => number.house === "Slytherin").length;
  document.querySelector(".hufflepuffDisplay span").textContent = students.filter((number) => number.house === "Hufflepuff").length;
  document.querySelector(".ravenclawDisplay span").textContent = students.filter((number) => number.house === "Ravenclaw").length;
}

function displayStudent(student) {
  //create copy from template
  const copy = document.querySelector(".studentTemplate").content.cloneNode(true);

  //add new data to copy
  copy.querySelector("[data-field=picture] img").src = `images/${student.image}`;
  copy.querySelector("[data-field=picture]").alt = student.firstName + " " + student.lastName;
  copy.querySelector("[data-field=firstName]").textContent = student.firstName;
  copy.querySelector("[data-field=lastName]").textContent = student.lastName;
  copy.querySelector("[data-field=gender]").textContent = student.gender;
  copy.querySelector("[data-field=house] img").src = `logos/${student.house}.png`;
  copy.querySelector("[data-field=bloodStatus]").textContent = student.bloodStatus;
  copy.querySelector("tr").setAttribute("onclick", `showPopup("${student.firstName}")`);

  //Expell settings
  if (student.expelled === true) {
    copy.querySelector("tr").classList.add("expelled");
    student.prefect = false;
    student.InqSquad = false;
  } else {
    copy.querySelector("tr").classList.remove("expelled");
  }

  //append copy to list
  document.querySelector(".studentList tbody").appendChild(copy);
}

// Popup open/close
function showPopup(firstname) {
  //console.log("showPopup()");
  allStudents.forEach((student) => {
    if (student.firstName == firstname) {
      displayPopup(student);
    }
  });
}

function displayPopup(student) {
  //console.log("displayPopup");
  document.querySelector(".popupPhoto img").src = `images/${student.image}`;
  document.querySelector(".popupPhoto img").alt = student.firstName + " " + student.lastName;
  document.querySelector(".popUpFirstname").textContent = student.firstName + " ";
  document.querySelector(".popupMiddlename").textContent = student.middleName;
  document.querySelector(".popupLastname").textContent = student.lastName;
  document.querySelector(".popupGender img").src = `logos/${student.gender}.png`;
  document.querySelector(".popupBloodStatus").textContent = student.bloodStatus;
  document.querySelector(".popupHouse img").src = `logos/${student.house}.png`;

  //pop up background color
  if (student.house === "Gryffindor") {
    document.querySelector("#studentPopup").style.backgroundColor = "#740001";
  } else if (student.house === "Slytherin") {
    document.querySelector("#studentPopup").style.backgroundColor = "#1A472A";
  } else if (student.house === "Hufflepuff") {
    document.querySelector("#studentPopup").style.backgroundColor = "#E2B125";
  } else if (student.house === "Ravenclaw") {
    document.querySelector("#studentPopup").style.backgroundColor = "#0E1A40";
  }

  //prefect settings
  document.querySelector("#studentPopup .prefectBtn").onclick = function () {
    checkPrefectStatus(student);
  };

  if (student.prefect === true) {
    document.querySelector(".popupPrefect .popupPrefectStatus").textContent = "Yes";
    document.querySelector(".prefectBtn").textContent = "Remove prefect position";
  } else {
    document.querySelector(".popupPrefect .popupPrefectStatus").textContent = "No";
    document.querySelector(".prefectBtn").textContent = "Add prefect position";
  }

  //Expell settings
  document.querySelector("#studentPopup .expelBtn").onclick = function () {
    expelStudent(student);
  };

  if (student.expelled === true) {
    document.querySelector("#studentPopup .expelBtn").textContent = "Unexpel";
    student.prefect = false;
    student.InqSquad = false;
    document.querySelector(".prefectBtn").style.visibility = "hidden";
    document.querySelector(".memberBtn").style.visibility = "hidden";
    document.querySelector(".popupExpel").style.display = "flex";
    document.querySelector(".popupPrefect").style.display = "none";
    document.querySelector(".popupMember").style.display = "none";
  } else {
    document.querySelector("#studentPopup .expelBtn").textContent = "Expel";
    document.querySelector(".prefectBtn").style.visibility = "visible";
    document.querySelector(".memberBtn").style.visibility = "visible";
    document.querySelector(".popupExpel").style.display = "none";
    document.querySelector(".popupPrefect").style.display = "flex";
    document.querySelector(".popupMember").style.display = "flex";
  }

  //Inquisitorial Squad settings
  if (
    student.house === "Slytherin" ||
    student.bloodStatus === "Pure-blood" ||
    (student.house === "Slytherin" && student.bloodStatus === "Pure-blood") ||
    (student.house === "Slytherin" && student.bloodStatus === "Half-blood") ||
    (student.house === "Slytherin" && student.bloodStatus === "Muggle-born")
  ) {
    document.querySelector(".popupMember").classList.remove("hide");
    document.querySelector(".memberBtn").classList.remove("hide");
  } else {
    document.querySelector(".popupMember").classList.add("hide");
    document.querySelector(".memberBtn").classList.add("hide");
  }

  document.querySelector(".memberBtn").onclick = function () {
    addInqSquadMembership(student);
  };

  if (student.InqSquad === true) {
    document.querySelector(".popupMemberStatus").textContent = "Yes";
    document.querySelector(".memberBtn").textContent = "Remove membership";
  } else {
    document.querySelector(".popupMemberStatus").textContent = "No";
    document.querySelector(".memberBtn").textContent = "Add membership";
  }

  const popUp = document.querySelector("#studentPopup");
  popUp.style.visibility = "visible";
}

function closePopup() {
  const popUp = document.querySelector("#studentPopup");
  document.querySelector(".prefectBtn").style.visibility = "hidden";
  document.querySelector(".memberBtn").style.visibility = "hidden";
  popUp.style.visibility = "hidden";
}

//Prefect functions
function checkPrefectStatus(selectedStudent) {
  //console.log("checkPrefectStatus()");
  let prefCheck = true;
  //console.log(selectedStudent);

  if (selectedStudent.prefect === true) {
    selectedStudent.prefect === false;
    document.querySelector(".popupPrefect .popupPrefectStatus").textContent = "No";
    document.querySelector(".prefectBtn").textContent = "Add prefect position";
  } else {
    allStudents.forEach((student) => {
      if (student.house === selectedStudent.house && student.gender === selectedStudent.gender && student.prefect === true) {
        prefCheck = false;
        //console.log("There can only be one prefect of each gender in each house!");
        removeOther(student);
      }
    });

    if (prefCheck === true) {
      allStudents.forEach((student) => {
        if (student === selectedStudent) {
          student.prefect = true;
          document.querySelector(".popupPrefect .popupPrefectStatus").textContent = "Yes";
          document.querySelector(".prefectBtn").textContent = "Remove prefect position";
        }
      });
    }
  }

  function removeOther(student) {
    //console.log("removeOther()");

    //ask the user to ignore or remove the other
    const prefectDialog = document.querySelector("#prefectDialog");
    prefectDialog.style.visibility = "visible";
    document.querySelector("#prefectDialog .otherStudent").textContent = `${student.firstName} ${student.lastName}`;
    document.querySelector("#prefectDialog .close").addEventListener("click", closeDialog);
    document.querySelector("[data-action=removeOther]").addEventListener("click", clickRemoveOther);

    //if ignore - do nothing...
    function closeDialog() {
      document.querySelector("#prefectDialog").style.visibility = "hidden";
      document.querySelector("[data-action=removeOther]").removeEventListener("click", clickRemoveOther);
    }

    //if remove other:
    function clickRemoveOther() {
      //console.log("clickRemovePrefect()");
      removePrefect(student);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }

  function removePrefect(student) {
    //console.log("removePrefect()");
    student.prefect = false;
  }

  function makePrefect(selectedStudent) {
    //console.log("makePrefect()");
    selectedStudent.prefect = true;
    document.querySelector(".popupPrefect .popupPrefectStatus").textContent = "Yes";
    document.querySelector(".prefectBtn").textContent = "Remove prefect position";
    //console.log(selectedStudent.prefect);
  }

  buildList();
}

//Expelled function
function expelStudent(selectedStudent) {
  //console.log("expelStudent()");
  if (selectedStudent.hacker === true) {
    //alert("I can't be expelled, MUA HA HA HA!!");
    document.querySelector("#cantExpelDialog").style.visibility = "visible";
    document.querySelector("#cantExpelDialog .close").addEventListener("click", closeDialog);

    function closeDialog() {
      document.querySelector("#cantExpelDialog").style.visibility = "hidden";
      document.querySelector("#cantExpelDialog .close").removeEventListener("click", closeDialog);
    }
  } else {
    selectedStudent.expelled = !selectedStudent.expelled;
    //console.log("changing expelled status");
  }
  document.querySelector("#studentPopup .expelBtn").removeEventListener("click", expelStudent);

  buildList();
  closePopup();
}

//Blood status functions
async function loadJSONFamilies() {
  //console.log("loadJSONFamilies()");
  const response = await fetch("https://petlatkea.dk/2021/hogwarts/families.json");
  const jsonData = await response.json();
  // when loaded, prepare data objects
  prepareFamilies(jsonData);
}

function prepareFamilies(jsonData) {
  let halfBloodArray = jsonData.half;
  let pureBloodArray = jsonData.pure;

  //Set blood status
  allStudents.forEach((student) => {
    if (halfBloodArray.includes(student.lastName)) {
      student.bloodStatus = "Half-blood";
    } else if (pureBloodArray.includes(student.lastName)) {
      student.bloodStatus = "Pure-blood";
    } else {
      student.bloodStatus = "Muggle-born";
    }
  });

  displayList(allStudents);
}

//Inquisitorial Squad functions
function addInqSquadMembership(selectedStudent) {
  //console.log("addInqSquadMembership()");
  selectedStudent.InqSquad = !selectedStudent.InqSquad;

  if (selectedStudent.InqSquad === true) {
    document.querySelector(".popupMemberStatus").textContent = "Yes";
    document.querySelector(".memberBtn").textContent = "Remove membership";
  } else {
    document.querySelector(".popupMemberStatus").textContent = "No";
    document.querySelector(".memberBtn").textContent = "Add membership";
  }

  document.querySelector(".memberBtn").removeEventListener("click", addInqSquadMembership);

  buildList();
}

//hackTheSystem() function - activated by clicking on sorting hat on the top right corner
function clickOnHat() {
  //console.log("clickOnHat()");
  document.querySelector("body").classList.add("shake");
  document.querySelector(".sortingHat").removeEventListener("click", clickOnHat);
  document.querySelector("body").addEventListener("animationend", hackTheSystem);
}

function hackTheSystem() {
  console.log("system hacked");
  document.querySelector("body").classList.remove("shake");
  document.querySelector("body").classList.add("hacked");

  const newStudent = {
    firstName: "Ana",
    middleName: "Sofia",
    nickName: "",
    gender: "girl",
    lastName: "Castellanos",
    image: "castellanos_a.jpg",
    house: "Gryffindor",
    prefect: false,
    expelled: false,
    bloodStatus: "Muggle-born",
    InqSquad: false,
    hacker: true,
  };

  messUpBloodStatus();

  allStudents.unshift(newStudent);

  buildList();
}

function messUpBloodStatus() {
  allStudents.forEach((student) => {
    if (student.bloodStatus === "Muggle-born") {
      student.bloodStatus = "Pure-blood";
    } else if (student.bloodStatus === "Half-blood") {
      student.bloodStatus = "Pure-blood";
    } else {
      let bloodStatusNum = Math.floor(Math.random() * 3);
      if (bloodStatusNum === 0) {
        student.bloodStatus = "Pure-blood";
      } else if (bloodStatusNum === 1) {
        student.bloodStatus = "Half-blood";
      } else {
        student.bloodStatus = "Muggle-born";
      }
    }
  });
}
