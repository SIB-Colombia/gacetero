define(["jquery", "underscore", "knockout", "templates/tree.js", "jstree"], function($, _, ko, treeTemplate) {
//define(["knockout", "text!./sopas.html"], function(ko, treeTemplate) {

	function TreeViewModel(params) {
		var capitaliseFirstLetter = function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		};

		var self = this;
		self.searchCondition = ko.observable("").syncWith("searchCondition");

		$.getJSON("/api/location/locationtree", function(allData) {
			var initialData = {
				nodes: []
			};
			var countCountries = 0;
			var countDepartments = 0;
			var countCounties = 0;
			if(allData.aggregations.biggest_countries.buckets.length > 0) {
				_.each(allData.aggregations.biggest_countries.buckets, function(dataCountry) {
					initialData["nodes"][countCountries] = {
						text: capitaliseFirstLetter(dataCountry.key),
						id: 'país: '+capitaliseFirstLetter(dataCountry.key),
						icon: 'fa fa-flag',
						state: {
							opened: (dataCountry.key == 'colombia')?true:false,
							selected: false
						},
						children: []
					};
					if(dataCountry.biggest_department_name.buckets.length > 0) {
						initialData["nodes"][countCountries]["children"][0] = {
							text: 'Páramos',
							icon: 'fa fa-map-marker',
							state: {
								opened: false,
								selected: false
							},
							children: []
						};
						initialData["nodes"][countCountries]["children"][1] = {
							text: 'Departamentos',
							icon: 'fa fa-map-marker',
							state: {
								opened: false,
								selected: false
							},
							children: []
						};
						_.each(dataCountry.biggest_department_name.buckets, function(dataDepartment) {
							initialData["nodes"][countCountries]["children"][1]["children"][countDepartments] = {
								text: capitaliseFirstLetter(dataDepartment.key),
								id: 'país: '+capitaliseFirstLetter(dataCountry.key)+' y departamento: '+capitaliseFirstLetter(dataDepartment.key),
								icon: 'fa fa-map-marker',
								state: {
									opened: false,
									selected: false
								},
								children: []
							};
							if(dataDepartment.biggest_county_name.buckets.length > 0) {
								_.each(dataDepartment.biggest_county_name.buckets, function(dataCounty) {
									initialData["nodes"][countCountries]["children"][1]["children"][countDepartments]["children"][countCounties] = {
										text: capitaliseFirstLetter(dataCounty.key),
										id: 'país: '+capitaliseFirstLetter(dataCountry.key)+' y departamento: '+capitaliseFirstLetter(dataDepartment.key)+' y municipio: '+capitaliseFirstLetter(dataCounty.key),
										icon: 'fa fa-map-marker',
										state: {
											opened: false,
											selected: false
										},
										children: []
									};
									countCounties += 1;
								});
							}
							countCounties = 0;
							countDepartments += 1;
						});
					}
					countDepartments = 0;
					countCountries += 1;
				});
				countCountries = 0;
				countParamos = 0;
				$.getJSON("/api/location/locationparamotree", function(allData) {
					if(allData.aggregations.biggest_countries.buckets.length > 0) {
						_.each(allData.aggregations.biggest_countries.buckets, function(dataCountry) {
							if(dataCountry.biggest_paramos.buckets.length > 0) {
								_.each(dataCountry.biggest_paramos.buckets, function(dataParamos) {
									initialData["nodes"][countCountries]["children"][0]["children"][countParamos] = {
										text: capitaliseFirstLetter(dataParamos.key),
										id: 'país: '+capitaliseFirstLetter(dataCountry.key)+' y páramo: '+capitaliseFirstLetter(dataParamos.key),
										icon: 'fa fa-map-marker',
										state: {
											opened: false,
											selected: false
										},
										children: []
									};
									countParamos += 1;
								});
							}
							countParamos = 0;
							countCountries += 1;
						});
						$('#jstree_container').jstree({
							'core': {
								"multiple" : false,
								'data': initialData.nodes,
								//"themes": {
								//	"variant" : "small"
								//}
							}
						});
						$('#jstree_container')
							// listen for event
							.on('changed.jstree', function (e, data) {
								if(/^país/.test(data.selected[0]) || /^departamento/.test(data.selected[0]) || /^municipio/.test(data.selected[0])) {
									self.searchCondition = ko.observable(data.selected[0]).syncWith("searchCondition");
									$("#startSearch").click();
								}
							});
					}
				});
			}
		});
		self.message = ko.observable('Welcome to Sitio de prueba!');
	}

	TreeViewModel.prototype.doSomething = function() {
		this.message('You invoked doSomething() on the viewmodel.');
	};
	return { viewModel: TreeViewModel, template: treeTemplate({}) };
});