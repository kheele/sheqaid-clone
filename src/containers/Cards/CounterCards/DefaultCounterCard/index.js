/* */

// <editor-fold desc="imports">
// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// react-countup component
import CountUp from "react-countup";

// Material Kit 2 React components
import MKBox from "components/MK/MKBox";
import MKTypography from "components/MK/MKTypography";
import {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";

// </editor-fold>

function DefaultCounterCard(
    {
        sx = {},
        size,
        fontSize,
        countUpClass,
        color,
        background,
        count,
        radius,
        value,
        label,
        title,
        id,
        placeTitleOnTop,
        desc,
        onClick,
        ...rest
    }
) {
    const children = [
        <MKTypography
            variant="h1"
            color={color || "light"}
            textGradient
            className={value ? "w-full h-40 no-border-radius" : "w-40 h-40 circled"}
            sx={{
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: fontSize || '2.0em !important',
                fontWeight: 'normal !important',
            }}
        >
            {value && <span className="no-text-fill-color-white">{value}</span>}
            {!value && <Loader count={count} countUpClass={countUpClass} {...rest}/>}
        </MKTypography>,
        title && (
            <MKTypography variant="h5" mt={2} mb={1}>
                {title}
            </MKTypography>
        )
    ];

    const onClickImpl = (evt) => {
        onClick && onClick(id);
    };

    return (
        <MKBox
            p={2}
            textAlign="center"
            lineHeight={1}
            onClick={onClickImpl}
            sx={{
                width: `${size}px`,
                height: `${size}px`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                margin: 0,
                background,
                borderRadius: radius || '50%',
                cursor: 'pointer',
                ...sx,
            }}
        >
            {placeTitleOnTop ? children.reverse() : children}
            {desc && (
                <MKTypography variant="body2" color="text">
                    {desc}
                </MKTypography>
            )}
        </MKBox>
    );
}

function Loader({count, countUpClass, ...rest}) {
    const [end, setEnd] = useState(-1);
    useEffect(() => {
        (async () => {
            if (count instanceof Promise) {
                count = await count;
            }
            setEnd(count);
        })();
    }, [count]);

    if (end === -1) {
        return <CircularProgress size='1em'/>;
    }

    return (
        <CountUp
            end={end}
            duration={2}
            className={`${countUpClass} no-text-fill-color-white`}
            {...rest}
            sx={{fontWeight: 'normal !important',}}
        />
    );
}

// Setting default props for the DefaultCounterCard
DefaultCounterCard.defaultProps = {
    color: "info",
    background: "white",
    radius: "50%",
    desc: "",
    title: "",
};

// Typechecking props for the DefaultCounterCard
DefaultCounterCard.propTypes = {
    color: PropTypes.oneOf([
        "white",
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "light",
        "dark",
    ]),
    background: PropTypes.string,
    radius: PropTypes.string,
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Promise)]).isRequired,
    title: PropTypes.string,
    desc: PropTypes.string,
};

export default DefaultCounterCard;
