/*
*   Governs behavior of the popup window
*/

/*
*	Determines popup state on load
*
*/
function loadPopup() {
    
    // Reset save button id and text
    var saveBtn = document.getElementsByClassName("btn savebtn")[0];
    saveBtn.setAttribute("id", "save");
    saveBtn.textContent = "Save";
    
    // Turn on listener for save button
    $("#save").on("click");
    
    // Reset input form
    var input = document.getElementById("gearinput");
    input.setAttribute("placeholder", "New Gear");
    input.setAttribute("class", "form-control");
    
    // Place cursor on input form
    $("#gearinput").focus();
    
    // Reset interior
    document.getElementById('mylist').innerHTML = "";
    
    // Get all gear data
    var gearData = getGears();
    
    // If gears exist
    if (gearData){
        
        // Call create list funciton
        listGears(gearData);
    } else {
        
        // Load empty page
        $("#mylist").append('<font color ="gray">' + 
	            "<br><br><center>You haven't saved any windows yet!<br><br>" + 
	            "Create a new gear below to save all the tabs from the current window.</center>");
    }    
}

/*
*    Gets all gear info from local Storage
*    Returns a JSON object
*
*/
function getGears() {
    
    // Get the full string of data from localstorage
    var gearString = localStorage.gearSwitcher;
    
    // If there's nothing there, return null
    if (!gearString) {
        return null;
    } else {
        
        // Parse gear string into JSON format
        var gears = JSON.parse(gearString);
        return gears;
    }
}

/*
*    Populate popup with gear buttons
*
*/
function listGears (gearData){
    
    // Get correct div from popup html
    var myList = document.querySelector("#mylist");
    
    // Set interior to nothing (reset it)
    myList.innerHTML = "";
    
    // Iterate over gear list
    for (var i = 0, len = gearData.gears.length; i < len; i++){
        
        // For each item in list, create html row
        var r = createRow(i, gearData);
        myList.appendChild(r);
    }
}


/*
*
*    Create a gear row element
*
*/
function createRow(i, gearData){
    
    // Create a div called row
    var row = document.createElement('div');
    
    // Set dropup (instead of dropdown) for last row
    if (gearData.gears.length === i + 1 && i > 2){
        row.setAttribute("class", "row btn-group dropup");
    } else if (gearData.gears.length === 5 && i === 3){
		row.setAttribute("class", "row btn-group dropup");
	} 
	else {
        row.setAttribute("class", "row btn-group");
    }
    row.setAttribute("id", "row" + i);

    // Put all the good stuff in the row
    fillRow(row, i, gearData);
    return row;
}

/*
*    Fill a gear row with all the good stuff.
*
*/
function fillRow(row, i, gearData){
    
    // Reset row 
    row.innerHTML = "";
    
    // Get the current gear from list of all gears
    tempGear = gearData.gears[i];
    
    // Get name of gear
    gearName = escapeHtml(tempGear.title);

    // Create a div called row
    var gearBtn = document.createElement('button');
    gearBtn.setAttribute("id", "gear" + i);
    gearBtn.setAttribute("type", "button");
        
    // Get actual len
    var len = gearData.gears.length;
    
    // Set default button size
    var gearSize = "gear-sm";
    
    // Resize for scrollbar
    if (len <= 5){
        gearSize = "gear-lg"
    }
    
    // Make colors alternate
    var gearColor = "color" + (i % 4);
    gearBtn.setAttribute("class", ("gear btn btn-lg " + gearSize + " " + gearColor));
    
    // Add contents to button;
    gearBtn.innerHTML = gearName; 
    
    // Add button to row
    row.appendChild(gearBtn);
    
    // Create a div called row
    var dropBtn = document.createElement('button');
    dropBtn.setAttribute("id", "geardrop" + i);
    dropBtn.setAttribute("type", "button");
    dropBtn.setAttribute("class", ("btn btn-lg geardrop " + gearColor));
    dropBtn.setAttribute("data-toggle", "dropdown");
    
    // Create contents of dropdown button
    var dropContents = '<span class="caret"></span>';
    
    // Add contents to button
    dropBtn.innerHTML = dropContents;
    
    // Add button to row
    row.appendChild(dropBtn);    
    
    // Make dropdown list
    var dropdown = document.createElement('ul');
    dropdown.setAttribute("class", "dropdown-menu dropdown-menu-right");
    dropdown.setAttribute("id", "dropdown" + i);
    var item = makeLink("rename", i, 'Rename');
    dropdown.appendChild(item);
    item = makeLink("delete", i, 'Delete');
    dropdown.appendChild(item);
    item = makeLink("overwrite", i, 'Overwrite')
    dropdown.appendChild(item);    
    
    // Add dropdown button to row
    row.appendChild(dropdown);
    return row;    
}

