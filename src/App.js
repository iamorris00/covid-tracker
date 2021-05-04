import './App.scss';
import {Card, CardContent, FormControl, MenuItem, Select} from "@material-ui/core";
import {useEffect, useState} from "react";
import InfoBox from "./InfoBox/InfoBox";
import Map from "./Map/Map";
import Table from "./Table/Table";
import LineGraph from "./LineGraph/LineGraph";
import {prettyPrintStat} from "./util";
import numeral from 'numeral';


function App() {
    const [countries, setCountries] = useState([])
    const [country, setCountry] = useState(['OWID_WRL']);
    const [countryInfo, setCountryInfo] = useState({})
    const [vacInfo, setVacInfo] = useState({})
    const [tableData, setTableData] = useState([])
    const [date, setDate] = useState('')
    const [mapCenter, setMapCenter] = useState([4.570868, -74.297333])
    const [mapZoom, setMapZoom] = useState(2)
    const [mapCountries, setMapCountries] =useState({})
    const [casesType, setCasesType] = useState('cases');

    // Runs a piece of code based on a given condition
    useEffect(() => {
        //The ode inside here will run once
        //When the component loads and not again
        const getCountriesData = async () => {
            await fetch('https://covid.ourworldindata.org/data/owid-covid-data.json')
                .then((res) => res.json())
                .then((data) => {
                    const countries = Object.keys(data).map((id) => ({
                        value: id,
                        name: data[id].location,

                    }))
                    setMapCountries(data)
                    setTableData(Object.values(data))
                    setCountries(countries);
                })

        };

        getCountriesData()

    }, [])

    useEffect( ()=>{
        const getWorldData = async () =>{
            await fetch('https://covid.ourworldindata.org/data/owid-covid-data.json')
                .then(res => res.json())
                .then(data => {
                    let lastDate = data['OWID_WRL'].data.length - 1
                    setCountryInfo(data['OWID_WRL'].data[lastDate])
                    setVacInfo(data['OWID_WRL'].data[lastDate])
                    setDate(data['OWID_WRL'].data[lastDate].date)
                })
        }
        getWorldData();
    }, [])


    const onCountryChange = async (event) => {
        const countryCode = event.target.value;
        setCountry(countryCode)

        await fetch('https://covid.ourworldindata.org/data/owid-covid-data.json')
            .then(res => res.json())
            .then(data => {
                let lastDate = data[countryCode].data.length - 1
                setCountryInfo(data[countryCode].data[lastDate])
                setVacInfo(data[countryCode].data[lastDate-1]) //Hacky fix for the API
                setDate(data[countryCode].data[lastDate].date)
            })

        await fetch(`https://disease.sh/v3/covid-19/countries/${countryCode}`)
            .then(res => res.json())
            .then(data => {
                if(data.countryInfo){
                    setMapCenter([data.countryInfo.lat, data.countryInfo.long])
                    setMapZoom(3)
                }else{
                    setMapCenter([4.570868, -74.297333])
                    setMapZoom(2)
                }
            })
    }

  return (
    <div className="app">
        <div className="app__left">
            <div className="app__header">
                <h1>Covid-19 Tracker</h1>
                <h1 style={{color:"whitesmoke"}}>{date}</h1>
                <FormControl className={'app__dropdown'}>
                    <Select
                        onChange={onCountryChange}
                        variant={'outlined'}
                        value={country}
                        className={'app__select'}
                        style={{width:'200px'}}
                    >
                        {/*Loop through all the countries and show a drop down
                    list of the options*/}
                        {countries.map(country => (
                            <MenuItem value={country.value}>{country.name}</MenuItem>
                        ))}

                    </Select>
                </FormControl>
            </div>

            <div className="app__stats">
                <InfoBox onClick={e => setCasesType('cases')}
                        title={'Coronavirus Cases'} cases={prettyPrintStat(countryInfo.new_cases)}
                         total={numeral(countryInfo.total_cases).format('000,000')} color={'yellow'}
                        active={casesType === 'cases'}/>
                <InfoBox onClick={e => setCasesType('deaths')}
                         title={'Deaths'} cases={prettyPrintStat(countryInfo.new_deaths)}
                         total={numeral(countryInfo.total_deaths).format('000,000')} color={'red'}
                         active={casesType === 'deaths'}/>
                <InfoBox onClick={e => setCasesType('vaccinated')}
                         title={'Vaccinated'} cases={prettyPrintStat(vacInfo.new_vaccinations)}
                         total={numeral(vacInfo.total_vaccinations).format('000,000')} color={'green'}
                         active={casesType === 'vaccinated'}/>
            </div>
            <Map
                casesType={casesType}
                countriesInfo={mapCountries}
                center={mapCenter}
                zoom={mapZoom}/>
        </div>

        <Card variant={'outlined'} className="app__right" style={{backgroundColor:'#424242'}}>
            <CardContent>
                <h2>New {casesType}</h2>
                <LineGraph countryCode={country} casesType={casesType}/>
                <h2>Live {casesType} by country</h2>
                <Table countries = {tableData} casesType={casesType}/>
            </CardContent>


        </Card>
    </div>
  );
}

export default App;
