/*
Copyright 2022 The Matrix.org Foundation C.I.C.

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
import { mount } from 'enzyme';

import { tooltipifyLinks } from '../../src/utils/tooltipify';
import PlatformPeg from '../../src/PlatformPeg';
import BasePlatform from '../../src/BasePlatform';

describe('tooltipify', () => {
    jest.spyOn(PlatformPeg, 'get')
        .mockReturnValue({ needsUrlTooltips: () => true } as unknown as BasePlatform);

    it('does nothing for empty element', () => {
        const component = mount(<div />);
        const root = component.getDOMNode();
        const originalHtml = root.outerHTML;
        const containers: Element[] = [];
        tooltipifyLinks([root], [], containers);
        expect(containers).toHaveLength(0);
        expect(root.outerHTML).toEqual(originalHtml);
    });

    it('wraps single anchor', () => {
        const component = mount(<div><a href="/foo">click</a></div>);
        const root = component.getDOMNode();
        const containers: Element[] = [];
        tooltipifyLinks([root], [], containers);
        expect(containers).toHaveLength(1);
        const anchor = root.querySelector(".mx_TextWithTooltip_target a");
        expect(anchor?.getAttribute("href")).toEqual("/foo");
        expect(anchor?.innerHTML).toEqual("click");
    });

    it('ignores node', () => {
        const component = mount(<div><a href="/foo">click</a></div>);
        const root = component.getDOMNode();
        const originalHtml = root.outerHTML;
        const containers: Element[] = [];
        tooltipifyLinks([root], [root.children[0]], containers);
        expect(containers).toHaveLength(0);
        expect(root.outerHTML).toEqual(originalHtml);
    });
});
