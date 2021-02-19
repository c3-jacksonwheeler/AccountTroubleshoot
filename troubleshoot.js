/*

Usage Instructions:

Dev console > sources tab > New snippet > drag and drop this file into snippet > click run icon in bottom right
Then the tree(troubleshooter) icon will appear to the left of the grid icon




testing billingaccount in coned qa: 100000000001


*/





class Troubleshooter {
	//https://coolors.co/182825-016fb9-22aed1-6d8ea0-afa98d-cfc0bd-957186
	typeNodes = [
	{	
		name:"BillingAccount",
		rootConnection:(BAID)=>{return `id == "${BAID}"`},
		connections:[],
		type:BillingAccount,
		color:"#ffd880"

	},
	{
		name:"ServiceAgreement",
		rootConnection:(BAID)=>{return `account.id == "${BAID}"`},
		connections:[],
		type:ServiceAgreement,
		color:"#016fb9"
	},
	{
		name:"Facility",
		rootConnection:(BAID)=>{return `billingAccounts.id == "${BAID}"`},
		connections:[],
		type:Facility,
		color:"#8E9C97"
	},
	{
		name:"Service",
		rootConnection:(BAID)=>{return `serviceAgreement.account.id == "${BAID}"`},
		connections:[],
		type:Service,
		color:"#22aed1"
	},
	{
		name:"ServicePoint",
		rootConnection:(BAID)=>{return `serviceAgreements.account.id == "${BAID}"`},
		connections:[],
		type:ServicePoint,
		color:"#6d8ea0"
	},
	{
		name:"PhysicalMeasurementSeries",
		rootConnection:(BAID)=>{return `servicePoint.serviceAgreements.account.id == "${BAID}"`},
		connections:[],
		type:PhysicalMeasurementSeries,
		color:"#cfc0bd"
	},
	{
		name:"DetailBill",
		rootConnection:(BAID)=>{return `parent.serviceAgreement.account.id == "${BAID}"`},
		connections:[],
		type:DetailedBill,
		color:"#0D4C6F"
	},



];

// 
	// {
	// 	name:"Measurements",
	// 	color:"BAA1AF",
	// }

