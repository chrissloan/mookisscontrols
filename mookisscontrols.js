/*-----------------------------------------------------
MOOKISS LIBRARY v. 1
Utilizes the MooTools Library: http://www.mootools.net

Author: Chris Sloan
Website: http://www.chrissloan.info
License: Open Source MIT Licence
-----------------------------------------------------*/


//--------------
// TABS CLASS
//--------------
var MooKissTabs = new Class({
	options: {
		selectedClass: 'selected',
		containerClass: 'panel',
		tabsClass: 'tabs'
	},
	
	initialize: function(element, options) {
		this.setOptions(options); //set the options that the user passes
		
		this.el = $(element);
		this.elid = element;
	
		this.tabs = $$('#' + this.elid + ' ul li a'); //store all the tabs into the hash
		this.panels = $$('#' + this.elid + ' .' + this.options.containerClass); //store all the panels into the hash
			
		this.panels.setStyle('display', 'none');
		this.panels[0].setStyle('display', 'block');
		this.tabs[0].addClass(this.options.selectedClass); //make first tab selected
		
		this.tabs.each(function(item) { //add the onclick functionality
			item.addEvent('click', function(){
					this.activate(item);
				}.bind(this)
			);
			
		}.bind(this));
	},
	
	activate: function(tab){
		var newTab = tab.get('name'); //which tab was clicked
	
		//lets reset and hide everything
		this.tabs.removeClass(this.options.selectedClass);
		this.panels.setStyle('display', 'none');
		//this.panels.setStyle('visibility', 'hidden');
		
		tab.addClass(this.options.selectedClass); //add the selected class to the tab
		var thePanel = 'div[id='+ newTab + ']'; //the panel to make visible
		
		this.activePanel = this.panels.filter(thePanel); //find the panel amongst all others
		
		this.activePanel.setStyle('display', 'block'); //set it to be visible
	}
	
});

//--------------
// TIPS CLASS
//--------------
var MooKissTip = new Class({
	options: {
		
	},
	
	initialize: function(element, options) {
		this.setOptions(options); //set the options that the user passes
		
		this.tips = $$('.' + element);
		this.tips.each(function(item) { //add the onclick functionality
			item.addEvent('mouseover', function(){
					this.showtip(item);
				}.bind(this)
			);
		
		}.bind(this));
			
		this.tips.each(function(item) { //add the onclick functionality
			item.addEvent('mouseout', function(){
					this.removetip(item);
				}.bind(this)
			);
			
		}.bind(this));
	},
	
	showtip: function(tip){
		this.tipTitle = tip.get('title');
		this.tip = new Element('div').addClass('tooltip').injectInside(document.body);
		this.tip.set('html', this.tipTitle);
	},
	
	removetip: function(tip){
		this.tip.dispose();
	}
	
});


