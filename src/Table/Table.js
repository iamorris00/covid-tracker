import React from 'react';
import './table.scss';
import numeral from 'numeral';


const Table = ({countries, casesType}) => {
    const data = countries.map(country =>({
        name: country.location,
        cases: country.data[country.data.length-1].new_cases ? country.data[country.data.length-1].new_cases : 0,
        deaths: country.data[country.data.length-1].new_deaths ? country.data[country.data.length-1].new_deaths : 0,
        vaccinated: country.data[country.data.length-1].new_vaccinations ? country.data[country.data.length-1].new_vaccinations : 0,

    }))


    const sortedData = data.sort((a,b) => (parseFloat(b[casesType]) - parseFloat(a[casesType])))
    return (
        <div className={'table'}>
            {sortedData.map(country => (
                <tr>
                    <td >{country.name}</td>
                    <td ><strong>{numeral(country[casesType]).format('000,000')}</strong></td>
                </tr>
            ))}
        </div>
    );
};

export default Table;