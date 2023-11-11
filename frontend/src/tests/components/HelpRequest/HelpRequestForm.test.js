import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("HelpRequestForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByText(/Team ID/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a HelpRequest", async () => {

        render(
            <Router  >
                <HelpRequestForm initialContents={helpRequestFixtures.oneHelpRequest} />
            </Router>
        );
        
        await screen.findByTestId(/HelpRequestForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/HelpRequestForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-teamId");
        const teanIdField = screen.getByTestId("HelpRequestForm-teamId");
        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const solvedField = screen.getByTestId("HelpRequestForm-solved");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(teanIdField, { target: { value: 'f23-6pm-44' } });
        fireEvent.change(requesterEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(requestTimeField, { target: { value: 'bad-input' } });
        fireEvent.change(solvedField, {target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/TeamId must be in the correct format, e.g. f23-6pm-3/);
        await screen.findByText(/RequesterEmail must be in the email format, e.g. cgacho@ucsb.edu/);
        await screen.findByText(/Solved must be true or false/);
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

        await screen.findByText(/TeamId is required./);
        expect(screen.getByText(/Table or BreakoutRoom is required./)).toBeInTheDocument();
        expect(screen.getByText(/RequesterEmail is required./)).toBeInTheDocument();
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
        await screen.findByTestId("HelpRequestForm-teamId");

        const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const explanationField = screen.getByTestId("HelpRequestForm-explanation");
        const solvedField = screen.getByTestId("HelpRequestForm-solved");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(teamIdField, { target: { value: 'f23-6pm-3' } });
        fireEvent.change(requesterEmailField, { target: { value: 'cgaucho@ucsb.edu' } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: '10' } });
        fireEvent.change(requestTimeField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(explanationField, { target: { value: 'Merge Confilct' } });
        fireEvent.change(solvedField, { target: { value: true } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/TeamId must be in the correct format, e.g. f23-6pm-3/)).not.toBeInTheDocument();
        expect(screen.queryByText(/requestTime must be in ISO format/)).not.toBeInTheDocument();
        expect(screen.queryByText(/RequesterEmail must be in the email format, e.g. cgacho@ucsb.edu/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Solved must be true or false/)).not.toBeInTheDocument();

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

