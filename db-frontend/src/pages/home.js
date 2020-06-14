import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Bark from '../components/bark/Bark';
import Profile from '../components/profile/Profile';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBarks } from '../redux/actions/dataActions';
import BarkSkeleton from '../utility/BarkSkeleton';

import Switch from '@material-ui/core/Switch';

class Home extends Component {
	state = {
		feedType: true,
	};

	componentDidMount() {
		this.props.getBarks();
	}

	handleSwitch = () => {
		if (this.state.feedType === true) {
			this.setState({
				feedType: false,
			});
		}

		if (this.state.feedType === false) {
			this.setState({
				feedType: true,
			});
		}
	};

	render() {
		const { following } = this.props.user;
		const { barks, loading } = this.props.data;

		let barkMarkup = loading ? (
			<BarkSkeleton />
		) : this.state.feedType ? (
			barks.map((bark) => <Bark key={bark.barkId} bark={bark} />)
		) : (
			barks.map((bark) => {
				if (following.includes(bark.userHandle))
					return <Bark key={bark.barkId} bark={bark} />;
			})
		);

		let switchToggle = loading ? null : (
			<Fragment>
				<span> All Barks</span>
				<Switch
					onChange={this.handleSwitch}
					name='checkedA'
					inputProps={{ 'aria-label': 'secondary checkbox' }}
				/>
				<span> Following</span>
			</Fragment>
		);

		return (
			<Fragment>
				{switchToggle}
				<Grid container>
					<Grid item sm={8} xs={12}>
						{barkMarkup}
					</Grid>
					<Grid item sm={4} xs={12}>
						<Profile></Profile>
					</Grid>
				</Grid>
			</Fragment>
		);
	}
}

Home.propTypes = {
	getBarks: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	data: state.data,
	user: state.user.credentials,
});

export default connect(mapStateToProps, { getBarks })(Home);
