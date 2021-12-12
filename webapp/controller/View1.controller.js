sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, Filter, FlattenedDataset, FeedItem) {
		"use strict";

		return Controller.extend("homework1.controller.View1", {
			onInit: function () {

			},

			onPress: function(oEvent){
				let comboValue = this.getView().byId('idCombo').getValue();
				let oFilter = new Filter("Syear", "EQ", comboValue);
                let oTable = this.byId("idSalesTable");

                let oBinding = oTable.getBinding("items");
                oBinding.filter(oFilter);		
			},

			onSelectCarr: function(oEvent){
				let sCarrContext = oEvent.getSource().getBindingContext();
				let sCarrId = this.getView().getModel().getProperty('Carrid', sCarrContext);
				let sCarrName = this.getView().getModel().getProperty('Carrname', sCarrContext);;

				let oFilter = new Filter("Carrid", "EQ", sCarrId);

				let oViz1 = this.byId('idVizFrame');
				oViz1.destroyFeeds();
                oViz1.destroyDataset();

				let oDataset = new FlattenedDataset({
                    dimensions : [{
                        name : "연도",
                        value : "{Syear}"
                    }],
                    measures : [{
                        name : "매출액",
                        value : "{Curam}"
                    }],
                    data : { path :  "/ES_CHARTSet",
                             filters : oFilter
                    }
                });
                oViz1.setDataset(oDataset);

				oViz1.setVizProperties({
                    title : { text : sCarrName+" 년도별 매출액" },
					plotArea : {
                        colorPalette : d3.scale.category20().range(),
                        drawingEffect : "glossy",
							dataLabel: {
								visible: true
							}
                    }
                });

				let feedColor = new FeedItem({
                    uid : "color",
                    type : "Dimension",
                    values : ["연도"]
                });
                let feedSize = new FeedItem({
                    uid : "size",
                    type : "Measure",
                    values : ["매출액"]
                });
                oViz1.addFeed(feedSize);
                oViz1.addFeed(feedColor);

				let comboValue = this.byId("idCombo").getValue();

				let oFilter2 = []
				oFilter2.push(new Filter("Syear", "EQ", comboValue));
				oFilter2.push(new Filter("Carrid", "EQ", sCarrId));
				
				let oViz2 = this.byId('idVizFrame2');

				oViz2.destroyFeeds();
                oViz2.destroyDataset();

				let oDatasetStack = new FlattenedDataset({
                    dimensions : [{
                        name : "월",
                        value : "{Month}"
                    }],
                    measures : [{
                        name : "매출액",
                        value : "{Curam}"
                    }
					,{
                        name : "취소된 매출액",
                        value : "{Curam_c}"
                    }
					],
                    data : { path :  "/ES_MONTHSet",
                             filters : oFilter2
                    }
                });
                oViz2.setDataset(oDatasetStack);

				oViz2.setVizProperties({
                    title : { text : comboValue+" 년도별 매출액" },
					plotArea : {
                        colorPalette : d3.scale.category20().range(),
                        drawingEffect : "glossy"
                    }
                });

                let feedvalueAxis = new FeedItem({
                    uid : "valueAxis",
                    type : "Measure",
                    values : ["취소된 매출액", "매출액"]
                });
                let feedcategoryAxis = new FeedItem({
                    uid : "categoryAxis",
                    type : "Dimension",
                    values : ["월"]
                });
                oViz2.addFeed(feedvalueAxis);
                oViz2.addFeed(feedcategoryAxis);

			}

		});
	});
