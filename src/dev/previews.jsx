import React from 'react';
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox';
import {PaletteTree} from './palette';
import ProfileButton from "../views/header/ProfileButton";
import LoggedInApp from "../views/LoggedInApp";
import UsernameStatus from "../components/inputs/UsernameStatus";
import Signup from "../views/LoggedOutApp/Signup";
import EditDialog from "../views/default/Users/EditDialog";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/ProfileButton">
                <ProfileButton/>
            </ComponentPreview>
            <ComponentPreview path="/LoggedInApp">
                <LoggedInApp/>
            </ComponentPreview>
            <ComponentPreview path="/UsernameStatus">
                <UsernameStatus/>
            </ComponentPreview>
            <ComponentPreview path="/Signup">
                <Signup/>
            </ComponentPreview>
            <ComponentPreview path="/EditDialog">
                <EditDialog/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;