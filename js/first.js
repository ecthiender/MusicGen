

function View(controller) {
	this.controller = controller

	this.yes = document.getElementById("yes");
	this.no = document.getElementById("no");
	this.play = document.getElementById("play");

	this.info_pane = document.getElementById("info_pane");
	this.info_pane_icon = document.getElementById("info_pane_icon");
	//store the previous icon type used to allow you to add and remove icons
	this.info_pane_icon.icon_name_current = null


	console.assert(this.yes != null && 
					this.no != null && 
					this.play != null && 
					this.info_pane != null &&
					this.info_pane_icon != null)
}

View.prototype.get_yes = function  () { return this.yes }
View.prototype.get_no = function  () { return this.no }
View.prototype.get_play = function  () { return this.play }
View.prototype.get_info_pane = function  () { return this.info_pane }
View.prototype.get_info_pane_icon = function  () { return this.info_pane_icon }


function Mediator() {
	this.view = new View(this)
	this.model = new Model(this)
}

Mediator.prototype.get_view = function() { return this.view }

Mediator.prototype.init = function() { 

	//setup event listeners
	this.view.get_yes().onclick = this.model.handle_yes_click.bind(this.model);
	this.view.get_no().onclick = this.model.handle_no_click.bind(this.model);
	this.view.get_play().onclick = this.model.handle_play_click.bind(this.model);

	this.model.init()
}

function __disable_button__(button) {
	button.classList.add("pure-button-disabled");
	button.disabled = true;
}



Mediator.prototype.disable_yes = function() { __disable_button__(this.view.get_yes()) }
Mediator.prototype.disable_no = function() { __disable_button__(this.view.get_no()) }
Mediator.prototype.disable_play = function() { __disable_button__(this.view.get_play()) }

function __enablebutton__(button) {
	button.classList.remove("pure-button-disabled");
	button.disabled = false;
}

Mediator.prototype.enable_yes = function() { __enablebutton__(this.view.get_yes()) }
Mediator.prototype.enable_no = function() { __enablebutton__(this.view.get_no()) }
Mediator.prototype.enable_play = function() { __enablebutton__(this.view.get_play()) }


Mediator.prototype.display_info = function(info, color) {
	if (color == undefined) { color = "#000000"; }
	info_pane = this.view.get_info_pane();
	info_pane.visible = true;
	info_pane.innerHTML = info;

	info_pane.style.color = color;
	console.log("info: " + info);
	console.log("color: " + color);
}

Mediator.prototype.display_icon = function(new_icon_name, color) {
	if (color == undefined) { color = "#000000"; }

	icon = this.view.get_info_pane_icon();
	
	if (new_icon_name == null) {
		//just remove the current icon and finish :)
		icon.classList.remove(icon.icon_name_current)
		icon.icon_name_current = null
		return
	}

	icon.visible = true;

	//remove the old icon class 
	icon.classList.remove(icon.icon_name_current)

	//store the current icon class and set it up
	icon.icon_name_current = new_icon_name
	icon.classList.add(new_icon_name)


	icon.style.color = color;

	console.log("new icon: " + new_icon_name);
}



function Model(controller) {
	this.controller = controller

	//whether it's playing the sounds or not 
	this.playing_sound = false

}

Model.prototype.init = function() {
	//disable the yes and no buttons
	this.controller.disable_yes();
	this.controller.disable_no();
	this.controller.enable_play();
	
}

Model.prototype.handle_play_click = function() {
	this.controller.disable_yes()
	this.controller.disable_no()
	this.controller.disable_play()

	this.same_pitch = (Math.random() > 0.5);
	var freq1 = 400 + Math.random() * 100;
	var freq2 = 400 + Math.random() * 100;
	
	if  ( this.same_pitch ) {
		freq1 = freq2
	}

	this.SOUND_PLAY_TIME = 1200;
	this.SOUND_OPTIONS_GAP = 500;


	var clear_info_time = this.SOUND_PLAY_TIME + 10;
	var second_sound_play_time = this.SOUND_PLAY_TIME + this.SOUND_OPTIONS_GAP;
	var enable_choice_time = second_sound_play_time + this.SOUND_PLAY_TIME + this.SOUND_OPTIONS_GAP;
	

	//play the first sound
	window.setTimeout(this.sound_play, 0, 
			freq1, "1st Sound", this.SOUND_PLAY_TIME)

	//play the second sound
	window.setTimeout(this.sound_play, second_sound_play_time, 
		freq2, "2nd Sound", this.SOUND_PLAY_TIME)


	//enable the buttons
	window.setTimeout(this.enable_choice, enable_choice_time)
}

Model.prototype.sound_play = function(freq, text, time_to_play) {
	var sound_source = T("sin", {freq: freq});


	var clear_info = function() {
		this.controller.display_info("")	
		this.controller.display_icon(null)	
	}

	//once you're done playing the sound, clear the info bar for neatness
	window.setTimeout(function() { 
		sound_source.pause()
		clear_info()
	}, time_to_play);
		
	sound_source.play();

	//display the info pane so that we can tell the user which sound is playing
	this.controller.display_info(text, "#0074D9");
	this.controller.display_icon("fa-volume-up",  "#0074D9");
}

Model.prototype.enable_choice = function() {
	this.controller.display_info("")	
	this.controller.display_icon(null)	


	this.controller.enable_yes();
	this.controller.enable_no();
	this.controller.disable_play();

	
}




function display_correct(controller) {
	controller.display_info("Right!", " #01FF70")
	controller.display_icon("fa-smile-o", "#01FF70")	
}

function display_wrong(controller){
	controller.display_info("Wrong!", "#FF4136")
	controller.display_icon("fa-frown-o", "#FF4136")	
}


Model.prototype.handle_yes_click = function(){
	if (this.same_pitch) {
		display_correct(this.controller)
	} else {
		display_wrong(this.controller)
	}

	//reset to good old init state
	this.init()
}
Model.prototype.handle_no_click = function(){
	if (this.same_pitch) {
		display_wrong(this.controller)
	} else {
		display_correct(this.controller)
	}

	this.init()
}

