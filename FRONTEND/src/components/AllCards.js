import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import image from '../images/smaragd.jpg';

export default function AllCards(props) {

    return (
        <Card sx={{ display: "inline-block", minWidth: "200px" }}>
            <CardMedia
                component="img"
                src={image}
                alt="GreenSmaragd"
            />
            <CardContent>
                <Typography sx={{ fontSize: 20 }} gutterBottom variant="h5" component="div">
                    {props.gem.title}
                </Typography>
                <Typography sx={{ fontSize: 10 }} variant="body2" color="text.secondary">
                    {props.gem.origin}
                </Typography>
                <br></br>
                <Typography
                    sx={{ fontSize: 13, margin: "10px", letterSpacing: "1px" }}
                    variant="body2"
                    color={props.gem.reserved ? "grey" : "blue"}
                >
                    {props.gem.reserved ? "RESERVED" : "AVAILABLE"}
                </Typography>
            </CardContent>
        </Card >
    );
}