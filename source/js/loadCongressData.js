const dataToRetreive = data["results"][0]["members"];

// apply congress data filters
const congressData = dataToRetreive.map(
    ({
        first_name,
        middle_name,
        last_name,
        party,
        state,
        seniority,
        votes_with_party_pct
    }) => ({
        first_name,
        middle_name,
        last_name,
        party,
        state,
        seniority,
        votes_with_party_pct
    })
);

// generate table headings
let thead = document.getElementById("tableHead");
const tableHeadingArray = [
    "Name",
    "Party",
    "State",
    "Years in Office",
    "% Votes w/ Party"
];
let tableHead = document.createElement("tr");
for (let i = 0; i < tableHeadingArray.length; i++) {
    let newTh = document.createElement("th");
    newTh.appendChild(document.createTextNode(tableHeadingArray[i]));
    tableHead.appendChild(newTh);
}
thead.appendChild(tableHead);

/* repeatable code when filtered: */
const populateTable = data => {
    // in case no filter is chosen, show all data
    if (data.length === 0) {
        data = congressData;
    }
    // sort data using the first name
    data = data.sort((a, b) => {
        return b.seniority - a.seniority;
    });
    // the length of all ensuing arrays
    const masterArrayLength = data.length;

    // the function that generates arrays for each properties of interest
    const generateValueArray = (value, unitOfMeasure = "") => {
        const array = [];
        for (let n = 0; n < masterArrayLength; n++) {
            array.push(data[n][value] + unitOfMeasure);
        }
        return array;
    };

    // make a full name array
    const firstNameArray = generateValueArray("first_name");
    const middleNameArray = generateValueArray("middle_name");
    const lastNameArray = generateValueArray("last_name");
    const fullNameArray = [];
    for (let n = 0; n < masterArrayLength; n++) {
        if (middleNameArray[n] === "null") {
            fullNameArray.push(firstNameArray[n] + " " + lastNameArray[n]);
        } else {
            fullNameArray.push(
                firstNameArray[n] +
                    " " +
                    middleNameArray[n] +
                    " " +
                    lastNameArray[n]
            );
        }
    }

    // all other properties of interest
    const partyArray = generateValueArray("party");
    const stateArray = generateValueArray("state");
    const seniorityArray = generateValueArray("seniority");
    const votesWithPartyPercentageArray = generateValueArray(
        "votes_with_party_pct",
        "%"
    );

    // table contents
    let tbody = document.getElementById("tableBody");

    // clear table contents
    tbody.innerHTML = "";

    // generate table contents
    for (let i = 0; i < masterArrayLength; i++) {
        let tableContents = document.createElement("tr");
        const addContentFromArray = array => {
            let newTh = document.createElement("td");
            newTh.appendChild(document.createTextNode(array[i]));
            tableContents.appendChild(newTh);
        };
        addContentFromArray(fullNameArray);
        addContentFromArray(partyArray);
        addContentFromArray(stateArray);
        addContentFromArray(seniorityArray);
        addContentFromArray(votesWithPartyPercentageArray);
        tbody.appendChild(tableContents);
    }

    // add total rows info
    let totalInfo = document.querySelector(".total-info");
    totalInfo.innerHTML = "";
    let totalInfoText = document.createTextNode(
        "Total rows: " + masterArrayLength
    );
    totalInfo.appendChild(totalInfoText);
};
populateTable(congressData); // first load without filters

// Get party checkbox values
let checkboxValues = [];
const evaluateCheckbox = () => {
    checkboxValues = Array.from(
        document.querySelectorAll("input[name=filterByParty]:checked")
    ).map(item => item.value);
};
const checkboxSelection = document.getElementsByClassName("form-check-input");
Array.from(checkboxSelection).forEach(function(element) {
    element.addEventListener("click", () => {
        evaluateCheckbox();
        // regenerate tbody with checkbox filters
        populateTable(filterByParty(checkboxValues));
    });
});

// function to filter congressData
const filterByParty = () => {
    const doFilterAction = item => {
        if (checkboxValues.includes(item.party)) {
            return true;
        }
        return false;
    };
    let congressDataPartyFiltered = congressData.filter(doFilterAction);
    return congressDataPartyFiltered;
};

// Get state dropdown values (jQuery)
let dropdownValue = "All";
$(".dropdown-menu").on("click", "button", function() {
    $(".btn:first-child").text($(this).text());
    dropdownValue = $(this).val();
    console.log(dropdownValue);
});