/*
*    Creates a dropdown link
*    Returns the link needing to be appended
*/
function makeLink(type, i, text){
    
	// Create list item and link tags
    var item = document.createElement('li');
    var link = document.createElement('a');
    
	// Set link attributes
    link.href = '#';
    link.innerHTML = text;
    link.id = (type + i);
    link.setAttribute("class", type);
	
	// Append link to the list item
    item.appendChild(link);
    return item;  
}

/*
*    When user rename's gear
*
*/
function hitRename(){
    
    // Get input box
    var input = document.getElementById("gearinput");
    
    // Get value from inside box
    var v = $("#gearinput").val();
    v = v.substring(0, 30)
    var newName = escapeHtml(v);
    
    // Pull i from input's class
    var inputClass = input.getAttribute("class");
    var index = inputClass.replace("form-control rename-color rn", "");
    var i = parseInt(index);
    
    // Do the actual renaming
    if (newName){
        changeName(newName, i);
    }
}

// Wait for document to load
$(document).ready(function (){
    
	/*
    *    When a Rename option is clicked
    */
    $(".rename").click(function (c){
        
        // Get id number from geardrop button
        var btnId = c.target.id;
        
        // Get index number from id
        var index = btnId.replace("rename", "");
            
        // Turn number (string) into an int
        var i = parseInt(index);
        
		// Set id of gear with correct index i
        var gearId = ("gear" + i);
        
        // Get correct button element
        var gearBtn = document.getElementById(gearId);
        
        // Turn off save button
        $("#save").off("click");
        
        // Change save button id and text
        var saveBtn = document.getElementsByClassName("btn savebtn")[0];
        saveBtn.setAttribute("id", "renameBtn");
        saveBtn.textContent = "Rename";
    
        // Change input
        var input = document.getElementById("gearinput");
        input.setAttribute("placeholder", "Rename gear");
        input.setAttribute("class", "form-control rename-color rn" + i);
        
        // Put cursor in box
        $("#gearinput").focus();

        // Get rid of dropdown
        document.getElementById("go").remove();
        
		// Put cancel button next to save button
        addCancelBtn();
        
        // Wait for user to click rename button
        $("#renameBtn").click(function (c){
            
            // Rename function
            hitRename();
        });
    });
    
    /*
    *    When a Delete option is clicked
    *
    */
    $(".delete").click(function (c){
    
        // Get id number from button
        var btnId = c.target.id;
    
        // Get index number from id
        var index = btnId.replace("delete", "");
            
        // Turn number (string) into an int
        var i = parseInt(index);
        
        // Get correct button element
        var gearId = ("gear" + i);
        var gearBtn = document.getElementById(gearId);
        
        // Ask to confirm delete
        gearBtn.innerHTML = "<a id='deleteId' href='#'>Click here to delete</a>";
        
        // Turn off normal button behavior
        $(".gear").off("click");

        // Wait for user to confirm delete
        $("#deleteId").click(function (c){
            deleteGear(i);
        });
    });    
    
    /*
    *    When a gear button is clicked
    *
    */
    $(".gear").click(function (c){
        
        // Get info about which button was clicked
        var btnId = c.target.id;
        
        // Get index number from id
        var index = btnId.replace("gear", "");
        
        // Turn number (string) into an int
        var i = parseInt(index);
        
        // Open gear of that index
        openGear(i);
    });

    /*
    *    When a Overwrite option is clicked
    *
    */    
    $(".overwrite").click(function (c) {
        
        // Get id number from geardrop button
        var btnId = c.target.id;
        
        // Get index number from id
        var index = btnId.replace("overwrite", "");    

        // Turn number (string) into an int
        var i = parseInt(index);
        
        // Get correct button element
        var gearId = ("gear" + i);
        var gearBtn = document.getElementById(gearId);
        
		// Set confirmation text in button
        gearBtn.innerHTML = "<a id='overId' href='#'>Click here to overwrite</a>";
        
		// Turn off normal button behavior
        $(".gear").off("click");
        
        // On click of overwrite link
        $("#overId").click(function (c){
            
			// Overwrite then refresh page
            overwriteGear(i);
            location.reload();
            
        });    
    });
    
	// When save button clicked
    $("#save").click(function (){
        
        hitSave();

    });
    
	// When "Delete All" is clicked
    $("#delAll").click(function (){
        
        // Get save button
        var saveBtn = document.getElementById("save");
        
        // Turn off save button
        $("#save").off("click");
        
        // Change button to show confirmation
        saveBtn.innerHTML = "Delete all gears?";
        
        // Add confirm and cancel buttons
        var yesBtn = document.createElement('button');
        yesBtn.setAttribute("id", "yesBtn");
        yesBtn.setAttribute("type", "button");
        yesBtn.setAttribute("class", "btn savebtn");
        yesBtn.textContent = "Yes";
        addCancelBtn();
        
        // Hide dropdown 
        document.getElementById("go").remove();
        
        // Find and append to row of save buttons
        var saveRow = document.getElementById("saveRow");
        saveRow.appendChild(yesBtn);
        saveRow.appendChild(canclBtn);
        
		// Listen for confirmation
        $(document).ready(function (){
			
            $("#yesBtn").click(function (){
				
                // Remove all gear info and refresh
                localStorage.removeItem("gearSwitcher");
                location.reload();
            });
        });
    });
});

