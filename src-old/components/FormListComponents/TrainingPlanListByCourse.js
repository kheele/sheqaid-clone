import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import {CircularProgress, ListSubheader} from "@mui/material";
import {forwardRef, useEffect, useImperativeHandle} from "react";
import Card from "@mui/material/Card";
import WebWorker from "../../web-worker/WebWorker";
import {toJS} from "mobx";

function ItemRow(
    {
        item,
        readonly,
        selected,
        onSelect,
    }
) {
    const handleSelect = () => {
        onSelect(item);
    };

    const disabled = readonly || parseInt(item.group) > new Date().getFullYear();
    const labelId = `checkbox-list-secondary-label-${item.group}`;
    return <ListItem
        key={item.group}
        secondaryAction={<Checkbox
            edge="end"
            onChange={!readonly && handleSelect}
            disabled={disabled}
            checked={selected.contains(item.group)}
            inputProps={{'aria-labelledby': labelId}}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 25 } }}
        />}
        disabled={disabled}
        sx={{
            '& .MuiListItemSecondaryAction-root': {right: '10px',},
            '& .MuiListItem-root': {padding: '10px 0', borderBottom: '1px solid #ddd'},
        }}
        disablePadding
    >
        <ListItemText
            primary={item.group}
            sx={{
                '& .MuiTypography-root': {
                    fontSize: '13px', margin: '0 10px', padding: '10px 0', borderBottom:'1px solid #ddd',
                }
            }}
        />
    </ListItem>;
}

const Comp = forwardRef((props , ref) => {
    const {name, defaultValue, readonly, onChange} = props;
    const [selected, setSelected] = React.useState([]);
    const [items, setItems] = React.useState([]);
    const [value, setValue] = React.useState(null);

    // <editor-fold desc="useImperativeHandle funs">
    useImperativeHandle(ref, () => ({
        setValue: (value) => {
            setValue(value);
        },
    }));
    // </editor-fold>

    useEffect(() => {
        (async () => {
            if(!value) return;

            console.log('TrainingPlanListByCourse: value', value)

            const {id, data: {all_training_plan_list, training_plan_list,}} = value;
            const worker = new WebWorker(() => {
                Events.on("process", async (db, list) => {
                    const groups = list.groupBy(({data: {year}}) => year);
                    return Object.keys(groups).map(key => {
                        const list = groups[key];
                        const group = key;

                        const cost = list.map(({data: {cost}}) => cost || 0).reduce((a, b) => a + b, 0);
                        const attendanceRate = list.map(({data: {cost}}) => cost || 0).reduce((a, b) => a + b, 0);
                        const results = list.map(({data: {results}}) => results || 'N/A');
                        const status = list.map(({data: {status}}) => status);

                        const employeeList = list.filter(({data: {employee}}) => !!employee).map(({data: {employee}}) => employee).distinct(({id}) => id);
                        const jobPositionList = list.filter(({data: {job_position}}) => !!job_position).map(({data: {job_position}}) => job_position).distinct(({id}) => id);
                        const courseList = list.map(({data: {course_or_module}}) => course_or_module).distinct(({id}) => id);

                        return {
                            group,
                            list,
                            cost,
                            attendanceRate,
                            results,
                            status,
                            employeeList,
                            jobPositionList,
                            courseList
                        };
                    });
                });
            });
            const list = await worker.emit("process", toJS(all_training_plan_list || training_plan_list));
            worker.terminate();

            setItems(list);

            const __defaultValue = list.find(({group}) => {
                const year = parseInt(group, 10);
                let otherYear;
                if(defaultValue) {
                    if(isString(defaultValue) || isNumber(defaultValue)) {
                        otherYear = parseInt(defaultValue, 10);
                    } else if(defaultValue.group) {
                        otherYear = parseInt(defaultValue.group, 10);
                    }
                }
                if(!otherYear) {
                    otherYear = new Date().getFullYear();
                }
                return year === otherYear;
            });
            if(__defaultValue) {
                handleSelect(__defaultValue);
            }
        })();
        return () => {
            setSelected([]);
            setItems(null);
            // setValue(null);
        };
    }, [value, defaultValue]);

    const handleSelect = (item) => {
        // console.log(item, name, {props, ref})
        if(selected.contains(item.group)) {
            setSelected([]);
            onChange && onChange(null, name, {props, ref});
        } else {
            setSelected([item.group]);
            onChange && onChange(item, name, {props, ref});
        }
    };

    if (!items) {
        return <CircularProgress/>;
    }

    if (items.isEmpty()) {
        return null;
    }

    return (<Card sx={{mt: '10px', mb: '10px', mr: '10px', padding: '2px', float: 'left', display: 'block'}}>
        <List
            sx={{width: '100%', maxWidth: '100%', bgcolor: 'background.paper'}}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={<ListSubheader
                component="div"
                id="nested-list-subheader"
                sx={{
                    background: '#eee',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    padding: '10px',
                    lineHeight: '1.5',
                    float: 'left',
                    width: '100%',
                }}>
                {value.data.name} Training Plan
            </ListSubheader>}
        >
            {items.map((item) => {//Grouped by course
                return <ItemRow
                    key={item.group}
                    item={item}
                    readonly={readonly}
                    selected={selected}
                    onSelect={handleSelect}
                />;
            })}
        </List>
    </Card>);
});

export default Comp;