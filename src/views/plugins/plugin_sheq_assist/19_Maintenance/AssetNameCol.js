import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import Chip from "@material-ui/core/Chip";
import Avatar from "@mui/material/Avatar";

import {Clickable} from 'components/inputs';
import assetProfilePic from "assets/images/vehicle-image-loading.png";

@observer
class AssetNameCol extends React.Component {

    constructor(props) {
        super(props);
    }

    @computed get profile_pic() {
        const {item} = this.props;
        const {
            data: {
                //2 done
                photo_list,
                profile_pic: profile_pic_list,
            }
        } = item;

        let [profile_pic] = profile_pic_list || [];
        if (!profile_pic) {
            profile_pic = (photo_list || [])[0];
        }

        const doc = profile_pic && profile_pic.doc;

        return (doc && doc.dlUrls && doc.dlUrls[0]) || assetProfilePic;
    }

    render() {
        const {idx, onView, item} = this.props;

        const {
            id, data: {
                asset_detail: {
                    name,
                    asset_type,
                },
            }
        } = item;

        const {profile_pic} = this;

        return <Clickable
            idx={idx}
            onClick={onView}
        >
            <Chip
                avatar={
                    <Avatar
                        alt={name}
                        src={profile_pic}
                        sx={{
                            width: '50px !important',
                            height: '50px !important',
                            margin: '0 -4px 0 0 !important'
                        }}
                    />
                }
                label={<>
                    <p className="margin-0 margin-b-5 font-weight-bold text-transform-uppercase">{name}</p>
                    <Chip
                        label={asset_type}
                        size="small"
                        color="primary"
                        className="cursor-pointer h-20"
                        sx={{
                            cursor: "pointer",
                            padding: "3px 6px !important",
                            backgroundColor: "white !important",
                            margin: '0 !important',
                            height: 'auto !important',
                            width: 'auto !important'
                        }}
                    />
                </>}
                size="medium"
                className="margin-v-5 h-50 border-radius-30"
                sx={{
                    cursor: "pointer",
                    padding: "0 7px !important",
                    margin: '8px 0 !important',
                }}
            />
        </Clickable>;
    }
}

export default AssetNameCol;