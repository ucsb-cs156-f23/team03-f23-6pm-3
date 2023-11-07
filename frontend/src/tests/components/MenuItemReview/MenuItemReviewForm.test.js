import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("MenuItemReviewForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByText(/Item ID/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a MenuItemReview", async () => {

        render(
            <Router  >
                <MenuItemReviewForm initialContents={menuItemReviewFixtures.oneReview} />
            </Router>
        );
        await screen.findByTestId(/MenuItemReviewForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/MenuItemReviewForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-itemId");
        const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
        const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(itemIdField, { target: { value: -4 } });  
        fireEvent.change(reviewerEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(dateReviewedField, { target: { value: 'bad-input' } });
        fireEvent.change(starsField, { target: { value: -1 } });
        fireEvent.click(submitButton);

        await screen.findByText(/Reviewer email must be an email./);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-submit");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Item ID is required./);
        expect(screen.getByText(/Reviewer email is required./)).toBeInTheDocument();
        expect(screen.getByText(/Date reviewed is required./)).toBeInTheDocument();
        expect(screen.getByText(/Stars is required./)).toBeInTheDocument();
        expect(screen.getByText(/Comments is required./)).toBeInTheDocument();

    });


    test("Correct Error messsages on value outside of 0 and 5 for stars", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-submit");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");
        
        fireEvent.change(starsField, { target: { value: 6 } });   
        fireEvent.click(submitButton);

        await screen.findByText(/Stars must be between 0 and 5./);

    });




    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();

        render(
            <Router  >
                <MenuItemReviewForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-itemId");

        const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
        const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(itemIdField, { target: { value: 1 } });  
        fireEvent.change(reviewerEmailField, { target: { value: 'student12@ucsb.edu' } });
        fireEvent.change(dateReviewedField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(starsField, { target: { value: 4 } });  
        fireEvent.change(commentsField, { target: { value: 'I really liked the pepperoni pizza.' } });       
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Item ID must be greater than 0./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date reviewed is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Reviewer email must be an email./)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-cancel");
        const cancelButton = screen.getByTestId("MenuItemReviewForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