	constructor(){
		this.rootID = undefined;

		this.counts = [];

		

		//setup content pane
		let contentPane = `
		<div id="content-troubleshooter" class="content troubleshooter" style="display:none;">
			<h1>
				<i class="tab glyphicon glyphicon-tree-deciduous"></i>
				Troubleshooter
				<span id="tabs" class="tabs" style="display:flex;">
					<a href="#" title="accountTree" id="accountTroubleshootIcon" class="tab tab-grid treeIcon"><i class="glyphicon glyphicon-tree-deciduous" style="opacity: 0.4; filter: alpha(opacity=40);"></i></a>
					<a href="#" onClick="c3Grid()" title="grid" class="tab tab-grid"><i class="glyphicon glyphicon-th"></i></a>
					<a href="#" onClick="c3Viz()" title="visualizer" class="tab tab-visualizer"><i class="glyphicon glyphicon-eye-open" style=""></i></a>
					<a href="#" onClick="C3.console.doTester()" title="tester" class="tab tab-tester"><i class="glyphicon glyphicon-play" style=""></i></a>
					<a href="#" onClick="C3.console.doProvision()" title="provisioner" class="tab tab-provisioner"><i class="glyphicon glyphicon-cloud-upload" style=""></i></a>
					<a href="#" onClick="C3.console.doErrors()" title="errors" class="tab tab-errors"><i class="glyphicon glyphicon-exclamation-sign" style=""></i></a>
					<a href="#" onClick="C3.console.doHealth()" title="health" class="tab tab-health"><i class="glyphicon glyphicon-off" style=""></i></a>
					<a href="#" onClick="C3.console.doTypeHelp()" title="types" class="tab tab-types"><i class="glyphicon glyphicon-briefcase" style=""></i></a>
					<a href="#" onClick="C3.console.doCommandHelp()" title="commands" class="tab tab-commands"><i class="glyphicon glyphicon-book" style=""></i></a>
				</span>
			</h1>
			<div class="wrapper" id="tshootwrapper" style="height: 350px;">
			</div>
		</div>`
		$("body")[0].insertAdjacentHTML('beforeEnd',contentPane)
		
		//setup content
		let content = `
		<div class="tshootContainer">
			<div class="controllerContainer">
				<div class="controllerHeader">

					<div class="col-lg-6">
						<div class="input-group">
						  	<input type="text" class="form-control" id="BAInput" placeholder="BillingAccount ID">
							<span class="input-group-btn">
								<button class="btn btn-default" onClick="UIState.ts.submitRoot()" type="button">Submit</button>
								<button class="btn btn-default" onClick="UIState.ts.clear()" type="button">Clear</button>
							</span>
							
						</div><!-- /input-group -->
					</div><!-- /.col-lg-6 -->

					
				</div>
			<div class="controllerBody">
				
				<div class="buttonCol">
					<div class="btn-group-vertical bodyButtonGroup" id="bodyButtonGroup1" role="group" aria-label="...">
						
						
					
					</div>
					<div class="spinnerContainer" style="display:none;">
						<div class="lds-dual-ring"></div>
					</div>

					
				</div>
				<div class="buttonCol" style="display:none;">
					<div class="btn-group-vertical bodyButtonGroup" style="display:none;" id="bodyButtonGroup2" role="group" aria-label="...">
						<button type="button" class="btn btn-default">Latest ServiceAgreement TODO</button>
						<button type="button" class="btn btn-default">Last 12 DetailedBill TODO</button>

					</div>
				</div>
				
			</div>
			</div>
			<div class="heirarchyContainer">
			</div>
		</div>`




		$("#tshootwrapper")[0].insertAdjacentHTML('afterbegin',content);


	}
	getNodeByName(name){
		for(let i = 0; i < this.typeNodes.length; i++){
			if(this.typeNodes[i].name == name){
				return this.typeNodes[i];
			}
		}
		console.log("Node not found");
	}

	submitRoot(){
		let newBA = $("#BAInput").val();
		if(newBA.localeCompare(this.rootID) == 0){
			return;//same as previous
		}

		console.log(newBA);
		if(this.rootID !== undefined){
			this.clear(()=>{

				this.submitRoot(newBA);
			},false)
		}
		else{
			let rootTypeName = "BillingAccount";

			let rootNode = this.getNodeByName(rootTypeName)
			console.log(rootNode);

			let rootInstanceCount = rootNode.type.fetchCount({filter:rootNode.rootConnection(newBA)});
			if( rootInstanceCount != 1){
				//fail due to no root instance, or id selected multiple root instances
				console.log(`Error: root id selected ${rootInstanceCount} instances, expected 1 `);
				return;

			}

			this.rootID = newBA;

			let buttonGroup = $("#bodyButtonGroup1")[0]

			$("#bodyButtonGroup2").show();//bring up other controls
			//setup counts

			$(".spinnerContainer").show();
			for(let i = 0; i < this.typeNodes.length; i++){
				
				let node = this.typeNodes[i]
				if(rootTypeName != node.name){
					setTimeout(()=>{
						let numInstances = node.type.fetchCount({filter:node.rootConnection(this.rootID)});
						console.log(numInstances);
						//buttonGroup.insertAdjacentHTML('beforeEnd',`<button type="button" class="btn btn-default">${node.name}:${numInstances}</button>`)
						buttonGroup.innerHTML +=`<button type="button" onClick="UIState.ts.showTypeGrid('${node.name}')" style="text-color:${node.color};" class="btn btn-default">${node.name}:${numInstances}</button>`

						if(i == this.typeNodes.length-1){
							$(".spinnerContainer").hide();
						}
					},50)
					

				}
				
				
			}




		}
	}
	showTypeGrid(name){
		let node = this.getNodeByName(name);

		if(node && this.rootID){
			UIState.troubleshootContentPaneVisible = false;
			c3Grid(node.type.fetch({filter:node.rootConnection(this.rootID)}))


		}

	}


