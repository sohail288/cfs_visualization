OGR=ogr2ogr
TOPO=topojson
DEST=cfs/static/assets/geo
state_lines_url="http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/cultural/ne_110m_admin_1_states_provinces.zip"

###########################################
# Shapefiles
#############################################
state_base=ne_110m_admin_1_states_provinces
state_file=$(patsubst %, %.zip, $(state_base))
state_shp=$(subst zip,shp, $(state_file))


places_url="http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/cultural/ne_110m_populated_places.zip"

place_base=ne_110m_populated_places
place_file=$(patsubst %, %.zip, $(place_base))
place_shp=$(subst zip,shp, $(place_file))  


subunits_base=ne_10m_admin_0_map_subunits
subunits_url="http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_0_map_subunits.zip"
subunits_file=$(patsubst %, %.zip, $(subunits_base))
subunits_shp=$(subst zip,shp, $(subunits_file))

############################################
############################################

####################
# AWS DEPLOY SETTINGS
####################
EC2_AMI=ami-d5ea86b5
KEY_PAIR_NAME="cfs-key"







usa.json: clean cfs/static/assets/geo/$(state_base).json cfs/static/assets/geo/$(subunits_base).json
	rm -f $(DEST)/usa.json
	$(TOPO) -o $(DEST)/usa.json --id-property SU_A3 --properties name=NAME \
														-p state-name=name  \
														-p postal=postal \
														-- \
														$(DEST)/subunits.json \
														$(DEST)/states.json
	

debugify:
	@echo /$(subunits_shp)
	@echo $(DEST)/$(subunits_base).shp

cfs/static/assets/geo/$(state_base).json:
	wget $(state_lines_url)
	unzip $(state_file) 
	rm $(DEST)/states.json
	$(OGR) -f GeoJSON $(DEST)/states.json $(state_base).shp

	

cfs/static/assets/geo/$(place_base).json:
	wget $(places_url)
	unzip $(place_file)
	$(OGR) -f GeoJSON -where "ISO_A2 = 'US' AND CAPITOL = 1" places.json \
			ne_10m_populated_places.shp 

cfs/static/assets/geo/$(subunits_base).json: 
	wget $(subunits_url)
	unzip $(subunits_file)
	rm $(DEST)/subunits.json
	$(OGR) -f GeoJSON -where "ADM0_A3 IN ('USA')" $(DEST)/subunits.json \
			$(subunits_base).shp

deploy:
	@echo Deploying app
	@echo EC2: $(EC2_AMI)
	



clean:
	rm -f $(wildcard $(state_base).*)
	rm -f $(wildcard $(place_base).*)
	rm -f $(wildcard $(subunits_base).*)

