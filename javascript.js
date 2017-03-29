var inputName="";
var previousRows=0;

function searchTrigger(){					
	var xhttp,userName_obj,repos_array,str;
	
	str="https://api.github.com/users/";

	if (window.XMLHttpRequest)      								//Check if the user has a modern or an old browser
		xhttp = new XMLHttpRequest();								//Modern   
	else
		xhttp = new ActiveXObject("Microsoft.XMLHTTP");						//Old

	hide_NotExistsMessage();
	hide_Profile();

	xhttp.onreadystatechange = function() {								//Request for the username's existance
		if (this.readyState == 4 && this.status == 200){					//If the username exists
						
			userName_obj=JSON.parse(this.responseText);
			
			show_Profile(userName_obj);
			delete_TableRows();

			xhttp.onreadystatechange = function(){						//Request for the username's repositories
				if (this.readyState == 4 && this.status == 200){
					
					repos_array=JSON.parse(this.responseText);
					
					update_TableRows(userName_obj,repos_array);	
				}
			};
			xhttp.open("GET", userName_obj.repos_url, true);				//Request Call for repositories
			xhttp.send(); 

		}
		else if(this.readyState == 4 && this.status == 404){					//If the username doesn't exists
			
			show_NotExistsMessage();
		}
	};
	str= str.concat(inputName);
	
	xhttp.open("GET",str, true);									//Request Call for username
	xhttp.send();

};
			
function presentModal(){										//When loading the page it makes the modal visible
	document.getElementById("myModal").style.display="block";		
};

function delete_SearchText(){										//When user goes to write a username 											
	document.getElementById("searchName").value="";							//it delets the content
	document.getElementById("searchName").style.color="black";
};

function searchDescription(){										// Re-displays "Search username..."				
	inputName=document.getElementById("searchName").value;
	document.getElementById("searchName").value="Search username...";
	document.getElementById("searchName").style.color="grey";
};

function searchTrigger_withEnter(ev){									//Checks if the user has hit "Enter" key in order
	ev.which= ev.which || e.keyCode;								//to trigger the search
	if(ev.which == 13){
		inputName=document.getElementById("searchName").value;
		document.getElementById("searchName").blur();
		searchTrigger();
	}
};

function hide_Profile(){										//Hides the Profile view
	document.getElementsByClassName("gitImage")[0].style.display="none";							
	
	var sideText=document.getElementsByClassName("next_to_pic");													
	sideText[0].style.display="none";
	sideText[1].style.display="none";
	sideText[2].style.display="none";

	document.getElementById("reposTable").style.display="none";
	
};

function show_Profile(userName_obj){									//Makes the Profile visible
	var content=document.getElementsByClassName("modal-content");					//Expand the window
	content[0].style.height="450px";
	content[0].style.marginTop="-275px";	
	content[0].style.overflow="scroll";								//Enable scrolling
	var theimage=document.getElementsByClassName("gitImage");					//Set the imagine from the profile
	theimage[0].src=userName_obj.avatar_url;			
	
	var sideText=document.getElementsByClassName("next_to_pic");					//Make visible the text next to the image
	
	sideText[0].innerHTML=userName_obj.login;
	
	if(userName_obj.name != null)									//Check if there is no name
		sideText[1].innerHTML=userName_obj.name;
	else
		sideText[1].innerHTML="<b>No name available...</b>";

	if(userName_obj.bio != null)									//Check if there is no bio
		sideText[2].innerHTML=userName_obj.bio;
	else
		sideText[2].innerHTML="No bio available...";

	theimage[0].style.display="block";
	sideText[0].style.display="block";
	sideText[1].style.display="block";
	sideText[2].style.display="block";
	document.getElementById("reposTable").style.display="block";
};

function hide_NotExistsMessage(){									//Hides the box with the message "Doesn't exists"
	document.getElementById("notexists").style.display="none";
};

function show_NotExistsMessage(){
	var content=document.getElementsByClassName("modal-content");					//Expand the window
	content[0].style.height="90px";									//Change Postion
	content[0].style.marginTop="-100px";
	content[0].style.overflow="hidden";								//Disable the scrolling
	document.getElementById("notexists").style.display="block";					//Show Does not exists message
};

function delete_TableRows(){										//Delete all the rows from the table 
	var table=document.getElementById("reposTable");						//that have repositories of the previous username
	for(var k=0; k<previousRows; k++){											
		table.deleteRow(1);														
	}
	table.style.display="block";
};

function update_TableRows(userName_obj,repos_array){							//Updates the table rows
	var row,cell1,cell2,cell3,cell4,cell5;
	var table=document.getElementById("reposTable");			
	
	previousRows=userName_obj.public_repos;
	
	for(var i=0; i<userName_obj.public_repos; i++){							//In a loop fill the rows of the table 
		if(repos_array[i] != null){								//with the repositories informations				
			row=table.insertRow(i+1);								
			cell1=row.insertCell(0);
			cell2=row.insertCell(1);
			cell3=row.insertCell(2);
			cell4=row.insertCell(3);
			cell5=row.insertCell(4);
			
			cell1.innerHTML=repos_array[i].name;
			cell2.innerHTML="<img src='./pictures/gitstar.png' style='width:20px;height:20px'>";		//Set the star picture
			cell3.innerHTML=repos_array[i].stargazers_count + "";						//Set the number of stars
			cell4.innerHTML="<img src='./pictures/gitfork.png' style='width:20px;height:20px'>";		//Set the fork picture
			cell5.innerHTML=repos_array[i].forks_count + "";						//Set the number of forks
		}else{
			previousRows=i;
			break;
		}
	}
	table.style.display="block";
};

