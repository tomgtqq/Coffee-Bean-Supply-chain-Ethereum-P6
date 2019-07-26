import Web3 from "web3";
import SupplyChainArtifact from "../../build/contracts/SupplyChain.json";

const App = {
  // for web3 provider
  web3: null,
  account: null,
  meta: null,

  // init data
  emptyAddress: "0x0000000000000000000000000000000000000000",
  upc: 0,
  ownerID: "0x0000000000000000000000000000000000000000",
  originFarmerID: "0x0000000000000000000000000000000000000000",
  originFarmName: null,
  originFarmInformation: null,
  originFarmLatitude: null,
  originFarmLongitude: null,
  productNotes: null,
  productPrice: 1,
  distributorID: "0x0000000000000000000000000000000000000000",
  retailerID: "0x0000000000000000000000000000000000000000",
  consumerID: "0x0000000000000000000000000000000000000000",

  // For transaction histroy
  TxEventCount: 0,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SupplyChainArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        SupplyChainArtifact.abi,
        deployedNetwork.address,
      );

      // read Form from index.html 
      App.readForm();

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      // fetch item
      App.fetchItemBufferOne();
      App.fetchItemBufferTwo();

      // jquery bind Events
      App.bindEvents();

      // Suscribe , receives all
      App.fetchSmartContractEvents();

    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  readForm: function () {
    App.upc = $("#upc").val();
    App.originFarmerID = $("#originFarmerID").val();
    App.originFarmName = $("#originFarmName").val();
    App.originFarmInformation = $("#originFarmInformation").val();
    App.originFarmLatitude = $("#originFarmLatitude").val();
    App.originFarmLongitude = $("#originFarmLongitude").val();
    App.productNotes = $("#productNotes").val();
    App.productPrice = $("#productPrice").val();
    App.distributorID = $("#distributorID").val();
    App.retailerID = $("#retailerID").val();
    App.consumerID = $("#consumerID").val();

    console.log(
        App.upc,
        App.ownerID, 
        App.originFarmerID, 
        App.originFarmName, 
        App.originFarmInformation, 
        App.originFarmLatitude, 
        App.originFarmLongitude, 
        App.productNotes, 
        App.productPrice, 
        App.distributorID, 
        App.retailerID, 
        App.consumerID
    );
  },

  fetchItemBufferOne: async function(){
  const { fetchItemBufferOne } = this.meta.methods;

  App.upc = $('#upc').val();
  console.log('upc',App.upc);

  try{
        let result = await fetchItemBufferOne(App.upc).call();

        $("#ftc1-SKU").text('SKU' + ' - ' + result.itemSKU );
        $("#ftc1-UPC").text('UPC' + ' - ' + result.itemUPC );
        $("#upc").text(result.itemUPC );
        $("#ftc1-ownerID").text('ownerID' + ' - ' + result.ownerID);
        $("#ftc1-originFarmName").text('originFarmName' + ' - ' + result.originFarmName);
        $("#ftc1-originFarmerID").text('originFarmerID' + ' - ' + result.originFarmerID);
        $("#ftc1-originFarmInformation").text('originFarmInformation' + ' - ' + result.originFarmInformation);
        $("#ftc1-originFarmLatitude").text('originFarmLatitude' + ' - ' + result.originFarmLatitude);
        $("#ftc1-originFarmLongitude").text('originFarmLongitude' + ' - ' + result.originFarmLongitude);
        
        console.log('fetchItemBufferOne', result);
     }catch(error){
        console.error(err.message);
     }
  },

  fetchItemBufferTwo: async function(){
    const { fetchItemBufferTwo } = this.meta.methods;

    App.upc = $('#upc').val();
    console.log('upc',App.upc);

    try{
          let result = await fetchItemBufferTwo(App.upc).call();
          $("#ftc1-ProductID").text('ProductID' + ' - ' + result.productID);
          $("#ftc2-productPrice").text('productPrice' + ' - ' + result.productPrice );
          $("#ftc2-distributorID").text('distributorID' + '<br>' + ' - ' + result.distributorID );
          $("#ftc2-retailerID").text('retailerID' + '<br>' + ' - '  + result.retailerID);
          $("#ftc2-consumerID").text('consumerID' + '<br>' + ' - '  + result.consumerID);
          console.log('fetchItemBufferTwo', result);
       }catch(error){
          console.error(err.message);
       }
  },

  harvestItem: async function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data('id'));
    console.log('processId',processId);

    const { harvestItem } = this.meta.methods;

    App.upc = $('#upc').val();
    App.originFarmerID = $("#originFarmerID").val();
    App.originFarmName = $("#originFarmName").val();
    App.originFarmInformation = $("#originFarmInformation").val();
    App.originFarmLatitude = $("#originFarmLatitude").val();
    App.originFarmLongitude = $("#originFarmLongitude").val();
    App.productNotes = $("#productNotes").val();



    console.log(
      App.upc, 
      App.account, 
      App.originFarmerID, 
      App.originFarmName, 
      App.originFarmInformation, 
      App.originFarmLatitude, 
      App.originFarmLongitude, 
      App.productNotes
  );

    try{
          let result = await harvestItem(
            App.upc, 
            App.originFarmerID, 
            App.originFarmName, 
            App.originFarmInformation, 
            App.originFarmLatitude, 
            App.originFarmLongitude, 
            App.productNotes
            ).send({from: App.account});

            $("#ftc-item").text(result);
            console.log('harvestItem',result);

       }catch(error){
          console.error(error.message);
       }
  },

  processItem: async function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data('id'));
    console.log('processId',processId);

    const { processItem } = this.meta.methods;

    App.upc = $('#upc').val();

    console.log(
      App.upc, 
      App.account, 
  );

    try{
          let result = await processItem(App.upc).send({from: App.account});

            $("#ftc-item").text(result);
            console.log('processItem',result);
            
       }catch(error){
          console.error(error.message);
       }
  },

  packItem: async function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data('id'));
    console.log('processId',processId);

    const { packItem } = this.meta.methods;

    App.upc = $('#upc').val();

    console.log(
      App.upc, 
      App.account, 
  );
    try{
          let result = await packItem(App.upc).send({from: App.account});

            $("#ftc-item").text(result);
            console.log('packItem',result);
            
       }catch(error){
          console.error(error.message);
       }
  },

  sellItem: async function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data('id'));
    console.log('processId',processId);

    const { sellItem } = this.meta.methods;

    App.upc = $('#upc').val();
    App.productPrice = $('#productPrice').val();
    let unit = $('#buyUnit').val();

    console.log(
      App.upc, 
      App.account, 
      App.productPrice,
      $('#productPrice').val()
  );

    try{
          let result = await sellItem(App.upc, this.web3.utils.toWei(App.productPrice, unit)).send({from: App.account});

            $("#ftc-item").text(result);
            console.log('packItem',result);
            
       }catch(error){
          console.error(error.message);
       }
  },

  buyItem: async function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data('id'));
    console.log('processId',processId);

    const { buyItem } = this.meta.methods;

    App.upc = $('#upc').val();
    App.productPrice = $('#productPrice').val();
    let unit = $('#buyUnit').val();

    console.log(
      App.upc, 
      App.account, 
      App.productPrice,
      $('#productPrice').val()
  );
    try{
          let result = await buyItem(App.upc).send({from: App.account, value: this.web3.utils.toWei(App.productPrice, unit)});

            $("#ftc-item").text(result);
            console.log('buyItem',result);
            
       }catch(error){
          console.error(error.message);
       }
  },

  shipItem: async function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data('id'));
    console.log('processId',processId);

    const { shipItem } = this.meta.methods;

    App.upc = $('#upc').val();

    console.log(
      App.upc, 
      App.account, 
  );




    try{
          let result = await shipItem(App.upc).send({from: App.account});

          $("#ftc-item").text(result);
          console.log('shipItem',result);
            
       }catch(error){
          console.error(error.message);
       }
  },

  receiveItem: async function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data('id'));
    console.log('processId',processId);

    const { receiveItem } = this.meta.methods;

    App.upc = $('#upc').val();

    console.log(
      App.upc, 
      App.account, 
  );    
    try{
          let result = await receiveItem(App.upc).send({from: App.account});

          $("#ftc-item").text(result);
          console.log('receiveItem',result);
            
       }catch(error){
          console.error(error.message);
       }
  },

  purchaseItem: async function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data('id'));
    console.log('processId',processId);

    const { purchaseItem } = this.meta.methods;

    App.upc = $('#upc').val();
    App.productPrice = $('#productPrice').val();
    let unit = $('#buyUnit').val();

    console.log(
      App.upc, 
      App.account, 
      App.productPrice,
      $('#productPrice').val()
  );
    try{
          let result = await purchaseItem(App.upc).send({from: App.account, value: this.web3.utils.toWei(App.productPrice, unit)});

          $("#ftc-item").text(result);
          console.log('purchaseItem',result);
            
       }catch(error){
          console.error(error.message);
       }
  },

  // fetch events that emitted from smart contract
  // events is log of smart contract usage and Stored in transaction log
  // Can have indexed arguments for searching, but as this part , only tracking operation 
  fetchSmartContractEvents: function () {
      this.meta.events.allEvents()
      .on('data', (log)=>{
        $("#event-counter").text(App.TxEventCount + 1);
        $("#fetch-event").text(log.event);
        $("#fetch-txHash").text(log.transactionHash);
        $("#tx-history").append('<li id="tx-item">'+log.event+'-'+log.transactionHash+'</li>');
       
        console.log(log.event)

        $('#event-note').text(log.event)
        $('#BootstrapDialog').modal('toggle');
      })
      .on('error',console.error);
  },

  bindEvents: function() {
      $(document).on('click', App.handleButtonClick);
  },

  handleButtonClick: async function(event) {
  // jquery: event from index.html . event is log of usage and data can be parsered  
  event.preventDefault();
  var processId = parseInt($(event.target).data('id'));
  console.log('processId',processId);

  switch(processId) {
      case 1:
          return await App.harvestItem(event);
          break;
      case 2:
          return await App.processItem(event);
          break;
      case 3:
          return await App.packItem(event);
          break;
      case 4:
          return await App.sellItem(event);
          break;
      case 5:
          return await App.buyItem(event);
          break;
      case 6:
          return await App.shipItem(event);
          break;
      case 7:
          return await App.receiveItem(event);
          break;
      case 8:
          return await App.purchaseItem(event);
          break;
      case 9:
          return await App.fetchItemBufferOne(event);
          break;
      case 10:
          return await App.fetchItemBufferTwo(event);
          break;
      }
  },

};

window.App = App;

window.addEventListener("load", async function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
  }

  App.start();
});
