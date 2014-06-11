

function View(controller) {
	this.controller = controller

	this.first_tone = document.getElementById("first_tone");
	this.second_tone = document.getElementById("second_tone");
	this.play = document.getElementById("play");

	this.info_pane = document.getElementById("info_pane");
	this.info_pane_icon = document.getElementById("info_pane_icon");
	//store the previous icon type used to allow you to add and remove icons
	this.info_pane_icon.icon_name_current = null


	console.assert(this.first_tone != null && 
					this.second_tone != null && 
					this.play != null && 
					this.info_pane != null &&
					this.info_pane_icon != null)
}

View.prototype.get_first_tone = function  () { return this.first_tone }
View.prototype.get_second_tone = function  () { return this.second_tone }
View.prototype.get_play = function  () { return this.play }
View.prototype.get_info_pane = function  () { return this.info_pane }
View.prototype.get_info_pane_icon = function  () { return this.info_pane_icon }


function Mediator() {
	this.view = new View(this)
	this.model = new Model(this)
}

Mediator.prototype.init = function() { 

	//setup event listeners
	this.view.get_first_tone().onclick = this.model.handle_first_click.bind(this.model);
	this.view.get_second_tone().onclick = this.model.handle_second_click.bind(this.model);
	this.view.get_play().onclick = this.model.handle_play_click.bind(this.model);

	this.model.init()
}

function __disable_button__(button) {
	button.classList.add("pure-button-disabled");
	button.disabled = true;
}



Mediator.prototype.disable_first = function() { __disable_button__(this.view.get_first_tone()) }
Mediator.prototype.disable_second = function() { __disable_button__(this.view.get_second_tone()) }
Mediator.prototype.disable_play = function() { __disable_button__(this.view.get_play()) }

function __enablebutton__(button) {
	button.classList.remove("pure-button-disabled");
	button.disabled = false;
}

Mediator.prototype.enable_first = function() { __enablebutton__(this.view.get_first_tone()) }
Mediator.prototype.enable_second = function() { __enablebutton__(this.view.get_second_tone()) }
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
	this.controller.disable_first();
	this.controller.disable_second();
	this.controller.enable_play();
	
}

Model.prototype.handle_play_click = function() {
	this.controller.disable_first()
	this.controller.disable_second()
	this.controller.disable_play()

	
	var freq1 = 400 + Math.random() * 100;
	var freq2 = 400 + Math.random() * 100;
	//generate the frequencies and check if first > second
	this.first_freq_higher = freq1 > freq2;


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

	this.controller.enable_first();
	this.controller.enable_second();
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


Model.prototype.handle_first_click = function(){
	if (this.first_freq_higher) {
		display_correct(this.controller)
	} else {
		display_wrong(this.controller)
	}

	//reset to good old init state
	this.init()
}
Model.prototype.handle_second_click = function(){
	if (this.first_freq_higher) {
		display_wrong(this.controller)
	} else {
		display_correct(this.controller)
	}

	this.init()
}

