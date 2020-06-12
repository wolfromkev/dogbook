import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Link from 'react-router-dom/Link';

export default ({
	children,
	onClick,
	toolTip,
	btnClassName,
	toolClassName,
	url,
	disableHoverListener,
}) => (
	<Tooltip
		disableHoverListener={disableHoverListener}
		title={toolTip}
		className={toolClassName}
		placement='top'
	>
		<IconButton
			onClick={onClick}
			className={btnClassName}
			component={Link}
			to={url}
		>
			{children}
		</IconButton>
	</Tooltip>
);