	clear(cb,clearInput){

		clearInput = (clearInput === undefined)?true:clearInput;

		this.rootID = undefined;
		$("#bodyButtonGroup2").hide();//bring up other controls
		

		$(".spinnerContainer").hide();

		$("#bodyButtonGroup1")[0].innerHTML = "";

		if(clearInput){
			$("#BAInput").val("");
		}

		if(cb){
			cb();
		}
		


	}


	renderState(){

	}


}


function switchContentPane(){
	if(!troubleshooterInjectedIntoPage){
		console.log("Setup process not finished yet");
	}

	let currentContent = $('*[id*=content]:visible').hide();
	
	
	UIState.troubleshootContentPaneVisible = true;

	$("#content-troubleshooter").show();
	layoutContent();//manually recalculate width/height, static console sourcecode will auto update after resize if div id is like "content-*"
	

	


}


function layoutContent() {//taken from static console source
    var content = $('body>.content:visible'),
        body = $('body'),
        pos = content.position(),
        totalW, totalH, contentH, h1, inner, top;

    if (content.length < 1 || !pos)
      return;

    totalH = body.innerHeight() || window.innerHeight;
    if (totalH > 0) {
      contentH = Math.floor(totalH - pos.top - pos.left - 1);
      content.css('height', contentH + 'px');
    }

    totalW = body.innerWidth() || window.innerWidth;
    if (totalW > 0)
      content.css('width', Math.ceil(totalW - pos.left * 2 + 1) + 'px');

    inner = content.find('>div').first();
    if (inner.length > 0 && contentH > 0) {
      top = 0;
      h1 = content.find('>h1');
      if (h1.length > 0)
        top = h1.outerHeight() + 2;
      inner.css('height', (contentH - top) + 'px');
    }

    content.find('.splitter_panel').trigger('splitter.resize');
  }

//css

var style = document.createElement('style')
style.setAttribute("id", "troubleshootStyle");
style.innerHTML = `

	.tshootContainer {
		display:flex;
		flex-direction:row;
		height:100%;

	}

	.controllerContainer {
		width:50%;
		height:100%;
		display:flex;
		flex-direction:column;
		background-color:white;
		border-right:1px solid #bebebe;
	}

	.heirarchyContainer {
		width:50%;
		height:100%;
		display:flex;
		flex-direction:column;
		background-color:#eeeeee;
	}
	.controllerHeader {
		width:100%;
		display:flex;
		flex-direction:row;
		justify-content:space-around;
		padding:2em;
	}
	.controllerBody {
		display:flex;
		flex-direction:row;
		justify-content:space-around;
		width:100%;
	}
	.row {
		display:flex;
		flex-direction:row;
	}

	.lds-dual-ring {
		display: inline-block;
		width: 20px;
		height: 20px;
	}
	.lds-dual-ring:after {
		content: " ";
		display: block;
		width: 32px;
		height: 32px;
		margin: 4px;
		border-radius: 50%;
		border: 3px solid #000;
		border-color: #000 transparent #000 transparent;
		animation: lds-dual-ring 1.2s linear infinite;
	}
	@keyframes lds-dual-ring {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.btn{
		background-image:none;
	}

	.buttonCol {
		display:flex;
		flex-direction:column;
		width:40%;
	}
	.bodyButtonGroup {
		width:100%;
	}

	.spinnerContainer{
		display:flex;
		width:100%;
		justify-content:center;
		vertical-align:center;

	}


`



let dev = true;
let injectingIcon = false;


