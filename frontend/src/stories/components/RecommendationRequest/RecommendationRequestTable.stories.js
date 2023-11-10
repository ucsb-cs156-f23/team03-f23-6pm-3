import React from 'react';
import RecommendationRequestTable from "main/components/RecommendationRequest/RecommendationRequestTable";
import { recommendationRequestFixtures } from 'fixtures/recommendationRequestFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/RecommendationRequest/RecommendationRequestTable',
    component: RecommendationRequestTable
};

const Template = (args) => {
    return (
        <RecommendationRequestTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    recommendations: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    recommendations: recommendationRequestFixtures.threeRecomendation,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    recommendations: recommendationRequestFixtures.threeRecomendation,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/recommendationrequests', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};

