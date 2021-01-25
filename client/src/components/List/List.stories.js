import React from 'react'
import FollowSuggestion from '../FollowSuggestion';
import News from '../News';
import { More } from '../icons';

import List from './';

export default {
    title: 'Example/List',
};

const Template = (args) => (
    <div style={{ width: "350px" }}>
        <List
            title={`Maybe you like`}
            icon={<More />}
            elements={[
                <FollowSuggestion
                    name="Asem Basheer"
                    nickname="@asembasheer"
                />,
                <FollowSuggestion name="Imad Aqel" nickname="@imadaqel" />,
                <FollowSuggestion
                    name="Aya"
                    nickname="@aya"
                />,
            ]}
        />
    </div>
);

export const FollowList = Template.bind({});
FollowList.args = {
};


const Template2 = (args) => (
    <div style={{ width: "350px" }}>
        <List
            title="O que está acontecendo"
            elements={[
                <News />,
                <News />,
                <News />,
                <News />,
                <News />,
                <News />,
                <News />,
            ]}
        />
    </div>
);

export const TrendingList = Template2.bind({});
TrendingList.args = {
};
