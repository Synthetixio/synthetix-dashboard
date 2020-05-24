import _assign from 'lodash/assign';

// *
// * Colors
// *
const yellow200 = '#FFF59D';
const deepOrange600 = '#F4511E';
const lime300 = '#DCE775';
const lightGreen500 = '#8BC34A';
const teal700 = '#00796B';
const cyan900 = '#006064';
const colors = [deepOrange600, yellow200, lime300, lightGreen500, teal700, cyan900];
const blueGrey50 = '#ECEFF1';
const blueGrey300 = '#90A4AE';
const blueGrey700 = '#455A64';
const grey900 = '#212121';
const lightBlue = '#30A1D6';
const white = '#FFFFFF';
// *
// * Typography
// *
const sansSerif = "'Roboto', 'Helvetica Neue', Helvetica, sans-serif";
const letterSpacing = 'normal';
const fontSize = 12;
// *
// * Layout
// *
const padding = 8;
const baseProps = {
	width: 350,
	height: 350,
	padding: 50,
};
// *
// * Labels
// *
const baseLabelStyles = {
	fontFamily: sansSerif,
	fontSize: fontSize,
	letterSpacing: letterSpacing,
	padding: padding,
	fill: blueGrey700,
	stroke: 'transparent',
	strokeWidth: 0,
};

const centeredLabelStyles = _assign({ textAnchor: 'middle' }, baseLabelStyles);
// *
// * Strokes
// *
const strokeDasharray = '1, 4';
const strokeLinecap = 'round';
const strokeLinejoin = 'round';

export default {
	area: _assign(
		{
			style: {
				data: {
					fill: grey900,
				},
				labels: centeredLabelStyles,
			},
		},
		baseProps
	),
	axis: _assign(
		{
			style: {
				axis: {
					fill: 'transparent',
					stroke: blueGrey300,
					strokeWidth: 1,
					strokeLinecap: strokeLinecap,
					strokeLinejoin: strokeLinejoin,
				},
				axisLabel: _assign({}, centeredLabelStyles, {
					padding: padding,
					stroke: 'transparent',
				}),
				grid: {
					fill: 'none',
					stroke: 'rgba(255,255,255,0.20)',
					strokeDasharray: strokeDasharray,
					strokeLinecap: strokeLinecap,
					strokeLinejoin: strokeLinejoin,
					pointerEvents: 'painted',
				},
				ticks: {
					fill: 'transparent',
					size: 5,
					stroke: 'transparent',
					strokeWidth: 1,
					strokeLinecap: strokeLinecap,
					strokeLinejoin: strokeLinejoin,
				},
				tickLabels: _assign({}, baseLabelStyles, {
					fill: '#6f6e98',
					//fontSize: "7px"
				}),
			},
		},
		baseProps
	),
	bar: _assign(
		{
			style: {
				data: {
					fill: blueGrey700,
					padding: padding,
					strokeWidth: 0,
				},
				labels: baseLabelStyles,
			},
		},
		baseProps
	),
	boxplot: _assign(
		{
			style: {
				max: { padding: padding, stroke: blueGrey700, strokeWidth: 1 },
				maxLabels: baseLabelStyles,
				median: { padding: padding, stroke: blueGrey700, strokeWidth: 1 },
				medianLabels: baseLabelStyles,
				min: { padding: padding, stroke: blueGrey700, strokeWidth: 1 },
				minLabels: baseLabelStyles,
				q1: { padding: padding, fill: blueGrey700 },
				q1Labels: baseLabelStyles,
				q3: { padding: padding, fill: blueGrey700 },
				q3Labels: baseLabelStyles,
			},
			boxWidth: 20,
		},
		baseProps
	),
	candlestick: _assign(
		{
			style: {
				data: {
					stroke: blueGrey700,
				},
				labels: centeredLabelStyles,
			},
			candleColors: {
				positive: '#ffffff',
				negative: blueGrey700,
			},
		},
		baseProps
	),
	chart: baseProps,
	errorbar: _assign(
		{
			borderWidth: 8,
			style: {
				data: {
					fill: 'transparent',
					opacity: 1,
					stroke: blueGrey700,
					strokeWidth: 2,
				},
				labels: centeredLabelStyles,
			},
		},
		baseProps
	),
	group: _assign(
		{
			colorScale: colors,
		},
		baseProps
	),
	legend: {
		colorScale: colors,
		gutter: 10,
		orientation: 'vertical',
		titleOrientation: 'top',
		style: {
			data: {
				type: 'circle',
			},
			labels: baseLabelStyles,
			title: _assign({}, baseLabelStyles, { padding: 5 }),
		},
	},
	line: _assign(
		{
			style: {
				data: {
					fill: 'transparent',
					opacity: 1,
					stroke: lightBlue,
					strokeWidth: 1,
				},
				labels: centeredLabelStyles,
			},
		},
		baseProps
	),
	pie: _assign(
		{
			colorScale: colors,
			style: {
				data: {
					padding: padding,
					stroke: blueGrey50,
					strokeWidth: 1,
				},
				labels: _assign({}, baseLabelStyles, { padding: 20 }),
			},
		},
		baseProps
	),
	scatter: _assign(
		{
			style: {
				data: {
					fill: white,
					opacity: 1,
					stroke: 'rgba(255,255,255,0.40)', //"rgba(48,161,214,0.40)",
					strokeWidth: 11,
				},
				labels: centeredLabelStyles,
			},
		},
		baseProps
	),
	stack: _assign(
		{
			colorScale: colors,
		},
		baseProps
	),
	tooltip: {
		style: _assign({}, centeredLabelStyles, {
			padding: 5,
			pointerEvents: 'none',
		}),
		flyoutStyle: {
			stroke: grey900,
			strokeWidth: 1,
			fill: '#f0f0f0',
			pointerEvents: 'none',
		},
		cornerRadius: 5,
		pointerLength: 10,
	},
	voronoi: _assign(
		{
			style: {
				data: {
					fill: 'transparent',
					stroke: 'transparent',
					strokeWidth: 0,
				},
				labels: _assign({}, centeredLabelStyles, {
					padding: 5,
					pointerEvents: 'none',
				}),
				flyout: {
					stroke: grey900,
					strokeWidth: 1,
					fill: '#f0f0f0',
					pointerEvents: 'none',
				},
			},
		},
		baseProps
	),
};