//--------------
// SLIDER CLASS
//--------------
var MooKissSlider = new Class({
	options: {
		scrollerContainer: 'scroller_container', //class name of box that scrolls the items
		itemsClass: 'box', //class name of items to scroll
		controlNext: 'next_button', //class of next button
		controlPrevious: 'previous_button', //class name of previous button
		moveBy: 1
	},
	
	initialize: function(element, options){
		this.setOptions(options); //set the options that the user passes
		this.el = $(element);
		this.elid = element;
		
		// Get the items that build the box
		this.scrollBox = $$('#' + this.elid + ' .' + this.options.scrollerContainer); // get the scrollbox
		this.nextButton = $$('#' + this.elid + ' .' + this.options.controlNext);
		this.previousButton = $$('#' + this.elid + ' .' + this.options.controlPrevious);
		
		this.locationID = 0; //Set the location of the first box
		this.items = $$('#' + this.elid + ' .' + this.options.itemsClass); //get the number of items to scroll
		this.numItems = this.items.length - 1; //count the items - 1 (it's an array, duh)
		
		//setup the scrolling method
		this.scroll = new Fx.Scroll(this.scrollBox[0], { // change this after getting by class
			wait: false,
			duration: 1000,
			transition: Fx.Transitions.Quad.easeInOut
		});
		
		this.nextButton.each(function(item) { //add the click functionality to all NEXT controls
			item.addEvent('click', function(){
					this.clickNext();
				}.bind(this)
			);
		}.bind(this));
		
		this.previousButton.each(function(item) { //add the click functionality to all PREVIOUS controls
			item.addEvent('click', function(){
					this.clickPrevious();
				}.bind(this)
			);
		}.bind(this));
	},
	
	clickNext: function(){ //conditionals galore
		if(this.locationID != this.numItems && (this.locationID + this.options.moveBy) <= this.numItems){
			this.locationID += this.options.moveBy;
			this.scroll.toElement(this.items[this.locationID]);
		}else if((this.locationID + this.options.moveBy) > this.numItems && this.locationID != this.numItems){
			this.locationID = this.numItems;
			this.scroll.toElement(this.items[this.locationID]);
		}else{
			this.locationID = 0;
			this.scroll.toElement(this.items[this.locationID]);
			
		}
	},
	
	clickPrevious: function(){ //conditionals galore
		if(this.locationID != 0 && (this.locationID - this.options.moveBy) >= 0){
			this.locationID -= this.options.moveBy;
			this.scroll.toElement(this.items[this.locationID]);
		}else if((this.locationID - this.options.moveBy) < 0 && this.locationID != 0){
			this.locationID = 0;
			this.scroll.toElement(this.items[this.locationID]);
		}else{
			this.locationID = this.numItems;
			this.scroll.toElement(this.items[this.locationID]);
			
		}
	}
	
});

//--------------
// TOGGLER CLASS
//--------------
var MooKissToggler = new Class({
	options: {
		toggleWrapper: 'toggle_wrapper', //outer container of the toggle section
		toggler: 'toggler', // class name of element that sets action
		toggledItem: 'toggled_item', // class name of element to be toggled
		externalCloser: 'external_closer', // close toggled area externally
		insideToggler: 'inside_toggler', // class name of toggler found inside toggled item
		type: 'toggle', // type of fx
		closeText: 'hide', // text to show on activation of toggler
		closeClass: 'toggler_close',
		hide: true // hide element to be toggled on initialization
	},
	
	initialize: function(element, options) {
		this.setOptions(options); //set the options that the user passes
		this.initialText = new Array();
		if (element){ //if an exact element id is passed in
			this.el = $(element);
			this.elid = element;
			this.togglers = $$('#' + this.elid + ' .' + this.options.toggler); //element that activates toggle
			this.toggledItems = $$('#' + this.elid + ' .' + this.options.toggledItem); //element that is toggled
			this.insideTogglers = $$('#'+ this.elid + ' .' + this.options.toggledItem + ' .' + this.options.insideToggler); //togglers inside the toggled area
			this.externalClosers = $$('#' + this.elid + ' .' + this.options.externalCloser); //if extra toggler is needed
		}else{
			this.wrappers = $$('.' + this.options.toggleWrapper);
			this.togglers = $$('.' + this.options.toggler);
			this.toggledItems = $$('.' + this.options.toggledItem);
			this.insideTogglers = $$(' .' + this.options.toggledItem + ' .' + this.options.insideToggler); //togglers inside the toggled area
			this.externalClosers = $$(' .' + this.options.externalCloser); //if extra toggler is needed
		}
		
		if(this.options.hide){ //if hide initially set to TRUE, hide the area to be toggled
			this.toggledItems.each(function(toggledItem){ 
				var toggleThis = new Fx.Slide(toggledItem);
				toggleThis.hide();
			}.bind(this));
		}
		

		this.togglers.each(function(toggler, index){
				this.initialText[index] = toggler.get('text'); //store the link's initial text
				toggler.addEvent('click', function(e){
					this.activate(toggler, index);
				}.bind(this));
		}.bind(this));
		
		this.externalClosers.each(function(toggler, index){
				toggler.addEvent('click', function(e){
					this.closeExternal(toggler, index);
				}.bind(this));
		}.bind(this));
		
	},
	
	activate: function(toggler, index){
		
		this.insideTogglers.each(function(insideToggler){ // Allows for any togglers inside toggled element to close
				insideToggler.addEvent('click', function(e){
					this.insideTogglerClose(insideToggler, toggler, index);
				}.bind(this));
		}.bind(this));
		
		var toggleThis = new Fx.Slide(this.toggledItems[index]); //set the fx of the element
		
		if(toggler.get('text') == this.initialText[index]){ //change the text of the toggler
			toggler.set('text', this.options.closeText);
			toggler.addClass(this.options.closeClass);
		}else{
			toggler.set('text', this.initialText[index]);
			toggler.removeClass(this.options.closeClass);
		}
		
		switch (this.options.type){
			case "toggle": //toggle fx
				toggleThis.toggle();
				break;
				
			case "hide/show": //hide/show fx
				if(this.options.hide){
					toggleThis.show();
					this.options.hide = false;
				}else{
					toggleThis.hide();
					this.options.hide = true;
				}
				break;
				
			case "slideIn": //slide in fx
				toggleThis.slideIn();
				toggler.setStyle('display', 'none');
				break;
			
		}
  	
  			
	},
	
	closeExternal: function(toggler, index){
	//	alert(this.toggledItems[index].getStyle('display'));
		if(this.toggledItems[index].getStyle('display') == 'block'){
			
		this.togglers[index].set('text', this.initialText[index]);
		var toggleThis = new Fx.Slide(this.toggledItems[index]); //set the fx of the element
		toggleThis.hide();
		}
  			
	},
	
	insideTogglerClose: function(insideToggler, toggler, index){
		var toggleThis = new Fx.Slide(this.toggledItems[index]); //set the fx of the element
		toggler.set('text', this.initialText[index]);
		toggler.removeClass(this.options.closeClass);

		switch (this.options.type){
			case "toggle": //toggle fx
				toggleThis.toggle();
				break;
			
			case "hide/show": //hide/show fx
				if(this.options.hide){
					toggleThis.show();
					this.options.hide = false;
				}else{
					toggleThis.hide();
					this.options.hide = true;
				}
				break;

			case "slideIn": //slide in fx
				toggleThis.slideIn();
				toggler.setStyle('display', 'none');
				break;
			
			
		}
	}
	
});

