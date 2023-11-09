import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestsFixtures } from "fixtures/helpRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("HelpRequestForm tests", () => {
    const queryClient = new QueryClient();
    const testId = "HelpRequestForm";

    test("renders correctly", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByText(/Requester Email/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a RequesterEmail", async () => {

        render(
            <Router  >
                <HelpRequestForm initialContents={helpRequestsFixtures.oneRequest} />
            </Router>
        );
        await screen.findByTestId(/HelpRequestForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/HelpRequestForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input: teamId", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-teamId");
        const requesterTeamIdField = screen.getByTestId("HelpRequestForm-teamId");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterTeamIdField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/TeamId must be in the format qYY-nTT-S, e.g. s22-5pm-3/);
    });

    test("Correct Error messsages on bad input: solved", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-solved");
        const requesterSolvedField = screen.getByTestId("HelpRequestForm-solved");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterSolvedField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Solved must be true or false, e.g. true/);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-submit");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/RequesterEmail is required./);
        expect(screen.getByText(/TeamId is required./)).toBeInTheDocument();
        expect(screen.getByText(/TableOrBreakoutRoom is required./)).toBeInTheDocument();
        expect(screen.getByText(/RequestTime is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/Solved is required./)).toBeInTheDocument();
    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();

        render(
            <Router  >
                <HelpRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-requesterEmail");

        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
        const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const explanationField = screen.getByTestId("HelpRequestForm-explanation");
        const solvedField = screen.getByTestId("HelpRequestForm-solved");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'cgaucho@ucsb.edu' } });
        fireEvent.change(teamIdField, { target: { value: 's22-5pm-3' } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: '7' } });
        fireEvent.change(requestTimeField, { target: { value: '2022-04-20T17:35' } });
        fireEvent.change(requesterEmailField, { target: { value: '20221' } });
        fireEvent.change(explanationField, { target: { value: 'Need help with Swagger-ui' } });
        fireEvent.change(solvedField, { target: { value: 'true' } });
        fireEvent.click(submitButton);

        expect(screen.queryByText(/TeamId must be in the format qYY-nTT-S, e.g. s22-5pm-3/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Solved must be true or false, e.g. true/)).not.toBeInTheDocument();

    });

    test("Correct validations are performed for solved 1", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <HelpRequestForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/RequesterEmail is required./);
        expect(screen.getByText(/TeamId is required./)).toBeInTheDocument();
        expect(screen.getByText(/TableOrBreakoutRoom is required./)).toBeInTheDocument();
        expect(screen.getByText(/RequestTime is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/Solved is required./)).toBeInTheDocument();

        const solvedInput = screen.getByTestId(`${testId}-solved`);
        fireEvent.change(solvedInput, { target: { value: "truef" } });

        const teamInput = screen.getByTestId(`${testId}-teamId`);
        fireEvent.change(teamInput, { target: { value: "as22-5pm-3" } });
        fireEvent.click(submitButton);
        
        await screen.findAllByText(/Solved must be true or false, e.g. true/);
        expect(screen.getByText(/TeamId must be in the format qYY-nTT-S, e.g. s22-5pm-3/)).toBeInTheDocument();
        // await waitFor(() => {
        //     expect(screen.getByText(/Solved must be true or false, e.g. true/)).toBeInTheDocument();
        // });
    });

    test("Correct validations are performed for solved 2", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <HelpRequestForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Requester Email is required./);
        expect(screen.getByText(/Team Id is required./)).toBeInTheDocument();
        expect(screen.getByText(/Table Or BreakoutRoom is required./)).toBeInTheDocument();
        expect(screen.getByText(/Request Time is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/Solved is required./)).toBeInTheDocument();

        const solvedInput = screen.getByTestId(`${testId}-solved`);
        fireEvent.change(solvedInput, { target: { value: "ftrue" } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(screen.getByText(/Solved must be true or false, e.g. true/)).toBeInTheDocument();
        });
    });

    test("Validating TeamId - get mutants", async () => {
        render(
            <Router>
                <HelpRequestForm />
            </Router>
        );
        const submitButton = screen.getByText("Create");
    
        // valid value
        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
        const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom·");
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const explanationField = screen.getByTestId("HelpRequestForm-explanation");
        const solvedField = screen.getByTestId("HelpRequestForm-solved");
        fireEvent.change(requesterEmailField, { target: { value: 'cgaucho@ucsb.edu' } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: '7' } });
        fireEvent.change(requestTimeField, { target: { value: '2022-04-20T17:35' } });
        fireEvent.change(explanationField, { target: { value: 'Need help with Swagger-ui' } });
        fireEvent.change(solvedField, { target: { value: 'true' } });
        fireEvent.change(teamIdField, { target: { value: "f22-5pm-3" } });
        expect(screen.queryByText(/Invalid Team Id. Team Id must be in the format qYY-nTT-S, e.g. f23-6pm-3/)).not.toBeInTheDocument();
        expect(screen.getByText(/Invalid email. Valid email has a username followed by @ followed by a domain, followed by . and an extension of at least length 2/)).not.toBeInTheDocument();
       // Test with values of mutant patterns
        const mutantValues = [
            "m142-9am-4", // added digit
            "f2-10am-2",  // one digit
            "f222-10am-5",  // three digit
            "x22-5pm-1",    // letter not in sfwm
            "sf22-5pm-3",  // more than one letter
            "f20-am-2",  // missing digit before am
            "s20-5pm-9",  // invalid team num
            "s20-5pn-4", // invalid time !(am or pm)
            "s22-#am-3", // invalid time num
            "s22-16pm-3", // invalid time num
            "s22-5#-3am-1",
            "s22-5#-3am-1ab",
            "s22-aam-3"
        ];
    
        for (const value of mutantValues) {
            await fireEvent.change(teamIdField, { target: { value } });
            await fireEvent.click(submitButton);
            await waitFor(() => {
                expect(screen.getByText(/Invalid Team Id. Team Id must be in the format qYY-nTT-S, e.g. f23-6pm-3/)).toBeInTheDocument();
            });
        }
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-cancel");
        const cancelButton = screen.getByTestId("HelpRequestForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});

