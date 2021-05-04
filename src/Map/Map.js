import React, {useEffect} from "react";
import { useState } from 'react';
import ReactMapGL, {NavigationControl, Layer, Source} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './map.css'




function Map({center, zoom, countriesInfo, casesType}) {

        //Trying to set the popups FAILED
    // const mapRef = useRef(null)
    //
    // const cursorOverPopups = () =>{
    //     const map = mapRef.current.getMap()
    //
    //     map.on('mouseenter','covid_layer', ()=>{
    //         console.log('mouseon')
    //     })
    // }
    //
    // useEffect(()=>{
    //     cursorOverPopups()
    // },[])

    const navControlStyle = {
        left: 10,
        top: 20
    };

    const [viewport, setViewport] = useState({
        height: '480px',
        width: '100%',
        latitude: center[0],
        longitude: center[1],
        zoom: zoom
    });
    const [countriesLocation, setCountriesLocation] = useState([])

    useEffect( () =>{
        const changeViewport = () =>{
            setViewport({
                height: '470px',
                width: '100%',
                latitude: center[0],
                longitude: center[1],
                zoom: zoom
            })
        }
        changeViewport()
    }, [center, zoom])

    useEffect(() =>{
        const getCountriesLocations = async () =>{
            await fetch('https://disease.sh/v3/covid-19/countries')
                .then(res => res.json())
                .then(dataset => {
                    const datasetLocation = dataset.map((country) => ({
                        display:false,
                        id: country.countryInfo.iso3,
                        name:country.country,
                        img:country.countryInfo.flag,
                        lat:country.countryInfo.lat,
                        long:country.countryInfo.long,
                        cases:countriesInfo[country.countryInfo.iso3] ? countriesInfo[country.countryInfo.iso3]
                            .data[countriesInfo[country.countryInfo.iso3].data.length-1].new_cases:0,
                        deaths: countriesInfo[country.countryInfo.iso3] ? countriesInfo[country.countryInfo.iso3]
                            .data[countriesInfo[country.countryInfo.iso3].data.length-1].new_deaths:0,
                        vaccinated: countriesInfo[country.countryInfo.iso3] ? countriesInfo[country.countryInfo.iso3]
                            .data[countriesInfo[country.countryInfo.iso3].data.length-2].new_vaccinations:0,
                    }))
                    setCountriesLocation(datasetLocation)
            })
        }
        getCountriesLocations()
    },[countriesInfo])

    const geojson = {
        type: 'FeatureCollection',
        features: countriesLocation.map(country =>({
            type: 'Feature',
            properties:{
                id:country.id,
                cases:country.cases/200,
                deaths:country.deaths,
                vaccinated:country.vaccinated,
            },
            geometry: {
                type: 'Point',
                coordinates: [country.long, country.lat,0] //Coordinates: LONG, LAT
            },
        }))
}
    const colorCircles = {
        'cases':'yellow',
        'deaths':'red',
        'vaccinated':'green',
    }
    const layerStyle = {
        id: 'covid_layer',
        type: 'circle',
        paint: {
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['get', casesType],
                2,2.5,3,3.5,4,8,10,24,30,40
            ], //MAX CIRCLE RADIUS
            'circle-color': colorCircles[casesType],
            'circle-opacity':0.2,
            'circle-stroke-color':colorCircles[casesType],
            'circle-stroke-width':1,
        }
    };
    return (
        <ReactMapGL
            // ref={mapRef}
            className={'map'}
            mapStyle={'mapbox://styles/iamorris/cko34117a2hg218moiod9jgdt'}
            {...viewport}
            mapboxApiAccessToken={'pk.eyJ1IjoiaWFtb3JyaXMiLCJhIjoiY2tvMjN0emx4MDUwcDMxcGRmaDFydGVzZSJ9.L2vaoM3kH8k0filJ-WJFNg'}
            onViewportChange={nextViewport => setViewport(nextViewport)}
        >
            <NavigationControl style={navControlStyle} />
        {/*    Loop through drawing circles*/}
            <Source id="my-data" type="geojson" data={geojson}>
                <Layer {...layerStyle}/>
            </Source>
            {/*{countriesLocation.map(country => (*/}
            {/*     <Popup longitude={country.long} latitude={country.lat}*/}
            {/*           closeButton={true} closeOnClick={true} anchor="top"*/}
            {/*           className={'popup'} >*/}
            {/*        <div>*/}
            {/*            <img src={country.img} alt={country.name}/>*/}
            {/*            <div>{country.name}</div>*/}
            {/*            <div>Deaths: {country.deaths}</div>*/}
            {/*            <div>Cases: {country.cases}</div>*/}
            {/*            <div>Vacc: {country.vaccinated}</div>*/}
            {/*        </div>*/}
            {/*    </Popup>*/}
            {/*))}*/}
        </ReactMapGL>
    );
}

export default Map;