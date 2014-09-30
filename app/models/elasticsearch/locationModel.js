exports.getLocationsTree = function() {
	qryObj = {
		"size": 0,
		"_source": false,
		"query": {
			"filtered": {
				"filter": {
					"and": [
						{
							"exists": {
								"field": "cell_id"
							}
						},
						{
							"term": {
								"geospatial_issue": 0
							}
						}
					]
				}
			}
		},
		"aggs": {
			"biggest_countries": {
				"terms": {
					"field": "country_name.exactWords",
					"size": 100
				},
				"aggs": {
					"biggest_department_name": {
						"terms": {
							"field": "department_name.exactWords",
							"size": 100,
							"order": {
								"_term": "asc"
							}
						},
						"aggs": {
							"biggest_county_name": {
								"terms": {
									"field": "county_name.exactWords",
									"size": 100,
									"order": {
										"_term": "asc"
									}
								}
							}
						}
					}
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.getLocationsParamosTree = function() {
	qryObj = {
		"size": 0,
		"_source": false,
		"query": {
			"filtered": {
				"filter": {
					"and": [
						{
							"exists": {
								"field": "cell_id"
							}
						},
						{
							"term": {
								"geospatial_issue": 0
							}
						}
					]
				}
			}
		},
		"aggs": {
			"biggest_countries": {
				"terms": {
					"field": "country_name.exactWords",
					"size": 100
				},
				"aggs": {
					"biggest_paramos": {
						"terms": {
							"field": "paramo_name.exactWords",
							"size": 10
						}
					}
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.getGeneralLocationData = function() {
	qryObj = {
		"size": 0,
		"_source": false,
		"query": {
			"filtered": {
				"filter": {
					"and": [
						{
							"exists": {
								"field": "cell_id"
							}
						},
						{
							"term": {
								"geospatial_issue": 0
							}
						}
					]
				}
			}
		},
		"aggs": {
			"country_count": {
				"cardinality": {
					"field": "country_name.untouched"
				}
			},
			"department_count": {
				"cardinality": {
					"field": "department_name.untouched"
				}
			},
			"counties_count": {
				"cardinality": {
					"field": "county_name.untouched"
				}
			},
			"localities_count": {
				"cardinality": {
					"field": "locality.untouched"
				}
			},
			"paramos_count": {
				"cardinality": {
					"field": "paramo_name.untouched"
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.getSimilarLocationDataWithoutShingles = function(locationName) {
	qryObj = {
		"size": 0,
		"_source": [
			"department_name",
			"paramo_name",
			"county_name",
			"country_name",
			"locality"
		],
		"query": {
			"filtered": {
				"query": {
					"query_string": {
						"query": locationName,
						"fields": [
							"country_name.spanish",
							"department_name.spanish",
							"county_name.spanish",
							"locality.spanish",
							"paramo_name.spanish"
						],
						"use_dis_max": true,
						"default_operator": "AND"
					}
				},
				"filter": {
					"and": [
						{
							"exists": {
								"field": "cell_id"
							}
						},
						{
							"term": {
								"geospatial_issue": 0
							}
						}
					]
				}
			}
		},
		"aggs": {
			"biggest_countries": {
				"terms": {
					"field": "country_name.exactWords",
					"size": 10
				},
				"aggs": {
					"top_country_hits": {
						"top_hits": {
							"sort": [
								{
									"country_name.untouched": {
										"order": "asc"
									}
								}
							],
							"_source": {
								"include": [
									"country_name",
									"department_name",
									"county_name",
									"locality",
									"paramo_name",
									"location"
								]
							},
							"highlight": {
								"fields": {
									"country_name.spanish": {},
									"department_name.spanish": {},
									"county_name.spanish": {},
									"locality.spanish": {},
									"paramo_name.spanish": {}
								}
							},
							"size": 15
						}
					}
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.getSimilarLocationDataWithShingles = function(locationName) {
	qryObj = {
		"size": 0,
		"_source": [
			"department_name",
			"paramo_name",
			"county_name",
			"country_name",
			"locality"
		],
		"query": {
			"filtered": {
				"query": {
					"bool": {
						"must": {
							"query_string": {
								"query": locationName,
								"fields": [
									"country_name.spanish",
									"department_name.spanish",
									"county_name.spanish",
									"locality.spanish",
									"paramo_name.spanish"
								],
								"use_dis_max": true,
								"default_operator": "AND"
							}
						},
						"should": {
							"multi_match": {
								"query": locationName,
								"type": "most_fields",
								"operator": "and",
								"boost": 3,
								"fields": [
									"country_name.shingles",
									"department_name.shingles",
									"county_name.shingles",
									"locality.shingles",
									"paramo_name.shingles"
								]
							}
						}
					}
				},
				"filter": {
					"and": [
						{
							"exists": {
								"field": "cell_id"
							}
						},
						{
							"term": {
								"geospatial_issue": 0
							}
						}
					]
				}
			}
		},
		"aggs": {
			"biggest_countries": {
				"terms": {
					"field": "country_name.exactWords",
					"size": 10
				},
				"aggs": {
					"top_country_hits": {
						"top_hits": {
							"_source": {
								"include": [
									"country_name",
									"department_name",
									"county_name",
									"locality",
									"paramo_name",
									"location"
								]
							},
							"highlight": {
								"fields": {
									"country_name.spanish": {},
									"department_name.spanish": {},
									"county_name.spanish": {},
									"locality.spanish": {},
									"paramo_name.spanish": {}
								}
							},
							"size": 15
						}
					}
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.getSimilarLocationDataByCoordinates = function(latitude, longitude) {
	qryObj = {
		"size": 0,
		"_source": [
			"department_name",
			"paramo_name",
			"county_name",
			"country_name",
			"locality"
		],
		"query": {
			"filtered": {
				"query": {
					"match_all": {}
				},
				"filter": {
					"and": [
						{
							"exists": {
								"field": "cell_id"
							}
						},
						{
							"term": {
								"geospatial_issue": 0
							}
						},
						{
							"geo_distance": {
								"distance": "10km",
								"location": {
									"lat": latitude,
									"lon": longitude
								}
							}
						}
					]
				}
			}
		},
		"aggs": {
			"biggest_countries": {
				"terms": {
					"field": "country_name.exactWords",
					"size": 10
				},
				"aggs": {
					"top_country_hits": {
						"top_hits": {
							"sort": [
								{
									"country_name.untouched": {
										"order": "asc"
									}
								}
							],
							"_source": {
								"include": [
									"country_name",
									"department_name",
									"county_name",
									"locality",
									"paramo_name",
									"location"
								]
							},
							"highlight": {
								"fields": {
									"country_name.spanish": {},
									"department_name.spanish": {},
									"county_name.spanish": {},
									"locality.spanish": {},
									"paramo_name.spanish": {}
								}
							},
							"size": 15
						}
					}
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};

exports.getAllOccurrences = function(locationName) {
	console.log(locationName);
	qryObj = {
		"size": 10000,
		"_source": [
			"location",
			"department_name",
			"paramo_name",
			"county_name",
			"country_name",
			"locality"
		],
		"query": {
			"filtered": {
				"query": {
					"query_string": {
						"query": locationName.toString(),
						"fields": [
							"country_name.spanish^15",
							"department_name.spanish^10",
							"county_name.spanish^2",
							"locality.spanish",
							"paramo_name.spanish"
						],
						"use_dis_max": true,
						"default_operator": "AND"
					}
				},
				"filter": {
					"and": [
						{
							"exists": {
								"field": "cell_id"
							}
						},
						{
							"term": {
								"geospatial_issue": 0
							}
						}
					]
				}
			}
		},
		"highlight": {
			"fields": {
				"country_name.spanish": {},
				"department_name.spanish": {},
				"county_name.spanish": {},
				"locality.spanish": {},
				"paramo_name.spanish": {}
			}
		},
		"aggs": {
			"country_count": {
				"cardinality": {
					"field": "country_name.untouched"
				}
			},
			"department_count": {
				"cardinality": {
					"field": "department_name.untouched"
				}
			},
			"counties_count": {
				"cardinality": {
					"field": "county_name.untouched"
				}
			},
			"localities_count": {
				"cardinality": {
					"field": "locality.untouched"
				}
			},
			"paramos_count": {
				"cardinality": {
					"field": "paramo_name.untouched"
				}
			}
		}
	};

	mySearchCall = elasticSearchClient.search('sibexplorer', 'occurrences', qryObj);
	return mySearchCall;
};