import React, { Fragment } from 'react';
import defaultDog from '../images/defaultDog.png';
import ProptTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
	card: {
		display: 'flex',
		margin: '0 2rem 2rem 0',
		position: 'relative',
		backgroundColor: 'rgb(28, 30, 31)',
	},
	cardContent: {
		width: '100%',
		flexDirection: 'column',
		padding: 25,
	},
	cover: {
		minWidth: 200,
		objectFit: 'cover',
	},
	handle: {
		width: 60,
		height: 18,
		marginBottom: 7,
	},
	date: {
		height: 14,
		width: 100,
		backgroundColor: 'rgba(0,0,0, 0.3)',
		marginBottom: 10,
	},
	fullLine: {
		height: 15,
		width: '90%',
		backgroundColor: 'rgba(0,0,0, 0.6)',
		marginBottom: 10,
	},
	halfLine: {
		height: 15,
		width: '50%',
		backgroundColor: 'rgba(0,0,0, 0.6)',
		marginBottom: 10,
	},
};

const BarkSkeleton = (props) => {
	const { classes } = props;

	const content = Array.from({ length: 5 }).map((item, index) => (
		<Card className={classes.card} key={index}>
			<CardMedia className={classes.cover} image={defaultDog}></CardMedia>
			<CardContent className={classes.CardContent}>
				<div className={classes.handle}></div>
				<div className={classes.date}></div>
				<div className={classes.fullLine}></div>
				<div className={classes.fullLine}></div>
				<div className={classes.halfLine}></div>
			</CardContent>
		</Card>
	));

	return <Fragment>{content}</Fragment>;
};

BarkSkeleton.prototypes = {
	classes: ProptTypes.object.isRequired,
};

export default withStyles(styles)(BarkSkeleton);
