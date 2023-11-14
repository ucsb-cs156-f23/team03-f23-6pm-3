import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { rest } from "msw";

import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

export default {
    title: 'pages/HelpRequest/HelpRequestEditPage',
    component: HelpRequestEditPage
};

const Template = () => <HelpRequestEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/helprequest', (_req, res, ctx) => {
            return res(ctx.json(helpRequestFixtures.threeHelpRequests[1]));
        }),
        rest.put('/api/helprequest', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}