function iconInjection(){
	// if(injectingIcon){
	// 	return;
	// }
	injectingIcon = true;
	console.log("would have injected");
	let tabs = $('.tabs')
	console.log("tabs",tabs);
	tabs.each(function(tabsNum){
		
		window.setTimeout(()=>{
			if($(this).find("#accountTroubleshootIcon").length == 0){
				let treeIcon = '<a href="#" onClick="switchContentPane()" title="accountTree" id="accountTroubleshootIcon" style="padding:0px;" class="tab tab-grid treeIcon"><i class="glyphicon glyphicon-tree-deciduous"></i></a>'

				this.insertAdjacentHTML('afterbegin',treeIcon)


			}
			if(tabsNum == tabs.length-1){
				injectingIcon = false;
			}
		},0)
		


		//$(".navbar-right")[0].insertAdjacentHTML('afterbegin',treeIcon)
	})


	//let treeIcon = '<li id="accountTreeLI" style="display:flex;height:50px;display:flex;align-items:center;"><a href="#" title="accountTree" id="accountTroubleshootIcon" style="padding:0px;" class="tab tab-grid"><i style="font-size: 2em;" class="glyphicon glyphicon-tree-deciduous"></i></a></li>'



}



//main setup
if(typeof troubleshooterInjectedIntoPage == 'undefined' ){

	var troubleshooterInjectedIntoPage = false;//var used here to make this variable global scope



	//take over c3Grid c3Viz, etc. in order to inject the visualizer as a selectable tab
	
    let c = C3.console;
	let commands = [c.doGrid,c.doVisualize,c.doTester,c.doProvision,c.doErrors,c.doHealth,c.doTypeHelp,c.doCommandHelp]
	
	let _doGrid = C3.console.doGrid;
	C3.console.doGrid = (data,max,title)=>{_doGrid(data,max,title);iconInjection();}
	
	let _doVisualize = C3.console.doVisualize;
	C3.console.doVisualize = (data)=>{ _doVisualize(data); iconInjection();}

	let _doTester = C3.console.doTester;
	C3.console.doTester = ()=>{_doTester(); iconInjection(); }

	let _doProvision = C3.console.doProvision;
	C3.console.doProvision = ()=>{_doProvision(); iconInjection(); }

	let _doErrors = C3.console.doErrors;
	C3.console.doErrors = ()=>{_doErrors(); iconInjection(); }

	let _doHealth = C3.console.doHealth;
	C3.console.doHealth = ()=>{ _doHealth(); iconInjection();}

	let _doTypeHelp = C3.console.doTypeHelp;
	C3.console.doTypeHelp = (type, field)=>{ _doTypeHelp(type, field); iconInjection();}

	let _doCommandHelp = C3.console.doCommandHelp;
	C3.console.doCommandHelp = ()=>{ _doCommandHelp(); iconInjection();}


	iconInjection();

	//add css
	document.head.appendChild(style)

	//add icon to top bar
	// let treeIcon = '<li id="accountTreeLI" style="display:flex;height:50px;display:flex;align-items:center;"><a href="#" title="accountTree" id="accountTroubleshootIcon" style="padding:0px;" class="tab tab-grid"><i style="font-size: 2em;" class="glyphicon glyphicon-tree-deciduous"></i></a></li>'

	// $(".navbar-right")[0].insertAdjacentHTML('afterbegin',treeIcon)




	var UIState = {troubleshootContentPaneVisible:false, prevContentPane:undefined, ts:new Troubleshooter()}
	//add event listeners to other content pane

	// $("#accountTroubleshootIcon").click(switchContentPane)





	troubleshooterInjectedIntoPage = true;

}
else{
	console.info("Account TroubleShoot has already been set up")

	
	//dev workaround
	if(dev){



		//reset troubleshooter content pane
		$("#content-troubleshooter")[0].remove();
		UIState.ts = new Troubleshooter();

		// $("#accountTreeLI")[0].remove();

		//reset styles
		$("#troubleshootStyle")[0].remove();
		document.head.appendChild(style)


		if(UIState.troubleshootContentPaneVisible){
			$("#content-troubleshooter").show();
			layoutContent();//manually recalculate width/height, static console sourcecode will auto update after resize if div id is like "content-*"

		}


	}


}