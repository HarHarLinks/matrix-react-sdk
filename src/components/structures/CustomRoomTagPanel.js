/*
Copyright 2019 New Vector Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';
import CustomRoomTagStore from '../../stores/CustomRoomTagStore';
import AutoHideScrollbar from './AutoHideScrollbar';
import sdk from '../../index';
import dis from '../../dispatcher';
import classNames from 'classnames';
import * as FormattingUtils from '../../utils/FormattingUtils';

class CustomRoomTagPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: CustomRoomTagStore.getSortedTags(),
        };
    }

    componentWillMount() {
        this._tagStoreToken = CustomRoomTagStore.addListener(() => {
            this.setState({tags: CustomRoomTagStore.getSortedTags()});
        });
    }

    componentWillUnmount() {
        if (this._tagStoreToken) {
            this._tagStoreToken.remove();
        }
    }

    render() {
        const tags = this.state.tags.map((tag) => {
            return (<CustomRoomTagTile tag={tag} key={tag.name} />);
        });

        const classes = classNames('mx_CustomRoomTagPanel', {
            mx_CustomRoomTagPanel_empty: this.state.tags.length === 0,
        });

        return (<div className={classes}>
            <div className="mx_CustomRoomTagPanel_divider" />
            <AutoHideScrollbar className="mx_CustomRoomTagPanel_scroller">
                {tags}
            </AutoHideScrollbar>
        </div>);
    }
}

class CustomRoomTagTile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hover: false};
        this.onClick = this.onClick.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
    }

    onMouseOver() {
        this.setState({hover: true});
    }

    onMouseOut() {
        this.setState({hover: false});
    }

    onClick() {
        dis.dispatch({action: 'select_custom_room_tag', tag: this.props.tag.name});
    }

    render() {
        const BaseAvatar = sdk.getComponent('avatars.BaseAvatar');
        const AccessibleButton = sdk.getComponent('elements.AccessibleButton');
        const RoomTooltip = sdk.getComponent('rooms.RoomTooltip');

        const tag = this.props.tag;
        const avatarHeight = 40;
        const className = classNames({
            CustomRoomTagPanel_tileSelected: tag.selected,
        });
        const name = tag.name;
        const badge = tag.badge;
        let badgeElement;
        if (badge) {
            const badgeClasses = classNames({
                "mx_TagTile_badge": true,
                "mx_TagTile_badgeHighlight": badge.highlight,
            });
            badgeElement = (<div className={badgeClasses}>{FormattingUtils.formatCount(badge.count)}</div>);
        }

        const tip = (this.state.hover ?
            <RoomTooltip className="mx_TagTile_tooltip" label={name} /> :
            <div />);
        return (
            <AccessibleButton className={className} onClick={this.onClick}>
                <div className="mx_TagTile_avatar" onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
                    <BaseAvatar
                        name={tag.avatarLetter}
                        idName={name}
                        width={avatarHeight}
                        height={avatarHeight}
                    />
                    { badgeElement }
                    { tip }
                </div>
            </AccessibleButton>
        );
    }
}

export default CustomRoomTagPanel;