/*
*    Adds a Cancel button to bottom bar
*
*/
function addCancelBtn(){
	
    // Add cancel button
    var canclBtn = document.createElement('button');
    canclBtn.setAttribute("id", "canclBtn");
    canclBtn.setAttribute("type", "button");
    canclBtn.setAttribute("class", "btn savebtn");
    canclBtn.textContent = "Cancel";
    document.getElementById("saveRow").appendChild(canclBtn);
    
    // When cancel is clicked, refresh
    $(document).ready(function (){        
        
		$("#canclBtn").click(function (){
            
			location.reload();
        });
    });
}


/*
*    Overwrite gear data with current window's tabs
*
*/
function overwriteGear(index){
    
    // Pull data from storage
    var gearData = getGears();
    
    // Prepare new array for tabs
    var tabArray = [];
    
    // Get current window
    chrome.windows.getCurrent({populate: true}, function (win){
        
        // Current window
        var tabs = win.tabs;
        
        // Get tabs from window
        for (var i = 0, len = tabs.length; i < len; i++){
            
            // Push current tab's url to tabArray
            tabArray.push(tabs[i].url);
        }
        
        // Swap out tab arrays
        gearData.gears[index].tabs = tabArray;
        
        // Create temporary storage from gathered window info
        var id = win.id;
        
        // Prepare and store gear data
        var gearStr = JSON.stringify(gearData);
        localStorage.gearSwitcher = gearStr;
    });    
}

/*
*    Update gear title in storage and refresh popup
*
*/
function changeName(newName, index){
    
    // Get gear data
    var gearData = getGears();
    
    // Change name
    gearData.gears[index].title = newName;
    
    // Resave and store
    var gearStr = JSON.stringify(gearData);
    localStorage.gearSwitcher = gearStr;
    
    // Refresh
    location.reload();
}