//----------------
// SCROLLBAR CLASS
//----------------
var MooKissScrollbar = new Class({
	options: {
		scrollbarClass: 'scrollbar', //scrollbar class
		handleClass: 'handle', //handle class
		contentContainerClass: 'container', //class of element to hold the content and scrollbar
		scrollingContentClass: 'scrolling_content', //class of actual element to be scrolled
		scrollMode: 'vertical' //scroll mode
	},
	
	initialize: function(element, options) {
		this.setOptions(options); //set the options that the user passes
		this.el = $(element);
		this.elid = element;
		this.contentContainers = $$("#" + element + ' .' + this.options.contentContainerClass); //content containers of scrollbar and item to be scrolled
		this.scrollingContents = $$("#" + element + ' .' + this.options.contentContainerClass + ' .' + this.options.scrollingContentClass); //elements to be scrolled
		this.contentContainers.each(function(container, index){ //loop through the containers and add scrollbars
				this.createScrollbar(container, this.scrollingContents[index], index);
		}.bind(this));

	
	},
  
	createScrollbar: function(container, scrollingElement, index){ //create the scrollbars

		this.theScrollbar = new Element('div',{ //the scrollbar
			'class': this.options.scrollbarClass
		});
		
		this.theHandle = new Element('div',{ //the handle
			'class': this.options.handleClass
		}).inject(this.theScrollbar);
		
		this.theScrollbar.inject(container); //put the scrollbar in the container
		
		var slider = new Slider(this.theScrollbar, this.theHandle, { //create the sliding mechanism
			steps: scrollingElement.getScrollSize().y - scrollingElement.getSize().y,
			mode: this.options.scrollMode,
			onChange: function(step){
				scrollingElement.scrollTo(0, step);
			}
		}).set(0);
		
		$$(scrollingElement, this.theScrollbar).addEvent('mousewheel', function(e){	//to use the mousewheel on element
				e = new Event(e).stop();
				var step = slider.step - e.wheel * 30;	
				slider.set(step);					
			});
	}
	
});

MooKissTabs.implement(new Options);
MooKissSlider.implement(new Options);
MooKissToggler.implement(new Options);
MooKissTip.implement(new Options);
MooKissScrollbar.implement(new Options);