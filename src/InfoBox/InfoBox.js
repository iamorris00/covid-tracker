import React from 'react';
import {Card, CardContent, Typography} from "@material-ui/core";
import './infobox.scss'

const InfoBox = ({title, cases, total, active, color, ...props}) => {
    return (
        <Card
            onClick={props.onClick}
            className={`infoBox ${active && 'infoBox__selected'}`} style={ {backgroundColor: '#424242'} + active ? {borderColor:color} :{borderColor:'none'}}
        >
            <CardContent>
            {/*    Title*/}
            <Typography className={'infoBox__title'} color={"textSecondary"}>
                {title}
            </Typography>
            {/*    +1000 X Nm Cases*/}
            <h2 className={'infoBox__cases'}>{cases}</h2>
            {/*    1.2M Total*/}
            <Typography className={'infoBox__total'} color={'textSecondary'}>
                {total} Total
            </Typography>
            </CardContent>

        </Card>
    );
};

export default InfoBox;