/*
*	Save gear when user hits "Enter" while in input box
*	
*	Adapted from code by sachleen and kapa
*	Source: http://stackoverflow.com/a/11365682/5697014
*
*/
var inputbox = document.getElementById('gearinput');
inputbox.onkeypress = function (e){
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
        
        // Get class of input box (save or rename)
        var c = inputbox.getAttribute("class");
        
        // If button says Rename
        if (c.length > 13){
            hitRename();
        } else {
            // If button says Save
            hitSave();
        }
        return false;
    }
}

/*
*    Gets name from user and calls saveGear
*/
function hitSave(){
    
    // Get the user's name for the new Gear
    var inputVal = $("input[type='text']").val();
    
    // Make sure input is escaped for security
    var v = escapeHtml(inputVal);
    
    // Truncate name
    var name = v.substring(0, 30);
    
    // Call to save window function
    // Pass in name of window
    if (!name){
        var notify = document.getElementById('gearinput')
        notify.placeholder = "Please enter a name.";
        return;
    }
    
    // Save the gear info to storage
    saveGear(name);
    
    // Change placeholder to say saved
    var notify = document.getElementById('gearinput')
    notify.value = "Saved!";
    notify.setAttribute("disabled", "disabled");
    
    // Refresh
    location.reload();
}


/*
*    Save current window to gear
*    Takes user-given name of gear as argument
*/
function saveGear(name){
    
    // Intialize gear name
    var gearName = name;
    
    // If there are no gears already, initialize them
    var tempGears = getGears();
    if (!tempGears){
        
        // Create a space for storage
        tempGears = {};
        
        // Create a space for gears array 
        tempGears.gears = []; 
    }
    
    // Init storage for window and tabs
    var tabArray = [];
	
    // Var tempWin = new Object;
    var tempGear = {};
    
    // Get current window
    chrome.windows.getCurrent({populate: true}, function (win){
        
        // Current window
        var currentWindow = win;
        
        // Get tabs from window
        for (var i = 0, len = currentWindow.tabs.length; i < len; i++){
            
            // Push current tab's url to tabArray
            tabArray.push(currentWindow.tabs[i].url);
        }
        
        // Create temporary storage from gathered window info
        var id = currentWindow.id;

        // Save gear name
        tempGear.title = gearName;
        
        // Add tab array to the temporary Gear
        tempGear.tabs = tabArray;
        
        // Add this gear's data to existing array of gears
        tempGears.gears.push(tempGear);
        
        // Send tempGears back to localStorage
        var gearStr = JSON.stringify(tempGears, function (key, value){
            return value;
        });
        
        // Store everything again
        localStorage.gearSwitcher = gearStr;
        
    });
	
    return;
}


/*
*    Open a gear. 
*
*/
function openGear(i){
    
    // Get gear data
    var gearData = getGears();
    
    // Get tabArray for this window
    var tabArray = gearData.gears[i].tabs;
    
    // Create window    
    chrome.windows.create({"url": tabArray}, function (window){
        
        // Get winID
        var winID = window.id;
    });
}

/*
*    Delete selected gear from storage
*
*/
function deleteGear(i){
    
    // Pull gear data from storage
    var gearData = getGears();
    
    // Get array of gear objects
    var gearList = gearData.gears;
    
    // Delete one or more items
    if (gearList.length > 1){
        
        // Remove it
        gearList.splice(i, 1);
        
        // Resave and store
        var gearStr = JSON.stringify(gearData);
        localStorage.gearSwitcher = gearStr;
        
    } else { 
	    // If it's the last item
        localStorage.removeItem("gearSwitcher");
    }
    
    // Refresh
    location.reload();
}

/*
*
*   Escape HTML for security 
*	
*	Code source: https://github.com/janl/mustache.js/blob/master/mustache.js
*	Quoted by Tom Gruner: http://stackoverflow.com/a/12034334/5697014
*
*/
var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};
function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

// Load popup after window loads
window.onload = loadPopup();
