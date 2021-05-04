import React, {useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2'
import numeral from 'numeral'
import './linegraph.scss'



const options = {
    plugins:{
        legend: {
            display: false,
        },
    },
    elements:{
        points:{
            radius:0,
        },
    },
    maintainAspectRatio: false,
    tooltips:{
        mode: 'index',
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format('+0,0');
            },
        },
    },
    scales:{
        xAxes: [
            {
                type:'time',
                time: {
                    format: 'DD/MM/YY',
                    tooltipFormat: 'll',
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display:false,
                },
                ticks:{
                    callback: function (value, index, values) {
                        return numeral(value).format('0a')
                    },
                },
            },
        ],
    }
}

const LineGraph = ({countryCode, casesType}) => {
    const [data, setData] = useState({})



    useEffect(() =>{
        const casesTypeToData = {
            'cases':'new_cases',
            'deaths':'new_deaths',
            'vaccinated':'new_vaccinations'
        }

        const casesTypeToColor = {
            'cases':'rgba(255,255,0,0.8)',
            'deaths':'rgba(255,0,0,0.8)',
            'vaccinated':'rgba(0,255,0,0.8)'
        }

        const casesTypeToBgColor = {
            'cases':'rgba(255,255,0,0.2)',
            'deaths':'rgba(255,0,0,0.2)',
            'vaccinated':'rgba(0,255,0,0.2)'
        }
        const fetchData = async () => {
            await fetch('https://covid.ourworldindata.org/data/owid-covid-data.json')
                .then(res => res.json())
                .then(data => {
                    const dataset = data[countryCode].data.map((data) =>({
                            label: data.date,
                            data: data[casesTypeToData[casesType]],
                        })
                    )
                    const dataToSet = {
                        labels: dataset.map(data => data.label),
                        datasets: [
                            {
                                data: dataset.map(data => data.data),
                                fill: true,
                                backgroundColor: casesTypeToBgColor[casesType],
                                borderColor:casesTypeToColor[casesType],
                                borderWidth:1,
                                pointRadius: 0,
                                pointHoverBackgroundColor:'white',

                            }
                        ]
                    }
                    setData(dataToSet)
                })
        }
        fetchData();
    }, [countryCode, casesType])
    return (
        <div>
            <Line className={'lineGraph'}
                options={options}
                data={data}/>
        </div>
    );
};

export default LineGraph;